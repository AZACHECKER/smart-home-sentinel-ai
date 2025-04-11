
import React, { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Grid2X2, List, MoreVertical, Play, Settings } from 'lucide-react';
import VideoFeed from '@/components/VideoFeed';

const Cameras = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const cameras = [
    { id: 1, name: 'Front Door', location: 'Entrance', status: 'online' },
    { id: 2, name: 'Back Door', location: 'Rear Exit', status: 'online' },
    { id: 3, name: 'Living Room', location: 'Main Floor', status: 'offline' },
    { id: 4, name: 'Garage', location: 'Exterior', status: 'online' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header systemStatus={{ connected: true }} />
      
      <main className="flex-1 bg-background">
        <div className="container py-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Security Cameras</h1>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid2X2 size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="live">
            <TabsList>
              <TabsTrigger value="live">Live View</TabsTrigger>
              <TabsTrigger value="recordings">Recordings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="live" className="mt-6">
              {viewMode === 'grid' ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {cameras.map((camera) => (
                    <Card key={camera.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-lg">{camera.name}</CardTitle>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View Fullscreen</DropdownMenuItem>
                              <DropdownMenuItem>Start Recording</DropdownMenuItem>
                              <DropdownMenuItem>Camera Settings</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <CardDescription>{camera.location}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {camera.status === 'online' ? (
                            <VideoFeed />
                          ) : (
                            <div className="aspect-video flex items-center justify-center bg-muted text-muted-foreground rounded-md">
                              <div className="text-center p-4">
                                <div className="mb-2">Camera Offline</div>
                                <Button variant="outline" size="sm">
                                  <Play size={12} className="mr-1" /> Try to Connect
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {cameras.map((camera) => (
                    <Card key={camera.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`h-3 w-3 rounded-full ${camera.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            <div>
                              <div className="font-medium">{camera.name}</div>
                              <div className="text-sm text-muted-foreground">{camera.location}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Play size={14} className="mr-1" /> View
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Settings size={16} />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recordings" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recorded Footage</CardTitle>
                  <CardDescription>Access previously recorded video</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Camera</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Duration</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        <tr>
                          <td className="px-4 py-4">Front Door</td>
                          <td className="px-4 py-4">2023-04-11 09:15 AM</td>
                          <td className="px-4 py-4">1:23</td>
                          <td className="px-4 py-4">
                            <Button variant="outline" size="sm">
                              <Play size={14} className="mr-1" /> Play
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4">Living Room</td>
                          <td className="px-4 py-4">2023-04-11 08:30 AM</td>
                          <td className="px-4 py-4">2:45</td>
                          <td className="px-4 py-4">
                            <Button variant="outline" size="sm">
                              <Play size={14} className="mr-1" /> Play
                            </Button>
                          </td>
                        </tr>
                        <tr>
                          <td className="px-4 py-4">Back Door</td>
                          <td className="px-4 py-4">2023-04-11 07:20 AM</td>
                          <td className="px-4 py-4">0:35</td>
                          <td className="px-4 py-4">
                            <Button variant="outline" size="sm">
                              <Play size={14} className="mr-1" /> Play
                            </Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
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

export default Cameras;
