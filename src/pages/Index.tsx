
import React, { useState } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [systemStatus, setSystemStatus] = useState({
    connected: true,
    lockState: 'locked',
    lightState: 'off',
    alarmState: 'off'
  });

  const handleControlAction = (action: string) => {
    let message = '';
    let description = '';
    let variant: 'default' | 'destructive' = 'default';

    switch (action) {
      case 'lock':
        setSystemStatus(prev => ({ ...prev, lockState: 'locked' }));
        message = 'Door Locked';
        description = 'The door has been securely locked.';
        break;
      case 'unlock':
        setSystemStatus(prev => ({ ...prev, lockState: 'unlocked' }));
        message = 'Door Unlocked';
        description = 'The door has been unlocked. Please remember to lock it again.';
        break;
      case 'light_on':
        setSystemStatus(prev => ({ ...prev, lightState: 'on' }));
        message = 'Lights On';
        description = 'The lights have been turned on.';
        break;
      case 'light_off':
        setSystemStatus(prev => ({ ...prev, lightState: 'off' }));
        message = 'Lights Off';
        description = 'The lights have been turned off.';
        break;
      case 'alarm_on':
        setSystemStatus(prev => ({ ...prev, alarmState: 'on' }));
        message = 'Alarm Activated';
        description = 'The security alarm has been activated.';
        variant = 'destructive';
        break;
      case 'alarm_off':
        setSystemStatus(prev => ({ ...prev, alarmState: 'off' }));
        message = 'Alarm Deactivated';
        description = 'The security alarm has been deactivated.';
        break;
      default:
        return;
    }

    toast({
      title: message,
      description: description,
      variant: variant,
    });
  };

  const handleVoiceCommand = (command: string) => {
    toast({
      title: "Voice Command Received",
      description: command,
    });
    
    // Process voice commands
    const lowerCommand = command.toLowerCase();
    
    if (lowerCommand.includes('open') || lowerCommand.includes('unlock')) {
      handleControlAction('unlock');
    } else if (lowerCommand.includes('lock') || lowerCommand.includes('close')) {
      handleControlAction('lock');
    } else if ((lowerCommand.includes('light') || lowerCommand.includes('lights')) && lowerCommand.includes('on')) {
      handleControlAction('light_on');
    } else if ((lowerCommand.includes('light') || lowerCommand.includes('lights')) && lowerCommand.includes('off')) {
      handleControlAction('light_off');
    } else if (lowerCommand.includes('alarm') && (lowerCommand.includes('on') || lowerCommand.includes('activate'))) {
      handleControlAction('alarm_on');
    } else if (lowerCommand.includes('alarm') && (lowerCommand.includes('off') || lowerCommand.includes('deactivate'))) {
      handleControlAction('alarm_off');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header systemStatus={{ connected: systemStatus.connected }} />
      
      <main className="flex-1 bg-background">
        <Dashboard 
          systemStatus={systemStatus}
          onControlAction={handleControlAction} 
          onVoiceCommand={handleVoiceCommand}
        />
      </main>
      
      <footer className="border-t py-4">
        <div className="container flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Smart Home Sentinel AI &copy; {new Date().getFullYear()}
          </div>
          <div className="text-sm text-muted-foreground">
            System Status: {systemStatus.connected ? 'Online' : 'Offline'}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
