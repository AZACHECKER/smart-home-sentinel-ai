
import { useState } from 'react';
import { DetectionResponse } from '@/types/detection';
import { DetectionService } from '@/services/detectionService';
import { useToast } from '@/hooks/use-toast';

export const useDetection = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [detections, setDetections] = useState<DetectionResponse | null>(null);
  const { toast } = useToast();

  const detectFromImage = async (file: File) => {
    try {
      setIsLoading(true);
      const result = await DetectionService.detectFromImage(file);
      setDetections(result);
      toast({
        title: "Detection completed",
        description: `Found ${result.predictions.length} objects`,
      });
    } catch (error) {
      toast({
        title: "Detection failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const detectFromUrl = async (url: string) => {
    try {
      setIsLoading(true);
      const result = await DetectionService.detectFromUrl(url);
      setDetections(result);
      toast({
        title: "Detection completed",
        description: `Found ${result.predictions.length} objects`,
      });
    } catch (error) {
      toast({
        title: "Detection failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    detections,
    detectFromImage,
    detectFromUrl,
  };
};
