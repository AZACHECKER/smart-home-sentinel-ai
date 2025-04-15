
import React, { useRef, useState, useEffect } from 'react';
import { useVideoSource } from '@/hooks/use-video-source';
import { Button } from '@/components/ui/button';
import { detectFaces, drawDetections } from '@/utils/roboflow';
import { Badge } from '@/components/ui/badge';
import { Calendar, Maximize2, VideoOff, User, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SecurityCameraProps {
  name: string;
  showControls?: boolean;
}

const SecurityCamera = ({ name, showControls = true }: SecurityCameraProps) => {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<number | null>(null);
  const [detectionCount, setDetectionCount] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const [videoState, videoActions] = useVideoSource(videoRef);
  
  // Start detection when video is playing
  useEffect(() => {
    if (!videoState.isPlaying || !isDetecting) {
      if (detectionIntervalRef.current) {
        window.clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      return;
    }
    
    const detectFacesInVideo = async () => {
      if (!videoRef.current || !canvasRef.current) return;
      
      try {
        // Create temporary canvas to get video frame
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = videoRef.current.videoWidth;
        tempCanvas.height = videoRef.current.videoHeight;
        
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) return;
        
        // Draw current video frame to canvas
        ctx.drawImage(videoRef.current, 0, 0, tempCanvas.width, tempCanvas.height);
        
        // Get image data as base64
        const imageData = tempCanvas.toDataURL('image/jpeg');
        
        // Detect faces with 0.4 confidence threshold
        const detections = await detectFaces(imageData, 0.4);
        
        // Update detection count
        setDetectionCount(detections.length);
        
        // Draw boxes on overlay canvas
        if (canvasRef.current) {
          drawDetections(
            canvasRef.current,
            detections, 
            videoRef.current.videoWidth,
            videoRef.current.videoHeight
          );
          
          // If faces detected and not already notified, show alert
          if (detections.length > 0) {
            if (!containerRef.current?.dataset.notified) {
              toast({
                title: "Обнаружены люди",
                description: `Камера "${name}": обнаружено ${detections.length} человек`,
                variant: "default",
              });
              
              // Mark as notified to avoid spamming
              if (containerRef.current) {
                containerRef.current.dataset.notified = 'true';
                
                // Reset notification status after 30 seconds
                setTimeout(() => {
                  if (containerRef.current) {
                    containerRef.current.dataset.notified = '';
                  }
                }, 30000);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error in face detection:", error);
      }
    };
    
    // Start detection interval - run every second
    detectionIntervalRef.current = window.setInterval(detectFacesInVideo, 1000);
    
    return () => {
      if (detectionIntervalRef.current) {
        window.clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, [videoState.isPlaying, isDetecting, name, toast]);
  
  // Initialize video playback
  useEffect(() => {
    if (!videoState.isPlaying && videoRef.current) {
      videoActions.startStream().then(() => {
        setIsDetecting(true);
      });
    }
    
    return () => {
      if (detectionIntervalRef.current) {
        window.clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };
  
  // Update isFullscreen state when exiting fullscreen with Escape key
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Toggle face detection
  const toggleDetection = () => {
    setIsDetecting(prev => !prev);
    
    if (!isDetecting && canvasRef.current) {
      // Clear canvas when enabling detection
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`security-camera rounded-md overflow-hidden border ${detectionCount > 0 ? 'border-amber-500 shadow-lg shadow-amber-400/20' : 'border-muted'}`}
    >
      <div className="p-2 bg-muted flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge variant={detectionCount > 0 ? "destructive" : "outline"} className="h-6">
            {detectionCount > 0 ? (
              <ShieldAlert size={14} className="mr-1" />
            ) : (
              <User size={14} className="mr-1" />
            )}
            {detectionCount > 0 ? `${detectionCount} чел.` : 'Никого нет'}
          </Badge>
          <span className="text-sm font-medium">{name}</span>
        </div>
        <div className="flex items-center text-xs text-muted-foreground">
          <Calendar size={12} className="mr-1" />
          {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      <div className="aspect-video bg-muted relative">
        {videoState.errorMessage ? (
          <div className="absolute inset-0 flex items-center justify-center text-center p-4">
            <div className="space-y-2">
              <AlertTriangle className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{videoState.errorMessage}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={videoActions.retryConnection}
              >
                Повторить подключение
              </Button>
            </div>
          </div>
        ) : null}
        
        {videoState.isConnecting ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          </div>
        ) : null}
        
        <video 
          ref={videoRef} 
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay 
          playsInline 
          muted
        />
        
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
        
        {/* Status overlay */}
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
          <div className="flex items-center gap-1 bg-black/50 text-white px-2 py-1 text-xs rounded">
            <div className={`h-2 w-2 rounded-full ${videoState.isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span>{videoState.isPlaying ? 'Live' : 'Остановлено'}</span>
          </div>
          {isDetecting && (
            <div className="bg-black/50 text-white px-2 py-1 text-xs rounded flex items-center">
              <ShieldAlert size={12} className="mr-1" />
              Распознавание активно
            </div>
          )}
        </div>
      </div>
      
      {showControls && (
        <div className="p-2 bg-muted border-t flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={videoActions.togglePlayback}
            className="h-8"
          >
            {videoState.isPlaying ? (
              <VideoOff size={14} className="mr-1" /> 
            ) : (
              <VideoOff size={14} className="mr-1" /> 
            )}
            {videoState.isPlaying ? 'Стоп' : 'Старт'}
          </Button>
          
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleDetection} 
              className={`h-8 ${isDetecting ? 'bg-primary/10' : ''}`}
            >
              {isDetecting ? 'Выкл. распознавание' : 'Вкл. распознавание'}
            </Button>
            
            <Button variant="outline" size="sm" onClick={toggleFullscreen} className="h-8">
              <Maximize2 size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecurityCamera;
