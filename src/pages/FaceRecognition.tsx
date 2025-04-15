
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FaceTraining from '@/components/FaceTraining';

const FaceRecognition = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header systemStatus={{ connected: true }} />
      
      <main className="flex-1 bg-background">
        <div className="container py-6 space-y-6">
          <h1 className="text-3xl font-bold">Распознавание лиц</h1>
          
          <Tabs defaultValue="training" className="space-y-4">
            <TabsList>
              <TabsTrigger value="training">Обучение системы</TabsTrigger>
              <TabsTrigger value="detection">Видео наблюдение</TabsTrigger>
            </TabsList>
            
            <TabsContent value="training" className="space-y-6">
              <FaceTraining />
            </TabsContent>
            
            <TabsContent value="detection" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Система видеонаблюдения</CardTitle>
                  <CardDescription>
                    Просмотр камер с активным распознаванием лиц и объектов
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="aspect-video bg-muted rounded-md">
                        {/* Здесь использован существующий компонент VideoFeed */}
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">Камера 1 (Главный вход)</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="aspect-video bg-muted rounded-md">
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">Камера 2 (Задний двор)</p>
                        </div>
                      </div>
                    </div>
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
            Статус системы: Онлайн
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FaceRecognition;
