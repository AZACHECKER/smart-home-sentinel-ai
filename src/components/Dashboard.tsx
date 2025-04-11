
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
  const [lastEvent, setLastEvent] = useState('System initialized');
  const [recognizedUser, setRecognizedUser] = useState<null | { name: string, role: string, confidence: string }>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (systemStatus.alarmState === 'on') {
      setShowAlert(true);
      toast({
        variant: "destructive",
        title: "Security Alert",
        description: "Unauthorized access detected!",
      });
    } else {
      setShowAlert(false);
    }
  }, [systemStatus.alarmState, toast]);

  const handleRecognition = (user: { name: string, role: string, confidence: string } | null) => {
    setRecognizedUser(user);
    if (user) {
      setLastEvent(`User recognized: ${user.name} (${user.role})`);
    }
  };

  return (
    <div className="container py-6 space-y-6">
      {showAlert && (
        <Alert variant="destructive" className="animate-pulse">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Security Alert!</AlertTitle>
          <AlertDescription>
            Unauthorized access detected. Security system activated.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between">
              <div>Live Camera Feed</div>
              <Badge variant="outline">Camera 1</Badge>
            </CardTitle>
            <CardDescription>Main entrance monitoring with face recognition</CardDescription>
          </CardHeader>
          <CardContent>
            <VideoFeed />
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>System Controls</CardTitle>
              <CardDescription>Manage your smart home security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant={systemStatus.lockState === 'locked' ? "default" : "outline"}
                  className="flex items-center gap-2 h-auto py-3" 
                  onClick={() => onControlAction('lock')}
                >
                  <Lock size={18} />
                  <span>Lock Door</span>
                </Button>
                <Button 
                  variant={systemStatus.lockState === 'unlocked' ? "default" : "outline"}
                  className="flex items-center gap-2 h-auto py-3" 
                  onClick={() => onControlAction('unlock')}
                >
                  <Unlock size={18} />
                  <span>Unlock Door</span>
                </Button>
                <Button 
                  variant={systemStatus.lightState === 'on' ? "default" : "outline"}
                  className="flex items-center gap-2 h-auto py-3" 
                  onClick={() => onControlAction('light_on')}
                >
                  <LightbulbIcon size={18} />
                  <span>Lights On</span>
                </Button>
                <Button 
                  variant={systemStatus.lightState === 'off' ? "default" : "outline"}
                  className="flex items-center gap-2 h-auto py-3" 
                  onClick={() => onControlAction('light_off')}
                >
                  <LightbulbOff size={18} />
                  <span>Lights Off</span>
                </Button>
                <Button 
                  variant={systemStatus.alarmState === 'on' ? "destructive" : "outline"}
                  className="flex items-center gap-2 h-auto py-3" 
                  onClick={() => onControlAction('alarm_on')}
                >
                  <BellRing size={18} />
                  <span>Alarm On</span>
                </Button>
                <Button 
                  variant={systemStatus.alarmState === 'off' ? "default" : "outline"}
                  className="flex items-center gap-2 h-auto py-3" 
                  onClick={() => onControlAction('alarm_off')}
                >
                  <BellOff size={18} />
                  <span>Alarm Off</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>User Recognition</CardTitle>
              <CardDescription>Last detected person</CardDescription>
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
            <CardTitle>Voice Commands</CardTitle>
            <CardDescription>Control your home with your voice</CardDescription>
          </CardHeader>
          <CardContent>
            <VoiceCommands onVoiceCommand={onVoiceCommand} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Event Log</CardTitle>
            <CardDescription>Recent system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <EventLog lastEvent={lastEvent} />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Door Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold">
                {systemStatus.lockState === 'locked' ? 'Locked' : 'Unlocked'}
              </span>
              <div className={`p-2 rounded-full ${systemStatus.lockState === 'locked' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {systemStatus.lockState === 'locked' ? <Lock size={24} /> : <Unlock size={24} />}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Lighting</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-semibold">
                {systemStatus.lightState === 'on' ? 'On' : 'Off'}
              </span>
              <div className={`p-2 rounded-full ${systemStatus.lightState === 'on' ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                {systemStatus.lightState === 'on' ? <LightbulbIcon size={24} /> : <LightbulbOff size={24} />}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Temperature</CardTitle>
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
            <CardTitle className="text-base">Humidity</CardTitle>
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
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="energy">Energy</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Home Status Overview</CardTitle>
              <CardDescription>Complete system status</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1 border rounded-lg p-4">
                  <div className="text-muted-foreground text-sm">Security</div>
                  <div className="flex gap-2 items-center">
                    <Shield size={18} className="text-green-500" />
                    <span className="font-medium">Active</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 border rounded-lg p-4">
                  <div className="text-muted-foreground text-sm">Cameras</div>
                  <div className="flex gap-2 items-center">
                    <Video size={18} className="text-green-500" />
                    <span className="font-medium">2 Online</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 border rounded-lg p-4">
                  <div className="text-muted-foreground text-sm">Users</div>
                  <div className="flex gap-2 items-center">
                    <Users size={18} className="text-blue-500" />
                    <span className="font-medium">3 Registered</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1 border rounded-lg p-4">
                  <div className="text-muted-foreground text-sm">Energy</div>
                  <div className="flex gap-2 items-center">
                    <PlugZap size={18} className="text-yellow-500" />
                    <span className="font-medium">Optimal</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
              <CardDescription>System security overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Lock size={18} />
                    <span>Front Door</span>
                  </div>
                  <Badge variant={systemStatus.lockState === 'locked' ? 'default' : 'destructive'}>
                    {systemStatus.lockState === 'locked' ? 'Secured' : 'Unlocked'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Lock size={18} />
                    <span>Back Door</span>
                  </div>
                  <Badge>Secured</Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <Video size={18} />
                    <span>Surveillance Cameras</span>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-2">
                    <BellRing size={18} />
                    <span>Alarm System</span>
                  </div>
                  <Badge variant={systemStatus.alarmState === 'off' ? 'outline' : 'destructive'}>
                    {systemStatus.alarmState === 'off' ? 'Standby' : 'Triggered'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={18} />
                    <span>Motion Detection</span>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="automation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
              <CardDescription>Smart home automation rules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">Night Mode</div>
                    <div className="text-sm text-muted-foreground">Automatically lock doors and activate security at 11:00 PM</div>
                  </div>
                  <Badge>Enabled</Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div>
                    <div className="font-medium">Morning Routine</div>
                    <div className="text-sm text-muted-foreground">Turn lights on and adjust temperature at 7:00 AM</div>
                  </div>
                  <Badge>Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Away Mode</div>
                    <div className="text-sm text-muted-foreground">Simulate presence when no one is home</div>
                  </div>
                  <Badge variant="outline">Disabled</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="energy" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Energy Consumption</CardTitle>
              <CardDescription>Smart home power usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="font-medium">Today's Usage</div>
                  <div>3.2 kWh</div>
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="font-medium">Weekly Average</div>
                  <div>21.5 kWh</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-medium">Monthly Projection</div>
                  <div>92.4 kWh</div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">Consumption 12% lower than last month</p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
