
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, UserPlus, RefreshCw, Activity, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { detectFaces, drawDetections, extractFaceRegion } from '@/utils/roboflow';
import { Progress } from "@/components/ui/progress";

// Import new components and hooks
import CameraView from '@/components/face/CameraView';
import CapturedImages from '@/components/face/CapturedImages';
import UserForm from '@/components/face/UserForm';
import UserList from '@/components/face/UserList';
import RecognizedPerson from '@/components/face/RecognizedPerson';
import useFaceDetector from '@/hooks/use-face-detector';
import useCamera from '@/hooks/use-camera';
import { 
  FaceData, 
  loadFaceDatabase, 
  saveFaceDatabase,
  generateEmbeddings, 
  captureImageFromVideo,
  calculateSimilarity
} from '@/utils/face-recognition';

const FaceTraining = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<'owner' | 'guest' | 'admin'>('guest');
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [detections, setDetections] = useState([]);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [faceDatabase, setFaceDatabase] = useState<FaceData[]>([]);
  const [recognizedPerson, setRecognizedPerson] = useState<FaceData | null>(null);
  const [confidenceThreshold, setConfidenceThreshold] = useState(0.5);

  // Use custom hooks
  const { modelLoaded, modelStatus, featureExtractor } = useFaceDetector();
  
  const handleDetection = async (videoElement: HTMLVideoElement) => {
    try {
      if (!overlayCanvasRef.current) return;
      
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = videoElement.videoWidth;
      tempCanvas.height = videoElement.videoHeight;
      
      const ctx = tempCanvas.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(videoElement, 0, 0, tempCanvas.width, tempCanvas.height);
      const imageData = tempCanvas.toDataURL('image/jpeg');
      
      const faceDetections = await detectFaces(imageData, confidenceThreshold);
      setDetections(faceDetections);
      
      drawDetections(
        overlayCanvasRef.current,
        faceDetections, 
        videoElement.videoWidth,
        videoElement.videoHeight
      );
    } catch (error) {
      console.error("Error in real-time detection:", error);
    }
  };
  
  const [
    { isCapturing, videoRef, overlayCanvasRef },
    { startCamera, stopCamera }
  ] = useCamera({
    onDetectionInterval: handleDetection,
    detectionIntervalMs: 500
  });

  // Load face database on mount
  useEffect(() => {
    setFaceDatabase(loadFaceDatabase());
  }, []);
  
  // Save face database when it changes
  useEffect(() => {
    saveFaceDatabase(faceDatabase);
  }, [faceDatabase]);
  
  const captureImage = async () => {
    if (!videoRef.current) return;
    
    setIsLoading(true);
    
    try {
      const { imageData, detection, allDetections } = await captureImageFromVideo(videoRef.current, confidenceThreshold);
      
      if (!detection) {
        toast({
          variant: "destructive",
          title: "No face detected",
          description: "Make sure your face is clearly visible in the frame.",
        });
        return;
      }
      
      if (allDetections.length > 1) {
        toast({
          variant: "default",
          title: "Multiple faces detected",
          description: "Using the face with highest confidence.",
        });
      }
      
      const faceImage = await extractFaceRegion(imageData, detection);
      setCapturedImages(prev => [...prev, faceImage]);
      
      toast({
        title: "Face captured",
        description: `Detection confidence: ${Math.round(detection.confidence * 100)}%`,
      });
    } catch (error) {
      console.error('Error capturing image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process the image. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const registerFace = async () => {
    if (!userName || capturedImages.length === 0) {
      toast({
        variant: "destructive",
        title: "Insufficient data",
        description: "Please enter a name and take at least one photo.",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      setProcessingProgress(0);
      
      const userId = `user_${Date.now()}`;
      
      toast({
        title: "Processing images",
        description: "Creating embeddings for face recognition...",
      });
      
      const embeddings = await generateEmbeddings(
        capturedImages, 
        featureExtractor,
        (progress) => setProcessingProgress(progress)
      );
      
      const newUser: FaceData = {
        id: userId,
        name: userName,
        role: userRole,
        images: capturedImages,
        embeddings: embeddings
      };
      
      setFaceDatabase(prev => [...prev, newUser]);
      
      toast({
        title: "User added",
        description: `${userName} successfully added to recognition database.`,
      });
      
      setUserName('');
      setCapturedImages([]);
      stopCamera();
      
    } catch (error) {
      console.error('Error registering face:', error);
      toast({
        variant: "destructive",
        title: "Registration error",
        description: "Failed to register user.",
      });
    } finally {
      setIsLoading(false);
      setProcessingProgress(0);
    }
  };
  
  const deleteFace = (id: string) => {
    setFaceDatabase(prev => prev.filter(face => face.id !== id));
    toast({
      title: "User deleted",
      description: "User removed from recognition database.",
    });
  };
  
  const recognizeFace = async () => {
    if (!videoRef.current || !modelLoaded || !featureExtractor) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Camera or model not ready for recognition.",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const { imageData, detection, allDetections } = await captureImageFromVideo(videoRef.current, confidenceThreshold);
      
      if (!detection) {
        toast({
          variant: "destructive",
          title: "No face detected",
          description: "Make sure your face is clearly visible in the frame.",
        });
        return;
      }
      
      const faceImage = await extractFaceRegion(imageData, detection);
      
      const img = new Image();
      img.src = faceImage;
      await new Promise(resolve => {
        img.onload = resolve;
      });
      
      const embedding = await featureExtractor(img, { 
        pooling: "mean", 
        normalize: true 
      });
      const currentEmbedding = embedding.tolist()[0];
      
      let bestMatch: FaceData | null = null;
      let highestSimilarity = 0;
      
      for (const face of faceDatabase) {
        if (face.embeddings) {
          for (const faceEmbedding of face.embeddings) {
            const similarity = calculateSimilarity(currentEmbedding, faceEmbedding);
            
            if (similarity > highestSimilarity && similarity > 0.75) {
              highestSimilarity = similarity;
              bestMatch = face;
            }
          }
        }
      }
      
      if (bestMatch) {
        bestMatch = { ...bestMatch, recognizedFaceImage: faceImage };
        setRecognizedPerson(bestMatch);
        toast({
          title: "Face recognized",
          description: `Recognized user: ${bestMatch.name} (${bestMatch.role})`,
        });
      } else {
        setRecognizedPerson(null);
        toast({
          variant: "destructive",
          title: "Face not recognized",
          description: "No match found in the database.",
        });
      }
    } catch (error) {
      console.error('Error recognizing face:', error);
      toast({
        variant: "destructive",
        title: "Recognition error",
        description: "An error occurred during face recognition.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const startRecognitionMode = async () => {
    if (!modelLoaded) {
      toast({
        variant: "destructive",
        title: "Model not loaded",
        description: "Wait for the model to load before recognition.",
      });
      return;
    }
    
    await startCamera();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Face Training and Recognition</CardTitle>
        <CardDescription>Train the system to recognize owners and guests</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="register">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Face Registration</TabsTrigger>
            <TabsTrigger value="recognize">Recognition</TabsTrigger>
          </TabsList>
          
          <TabsContent value="register" className="space-y-4 mt-4">
            <div className="space-y-4">
              <UserForm
                userName={userName}
                userRole={userRole}
                onNameChange={setUserName}
                onRoleChange={setUserRole}
              />
              
              <div className="space-y-2">
                <label>Face Images</label>
                <div className="border rounded-md p-4">
                  {isCapturing ? (
                    <div className="space-y-4">
                      <CameraView
                        isCapturing={isCapturing}
                        videoRef={videoRef}
                        overlayCanvasRef={overlayCanvasRef}
                        detections={detections}
                        isLoading={isLoading}
                      />
                      <div className="flex justify-between">
                        <Button 
                          onClick={captureImage} 
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 size={16} className="mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Camera size={16} className="mr-2" /> 
                              Capture Photo
                            </>
                          )}
                        </Button>
                        <Button variant="outline" onClick={stopCamera} disabled={isLoading}>
                          Stop Camera
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {capturedImages.length > 0 ? (
                        <CapturedImages
                          images={capturedImages}
                          onDeleteImage={deleteImage}
                          onStartCamera={startCamera}
                          isLoading={isLoading}
                        />
                      ) : (
                        <Button 
                          variant="outline" 
                          className="w-full h-24"
                          onClick={startCamera}
                          disabled={isLoading}
                        >
                          <Camera size={20} className="mr-2" /> Enable Camera
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Take 3-5 photos of your face from different angles for better recognition.
                </p>
              </div>
              
              {processingProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Processing images</span>
                    <span>{Math.round(processingProgress)}%</span>
                  </div>
                  <Progress value={processingProgress} className="h-2" />
                </div>
              )}
              
              <Button 
                className="w-full" 
                disabled={!userName || capturedImages.length === 0 || isLoading || !modelLoaded}
                onClick={registerFace}
              >
                {isLoading ? (
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                ) : (
                  <UserPlus size={16} className="mr-2" />
                )}
                Register
              </Button>
              
              <div className="flex items-center space-x-2 text-sm">
                <div className={`h-2 w-2 rounded-full ${modelLoaded ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></div>
                <span>{modelStatus}</span>
              </div>
            </div>
            
            <UserList users={faceDatabase} onDeleteUser={deleteFace} />
          </TabsContent>
          
          <TabsContent value="recognize" className="space-y-4 mt-4">
            <div className="space-y-4">
              {faceDatabase.length === 0 ? (
                <Alert>
                  <AlertTitle>No registered faces</AlertTitle>
                  <AlertDescription>
                    Go to the "Face Registration" tab and add at least one face for recognition.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="border rounded-md p-4">
                    {isCapturing ? (
                      <div className="space-y-4">
                        <CameraView
                          isCapturing={isCapturing}
                          videoRef={videoRef}
                          overlayCanvasRef={overlayCanvasRef}
                          detections={detections}
                          isLoading={isLoading}
                        />
                        <div className="flex justify-between">
                          <Button onClick={recognizeFace} disabled={isLoading}>
                            {isLoading ? (
                              <RefreshCw size={16} className="mr-2 animate-spin" />
                            ) : (
                              <Activity size={16} className="mr-2" />
                            )}
                            Recognize
                          </Button>
                          <Button variant="outline" onClick={stopCamera} disabled={isLoading}>
                            Stop Camera
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button 
                        className="w-full h-24"
                        onClick={startRecognitionMode}
                        disabled={isLoading || !modelLoaded}
                      >
                        <Camera size={20} className="mr-2" /> 
                        Enable Recognition Mode
                      </Button>
                    )}
                  </div>
                  
                  {recognizedPerson && <RecognizedPerson person={recognizedPerson} />}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <p className="text-sm text-muted-foreground">
          Database is stored locally in your browser. For production use, integrate with a server.
        </p>
      </CardFooter>
    </Card>
  );
};

export default FaceTraining;
