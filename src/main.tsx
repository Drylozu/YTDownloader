import ReactDOM from 'react-dom/client';
import React from 'react';

import { SettingsProvider } from './context/Settings';
import { App } from './app';

import './style.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </React.StrictMode>
);

// Prevent scrolling, zooming and navigation using touchpad
document.addEventListener('DOMContentLoaded', function () {
  document.body.addEventListener(
    'touchmove',
    function (e) {
      e.preventDefault();
    },
    { passive: false }
  );
});
