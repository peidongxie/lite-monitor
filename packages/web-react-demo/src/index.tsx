import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './app';
import './index.css';

const container = globalThis.document.querySelector('#root');
const root = container && createRoot(container);
root?.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
