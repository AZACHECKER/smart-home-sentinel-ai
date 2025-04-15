
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FaceTraining from '@/components/FaceTraining';
import SecurityCamera from '@/components/SecurityCamera';
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, Download, UploadCloud } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const FaceRecognition = () => {
  const { toast } = useToast();
  
  // Function to export face database
  const exportDatabase = () => {
    try {
      const faceDatabase = localStorage.getItem('faceDatabase') || '[]';
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(faceDatabase);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `face-database-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      
      toast({
        title: "Экспорт завершен",
        description: "База данных лиц успешно экспортирована"
      });
    } catch (error) {
      console.error('Error exporting database:', error);
      toast({
        title: "Ошибка экспорта",
        description: "Не удалось экспортировать базу данных",
        variant: "destructive"
      });
    }
  };
  
  // Function to import face database
  const importDatabase = () => {
    try {
      // Create file input element
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.json';
      
      fileInput.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const content = event.target?.result as string;
            const data = JSON.parse(content);
            
            // Validate data structure
            if (!Array.isArray(data)) {
              throw new Error('Invalid data format');
            }
            
            // Store in localStorage
            localStorage.setItem('faceDatabase', JSON.stringify(data));
            
            toast({
              title: "Импорт завершен",
              description: `Импортировано ${data.length} записей в базу данных`,
            });
            
            // Reload page to apply changes
            window.location.reload();
          } catch (error) {
            console.error('Error parsing JSON:', error);
            toast({
              title: "Ошибка импорта",
              description: "Неверный формат файла",
              variant: "destructive"
            });
          }
        };
        
        reader.readAsText(file);
      };
      
      fileInput.click();
    } catch (error) {
      console.error('Error importing database:', error);
      toast({
        title: "Ошибка импорта",
        description: "Не удалось импортировать базу данных",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header systemStatus={{ connected: true }} />
      
      <main className="flex-1 bg-background">
        <div className="container py-6 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Распознавание лиц</h1>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={exportDatabase}>
                <Download size={16} className="mr-2" />
                Экспорт базы
              </Button>
              <Button variant="outline" size="sm" onClick={importDatabase}>
                <UploadCloud size={16} className="mr-2" />
                Импорт базы
              </Button>
            </div>
          </div>
          
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
                    <SecurityCamera name="Главный вход" />
                    <SecurityCamera name="Задний двор" />
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
