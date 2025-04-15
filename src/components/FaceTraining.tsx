import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Camera, Check, Trash, UserPlus, RefreshCw, Activity } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pipeline } from "@huggingface/transformers";
import { detectFaces } from '@/utils/roboflow';

interface FaceData {
  id: string;
  name: string;
  role: 'owner' | 'guest' | 'admin';
  images: string[];
  embeddings?: number[][];
}

const FaceTraining = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<'owner' | 'guest' | 'admin'>('guest');
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [faceDatabase, setFaceDatabase] = useState<FaceData[]>(() => {
    const saved = localStorage.getItem('faceDatabase');
    return saved ? JSON.parse(saved) : [];
  });
  const [modelStatus, setModelStatus] = useState('Модель не загружена');
  const [recognizedPerson, setRecognizedPerson] = useState<FaceData | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const featureExtractorRef = useRef<any>(null);
  
  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        setModelStatus('Загрузка модели...');
        
        featureExtractorRef.current = await pipeline(
          "feature-extraction",
          "mixedbread-ai/mxbai-embed-xsmall-v1"
        );
        
        setModelLoaded(true);
        setModelStatus('Модель загружена успешно');
        setIsLoading(false);
        
        toast({
          title: "Модель загружена",
          description: "AI модель для распознавания лиц успешно инициализирована",
        });
      } catch (error) {
        console.error('Ошибка загрузки модели:', error);
        setModelStatus('Ошибка загрузки модели');
        setIsLoading(false);
        
        toast({
          variant: "destructive",
          title: "Ошибка загрузки модели",
          description: "Не удалось загрузить модель для распознавания лиц",
        });
      }
    };

    loadModel();
    
    return () => {
      stopCamera();
    };
  }, [toast]);
  
  useEffect(() => {
    localStorage.setItem('faceDatabase', JSON.stringify(faceDatabase));
  }, [faceDatabase]);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 } 
        } 
      });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Ошибка доступа к камере:', error);
      toast({
        variant: "destructive",
        title: "Ошибка камеры",
        description: "Не удалось получить доступ к камере. Проверьте разрешения.",
      });
    }
  };
  
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCapturing(false);
  };
  
  const captureImage = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        
        try {
          const detections = await detectFaces(imageData);
          
          if (detections.length === 0) {
            toast({
              title: "No face detected",
              description: "Please ensure your face is clearly visible to the camera.",
              variant: "destructive",
            });
            return;
          }
          
          setCapturedImages(prev => [...prev, imageData]);
          
          toast({
            title: "Face captured",
            description: `Face detected with ${Math.round(detections[0].confidence * 100)}% confidence`,
          });
        } catch (error) {
          console.error('Error during face detection:', error);
          toast({
            title: "Error",
            description: "Failed to process the image. Please try again.",
            variant: "destructive",
          });
        }
      }
    }
  };
  
  const deleteImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const generateEmbeddings = async (images: string[]): Promise<number[][]> => {
    if (!featureExtractorRef.current) {
      throw new Error('Модель не загружена');
    }
    
    const embeddings = [];
    
    for (const imageData of images) {
      try {
        const img = new Image();
        img.src = imageData;
        await new Promise(resolve => {
          img.onload = resolve;
        });
        
        const embedding = await featureExtractorRef.current(img, { 
          pooling: "mean", 
          normalize: true 
        });
        embeddings.push(embedding.tolist()[0]);
      } catch (error) {
        console.error('Ошибка при создании эмбеддинга:', error);
      }
    }
    
    return embeddings;
  };
  
  const registerFace = async () => {
    if (!userName || capturedImages.length === 0) {
      toast({
        variant: "destructive",
        title: "Недостаточно данных",
        description: "Пожалуйста, введите имя и сделайте хотя бы одно фото.",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const userId = `user_${Date.now()}`;
      
      const embeddings = await generateEmbeddings(capturedImages);
      
      const newUser: FaceData = {
        id: userId,
        name: userName,
        role: userRole,
        images: capturedImages,
        embeddings: embeddings
      };
      
      setFaceDatabase(prev => [...prev, newUser]);
      
      toast({
        title: "Пользователь добавлен",
        description: `${userName} успешно добавлен в базу данных распознавания.`,
      });
      
      setUserName('');
      setCapturedImages([]);
      stopCamera();
      
    } catch (error) {
      console.error('Ошибка при регистрации лица:', error);
      toast({
        variant: "destructive",
        title: "Ошибка регистрации",
        description: "Не удалось зарегистрировать пользователя.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteFace = (id: string) => {
    setFaceDatabase(prev => prev.filter(face => face.id !== id));
    toast({
      title: "Пользователь удален",
      description: "Пользователь удален из базы данных распознавания.",
    });
  };
  
  const calculateSimilarity = (embedding1: number[], embedding2: number[]): number => {
    let dotProduct = 0;
    let mag1 = 0;
    let mag2 = 0;
    
    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      mag1 += embedding1[i] * embedding1[i];
      mag2 += embedding2[i] * embedding2[i];
    }
    
    mag1 = Math.sqrt(mag1);
    mag2 = Math.sqrt(mag2);
    
    return dotProduct / (mag1 * mag2);
  };
  
  const recognizeFace = async () => {
    if (!videoRef.current || !modelLoaded || !featureExtractorRef.current) {
      toast({
        variant: "destructive",
        title: "Ошибка",
        description: "Камера или модель не готовы для распознавания.",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        
        const img = new Image();
        img.src = imageData;
        await new Promise(resolve => {
          img.onload = resolve;
        });
        
        const embedding = await featureExtractorRef.current(img, { 
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
          setRecognizedPerson(bestMatch);
          toast({
            title: "Лицо распознано",
            description: `Распознан пользователь: ${bestMatch.name} (${bestMatch.role})`,
          });
        } else {
          setRecognizedPerson(null);
          toast({
            variant: "destructive",
            title: "Лицо не распознано",
            description: "Не удалось найти совпадение в базе данных.",
          });
        }
      }
    } catch (error) {
      console.error('Ошибка при распознавании лица:', error);
      toast({
        variant: "destructive",
        title: "Ошибка распознавания",
        description: "Произошла ошибка при распознавании лица.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const startRecognitionMode = async () => {
    if (!modelLoaded) {
      toast({
        variant: "destructive",
        title: "Модель не загружена",
        description: "Дождитесь загрузки модели для распознавания лиц.",
      });
      return;
    }
    
    await startCamera();
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Обучение и распознавание лиц</CardTitle>
        <CardDescription>Обучите систему распознавать владельцев и гостей</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="register">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="register">Регистрация лиц</TabsTrigger>
            <TabsTrigger value="recognize">Распознавание</TabsTrigger>
          </TabsList>
          
          <TabsContent value="register" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="userName">Имя пользователя</Label>
                  <Input 
                    id="userName" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Иван Иванов"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userRole">Роль</Label>
                  <Select value={userRole} onValueChange={(value: 'owner' | 'guest' | 'admin') => setUserRole(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите роль" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Владелец</SelectItem>
                      <SelectItem value="guest">Гость</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Изображения лица</Label>
                <div className="border rounded-md p-4">
                  {isCapturing ? (
                    <div className="space-y-4">
                      <div className="aspect-video bg-muted rounded-md overflow-hidden">
                        <video 
                          ref={videoRef} 
                          autoPlay 
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button onClick={captureImage} disabled={isLoading}>
                          <Camera size={16} className="mr-2" /> Захватить фото
                        </Button>
                        <Button variant="outline" onClick={stopCamera} disabled={isLoading}>Отмена</Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {capturedImages.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {capturedImages.map((img, index) => (
                            <div key={index} className="relative">
                              <img 
                                src={img} 
                                alt={`Лицо ${index + 1}`} 
                                className="w-full h-24 object-cover rounded-md"
                              />
                              <Button 
                                variant="destructive" 
                                size="icon"
                                className="absolute top-1 right-1 h-6 w-6"
                                onClick={() => deleteImage(index)}
                                disabled={isLoading}
                              >
                                <Trash size={14} />
                              </Button>
                            </div>
                          ))}
                          {capturedImages.length < 5 && (
                            <Button 
                              variant="outline" 
                              className="h-24 flex items-center justify-center"
                              onClick={startCamera}
                              disabled={isLoading}
                            >
                              <Camera size={24} />
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="w-full h-24"
                          onClick={startCamera}
                          disabled={isLoading}
                        >
                          <Camera size={20} className="mr-2" /> Включить камеру
                        </Button>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Сделайте 3-5 фотографий лица с разных ракурсов для лучшего распознавания.
                </p>
              </div>
              
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
                Зарегистрировать
              </Button>
              
              <div className="flex items-center space-x-2 text-sm">
                <div className={`h-2 w-2 rounded-full ${modelLoaded ? 'bg-green-500' : 'bg-amber-500 animate-pulse'}`}></div>
                <span>{modelStatus}</span>
              </div>
            </div>
            
            {faceDatabase.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-3">Зарегистрированные пользователи</h3>
                <div className="space-y-2">
                  {faceDatabase.map((face) => (
                    <div key={face.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
                      <div className="flex items-center space-x-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                          <img 
                            src={face.images[0]} 
                            alt={face.name}
                            className="object-cover h-full w-full"
                          />
                        </div>
                        <div>
                          <div className="font-medium">{face.name}</div>
                          <div className="text-sm text-muted-foreground capitalize">{face.role}</div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => deleteFace(face.id)}
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="recognize" className="space-y-4 mt-4">
            <div className="space-y-4">
              {faceDatabase.length === 0 ? (
                <Alert>
                  <AlertTitle>Нет зарегистрированных лиц</AlertTitle>
                  <AlertDescription>
                    Перейдите на вкладку "Регистрация лиц" и добавьте хотя бы одно лицо для распознавания.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <div className="border rounded-md p-4">
                    {isCapturing ? (
                      <div className="space-y-4">
                        <div className="aspect-video bg-muted rounded-md overflow-hidden">
                          <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          <canvas 
                            ref={canvasRef} 
                            className="absolute inset-0 w-full h-full object-cover opacity-0"
                          />
                        </div>
                        <div className="flex justify-between">
                          <Button onClick={recognizeFace} disabled={isLoading}>
                            {isLoading ? (
                              <RefreshCw size={16} className="mr-2 animate-spin" />
                            ) : (
                              <Activity size={16} className="mr-2" />
                            )}
                            Распознать
                          </Button>
                          <Button variant="outline" onClick={stopCamera} disabled={isLoading}>
                            Остановить камеру
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
                        Включить режим распознавания
                      </Button>
                    )}
                  </div>
                  
                  {recognizedPerson && (
                    <div className="p-4 border rounded-md bg-primary/10">
                      <div className="flex items-center space-x-4">
                        <div className="relative h-16 w-16 overflow-hidden rounded-full">
                          <img 
                            src={recognizedPerson.images[0]} 
                            alt={recognizedPerson.name}
                            className="object-cover h-full w-full"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-lg">{recognizedPerson.name}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm capitalize bg-primary/20 px-2 py-1 rounded">{recognizedPerson.role}</span>
                            <Check size={16} className="text-green-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <p className="text-sm text-muted-foreground">
          База данных сохраняется локально в вашем браузере. Для промышленного использования необходимо интегрировать с сервером.
        </p>
      </CardFooter>
    </Card>
  );
};

export default FaceTraining;
