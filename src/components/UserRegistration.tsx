
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Check, Trash, UserPlus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const UserRegistration = () => {
  const { toast } = useToast();
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState('');
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCapturing(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Could not access camera. Please check permissions.",
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
  
  const captureImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImages(prev => [...prev, imageData]);
        
        toast({
          title: "Image Captured",
          description: `Captured image ${capturedImages.length + 1}`,
        });
        
        if (capturedImages.length >= 2) {
          stopCamera();
        }
      }
    }
  };
  
  const deleteImage = (index: number) => {
    setCapturedImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const registerUser = () => {
    if (!userId || !userName || !userRole || capturedImages.length === 0) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill all fields and capture at least one image.",
      });
      return;
    }
    
    // Simulated registration success
    toast({
      title: "User Registered",
      description: `Successfully registered ${userName}`,
    });
    
    // Reset form
    setUserId('');
    setUserName('');
    setUserRole('');
    setCapturedImages([]);
  };
  
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus size={20} />
          <span>Register New User</span>
        </CardTitle>
        <CardDescription>
          Add a new user to the face recognition system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="userId">User ID</Label>
            <Input 
              id="userId" 
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="e.g. user123"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="userName">Full Name</Label>
            <Input 
              id="userName" 
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="John Doe"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="userRole">Role</Label>
          <Select value={userRole} onValueChange={setUserRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="resident">Resident</SelectItem>
              <SelectItem value="guest">Guest</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Face Images</Label>
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
                  <Button onClick={captureImage}>
                    <Camera size={16} className="mr-2" /> Capture Face
                  </Button>
                  <Button variant="outline" onClick={stopCamera}>Cancel</Button>
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
                          alt={`Face ${index + 1}`} 
                          className="w-full h-24 object-cover rounded-md"
                        />
                        <Button 
                          variant="destructive" 
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => deleteImage(index)}
                        >
                          <Trash size={14} />
                        </Button>
                      </div>
                    ))}
                    {capturedImages.length < 3 && (
                      <Button 
                        variant="outline" 
                        className="h-24 flex items-center justify-center"
                        onClick={startCamera}
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
                  >
                    <Camera size={20} className="mr-2" /> Start Camera
                  </Button>
                )}
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Capture at least 1-3 images of the user's face from different angles.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          disabled={!userId || !userName || !userRole || capturedImages.length === 0}
          onClick={registerUser}
        >
          <Check size={16} className="mr-2" /> Register User
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UserRegistration;
