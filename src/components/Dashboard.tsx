
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, Users, Shield, Lock, Unlock, LightbulbOff, LightbulbIcon,
  BellOff, BellRing, Video, MessageSquare, AlertTriangle, PlugZap,
  ThermometerIcon, Droplets
} from 'lucide-react';
import VideoFeed from './VideoFeed';
import VoiceCommands from './VoiceCommands';
import EventLog from './EventLog';
import RecognitionPanel from './RecognitionPanel';
import { useToast } from '@/components/ui/use-toast';

interface DashboardProps {
  systemStatus: {
    connected: boolean;
    lockState: string;
    lightState: string;
    alarmState: string;
  };
  onControlAction: (action: string) => void;
  onVoiceCommand: (command: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  systemStatus, 
  onControlAction,
  onVoiceCommand
}) => {
  const { toast } = useToast();
  const [lastEvent, setLastEvent] = useState('Система инициализирована');
  const [recognizedUser, setRecognizedUser] = useState<null | { name: string, role: string, confidence: string }>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (systemStatus.alarmState === 'on') {
      setShowAlert(true);
      toast({
        variant: "destructive",
        title: "Тревога!",
        description: "Обнаружен несанкционированный доступ!",
      });
    } else {
      setShowAlert(false);
    }
  }, [systemStatus.alarmState, toast]);

  // Симуляция распознавания пользователей
  useEffect(() => {
    const users = [
      { name: "Анна Иванова", role: "Владелец", confidence: "98%" },
      { name: "Иван Петров", role: "Житель", confidence: "95%" },
      { name: "Мария Сидорова", role: "Гость", confidence: "85%" },
      null
    ];
    
    const recognitionInterval = setInterval(() => {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      setRecognizedUser(randomUser);
      
      if (randomUser) {
        setLastEvent(`Пользователь распознан: ${randomUser.name} (${randomUser.role})`);
      } else {
        setLastEvent('Пользователь не распознан');
      }
    }, 30000);
    
    return () => clearInterval(recognitionInterval);
  }, []);

  return (
    <div className="container py-6 space-y-6">
      {showAlert && (
        <Alert variant="destructive" className="animate-pulse">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Внимание! Тревога!</AlertTitle>
          <AlertDescription>
            Обнаружен несанкционированный доступ. Система безопасности активирована.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between">
              <div>Видеонаблюдение</div>
              <Badge variant="outline">Камера 1</Badge>
            </CardTitle>
            <CardDescription>Мониторинг главного входа с распознаванием лиц</CardDescription>
          </CardHeader>
          <CardContent>
            <VideoFeed />
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Управление системой</CardTitle>
              <CardDescription>Управление безопасностью умного дома</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant={systemStatus.lockState === 'locked' ? "default" : "outline"}
                  className="flex items-center gap-2 h-auto py-3" 
                  onClick={() => onControlAction('lock')}
                >
                  <Lock size={18} />
                  <span>Закрыть дверь</span>
                </Button>
                <Button 
                  variant={systemStatus.lockState === 'unlocked' ? "default" : "outline"}
                  className="flex items-center gap-2 h-auto py-3" 
                  onClick={() => onControlAction('unlock')}
                >
                  <Unlock size={18} />
                  <span>Открыть дверь</span>
                </Button>
                <Button 
                  variant={systemStatus.lightState === 'on' ? "default" : "outline"}
                  className="flex items-center gap-2 h-auto py-3" 
                  onClick={() => onControlAction('light_on')}
                >
                  <LightbulbIcon size={18} />
                  <span>Включить свет</span>
                </Button>
                <Button 
                  variant={systemStatus.lightState === 'off' ? "default" : "outline"}
                  className="flex items-center gap-2 h-auto py-3" 
                  onClick={() => onControlAction('light_off')}
                >
                  <LightbulbOff size={18} />
                  <span>Выключить свет</span>
                </Button>
                <Button 
                  variant={systemStatus.alarmState === 'on' ? "destructive" : "outline"}
                  className="flex items-center gap-2 h-auto py-3" 
                  onClick={() => onControlAction('alarm_on')}
                >
                  <BellRing size={18} />
                  <span>Тревога вкл.</span>
                </Button>
                <Button 
                  variant={systemStatus.alarmState === 'off' ? "default" : "outline"}
                  className="flex items-center gap-2 h-auto py-3" 
                  onClick={() => onControlAction('alarm_off')}
                >
                  <BellOff size={18} />
                  <span>Тревога выкл.</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Распознавание пользователей</CardTitle>
              <CardDescription>Последний обнаруженный человек</CardDescription>
            </CardHeader>
            <CardContent>
              <RecognitionPanel recognizedUser={recognizedUser} />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Голосовое управление</CardTitle>
            <CardDescription>Управляйте домом с помощью голоса</CardDescription>
          </CardHeader>
          <CardContent>
            <VoiceCommands onVoiceCommand={onVoiceCommand} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Журнал событий</CardTitle>
            <CardDescription>Недавние события системы</CardDescription>
          </CardHeader>
          <CardContent>
            <EventLog lastEvent={lastEvent} />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Статус двери</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold">
                {systemStatus.lockState === 'locked' ? 'Закрыто' : 'Открыто'}
              </span>
              <div className={`p-2 rounded-full ${systemStatus.lockState === 'locked' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {systemStatus.lockState === 'locked' ? <Lock size={24} /> : <Unlock size={24} />}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Освещение</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold">
                {systemStatus.lightState === 'on' ? 'Включено' : 'Выключено'}
              </span>
              <div className={`p-2 rounded-full ${systemStatus.lightState === 'on' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                {systemStatus.lightState === 'on' ? <LightbulbIcon size={24} /> : <LightbulbOff size={24} />}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Температура</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold">21°C</span>
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <ThermometerIcon size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Влажность</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold">45%</span>
              <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                <Droplets size={24} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="security">Безопасность</TabsTrigger>
          <TabsTrigger value="automation">Автоматизация</TabsTrigger>
          <TabsTrigger value="energy">Энергия</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Общий статус дома</CardTitle>
              <CardDescription>Полный статус системы</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1 border rounded-lg p-4">
                  <div className="text-muted-foreground text-sm">Безопасность</div>
                  <div className="flex gap-2 items-center">
                    <Shield size={18} className="text-green-500" />
                    <span className="font-medium">Активна</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 border rounded-lg p-4">
                  <div className="text-muted-foreground text-sm">Камеры</div>
                  <div className="flex gap-2 items-center">
                    <Video size={18} className="text-green-500" />
                    <span className="font-medium">2 Онлайн</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 border rounded-lg p-4">
                  <div className="text-muted-foreground text-sm">Пользователи</div>
                  <div className="flex gap-2 items-center">
                    <Users size={18} className="text-blue-500" />
                    <span className="font-medium">3 Зарегистрировано</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 border rounded-lg p-4">
                  <div className="text-muted-foreground text-sm">Энергия</div>
                  <div className="flex gap-2 items-center">
                    <PlugZap size={18} className="text-yellow-500" />
                    <span className="font-medium">Оптимально</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Статус безопасности</CardTitle>
              <CardDescription>Обзор безопасности системы</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Lock size={18} />
                    <span>Входная дверь</span>
                  </div>
                  <Badge variant={systemStatus.lockState === 'locked' ? 'default' : 'destructive'}>
                    {systemStatus.lockState === 'locked' ? 'Защищено' : 'Разблокировано'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Lock size={18} />
                    <span>Задняя дверь</span>
                  </div>
                  <Badge>Защищено</Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Video size={18} />
                    <span>Камеры наблюдения</span>
                  </div>
                  <Badge>Активны</Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <BellRing size={18} />
                    <span>Система тревоги</span>
                  </div>
                  <Badge variant={systemStatus.alarmState === 'off' ? 'outline' : 'destructive'}>
                    {systemStatus.alarmState === 'off' ? 'В режиме ожидания' : 'Активирована'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={18} />
                    <span>Датчики движения</span>
                  </div>
                  <Badge variant="outline">Активны</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="automation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Настройки автоматизации</CardTitle>
              <CardDescription>Правила автоматизации умного дома</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">Ночной режим</div>
                    <div className="text-sm text-muted-foreground">Автоматически закрывает двери и активирует систему безопасности в 23:00</div>
                  </div>
                  <Badge>Включено</Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">Утренний режим</div>
                    <div className="text-sm text-muted-foreground">Включает свет и регулирует температуру в 7:00</div>
                  </div>
                  <Badge>Включено</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Режим отсутствия</div>
                    <div className="text-sm text-muted-foreground">Имитирует присутствие, когда никого нет дома</div>
                  </div>
                  <Badge variant="outline">Отключено</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="energy" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Потребление энергии</CardTitle>
              <CardDescription>Использование энергии умным домом</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="font-medium">Потребление сегодня</div>
                  <div>3.2 кВт·ч</div>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="font-medium">Недельное среднее</div>
                  <div>21.5 кВт·ч</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Месячный прогноз</div>
                  <div>92.4 кВт·ч</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">Потребление на 12% ниже, чем в прошлом месяце</p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
