
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Video, Users, Pause, Play } from 'lucide-react';

const VideoFeed = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [detectedFaces, setDetectedFaces] = useState(0);
  const [isConnecting, setIsConnecting] = useState(true);

  useEffect(() => {
    // Simulate connection to video feed
    const timer = setTimeout(() => {
      setIsConnecting(false);
    }, 2000);

    // Simulate random face detection
    const faceDetectionInterval = setInterval(() => {
      if (isPlaying && !isConnecting) {
        setDetectedFaces(Math.floor(Math.random() * 3));
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearInterval(faceDetectionInterval);
    };
  }, [isPlaying, isConnecting]);

  return (
    <div className="space-y-4">
      <div className="webcam-container aspect-video bg-muted relative overflow-hidden">
        {isConnecting ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4">Connecting to camera feed...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={isPlaying ? "hidden" : "flex flex-col items-center gap-2"}>
                <Play size={48} className="text-primary opacity-50" />
                <span className="text-sm">Feed paused</span>
              </div>
            </div>
            {isPlaying && (
              <>
                <div className="webcam-overlay"></div>
                <div className="webcam-scan"></div>
                <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-medium flex items-center">
                  <Video className="h-3 w-3 mr-1" /> LIVE
                </div>
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-medium flex items-center">
                  <Users className="h-3 w-3 mr-1" /> {detectedFaces} detected
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent text-white text-xs">
                  Front Door Camera • {new Date().toLocaleTimeString()}
                </div>
                
                {/* Simulated video content with animated gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 animate-pulse opacity-30"></div>
                
                {/* Simulated recognition boxes */}
                {detectedFaces > 0 && (
                  <div className="absolute left-[20%] top-[20%] w-[150px] h-[180px] border-2 border-primary animate-pulse"></div>
                )}
                {detectedFaces > 1 && (
                  <div className="absolute right-[25%] top-[30%] w-[130px] h-[160px] border-2 border-yellow-400 animate-pulse"></div>
                )}
              </>
            )}
          </>
        )}
      </div>
      
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <><Pause className="h-4 w-4 mr-1" /> Pause</> : <><Play className="h-4 w-4 mr-1" /> Play</>}
          </Button>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <div className={`h-2 w-2 rounded-full ${isPlaying && !isConnecting ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          {isPlaying && !isConnecting ? 'Streaming' : 'Stream inactive'}
        </div>
      </div>
    </div>
  );
};

export default VideoFeed;
