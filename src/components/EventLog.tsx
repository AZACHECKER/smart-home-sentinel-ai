
import React, { useState, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Check, DoorOpen, User, LightbulbIcon, BellRing, RefreshCw } from 'lucide-react';

interface EventLogProps {
  lastEvent: string;
}

const EventLog: React.FC<EventLogProps> = ({ lastEvent }) => {
  const [events, setEvents] = useState<{ time: string, event: string, type: string }[]>([
    { time: '10:24:15', event: 'System initialized', type: 'system' },
    { time: '10:25:32', event: 'Front door locked', type: 'door' },
    { time: '10:30:45', event: 'Motion detected in living room', type: 'motion' },
  ]);
  
  useEffect(() => {
    if (lastEvent) {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];
      setEvents(prev => [{ time: timeStr, event: lastEvent, type: getEventType(lastEvent) }, ...prev]);
    }
  }, [lastEvent]);
  
  const getEventType = (event: string) => {
    if (event.includes('door')) return 'door';
    if (event.includes('light')) return 'light';
    if (event.includes('alarm')) return 'alarm';
    if (event.includes('recognized') || event.includes('user')) return 'user';
    if (event.includes('motion')) return 'motion';
    if (event.includes('alert') || event.includes('unauthorized')) return 'alert';
    return 'system';
  };
  
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'door':
        return <DoorOpen size={16} />;
      case 'light':
        return <LightbulbIcon size={16} />;
      case 'alarm':
        return <BellRing size={16} />;
      case 'user':
        return <User size={16} />;
      case 'alert':
        return <AlertTriangle size={16} />;
      default:
        return <Check size={16} />;
    }
  };
  
  const getEventColor = (type: string) => {
    switch (type) {
      case 'door':
        return 'text-blue-500 bg-blue-50';
      case 'light':
        return 'text-yellow-500 bg-yellow-50';
      case 'alarm':
        return 'text-red-500 bg-red-50';
      case 'user':
        return 'text-green-500 bg-green-50';
      case 'alert':
        return 'text-red-500 bg-red-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Recent events ({events.length})</div>
        <Button variant="ghost" size="sm">
          <RefreshCw size={14} className="mr-1" /> Refresh
        </Button>
      </div>
      
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {events.map((event, i) => (
            <div key={i} className="flex items-center">
              <div className={`p-1.5 rounded-full mr-2 ${getEventColor(event.type)}`}>
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{event.event}</div>
                <div className="text-xs text-muted-foreground">{event.time}</div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default EventLog;
