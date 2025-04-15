
import { detectFaces, extractFaceRegion, RoboflowDetection } from './roboflow';

export interface FaceData {
  id: string;
  name: string;
  role: 'owner' | 'guest' | 'admin';
  images: string[];
  embeddings?: number[][];
  recognizedFaceImage?: string;
}

/**
 * Calculates cosine similarity between two embeddings
 */
export const calculateSimilarity = (embedding1: number[], embedding2: number[]): number => {
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

/**
 * Generates face embeddings from images
 */
export const generateEmbeddings = async (
  images: string[], 
  featureExtractor: any,
  onProgress?: (progress: number) => void
): Promise<number[][]> => {
  if (!featureExtractor) {
    throw new Error('Model not loaded');
  }
  
  const embeddings: number[][] = [];
  
  for (let i = 0; i < images.length; i++) {
    try {
      if (onProgress) {
        onProgress(((i + 1) / images.length) * 100);
      }
      
      const img = new Image();
      img.src = images[i];
      await new Promise(resolve => {
        img.onload = resolve;
      });
      
      const embedding = await featureExtractor(img, { 
        pooling: "mean", 
        normalize: true 
      });
      
      embeddings.push(embedding.tolist()[0]);
    } catch (error) {
      console.error('Error creating embedding:', error);
    }
  }
  
  return embeddings;
};

/**
 * Load face database from localStorage
 */
export const loadFaceDatabase = (): FaceData[] => {
  const saved = localStorage.getItem('faceDatabase');
  return saved ? JSON.parse(saved) : [];
};

/**
 * Save face database to localStorage
 */
export const saveFaceDatabase = (database: FaceData[]): void => {
  localStorage.setItem('faceDatabase', JSON.stringify(database));
};

/**
 * Export face database as JSON file
 */
export const exportFaceDatabase = (): void => {
  const faceDatabase = localStorage.getItem('faceDatabase') || '[]';
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(faceDatabase);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `face-database-${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

/**
 * Capture image from video element
 */
export const captureImageFromVideo = async (
  videoElement: HTMLVideoElement,
  confidenceThreshold: number
): Promise<{ imageData: string; detection: RoboflowDetection | null; allDetections: RoboflowDetection[] }> => {
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not create canvas context');
  }
  
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  const imageData = canvas.toDataURL('image/jpeg');
  
  const faceDetections = await detectFaces(imageData, confidenceThreshold);
  
  if (faceDetections.length === 0) {
    return { imageData, detection: null, allDetections: [] };
  }
  
  // Sort by confidence and get the best detection
  faceDetections.sort((a, b) => b.confidence - a.confidence);
  const bestDetection = faceDetections[0];
  
  return { 
    imageData, 
    detection: bestDetection, 
    allDetections: faceDetections 
  };
};
