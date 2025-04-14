
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Video, Users, Pause, Play, AlertTriangle, Settings } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useVideoSource } from '@/hooks/use-video-source';
import { useObjectDetection } from '@/hooks/use-object-detection';
import { translations as t } from '@/constants/translations';

const VideoFeed = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [videoState, videoActions] = useVideoSource(videoRef);
  const [detectionState] = useObjectDetection(videoRef, canvasRef, {
    enabled: videoState.isPlaying && !videoState.isConnecting
  });
  
  const handleSourceChange = (value: 'webcam' | 'stream') => {
    videoActions.setSourceType(value);
  };

  return (
    <div className="space-y-4">
      <div className="webcam-container aspect-video bg-muted relative overflow-hidden rounded-lg">
        {(videoState.isConnecting || detectionState.isModelLoading) ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4">{detectionState.isModelLoading ? t.loadingModels : t.connectingToSource}</p>
            </div>
          </div>
        ) : (detectionState.errorMessage || videoState.errorMessage) ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-destructive">
              <AlertTriangle className="mx-auto h-12 w-12 mb-2" />
              <p>{detectionState.errorMessage || videoState.errorMessage}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={videoActions.retryConnection}
              >
                {t.retryConnection}
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className={videoState.isPlaying ? "hidden" : "flex flex-col items-center gap-2"}>
                <Play size={48} className="text-primary opacity-50" />
                <span className="text-sm">{t.videoPaused}</span>
              </div>
            </div>
            
            <video 
              ref={videoRef}
              autoPlay 
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
              style={{ display: videoState.isPlaying ? 'block' : 'none' }}
            />
            
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {videoState.isPlaying && (
              <>
                <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-medium flex items-center">
                  <Video className="h-3 w-3 mr-1" /> {t.live}
                </div>
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-medium flex items-center">
                  <Users className="h-3 w-3 mr-1" /> {detectionState.detectedFaces} {t.detected}
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent text-white text-xs">
                  {videoState.sourceType === 'webcam' ? t.deviceCamera : t.videoStream} • {new Date().toLocaleTimeString()}
                </div>
              </>
            )}
          </>
        )}
      </div>
      
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={videoActions.togglePlayback}>
            {videoState.isPlaying ? 
              <><Pause className="h-4 w-4 mr-1" /> {t.pauseVideo}</> : 
              <><Play className="h-4 w-4 mr-1" /> {t.playVideo}</>}
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-1" /> {t.videoSettings}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t.videoSourceSettings}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <RadioGroup 
                  value={videoState.sourceType} 
                  onValueChange={(value) => handleSourceChange(value as 'webcam' | 'stream')}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="webcam" id="webcam" />
                    <Label htmlFor="webcam">{t.useDeviceCamera}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="stream" id="stream" />
                    <Label htmlFor="stream">{t.useStreamUrl}</Label>
                  </div>
                </RadioGroup>
                
                {videoState.sourceType === 'stream' && (
                  <div className="space-y-2">
                    <Label htmlFor="streamUrl">{t.streamUrlLabel}</Label>
                    <Input
                      id="streamUrl"
                      placeholder={t.streamUrlPlaceholder}
                      value={videoState.streamUrl}
                      onChange={(e) => videoActions.setStreamUrl(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t.streamUrlHelp}
                    </p>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button onClick={videoActions.startStream}>{t.apply}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <div className={`h-2 w-2 rounded-full ${videoState.isPlaying && !videoState.isConnecting ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          {videoState.isPlaying && !videoState.isConnecting ? t.stream : t.streamInactive}
        </div>
      </div>
      
      {detectionState.detectedObjects.length > 0 && (
        <div className="bg-muted/50 p-2 rounded-md">
          <p className="text-sm font-medium mb-1">{t.detectedObjects}</p>
          <div className="flex flex-wrap gap-1">
            {detectionState.detectedObjects.map((obj, idx) => (
              <span key={idx} className="bg-primary/10 text-xs px-2 py-1 rounded-md">{obj}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;
