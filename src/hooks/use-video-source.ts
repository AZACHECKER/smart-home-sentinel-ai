
import { useState, useRef, useEffect } from 'react';

type VideoSourceType = 'webcam' | 'stream';

interface VideoSourceState {
  sourceType: VideoSourceType;
  streamUrl: string;
  isPlaying: boolean;
  isConnecting: boolean;
  errorMessage: string | null;
  streamRef: MediaStream | null;
}

interface VideoSourceActions {
  setSourceType: (type: VideoSourceType) => void;
  setStreamUrl: (url: string) => void;
  togglePlayback: () => void;
  startStream: () => Promise<void>;
  stopStream: () => void;
  retryConnection: () => Promise<void>;
}

export const useVideoSource = (
  videoRef: React.RefObject<HTMLVideoElement>,
): [VideoSourceState, VideoSourceActions] => {
  const [sourceType, setSourceType] = useState<VideoSourceType>('webcam');
  const [streamUrl, setStreamUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const streamRef = useRef<MediaStream | null>(null);
  
  const stopCurrentStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      if (videoRef.current.src) {
        videoRef.current.src = '';
      }
    }
  };
  
  const startStream = async () => {
    if (!videoRef.current) return;
    
    setIsConnecting(true);
    setErrorMessage(null);
    
    try {
      // Остановить текущий поток, если он активен
      stopCurrentStream();
      
      if (sourceType === 'webcam') {
        console.log('Requesting camera access...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
        });
        
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      } else if (sourceType === 'stream' && streamUrl) {
        console.log('Connecting to stream URL:', streamUrl);
        videoRef.current.srcObject = null;
        videoRef.current.src = streamUrl;
        videoRef.current.play();
      }
      
      setIsPlaying(true);
    } catch (error) {
      console.error('Error accessing video source:', error);
      
      if (sourceType === 'webcam') {
        setErrorMessage('Нет доступа к камере. Пожалуйста, разрешите доступ.');
      } else {
        setErrorMessage('Не удалось подключиться к видеопотоку. Проверьте URL.');
      }
    } finally {
      setIsConnecting(false);
    }
  };
  
  const stopStream = () => {
    setIsPlaying(false);
    if (sourceType === 'webcam') {
      stopCurrentStream();
    }
  };
  
  const togglePlayback = () => {
    if (isPlaying) {
      stopStream();
    } else {
      startStream();
    }
  };
  
  const retryConnection = async () => {
    await startStream();
  };
  
  // Очистить ресурсы при размонтировании
  useEffect(() => {
    return () => {
      stopCurrentStream();
    };
  }, []);
  
  const state: VideoSourceState = {
    sourceType,
    streamUrl,
    isPlaying,
    isConnecting,
    errorMessage,
    streamRef: streamRef.current
  };
  
  const actions: VideoSourceActions = {
    setSourceType: (type: VideoSourceType) => {
      setSourceType(type);
    },
    setStreamUrl,
    togglePlayback,
    startStream,
    stopStream,
    retryConnection
  };
  
  return [state, actions];
};
