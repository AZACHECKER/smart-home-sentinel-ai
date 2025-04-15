
export interface Detection {
  class: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DetectionResponse {
  predictions: Detection[];
  image: {
    width: number;
    height: number;
  };
  time: number;
}
