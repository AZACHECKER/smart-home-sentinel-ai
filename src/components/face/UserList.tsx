
import React from 'react';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { FaceData } from '@/utils/face-recognition';

interface UserListProps {
  users: FaceData[];
  onDeleteUser: (id: string) => void;
}

const UserList: React.FC<UserListProps> = ({ users, onDeleteUser }) => {
  if (users.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium mb-3">Registered Users</h3>
      <div className="space-y-2">
        {users.map((face) => (
          <div key={face.id} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
            <div className="flex items-center space-x-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <img
                  src={face.images[0]}
                  alt={face.name}
                  className="object-cover h-full w-full"
                />
              </div>
              <div>
                <div className="font-medium">{face.name}</div>
                <div className="text-sm text-muted-foreground capitalize">{face.role}</div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDeleteUser(face.id)}
            >
              <Trash size={16} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
