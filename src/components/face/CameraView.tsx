
import React, { useRef, useEffect } from 'react';
import { RoboflowDetection, drawDetections } from '@/utils/roboflow';
import { Loader2 } from 'lucide-react';

interface CameraViewProps {
  isCapturing: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  overlayCanvasRef: React.RefObject<HTMLCanvasElement>;
  detections: RoboflowDetection[];
  isLoading?: boolean;
  message?: string;
}

const CameraView: React.FC<CameraViewProps> = ({
  isCapturing,
  videoRef,
  overlayCanvasRef,
  detections,
  isLoading,
  message
}) => {
  // Adjust overlay canvas size when video dimensions change
  useEffect(() => {
    if (!videoRef.current || !overlayCanvasRef.current || !isCapturing) return;
    
    const updateCanvasSize = () => {
      if (!videoRef.current || !overlayCanvasRef.current) return;
      
      overlayCanvasRef.current.width = videoRef.current.videoWidth;
      overlayCanvasRef.current.height = videoRef.current.videoHeight;
    };
    
    // Call once and add listener
    updateCanvasSize();
    videoRef.current.addEventListener('loadedmetadata', updateCanvasSize);
    
    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadedmetadata', updateCanvasSize);
      }
    };
  }, [isCapturing, videoRef, overlayCanvasRef]);

  return (
    <div className="aspect-video bg-muted rounded-md overflow-hidden relative">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
      <canvas
        ref={overlayCanvasRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
      />

      {isLoading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2">{message || 'Processing...'}</p>
          </div>
        </div>
      )}
      
      <div className="absolute top-2 right-2 bg-black/60 text-white rounded-md px-2 py-1 text-xs flex items-center">
        <div className={`h-2 w-2 rounded-full mr-1 ${detections.length > 0 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
        {detections.length > 0 ? `Found faces: ${detections.length}` : 'Searching for faces...'}
      </div>

      <div className="absolute bottom-2 left-2 right-2 bg-black/60 text-white rounded-md px-2 py-1 text-xs">
        Position your face clearly in the frame
      </div>
    </div>
  );
};

export default CameraView;
