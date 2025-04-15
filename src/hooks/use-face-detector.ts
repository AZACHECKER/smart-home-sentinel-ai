
import { useState, useEffect, useRef } from 'react';
import { pipeline } from "@huggingface/transformers";
import { useToast } from '@/hooks/use-toast';

export interface FaceDetectorState {
  isLoading: boolean;
  modelLoaded: boolean;
  modelStatus: string;
  featureExtractor: any;
}

export const useFaceDetector = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const [modelStatus, setModelStatus] = useState('Model not loaded');
  const featureExtractorRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadModel = async () => {
      try {
        setIsLoading(true);
        setModelStatus('Loading model...');
        
        featureExtractorRef.current = await pipeline(
          "feature-extraction",
          "mixedbread-ai/mxbai-embed-xsmall-v1"
        );
        
        setModelLoaded(true);
        setModelStatus('Model loaded successfully');
        setIsLoading(false);
        
        toast({
          title: "Model loaded",
          description: "AI model for face recognition successfully initialized",
        });
      } catch (error) {
        console.error('Error loading model:', error);
        setModelStatus('Error loading model');
        setIsLoading(false);
        
        toast({
          variant: "destructive",
          title: "Model loading error",
          description: "Failed to load face recognition model",
        });
      }
    };

    loadModel();
  }, [toast]);

  return {
    isLoading,
    modelLoaded,
    modelStatus,
    featureExtractor: featureExtractorRef.current
  };
};

export default useFaceDetector;
