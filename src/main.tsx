import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import ReactDOM from 'react-dom/client';
import React from 'react';

import { SettingsProvider } from './context/Settings';
import * as themes from './util/themes';
import { Layout } from './util/layout';
import routes from './util/routes';
import { App } from './app';

import './style.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <SettingsProvider>
     <App/>
    </SettingsProvider>
  </React.StrictMode>
);
