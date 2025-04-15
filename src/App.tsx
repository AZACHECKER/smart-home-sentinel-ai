import React from 'react';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Cameras from "./pages/Cameras";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import FaceRecognition from "./pages/FaceRecognition";
import "./App.css";
import { Toaster } from "@/components/ui/toaster";

export default function App() {
  // Состояния для системы умного дома
  const [systemStatus, setSystemStatus] = React.useState({
    connected: true,
    lockState: 'locked',
    lightState: 'off',
    alarmState: 'off',
  });

  // Обработчик действий управления
  const handleControlAction = (action: string) => {
    switch(action) {
      case 'lock':
        setSystemStatus(prev => ({ ...prev, lockState: 'locked' }));
        break;
      case 'unlock':
        setSystemStatus(prev => ({ ...prev, lockState: 'unlocked' }));
        break;
      case 'light_on':
        setSystemStatus(prev => ({ ...prev, lightState: 'on' }));
        break;
      case 'light_off':
        setSystemStatus(prev => ({ ...prev, lightState: 'off' }));
        break;
      case 'alarm_on':
        setSystemStatus(prev => ({ ...prev, alarmState: 'on' }));
        break;
      case 'alarm_off':
        setSystemStatus(prev => ({ ...prev, alarmState: 'off' }));
        break;
      default:
        break;
    }
  };

  // Обработчик голосовых команд
  const handleVoiceCommand = (command: string) => {
    if (command.includes('открыть') || command.includes('разблокировать')) {
      handleControlAction('unlock');
    } else if (command.includes('закрыть') || command.includes('заблокировать')) {
      handleControlAction('lock');
    } else if (command.includes('свет') && command.includes('включ')) {
      handleControlAction('light_on');
    } else if (command.includes('свет') && command.includes('выключ')) {
      handleControlAction('light_off');
    } else if (command.includes('тревог') && command.includes('включ')) {
      handleControlAction('alarm_on');
    } else if (command.includes('тревог') && command.includes('выключ')) {
      handleControlAction('alarm_off');
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Index 
            systemStatus={systemStatus}
            onControlAction={handleControlAction}
            onVoiceCommand={handleVoiceCommand}
          />
        } />
        <Route path="/cameras" element={<Cameras />} />
        <Route path="/users" element={<Users />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/face-recognition" element={<FaceRecognition />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}
