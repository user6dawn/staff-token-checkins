import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Add debugging for Vercel deployment
console.log('App starting...');
console.log('CSS loaded:', document.querySelector('style'));

const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found!');
} else {
  console.log('Root element found, rendering app...');
  createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
}
