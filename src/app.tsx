import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { useState } from 'react';

import { useSettings } from './context/Settings';
import { Updater } from './components/Updater';
import * as themes from './util/themes';
import { Layout } from './util/layout';
import routes from './util/routes';

export function App() {
  const [ready, setReady] = useState(false);
  const { settings } = useSettings();

  return (
    <ThemeProvider
      theme={themes[settings.theme as keyof typeof themes] || themes.dark}
    >
      {ready ? (
        <RouterProvider
          router={createBrowserRouter([
            {
              path: '/',
              element: <Layout />,
              children: routes.flat(),
            },
          ])}
        />
      ) : (
        <Updater onReady={() => setReady(true)} />
      )}
    </ThemeProvider>
  );
}
