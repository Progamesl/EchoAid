import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// NUCLEAR OPTION: Force dark mode immediately
(function() {
  console.log('🚨 NUCLEAR DARK MODE ACTIVATED');
  
  // Clear any existing theme settings
  localStorage.removeItem('theme');
  localStorage.removeItem('echoaid-theme');
  
  // Force dark mode on document
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add('dark');
  root.setAttribute('data-theme', 'dark');
  
  // Set CSS variables
  root.style.setProperty('--bg-primary', '#0f172a');
  root.style.setProperty('--bg-secondary', '#1e293b');
  root.style.setProperty('--text-primary', '#f1f5f9');
  root.style.setProperty('--text-secondary', '#94a3b8');
  root.style.setProperty('--border-color', '#334155');
  
  // Force body background
  document.body.style.backgroundColor = '#0f172a';
  document.body.style.color = '#f1f5f9';
  
  console.log('✅ Dark mode forced successfully');
})();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
