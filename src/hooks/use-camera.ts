
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface UseCameraProps {
  onDetectionInterval?: (videoElement: HTMLVideoElement) => Promise<void>;
  detectionIntervalMs?: number;
}

export interface CameraState {
  isCapturing: boolean;
  streamRef: React.MutableRefObject<MediaStream | null>;
  videoRef: React.RefObject<HTMLVideoElement>;
  overlayCanvasRef: React.RefObject<HTMLCanvasElement>;
  detectionIntervalRef: React.MutableRefObject<number | null>;
}

export interface CameraActions {
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

export const useCamera = ({
  onDetectionInterval,
  detectionIntervalMs = 500
}: UseCameraProps = {}): [CameraState, CameraActions] => {
  const [isCapturing, setIsCapturing] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const detectionIntervalRef = useRef<number | null>(null);
  const { toast } = useToast();

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
        
        // Clear overlay canvas
        if (overlayCanvasRef.current) {
          const ctx = overlayCanvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
          }
        }
        
        // Set up detection interval if provided
        if (onDetectionInterval) {
          detectionIntervalRef.current = window.setInterval(async () => {
            if (videoRef.current) {
              await onDetectionInterval(videoRef.current);
            }
          }, detectionIntervalMs);
        }
      }
    } catch (error) {
      console.error('Camera access error:', error);
      toast({
        variant: "destructive",
        title: "Camera error",
        description: "Could not access camera. Check permissions.",
      });
    }
  };
  
  const stopCamera = () => {
    // Stop all tracks in the stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Clear video source
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    // Clear detection interval
    if (detectionIntervalRef.current) {
      window.clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    
    setIsCapturing(false);
  };

  // Clean up resources on component unmount
  // (This effect should be in the component using this hook)

  return [
    {
      isCapturing,
      streamRef,
      videoRef,
      overlayCanvasRef,
      detectionIntervalRef
    },
    {
      startCamera,
      stopCamera
    }
  ];
};

export default useCamera;
