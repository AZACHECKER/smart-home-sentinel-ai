
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.tsx';
import './index.css';

// Конфигурация модуля TensorFlow.js для более эффективной загрузки
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/tf-loader.js').then(
      (registration) => {
        console.log('TF ServiceWorker registered: ', registration);
      },
      (err) => {
        console.log('TF ServiceWorker registration failed: ', err);
      }
    );
  });
}

// Инициализация переменных для видео
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('visibilitychange', () => {
      console.log('Visibility changed:', document.visibilityState);
    });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
