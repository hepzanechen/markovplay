import React from 'react'; // Ensure React is imported
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.querySelector('#app');

if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error("Container not found");
}