import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Activity, Bell, Camera, Home, Menu, Settings, UserRound, Users, ScanFace } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  systemStatus: {
    connected: boolean;
  };
}

const Header: React.FC<HeaderProps> = ({ systemStatus }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const links = [
    { to: '/', label: 'Панель управления', icon: <Home size={16} className="mr-2" /> },
    { to: '/cameras', label: 'Камеры', icon: <Camera size={16} className="mr-2" /> },
    { to: '/users', label: 'Пользователи', icon: <Users size={16} className="mr-2" /> },
    { to: '/face-recognition', label: 'Распознавание лиц', icon: <ScanFace size={16} className="mr-2" /> },
    { to: '/settings', label: 'Настройки', icon: <Settings size={16} className="mr-2" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-14 items-center">
        <Link to="/" className="flex items-center font-semibold">
          <Activity className="h-5 w-5 mr-2 text-primary" />
          <span>Smart Home Sentinel</span>
          <Badge
            variant="outline"
            className="ml-2 hidden text-xs sm:inline-flex"
          >
            AI
          </Badge>
        </Link>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden md:flex items-center space-x-2">
            {links.map((link) => (
              <Button
                key={link.to}
                variant={location.pathname === link.to ? "default" : "ghost"}
                size="sm"
                asChild
              >
                <Link to={link.to}>
                  {link.icon}
                  {link.label}
                </Link>
              </Button>
            ))}
          </nav>
          
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-2 relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
            </Button>
            
            <Button variant="ghost" size="icon" asChild>
              <Link to="/settings">
                <UserRound size={18} />
              </Link>
            </Button>
          </div>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
              >
                <Menu size={18} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 py-4">
                <h3 className="text-sm font-semibold">Навигация</h3>
                <nav className="grid gap-2">
                  {links.map((link) => (
                    <Button
                      key={link.to}
                      variant={location.pathname === link.to ? "default" : "ghost"}
                      size="sm"
                      asChild
                      className="justify-start"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Link to={link.to}>
                        {link.icon}
                        {link.label}
                      </Link>
                    </Button>
                  ))}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
