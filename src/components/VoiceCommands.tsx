
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, MicOff, Sparkles } from 'lucide-react';

interface VoiceCommandsProps {
  onVoiceCommand: (command: string) => void;
}

const VoiceCommands: React.FC<VoiceCommandsProps> = ({ onVoiceCommand }) => {
  const [textCommand, setTextCommand] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', message: string}[]>([
    {role: 'ai', message: 'Привет! Я ваш умный помощник. Чем могу помочь?'}
  ]);
  const [isThinking, setIsThinking] = useState(false);
  
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Эмуляция распознавания голоса и запроса к ИИ
  const processVoiceCommand = (command: string) => {
    // Добавляем запрос пользователя в историю
    addMessageToChat('user', command);
    
    // Эмуляция обработки ИИ
    setIsThinking(true);
    setTimeout(() => {
      // Определяем ответ на основе ключевых слов
      let response = '';
      const lowerCommand = command.toLowerCase();
      
      if (lowerCommand.includes('привет') || lowerCommand.includes('здравствуй')) {
        response = 'Здравствуйте! Чем я могу помочь?';
      } else if (lowerCommand.includes('открой') || lowerCommand.includes('открыть') || lowerCommand.includes('разблокируй')) {
        response = 'Выполняю команду разблокировки двери. Пожалуйста, смотрите в камеру для распознавания лица.';
        onVoiceCommand('Открыть входную дверь');
      } else if (lowerCommand.includes('закрой') || lowerCommand.includes('закрыть') || lowerCommand.includes('заблокируй')) {
        response = 'Выполняю команду блокировки двери.';
        onVoiceCommand('Закрыть дверь');
      } else if (lowerCommand.includes('свет') && (lowerCommand.includes('включи') || lowerCommand.includes('включить'))) {
        response = 'Включаю свет.';
        onVoiceCommand('Включить свет');
      } else if (lowerCommand.includes('свет') && (lowerCommand.includes('выключи') || lowerCommand.includes('выключить'))) {
        response = 'Выключаю свет.';
        onVoiceCommand('Выключить свет');
      } else if (lowerCommand.includes('тревог') && (lowerCommand.includes('включи') || lowerCommand.includes('активируй'))) {
        response = 'Активирую тревожную сигнализацию.';
        onVoiceCommand('Активировать тревогу');
      } else if (lowerCommand.includes('тревог') && (lowerCommand.includes('выключи') || lowerCommand.includes('деактивируй'))) {
        response = 'Отключаю тревожную сигнализацию.';
        onVoiceCommand('Деактивировать тревогу');
      } else if (lowerCommand.includes('погод')) {
        response = 'Сегодня ожидается солнечная погода, температура около 22 градусов.';
      } else if (lowerCommand.includes('врем')) {
        response = `Текущее время: ${new Date().toLocaleTimeString()}`;
      } else if (lowerCommand.includes('спасибо')) {
        response = 'Всегда рад помочь!';
      } else {
        response = 'Я не совсем понимаю, что вы имеете в виду. Могу я помочь чем-то ещё?';
      }
      
      addMessageToChat('ai', response);
      setIsThinking(false);
    }, 1000);
  };
  
  const addMessageToChat = (role: 'user' | 'ai', message: string) => {
    setChatHistory(prev => [...prev, {role, message}]);
  };
  
  // Прокрутка чата вниз при добавлении новых сообщений
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);
  
  const handleSendCommand = () => {
    if (textCommand.trim()) {
      processVoiceCommand(textCommand);
      setTextCommand('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendCommand();
    }
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setRecordingDuration(0);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
      
      // Эмулируем распознавание речи
      const simulatedCommands = [
        'Открыть дверь',
        'Включить свет',
        'Какая погода сегодня?',
        'Который час?',
        'Активировать сигнализацию',
      ];
      const randomCommand = simulatedCommands[Math.floor(Math.random() * simulatedCommands.length)];
      processVoiceCommand(randomCommand);
    } else {
      setIsRecording(true);
      
      // Имитация записи длительности
      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => {
          if (prev >= 5) {
            setIsRecording(false);
            if (recordingTimerRef.current) {
              clearInterval(recordingTimerRef.current);
              recordingTimerRef.current = null;
            }
            
            // Эмулируем распознавание речи
            const simulatedCommands = [
              'Открыть дверь',
              'Включить свет',
              'Какая погода сегодня?',
              'Который час?',
              'Активировать сигнализацию',
            ];
            const randomCommand = simulatedCommands[Math.floor(Math.random() * simulatedCommands.length)];
            processVoiceCommand(randomCommand);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };
  
  const suggestedCommands = [
    "Открыть дверь",
    "Включить свет",
    "Выключить свет",
    "Активировать сигнализацию",
    "Деактивировать сигнализацию",
    "Который час?"
  ];
  
  return (
    <div className="space-y-4">
      <div className="h-60 overflow-y-auto bg-muted/50 p-4 rounded-md mb-2">
        {chatHistory.map((msg, idx) => (
          <div 
            key={idx} 
            className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <div 
              className={`inline-block px-3 py-2 rounded-lg max-w-[80%] break-words ${
                msg.role === 'user' 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-muted-foreground/10'
              }`}
            >
              {msg.role === 'ai' && <Sparkles className="inline-block h-3 w-3 mr-1" />}
              {msg.message}
            </div>
          </div>
        ))}
        {isThinking && (
          <div className="text-left mb-3">
            <div className="inline-block px-3 py-2 rounded-lg max-w-[80%] bg-muted-foreground/10">
              <div className="flex space-x-1">
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce"></div>
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="h-2 w-2 bg-muted-foreground rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Введите команду..."
          value={textCommand}
          onChange={(e) => setTextCommand(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button onClick={handleSendCommand}>
          <Send size={18} />
        </Button>
      </div>
      
      <div className="flex justify-center">
        <Button 
          variant={isRecording ? "destructive" : "outline"} 
          className={`rounded-full h-16 w-16 flex items-center justify-center ${isRecording ? 'animate-pulse' : ''}`}
          onClick={toggleRecording}
        >
          {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
        </Button>
      </div>
      
      {isRecording && (
        <div className="text-center">
          <div className="text-sm text-muted-foreground">Запись... {recordingDuration}с</div>
          <div className="mt-1 h-1 bg-gray-200 rounded-full">
            <div 
              className="h-1 bg-primary rounded-full transition-all duration-1000" 
              style={{ width: `${(recordingDuration / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="pt-2">
        <p className="text-sm text-muted-foreground mb-2">Предлагаемые команды:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedCommands.map((command, index) => (
            <Button 
              key={index} 
              variant="secondary" 
              size="sm"
              onClick={() => processVoiceCommand(command)}
            >
              {command}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceCommands;
