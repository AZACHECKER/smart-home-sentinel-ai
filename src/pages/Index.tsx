
import React, { useState } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import AIChat from '@/components/AIChat';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { translations as t } from '@/constants/translations';

interface IndexProps {
  systemStatus: {
    connected: boolean;
    lockState: string;
    lightState: string;
    alarmState: string;
  };
  onControlAction: (action: string) => void;
  onVoiceCommand: (command: string) => void;
}

const Index: React.FC<IndexProps> = ({ systemStatus: initialSystemStatus, onControlAction: parentControlAction, onVoiceCommand: parentVoiceCommand }) => {
  const { toast } = useToast();
  const [systemStatus, setSystemStatus] = useState({
    connected: initialSystemStatus.connected,
    lockState: initialSystemStatus.lockState,
    lightState: initialSystemStatus.lightState,
    alarmState: initialSystemStatus.alarmState
  });

  const handleControlAction = (action: string) => {
    let message = '';
    let description = '';
    let variant: 'default' | 'destructive' = 'default';

    switch (action) {
      case 'lock':
        setSystemStatus(prev => ({ ...prev, lockState: 'locked' }));
        message = t.doorLocked;
        description = t.doorSecured;
        break;
      case 'unlock':
        setSystemStatus(prev => ({ ...prev, lockState: 'unlocked' }));
        message = t.doorUnlocked;
        description = t.doorOpened;
        break;
      case 'light_on':
        setSystemStatus(prev => ({ ...prev, lightState: 'on' }));
        message = t.lightTurnedOn;
        description = t.lightTurnedOnDesc;
        break;
      case 'light_off':
        setSystemStatus(prev => ({ ...prev, lightState: 'off' }));
        message = t.lightTurnedOff;
        description = t.lightTurnedOffDesc;
        break;
      case 'alarm_on':
        setSystemStatus(prev => ({ ...prev, alarmState: 'on' }));
        message = t.alarmActivated;
        description = t.alarmActivatedDesc;
        variant = 'destructive';
        break;
      case 'alarm_off':
        setSystemStatus(prev => ({ ...prev, alarmState: 'off' }));
        message = t.alarmDeactivated;
        description = t.alarmDeactivatedDesc;
        break;
      default:
        return;
    }

    toast({
      title: message,
      description: description,
      variant: variant,
    });
    
    // Call the parent handler
    parentControlAction(action);
  };

  const handleVoiceCommand = (command: string) => {
    toast({
      title: t.voiceCommand,
      description: command,
    });
    
    // Call the parent handler
    parentVoiceCommand(command);
    
    // Process voice command locally
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('открыть') || lowerCommand.includes('разблокировать')) {
      handleControlAction('unlock');
    } else if (lowerCommand.includes('закрыть') || lowerCommand.includes('заблокировать')) {
      handleControlAction('lock');
    } else if (lowerCommand.includes('свет') && lowerCommand.includes('вкл')) {
      handleControlAction('light_on');
    } else if (lowerCommand.includes('свет') && lowerCommand.includes('выкл')) {
      handleControlAction('light_off');
    } else if (lowerCommand.includes('тревога') && (lowerCommand.includes('вкл') || lowerCommand.includes('активировать'))) {
      handleControlAction('alarm_on');
    } else if (lowerCommand.includes('тревога') && (lowerCommand.includes('выкл') || lowerCommand.includes('деактивировать'))) {
      handleControlAction('alarm_off');
    }
  };
  
  const handleChatMessage = (message: string) => {
    // Обработка сообщений чата
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('открыть') || lowerMessage.includes('разблокировать')) {
      handleControlAction('unlock');
    } else if (lowerMessage.includes('закрыть') || lowerMessage.includes('заблокировать')) {
      handleControlAction('lock');
    } else if (lowerMessage.includes('свет') && (lowerMessage.includes('вкл') || lowerMessage.includes('включить'))) {
      handleControlAction('light_on');
    } else if (lowerMessage.includes('свет') && (lowerMessage.includes('выкл') || lowerMessage.includes('выключить'))) {
      handleControlAction('light_off');
    } else if (lowerMessage.includes('тревога') && (lowerMessage.includes('вкл') || lowerMessage.includes('активировать'))) {
      handleControlAction('alarm_on');
    } else if (lowerMessage.includes('тревога') && (lowerMessage.includes('выкл') || lowerMessage.includes('деактивировать'))) {
      handleControlAction('alarm_off');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header systemStatus={{ connected: systemStatus.connected }} />
      
      <main className="flex-1 bg-background">
        <div className="container py-6">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dashboard">{t.dashboardTab}</TabsTrigger>
              <TabsTrigger value="assistant">{t.assistantTab}</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
              <Dashboard 
                systemStatus={systemStatus}
                onControlAction={handleControlAction} 
                onVoiceCommand={handleVoiceCommand}
              />
            </TabsContent>
            <TabsContent value="assistant">
              <div className="mt-6 h-[calc(100vh-200px)]">
                <AIChat onSendMessage={handleChatMessage} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="border-t py-4">
        <div className="container flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {t.copyright} &copy; {new Date().getFullYear()}
          </div>
          <div className="text-sm text-muted-foreground">
            {t.systemStatus} {systemStatus.connected ? t.online : t.offline}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
