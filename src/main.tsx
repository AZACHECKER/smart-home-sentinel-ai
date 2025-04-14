
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.tsx';
import './index.css';
import * as tf from '@tensorflow/tfjs';

// Инициализация TensorFlow.js с отложенной загрузкой моделей
const initTensorFlow = async () => {
  try {
    await tf.ready();
    console.log('TensorFlow.js успешно инициализирован');
  } catch (err) {
    console.error('Ошибка инициализации TensorFlow.js:', err);
    // Продолжаем работу приложения даже при ошибке TensorFlow
  }
};

// Запуск инициализации параллельно с рендерингом приложения
initTensorFlow();

// ServiceWorker для TensorFlow
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/tf-loader.js').then(
      (registration) => {
        console.log('TF ServiceWorker зарегистрирован: ', registration);
      },
      (err) => {
        console.log('Ошибка регистрации TF ServiceWorker: ', err);
      }
    );
  });
}

// Инициализация переменных для видео
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('visibilitychange', () => {
      console.log('Видимость изменена:', document.visibilityState);
    });
  });
}

// Рендеринг приложения
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
