
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDetection } from '@/hooks/useDetection';
import { Loader2, Upload, Link } from 'lucide-react';

export const DetectionPanel = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isLoading, detections, detectFromImage, detectFromUrl } = useDetection();
  const [imageUrl, setImageUrl] = React.useState('');

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await detectFromImage(file);
    }
  };

  const handleUrlSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (imageUrl) {
      await detectFromUrl(imageUrl);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>People Detection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Upload className="w-4 h-4 mr-2" />
            )}
            Upload Image
          </Button>
        </div>

        <div className="space-y-2">
          <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !imageUrl}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Link className="w-4 h-4" />
              )}
            </Button>
          </form>
        </div>

        {detections && (
          <div className="space-y-2">
            <h3 className="font-medium">Detection Results:</h3>
            <div className="bg-muted p-4 rounded-md">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(detections, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
