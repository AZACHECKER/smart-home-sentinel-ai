
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, Send, MicOff } from 'lucide-react';

interface VoiceCommandsProps {
  onVoiceCommand: (command: string) => void;
}

const VoiceCommands: React.FC<VoiceCommandsProps> = ({ onVoiceCommand }) => {
  const [textCommand, setTextCommand] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const handleSendCommand = () => {
    if (textCommand.trim()) {
      onVoiceCommand(textCommand);
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
      // Simulate processing voice command
      setTimeout(() => {
        onVoiceCommand("Voice command processed");
      }, 1000);
    } else {
      setIsRecording(true);
      
      // Simulate recording duration counter
      const interval = setInterval(() => {
        setRecordingDuration(prev => {
          if (prev >= 5) {
            clearInterval(interval);
            setIsRecording(false);
            setTimeout(() => {
              onVoiceCommand("Voice command processed");
            }, 1000);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
  };
  
  const suggestedCommands = [
    "Open the front door",
    "Turn on lights",
    "Turn off lights",
    "Activate alarm",
    "Deactivate alarm",
    "Start voice chat"
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Type a command..."
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
          <div className="text-sm text-muted-foreground">Recording... {recordingDuration}s</div>
          <div className="mt-1 h-1 bg-gray-200 rounded-full">
            <div 
              className="h-1 bg-primary rounded-full transition-all duration-1000" 
              style={{ width: `${(recordingDuration / 5) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      
      <div className="pt-2">
        <p className="text-sm text-muted-foreground mb-2">Suggested commands:</p>
        <div className="flex flex-wrap gap-2">
          {suggestedCommands.map((command, index) => (
            <Button 
              key={index} 
              variant="secondary" 
              size="sm"
              onClick={() => onVoiceCommand(command)}
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
