
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, UserCheck, UserX } from 'lucide-react';

interface RecognitionPanelProps {
  recognizedUser: {
    name: string;
    role: string;
    confidence: string;
  } | null;
}

const RecognitionPanel: React.FC<RecognitionPanelProps> = ({ recognizedUser }) => {
  return (
    <div className="flex items-center gap-4">
      <Avatar className="h-16 w-16">
        {recognizedUser ? (
          <>
            <AvatarImage src="" alt={recognizedUser.name} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {recognizedUser.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </>
        ) : (
          <AvatarFallback className="bg-muted">
            <User size={24} />
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="flex-1">
        {recognizedUser ? (
          <>
            <div className="flex items-center gap-2">
              <div className="font-semibold">{recognizedUser.name}</div>
              <Badge variant="outline">{recognizedUser.role}</Badge>
              <UserCheck size={16} className="text-green-500" />
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Уверенность: {recognizedUser.confidence}
            </div>
            <div className="mt-1 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: recognizedUser.confidence }}
              ></div>
            </div>
          </>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="font-semibold">Пользователь не обнаружен</div>
              <UserX size={16} className="text-gray-400" />
            </div>
            <div className="text-sm text-muted-foreground">
              Ожидание распознавания лица...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecognitionPanel;
