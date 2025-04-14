
import { useState, useEffect, useRef, RefObject } from 'react';
import * as faceapi from 'face-api.js';
import * as cocossd from '@tensorflow-models/coco-ssd';

interface DetectionState {
  isModelLoading: boolean;
  detectedFaces: number;
  detectedObjects: string[];
  errorMessage: string | null;
  isProcessingFrame: boolean;
}

interface DetectionActions {
  startDetection: () => void;
  stopDetection: () => void;
}

interface DetectionOptions {
  enabled: boolean;
}

// Словарь с переводами объектов
const objectTranslations: {[key: string]: string} = {
  'person': 'человек',
  'bicycle': 'велосипед',
  'car': 'автомобиль',
  'motorcycle': 'мотоцикл',
  'airplane': 'самолет',
  'bus': 'автобус',
  'train': 'поезд',
  'truck': 'грузовик',
  'boat': 'лодка',
  'traffic light': 'светофор',
  'fire hydrant': 'пожарный гидрант',
  'stop sign': 'знак стоп',
  'parking meter': 'парковочный счетчик',
  'bench': 'скамейка',
  'bird': 'птица',
  'cat': 'кот',
  'dog': 'собака',
  'horse': 'лошадь',
  'sheep': 'овца',
  'cow': 'корова',
  'elephant': 'слон',
  'bear': 'медведь',
  'zebra': 'зебра',
  'giraffe': 'жираф',
  'backpack': 'рюкзак',
  'umbrella': 'зонт',
  'handbag': 'сумка',
  'tie': 'галстук',
  'suitcase': 'чемодан',
  'frisbee': 'фрисби',
  'skis': 'лыжи',
  'snowboard': 'сноуборд',
  'sports ball': 'спортивный мяч',
  'kite': 'воздушный змей',
  'baseball bat': 'бейсбольная бита',
  'baseball glove': 'бейсбольная перчатка',
  'skateboard': 'скейтборд',
  'surfboard': 'доска для серфинга',
  'tennis racket': 'теннисная ракетка',
  'bottle': 'бутылка',
  'wine glass': 'винный бокал',
  'cup': 'чашка',
  'fork': 'вилка',
  'knife': 'нож',
  'spoon': 'ложка',
  'bowl': 'миска',
  'banana': 'банан',
  'apple': 'яблоко',
  'sandwich': 'бутерброд',
  'orange': 'апельсин',
  'broccoli': 'брокколи',
  'carrot': 'морковь',
  'hot dog': 'хот-дог',
  'pizza': 'пицца',
  'donut': 'пончик',
  'cake': 'торт',
  'chair': 'стул',
  'couch': 'диван',
  'potted plant': 'комнатное растение',
  'bed': 'кровать',
  'dining table': 'обеденный стол',
  'toilet': 'туалет',
  'tv': 'телевизор',
  'laptop': 'ноутбук',
  'mouse': 'мышь',
  'remote': 'пульт',
  'keyboard': 'клавиатура',
  'cell phone': 'мобильный телефон',
  'microwave': 'микроволновка',
  'oven': 'духовка',
  'toaster': 'тостер',
  'sink': 'раковина',
  'refrigerator': 'холодильник',
  'book': 'книга',
  'clock': 'часы',
  'vase': 'ваза',
  'scissors': 'ножницы',
  'teddy bear': 'плюшевый мишка',
  'hair drier': 'фен',
  'toothbrush': 'зубная щетка'
};

export const useObjectDetection = (
  videoRef: RefObject<HTMLVideoElement>,
  canvasRef: RefObject<HTMLCanvasElement>,
  options: DetectionOptions
): [DetectionState, DetectionActions] => {
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [detectedFaces, setDetectedFaces] = useState(0);
  const [detectedObjects, setDetectedObjects] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessingFrame, setIsProcessingFrame] = useState(false);
  
  const animationRef = useRef<number | null>(null);
  const cocoModelRef = useRef<cocossd.ObjectDetection | null>(null);
  
  // Загрузка моделей
  useEffect(() => {
    const loadModels = async () => {
      try {
        setIsModelLoading(true);
        
        console.log('Загрузка моделей Face API...');
        // Загрузка моделей Face API
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models/face-api');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models/face-api');
        await faceapi.nets.faceRecognitionNet.loadFromUri('/models/face-api');
        
        console.log('Загрузка модели COCO-SSD...');
        // Загрузка модели COCO-SSD для обнаружения объектов
        cocoModelRef.current = await cocossd.load();
        
        setIsModelLoading(false);
        console.log('Модели успешно загружены');
      } catch (error) {
        console.error('Ошибка при загрузке моделей:', error);
        setErrorMessage('Ошибка при загрузке моделей распознавания');
        setIsModelLoading(false);
      }
    };

    loadModels();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  const translateObject = (objectName: string): string => {
    return objectTranslations[objectName] || objectName;
  };
  
  const processVideoFrame = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (!video || !canvas || video.readyState !== 4 || isProcessingFrame) return;
    
    setIsProcessingFrame(true);
    
    try {
      // Настройка canvas по размеру видео
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      // Отрисовка текущего кадра видео
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Распознавание лиц
      const faceDetections = await faceapi.detectAllFaces(
        video, 
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks();
      
      setDetectedFaces(faceDetections.length);
      
      // Отрисовка прямоугольников вокруг лиц
      faceDetections.forEach(detection => {
        const box = detection.detection.box;
        ctx.strokeStyle = '#00ff00';
        ctx.lineWidth = 2;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.fillStyle = 'white';
        ctx.fillText('Человек', box.x, box.y - 5);
      });
      
      // Распознавание объектов
      if (cocoModelRef.current) {
        const predictions = await cocoModelRef.current.detect(video);
        
        const objectsWithTranslations = predictions.map(p => translateObject(p.class));
        setDetectedObjects([...new Set(objectsWithTranslations)]);
        
        predictions.forEach(prediction => {
          const [x, y, width, height] = prediction.bbox;
          
          ctx.strokeStyle = '#ff0000';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, width, height);
          
          const translatedName = translateObject(prediction.class);
          
          ctx.fillStyle = 'white';
          ctx.font = '16px Arial';
          ctx.fillText(`${translatedName}: ${Math.round(prediction.score * 100)}%`, x, y - 5);
        });
      }
    } catch (error) {
      console.error('Error processing video frame:', error);
    } finally {
      setIsProcessingFrame(false);
    }
  };
  
  // Функция для запуска детекции объектов
  const startDetection = () => {
    if (!videoRef.current || isModelLoading) return;
    
    const detectFrame = () => {
      processVideoFrame().then(() => {
        if (options.enabled) {
          animationRef.current = requestAnimationFrame(detectFrame);
        }
      });
    };
    
    detectFrame();
  };
  
  // Функция для остановки детекции объектов
  const stopDetection = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  };
  
  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      stopDetection();
    };
  }, []);
  
  // Перезапуск детекции при изменении состояния enabled
  useEffect(() => {
    if (options.enabled && !isModelLoading) {
      startDetection();
    } else {
      stopDetection();
    }
    
    return () => {
      stopDetection();
    };
  }, [options.enabled, isModelLoading]);
  
  const state: DetectionState = {
    isModelLoading,
    detectedFaces,
    detectedObjects,
    errorMessage,
    isProcessingFrame
  };
  
  const actions: DetectionActions = {
    startDetection,
    stopDetection
  };
  
  return [state, actions];
};
