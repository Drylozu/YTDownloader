import { appConfigDir, join } from '@tauri-apps/api/path';
import styled, { keyframes } from 'styled-components';
import { invoke } from '@tauri-apps/api/tauri';
import { useEffect, useState } from 'react';
import { type } from '@tauri-apps/api/os';
import axios from 'axios';

import { useSettings } from '../context/Settings';

const Center = styled.div`
  background-color: ${(props) => props.theme.backgroundMain};
  color: ${(props) => props.theme.colorMain};
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 0.5rem;

  & > h2 {
    margin-bottom: 0.5rem;
  }
`;

const Loading = keyframes`
    0% {
        width: 5rem;
        right: 100%;
    }
    50% {
        width: 15rem;
        right: 100%;
    }
    50% {
        width: 15rem;
        right: 0%;
    }
    100% {
        width: 0rem;
        right: 0%;
    }
`;

const Loader = styled.div`
  background-color: ${(props) => props.theme.activeOpaque};
  border-radius: 0.8rem;
  height: 0.8rem;
  width: 15rem;

  overflow: hidden;
  position: relative;

  & > div {
    background-color: ${(props) => props.theme.active};
    border-radius: 0.8rem;
    height: 100%;
    width: 5rem;
    position: absolute;
    animation: 2s ${Loading} infinite;
  }
`;

const file = (await type()) === 'Windows_NT' ? 'yt-dlp.exe' : 'yt-dlp';

export function Updater({ onReady }: { onReady(): void }) {
  const [info, setInfo] = useState('buscando actualizaciones...');
  const { edit, loaded, settings } = useSettings();

  const update = async () => {
    if (Date.now() - settings.lastYTDLCheck <= 4.32e7) return onReady();
    setInfo('obteniendo versiones de YTDL recientes');

    const res = await axios
      .get<any>('https://api.github.com/repos/yt-dlp/yt-dlp/releases/latest')
      .catch(() => null);
    if (!res) return onReady();
    if (settings.YTDLTag === res.data.tag_name) return onReady();

    setInfo('descargando nueva versión de YTDL...');
    const asset = res.data.assets.find((a: any) => a.name === file);
    if (!asset) return onReady();

    let updated = false;

    await invoke('download_file', {
      output: await join(await appConfigDir(), file),
      url: asset.browser_download_url,
    })
      .then(() => (updated = true))
      .catch(console.error);

    edit({
      lastYTDLCheck: Date.now(),
      ...(updated ? { YTDLTag: res.data.tag_name } : {}),
    });
    onReady();
  };

  useEffect(() => {
    if (loaded) update();
  }, [loaded]);

  return (
    <Center>
      <h2>YouTube Downloader</h2>
      <span>{info}</span>
      <Loader>
        <div />
      </Loader>
    </Center>
  );
}
