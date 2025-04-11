
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from '@/components/ui/slider';

const Settings = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header systemStatus={{ connected: true }} />
      
      <main className="flex-1 bg-background">
        <div className="container py-6 space-y-6">
          <h1 className="text-3xl font-bold">System Settings</h1>
          
          <Tabs defaultValue="general">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>Configure basic system settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="systemName">System Name</Label>
                      <Input id="systemName" defaultValue="Smart Home Sentinel" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Time Zone</Label>
                      <Select defaultValue="UTC">
                        <SelectTrigger>
                          <SelectValue placeholder="Select time zone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                          <SelectItem value="ET">ET (Eastern Time)</SelectItem>
                          <SelectItem value="CT">CT (Central Time)</SelectItem>
                          <SelectItem value="MT">MT (Mountain Time)</SelectItem>
                          <SelectItem value="PT">PT (Pacific Time)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Date Format</Label>
                      <Select defaultValue="mmddyyyy">
                        <SelectTrigger>
                          <SelectValue placeholder="Select date format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mmddyyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="ddmmyyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="yyyymmdd">YYYY-MM-DD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkMode">Dark Mode</Label>
                      <div className="text-sm text-muted-foreground">Enable dark theme for the interface</div>
                    </div>
                    <Switch id="darkMode" />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Changes</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Configure security features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoLock">Auto Lock</Label>
                      <div className="text-sm text-muted-foreground">Automatically lock door after opening</div>
                    </div>
                    <Switch id="autoLock" defaultChecked />
                  </div>
                  
                  <div className="space-y-4">
                    <Label>Auto Lock Delay (seconds)</Label>
                    <Slider defaultValue={[30]} max={60} step={5} />
                    <div className="text-sm text-muted-foreground text-center">30 seconds</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="motionDetection">Motion Detection</Label>
                      <div className="text-sm text-muted-foreground">Detect movement and trigger alerts</div>
                    </div>
                    <Switch id="motionDetection" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="faceVerification">Face Verification</Label>
                      <div className="text-sm text-muted-foreground">Require face verification before unlocking door</div>
                    </div>
                    <Switch id="faceVerification" defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confidenceThreshold">Face Recognition Confidence Threshold</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue placeholder="Select threshold" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (More permissive)</SelectItem>
                        <SelectItem value="medium">Medium (Balanced)</SelectItem>
                        <SelectItem value="high">High (More strict)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Security Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>Configure alerts and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">Email Notifications</Label>
                      <div className="text-sm text-muted-foreground">Receive security alerts via email</div>
                    </div>
                    <Switch id="emailNotifications" defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emailAddress">Email Address</Label>
                    <Input id="emailAddress" type="email" placeholder="your@email.com" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="pushNotifications">Push Notifications</Label>
                      <div className="text-sm text-muted-foreground">Receive notifications on your mobile device</div>
                    </div>
                    <Switch id="pushNotifications" defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Notification Events</Label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm">Unauthorized Access Attempts</div>
                        <Switch id="notifyUnauthorized" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">Motion Detection</div>
                        <Switch id="notifyMotion" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">Door Lock/Unlock</div>
                        <Switch id="notifyDoor" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">System Status Changes</div>
                        <Switch id="notifySystem" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Notification Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>Configure advanced system options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="apiEndpoint">Backend API Endpoint</Label>
                    <Input id="apiEndpoint" defaultValue="http://localhost:3434" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="s3Bucket">S3 Bucket Name</Label>
                    <Input id="s3Bucket" placeholder="your-s3-bucket" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="awsRegion">AWS Region</Label>
                    <Select defaultValue="us-east-1">
                      <SelectTrigger>
                        <SelectValue placeholder="Select AWS region" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                        <SelectItem value="us-east-2">US East (Ohio)</SelectItem>
                        <SelectItem value="us-west-1">US West (N. California)</SelectItem>
                        <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="aiModel">AI Model Configuration</Label>
                    <Select defaultValue="llama-4-maverick">
                      <SelectTrigger>
                        <SelectValue placeholder="Select AI model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="llama-4-maverick">Llama-4-Maverick</SelectItem>
                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                        <SelectItem value="claude-3">Claude 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="faceModel">Face Recognition Model</Label>
                    <Select defaultValue="vgg-face">
                      <SelectTrigger>
                        <SelectValue placeholder="Select face recognition model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vgg-face">VGG-Face</SelectItem>
                        <SelectItem value="facenet">FaceNet</SelectItem>
                        <SelectItem value="openface">OpenFace</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button variant="destructive">Reset to Defaults</Button>
                    <Button>Save Advanced Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="border-t py-4">
        <div className="container flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Smart Home Sentinel AI &copy; {new Date().getFullYear()}
          </div>
          <div className="text-sm text-muted-foreground">
            System Status: Online
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Settings;
