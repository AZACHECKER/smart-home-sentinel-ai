
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.tsx';
import './index.css';
import * as tf from '@tensorflow/tfjs';

// Configure TensorFlow.js for more efficient loading
tf.ready().then(() => {
  console.log('TensorFlow.js is ready');
}).catch(err => {
  console.error('TensorFlow.js initialization error:', err);
});

// ServiceWorker configuration for TensorFlow
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

// Initialization for video variables
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
