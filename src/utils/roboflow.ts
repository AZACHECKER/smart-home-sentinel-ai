
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

export async function detectFaces(imageBase64: string): Promise<RoboflowDetection[]> {
  try {
    const response = await fetch(
      `${ROBOFLOW_API_URL}/${ROBOFLOW_MODEL}?api_key=${ROBOFLOW_API_KEY}`,
      {
        method: "POST",
        body: imageBase64.split(',')[1], // Remove data:image/jpeg;base64, prefix
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.predictions || [];
  } catch (error) {
    console.error("Error detecting faces:", error);
    throw error;
  }
}
