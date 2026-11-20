import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './style.css';
import '../css/style.css';
import '../css/components.css';
import '../css/responsive.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
