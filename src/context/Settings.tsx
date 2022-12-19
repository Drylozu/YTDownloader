import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  exists,
  readTextFile,
  writeTextFile,
  createDir,
} from '@tauri-apps/api/fs';
import { BaseDirectory, appConfigDir, downloadDir } from '@tauri-apps/api/path';
import { appWindow } from '@tauri-apps/api/window';

interface Settings {
  cacheDir: string;
  downloadsDir: string;
  background: boolean;
  theme: string;
  lastYTDLCheck: number;
  YTDLTag: string;
}

interface SettingsManager {
  settings: Settings;
  loaded: boolean;
  reload(): void;
  edit(callback: ((v: Settings) => Settings | void) | Partial<Settings>): void;
}

const defaultState: SettingsManager = {
  settings: {
    cacheDir: await appConfigDir(),
    downloadsDir: await downloadDir(),
    background: true,
    theme: 'dark',
    lastYTDLCheck: Date.now(),
    YTDLTag: '',
  },
  loaded: false,
  reload() {},
  edit: () => (v: Settings) => v,
};

const Settings = createContext(defaultState);

export function useSettings() {
  return useContext(Settings);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [settings, setSettings] = useState(defaultState.settings);

  const reload = async () => {
    if (!(await exists('', { dir: BaseDirectory.AppConfig })))
      await createDir('', { dir: BaseDirectory.AppConfig, recursive: true });

    if (!(await exists('config.json', { dir: BaseDirectory.AppConfig })))
      await writeTextFile(
        { path: 'config.json', contents: JSON.stringify(defaultState) },
        {
          dir: BaseDirectory.AppConfig,
        }
      );

    try {
      const text = await readTextFile('config.json', {
        dir: BaseDirectory.AppConfig,
      });
      const data = JSON.parse(text);
      setSettings(Object.assign({}, defaultState.settings, data));
      if (!loaded) setLoaded(true);
    } catch (e) {}
  };

  const edit = async (
    callback: ((v: Settings) => Settings) | Partial<Settings>
  ) => {
    let config = Object.assign({}, settings);
    if (typeof callback === 'function') config = callback(config) || config;
    else config = Object.assign(config, callback);

    await writeTextFile(
      { path: 'config.json', contents: JSON.stringify(config) },
      { dir: BaseDirectory.AppConfig }
    );
    setSettings(config);
  };

  useEffect(() => {
    reload();
  }, []);

  useEffect(() => {
    appWindow.emit('background', settings.background);
  }, [settings]);

  return (
    <Settings.Provider
      value={{
        settings,
        loaded,
        reload,
        edit,
      }}
    >
      {children}
    </Settings.Provider>
  );
}
