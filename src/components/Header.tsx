
import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Lock, ShieldCheck, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderProps {
  systemStatus: {
    connected: boolean;
  };
}

const Header: React.FC<HeaderProps> = ({ systemStatus }) => {
  const isMobile = useIsMobile();
  
  const NavItems = () => (
    <>
      <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
        <ShieldCheck size={24} className="text-primary" />
        <span className="hidden sm:inline">Smart Home Sentinel AI</span>
        <span className="sm:hidden">Sentinel AI</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="font-medium hover:text-primary transition-colors">
          Dashboard
        </Link>
        <Link to="/cameras" className="font-medium hover:text-primary transition-colors">
          Cameras
        </Link>
        <Link to="/users" className="font-medium hover:text-primary transition-colors">
          Users
        </Link>
        <Link to="/settings" className="font-medium hover:text-primary transition-colors">
          Settings
        </Link>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center mr-2">
          <div className={`status-dot ${systemStatus.connected ? 'online' : 'offline'}`}></div>
          <span className="text-sm hidden sm:inline">{systemStatus.connected ? 'System Online' : 'System Offline'}</span>
        </div>
        
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell size={20} />
        </Button>
        
        <Link to="/lock">
          <Button variant="ghost" size="icon" aria-label="Lock">
            <Lock size={20} />
          </Button>
        </Link>
      </div>
    </>
  );

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        {isMobile ? (
          <>
            <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
              <ShieldCheck size={24} className="text-primary" />
              <span>Sentinel AI</span>
            </Link>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col gap-6 mt-8">
                  <Link to="/" className="font-medium text-lg hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/cameras" className="font-medium text-lg hover:text-primary transition-colors">
                    Cameras
                  </Link>
                  <Link to="/users" className="font-medium text-lg hover:text-primary transition-colors">
                    Users
                  </Link>
                  <Link to="/settings" className="font-medium text-lg hover:text-primary transition-colors">
                    Settings
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </>
        ) : (
          <NavItems />
        )}
      </div>
    </header>
  );
};

export default Header;
