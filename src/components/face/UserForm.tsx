
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserFormProps {
  userName: string;
  userRole: 'owner' | 'guest' | 'admin';
  onNameChange: (name: string) => void;
  onRoleChange: (role: 'owner' | 'guest' | 'admin') => void;
}

const UserForm: React.FC<UserFormProps> = ({
  userName,
  userRole,
  onNameChange,
  onRoleChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="userName">User Name</Label>
        <Input
          id="userName"
          value={userName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="John Doe"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="userRole">Role</Label>
        <Select value={userRole} onValueChange={(value: 'owner' | 'guest' | 'admin') => onRoleChange(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="guest">Guest</SelectItem>
            <SelectItem value="admin">Administrator</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UserForm;
