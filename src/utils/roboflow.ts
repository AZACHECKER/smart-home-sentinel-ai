
const ROBOFLOW_API_KEY = "VFzMGMweB1K0KmZdwdZT";
const ROBOFLOW_MODEL = "face-detection-mik1i/27";
const ROBOFLOW_API_URL = "https://detect.roboflow.com";

export interface RoboflowDetection {
  class: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RoboflowResponse {
  predictions: RoboflowDetection[];
  time: number;
  image: {
    width: number;
    height: number;
  };
}

/**
 * Detects faces in the provided image using Roboflow API
 * @param imageBase64 Base64 encoded image data
 * @param confidenceThreshold Minimum confidence threshold (0-1)
 * @returns Array of detected faces
 */
export async function detectFaces(
  imageBase64: string,
  confidenceThreshold = 0.5
): Promise<RoboflowDetection[]> {
  try {
    // Remove data:image/jpeg;base64, prefix if present
    const base64Data = imageBase64.includes('base64,') 
      ? imageBase64.split('base64,')[1] 
      : imageBase64;
    
    const response = await fetch(
      `${ROBOFLOW_API_URL}/${ROBOFLOW_MODEL}?api_key=${ROBOFLOW_API_KEY}`,
      {
        method: "POST",
        body: base64Data,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json() as RoboflowResponse;
    
    // Filter results by confidence threshold
    const predictions = result.predictions || [];
    return predictions.filter(pred => pred.confidence >= confidenceThreshold);
  } catch (error) {
    console.error("Error detecting faces:", error);
    throw error;
  }
}

/**
 * Extracts face region from image based on detection
 * @param imageData Original image data (base64)
 * @param detection Detection with coordinates
 * @returns Base64 encoded cropped face image
 */
export function extractFaceRegion(
  imageData: string,
  detection: RoboflowDetection
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Create canvas to crop the face
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        resolve(''); // Return empty string if canvas context is not available
        return;
      }
      
      // Calculate face position with padding (20%)
      const padding = 0.2;
      const x = Math.max(0, detection.x - (detection.width * padding / 2));
      const y = Math.max(0, detection.y - (detection.height * padding / 2));
      const width = detection.width * (1 + padding);
      const height = detection.height * (1 + padding);
      
      // Set canvas dimensions to match the face region
      canvas.width = width;
      canvas.height = height;
      
      // Draw only the face region to the canvas
      ctx.drawImage(
        img,
        x, y, width, height,
        0, 0, width, height
      );
      
      // Get the cropped face as base64
      const croppedFace = canvas.toDataURL('image/jpeg');
      resolve(croppedFace);
    };
    
    // Load the original image
    img.src = imageData;
  });
}

/**
 * Draw face detection boxes on a canvas
 * @param canvas Canvas element to draw on
 * @param detections Array of face detections
 * @param imageWidth Original image width
 * @param imageHeight Original image height
 */
export function drawDetections(
  canvas: HTMLCanvasElement,
  detections: RoboflowDetection[],
  imageWidth: number,
  imageHeight: number
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Clear previous drawings
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Calculate scale factors
  const scaleX = canvas.width / imageWidth;
  const scaleY = canvas.height / imageHeight;
  
  detections.forEach(detection => {
    // Scale coordinates to canvas size
    const x = detection.x * scaleX;
    const y = detection.y * scaleY;
    const width = detection.width * scaleX;
    const height = detection.height * scaleY;
    
    // Draw rectangle around face
    ctx.strokeStyle = '#4ade80'; // Green color
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    
    // Draw confidence label
    const confidence = Math.round(detection.confidence * 100);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(x, y - 20, 70, 20);
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText(`Face: ${confidence}%`, x + 5, y - 5);
  });
}
