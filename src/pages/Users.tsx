
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import UserRegistration from '@/components/UserRegistration';

const Users = () => {
  const users = [
    { id: 'user1', name: 'John Doe', role: 'resident', lastAccess: '2023-04-11 10:23 AM', status: 'active' },
    { id: 'user2', name: 'Jane Smith', role: 'resident', lastAccess: '2023-04-10 08:15 PM', status: 'active' },
    { id: 'user3', name: 'Mike Johnson', role: 'guest', lastAccess: '2023-04-09 02:30 PM', status: 'inactive' },
    { id: 'user4', name: 'Sarah Williams', role: 'admin', lastAccess: '2023-04-11 09:45 AM', status: 'active' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header systemStatus={{ connected: true }} />
      
      <main className="flex-1 bg-background">
        <div className="container py-6 space-y-6">
          <h1 className="text-3xl font-bold">User Management</h1>
          
          <Tabs defaultValue="list">
            <TabsList>
              <TabsTrigger value="list">User List</TabsTrigger>
              <TabsTrigger value="register">Register New User</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Registered Users</CardTitle>
                  <CardDescription>Manage users who have access to your home</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="min-w-full divide-y divide-border">
                      <thead>
                        <tr className="bg-muted/50">
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Last Access</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-card divide-y divide-border">
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarFallback className="bg-primary text-primary-foreground">
                                    {user.name.substring(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-muted-foreground">ID: {user.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <Badge variant="outline">{user.role}</Badge>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-sm">
                              {user.lastAccess}
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                {user.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register" className="mt-6">
              <UserRegistration />
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

export default Users;
