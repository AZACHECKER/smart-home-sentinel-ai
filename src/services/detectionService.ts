
const ROBOFLOW_API_KEY = "VFzMGMweB1K0KmZdwdZT";
const ROBOFLOW_ENDPOINT = "https://serverless.roboflow.com/people-detection-o4rdr/9";

export class DetectionService {
  static async detectFromImage(imageFile: File): Promise<DetectionResponse> {
    try {
      const base64Image = await this.convertFileToBase64(imageFile);
      
      const response = await fetch(`${ROBOFLOW_ENDPOINT}?api_key=${ROBOFLOW_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: base64Image,
      });

      if (!response.ok) {
        throw new Error('Detection request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in detection:', error);
      throw error;
    }
  }

  static async detectFromUrl(imageUrl: string): Promise<DetectionResponse> {
    try {
      const response = await fetch(`${ROBOFLOW_ENDPOINT}?api_key=${ROBOFLOW_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Detection request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in detection:', error);
      throw error;
    }
  }

  private static async convertFileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]); // Remove data URL prefix
      };
      reader.onerror = reject;
    });
  }
}
