
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, Bot, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface AIChatProps {
  onSendMessage: (message: string) => void;
}

const AIChat: React.FC<AIChatProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', message: string}[]>([
    {role: 'ai', message: 'Привет! Я ваш умный ассистент. Чем я могу помочь вам сегодня?'}
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // Add user message to chat history
    setChatHistory(prev => [...prev, {role: 'user', message: message.trim()}]);
    
    // Clear input field
    setMessage('');
    
    // Notify parent component
    onSendMessage(message.trim());
    
    // Simulate AI thinking
    setIsThinking(true);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Я понял ваш запрос и работаю над ним.",
        "Конечно, я могу помочь с этим.",
        "Интересный вопрос! Давайте разберемся.",
        "Я проверил информацию. Вот что удалось найти.",
        "Хороший вопрос. Вот ответ на него.",
        "Я обработал ваш запрос. Вот результат.",
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setChatHistory(prev => [...prev, {role: 'ai', message: randomResponse}]);
      setIsThinking(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Auto-scroll to bottom when chat updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isThinking]);

  const suggestedQuestions = [
    "Какая погода сегодня?",
    "Открыть входную дверь",
    "Включить свет в гостиной",
    "Как защитить дом от взлома?",
    "Покажи камеру у входа",
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Чат с ассистентом</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-2 bg-muted/30 rounded-md">
          {chatHistory.map((chat, index) => (
            <div 
              key={index} 
              className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`px-3 py-2 rounded-lg max-w-[80%] break-words flex items-start gap-2
                  ${chat.role === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted'
                  }`}
              >
                {chat.role === 'ai' ? (
                  <Bot className="mt-1 h-4 w-4 flex-shrink-0" />
                ) : (
                  <User className="mt-1 h-4 w-4 flex-shrink-0" />
                )}
                <div>{chat.message}</div>
              </div>
            </div>
          ))}
          
          {isThinking && (
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-lg max-w-[80%] bg-muted flex items-center gap-2">
                <Bot className="h-4 w-4" />
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
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Введите сообщение..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <Button onClick={handleSendMessage} disabled={message.trim() === '' || isThinking}>
              <Send size={18} />
            </Button>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-2">Быстрые вопросы:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q, idx) => (
                <Button 
                  key={idx} 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    setMessage(q);
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  disabled={isThinking}
                >
                  {q}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChat;
