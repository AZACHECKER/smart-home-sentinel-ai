
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
        <span className="hidden sm:inline">Умный Дом Страж ИИ</span>
        <span className="sm:hidden">Страж ИИ</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="font-medium hover:text-primary transition-colors">
          Панель управления
        </Link>
        <Link to="/cameras" className="font-medium hover:text-primary transition-colors">
          Камеры
        </Link>
        <Link to="/users" className="font-medium hover:text-primary transition-colors">
          Пользователи
        </Link>
        <Link to="/settings" className="font-medium hover:text-primary transition-colors">
          Настройки
        </Link>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center mr-2">
          <div className={`w-2 h-2 rounded-full mr-1 ${systemStatus.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm hidden sm:inline">{systemStatus.connected ? 'Система онлайн' : 'Система оффлайн'}</span>
        </div>
        
        <Button variant="ghost" size="icon" aria-label="Уведомления">
          <Bell size={20} />
        </Button>
        
        <Link to="/lock">
          <Button variant="ghost" size="icon" aria-label="Блокировка">
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
              <span>Страж ИИ</span>
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
                    Панель управления
                  </Link>
                  <Link to="/cameras" className="font-medium text-lg hover:text-primary transition-colors">
                    Камеры
                  </Link>
                  <Link to="/users" className="font-medium text-lg hover:text-primary transition-colors">
                    Пользователи
                  </Link>
                  <Link to="/settings" className="font-medium text-lg hover:text-primary transition-colors">
                    Настройки
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
