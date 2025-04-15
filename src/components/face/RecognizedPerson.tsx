
import React from 'react';
import { Check } from 'lucide-react';
import { FaceData } from '@/utils/face-recognition';

interface RecognizedPersonProps {
  person: FaceData;
}

const RecognizedPerson: React.FC<RecognizedPersonProps> = ({ person }) => {
  return (
    <div className="p-4 border rounded-md bg-primary/10">
      <div className="flex items-center space-x-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full">
          <img
            src={person.recognizedFaceImage || person.images[0]}
            alt={person.name}
            className="object-cover h-full w-full"
          />
        </div>
        <div>
          <h4 className="font-medium text-lg">{person.name}</h4>
          <div className="flex items-center gap-2">
            <span className="text-sm capitalize bg-primary/20 px-2 py-1 rounded">{person.role}</span>
            <Check size={16} className="text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecognizedPerson;
