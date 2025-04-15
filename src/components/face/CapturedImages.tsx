
import React from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Trash } from 'lucide-react';

interface CapturedImagesProps {
  images: string[];
  maxImages?: number;
  onDeleteImage: (index: number) => void;
  onStartCamera: () => void;
  isLoading: boolean;
}

const CapturedImages: React.FC<CapturedImagesProps> = ({
  images,
  maxImages = 5,
  onDeleteImage,
  onStartCamera,
  isLoading
}) => {
  return (
    <div className="grid grid-cols-3 gap-2">
      {images.map((img, index) => (
        <div key={index} className="relative">
          <img
            src={img}
            alt={`Face ${index + 1}`}
            className="w-full h-24 object-cover rounded-md"
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-1 right-1 h-6 w-6"
            onClick={() => onDeleteImage(index)}
            disabled={isLoading}
          >
            <Trash size={14} />
          </Button>
        </div>
      ))}
      
      {images.length < maxImages && (
        <Button
          variant="outline"
          className="h-24 flex items-center justify-center"
          onClick={onStartCamera}
          disabled={isLoading}
        >
          <Camera size={24} />
        </Button>
      )}
    </div>
  );
};

export default CapturedImages;
