import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Global error protection against unhandled async rejections, iframe sandboxing, or extension crashes
window.onerror = function (message, source, lineno, colno, error) {
  const msg = String(message || '');
  if (!msg || msg === 'Script error.' || msg === 'Uncaught ' || msg.trim() === 'Uncaught' || !error) {
    return true; // Suppress benign / empty errors
  }
  return false;
};

window.addEventListener('error', (event) => {
  const msg = String(event.message || '');
  if (!msg || msg === 'Script error.' || msg === 'Uncaught ' || msg.trim() === 'Uncaught' || !event.error) {
    event.stopImmediatePropagation();
    event.preventDefault();
    return true;
  }
}, true);

window.addEventListener('unhandledrejection', (event) => {
  if (!event.reason || typeof event.reason === 'undefined' || event.reason === '') {
    event.stopImmediatePropagation();
    event.preventDefault();
    return;
  }
  const reasonStr = String(event.reason?.message || event.reason || '');
  if (
    reasonStr === 'Uncaught ' ||
    reasonStr.trim() === 'Uncaught' ||
    reasonStr.includes('NotAllowedError') ||
    reasonStr.includes('Document is not focused') ||
    reasonStr.includes('clipboard')
  ) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
}, true);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

