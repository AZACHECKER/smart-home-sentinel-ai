
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Video, Users, Pause, Play, Camera, AlertTriangle } from 'lucide-react';
import * as faceapi from 'face-api.js';
import * as cocossd from '@tensorflow-models/coco-ssd';

const VideoFeed = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [detectedFaces, setDetectedFaces] = useState(0);
  const [detectedObjects, setDetectedObjects] = useState<string[]>([]);
  const [isConnecting, setIsConnecting] = useState(true);
  const [isModelLoading, setIsModelLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const cocoModelRef = useRef<cocossd.ObjectDetection | null>(null);
  
  // Загрузка моделей при инициализации
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
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Инициализация веб-камеры
  useEffect(() => {
    const setupCamera = async () => {
      if (isModelLoading) return;
      
      try {
        setIsConnecting(true);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        
        console.log('Запрос доступа к камере...');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }
        });
        
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log('Видеопоток установлен в элемент video');
        }
        
        setIsConnecting(false);
        setErrorMessage(null);
      } catch (error) {
        console.error('Ошибка доступа к камере:', error);
        setErrorMessage('Нет доступа к камере. Пожалуйста, разрешите доступ.');
        setIsConnecting(false);
      }
    };

    if (isPlaying && !isModelLoading) {
      setupCamera();
    } else if (!isPlaying && streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
  }, [isPlaying, isModelLoading]);

  // Обработка видеопотока и распознавание
  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || isConnecting || isModelLoading || !isPlaying) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    const detectFrame = async () => {
      if (video.readyState === 4) {
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
          
          const objectsWithRussianTranslation = predictions.map(p => {
            const translations: {[key: string]: string} = {
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
            
            return translations[p.class] || p.class;
          });
          
          setDetectedObjects([...new Set(objectsWithRussianTranslation)]);
          
          // Отрисовка прямоугольников вокруг объектов
          predictions.forEach(prediction => {
            const [x, y, width, height] = prediction.bbox;
            
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            
            // Перевод популярных классов объектов
            let objectName = prediction.class;
            const translations: {[key: string]: string} = {
              'person': 'человек',
              'cat': 'кот',
              'dog': 'собака',
              'chair': 'стул',
              'table': 'стол',
              'bottle': 'бутылка',
              'cup': 'чашка',
              'laptop': 'ноутбук',
              'cell phone': 'телефон',
              'book': 'книга'
            };
            
            if (translations[objectName]) {
              objectName = translations[objectName];
            }
            
            ctx.fillStyle = 'white';
            ctx.font = '16px Arial';
            ctx.fillText(`${objectName}: ${Math.round(prediction.score * 100)}%`, x, y - 5);
          });
        }
      }
      
      animationRef.current = requestAnimationFrame(detectFrame);
    };

    video.onloadeddata = () => {
      console.log('Видео загружено, начало обработки кадров');
      animationRef.current = requestAnimationFrame(detectFrame);
    };

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isConnecting, isModelLoading, isPlaying]);

  return (
    <div className="space-y-4">
      <div className="webcam-container aspect-video bg-muted relative overflow-hidden rounded-lg">
        {(isConnecting || isModelLoading) ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4">{isModelLoading ? 'Загрузка моделей распознавания...' : 'Подключение к камере...'}</p>
            </div>
          </div>
        ) : errorMessage ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-destructive">
              <AlertTriangle className="mx-auto h-12 w-12 mb-2" />
              <p>{errorMessage}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setIsModelLoading(false);
                  setIsConnecting(false);
                  setIsPlaying(true);
                }}
              >
                Повторить попытку
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className={isPlaying ? "hidden" : "flex flex-col items-center gap-2"}>
                <Play size={48} className="text-primary opacity-50" />
                <span className="text-sm">Видео на паузе</span>
              </div>
            </div>
            
            <video 
              ref={videoRef}
              autoPlay 
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
              style={{ display: isPlaying ? 'block' : 'none' }}
            />
            
            <canvas 
              ref={canvasRef} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            
            {isPlaying && (
              <>
                <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-medium flex items-center">
                  <Video className="h-3 w-3 mr-1" /> ПРЯМОЙ ЭФИР
                </div>
                <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-medium flex items-center">
                  <Users className="h-3 w-3 mr-1" /> {detectedFaces} обнаружено
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/50 to-transparent text-white text-xs">
                  Фронтальная камера • {new Date().toLocaleTimeString()}
                </div>
              </>
            )}
          </>
        )}
      </div>
      
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <><Pause className="h-4 w-4 mr-1" /> Пауза</> : <><Play className="h-4 w-4 mr-1" /> Воспроизведение</>}
          </Button>
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1">
          <div className={`h-2 w-2 rounded-full ${isPlaying && !isConnecting ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
          {isPlaying && !isConnecting ? 'Трансляция' : 'Трансляция неактивна'}
        </div>
      </div>
      
      {detectedObjects.length > 0 && (
        <div className="bg-muted/50 p-2 rounded-md">
          <p className="text-sm font-medium mb-1">Обнаружены объекты:</p>
          <div className="flex flex-wrap gap-1">
            {detectedObjects.map((obj, idx) => (
              <span key={idx} className="bg-primary/10 text-xs px-2 py-1 rounded-md">{obj}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;
