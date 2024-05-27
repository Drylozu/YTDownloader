import styled from 'styled-components';
import { useEffect } from 'react';

import { FolderPicker } from '../components/FolderPicker';
import { useSettings } from '../context/Settings';
import { Dropdown } from '../components/Dropdown';
import { Switch } from '../components/Switch';
import { Title } from '../components/common';

const Col = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.25rem 0;
`;

const Divider = styled.hr`
  height: 0.1rem;
  border: none;
  background-color: ${(props) => props.theme.accentColor};
`;

export function Settings() {
  const { edit, reload, settings } = useSettings();

  useEffect(() => {
    reload();
  }, []);

  return (
    <div>
      <Title>Configuración</Title>
      <Col style={{ gap: '1rem' }}>
        <Switch
          onChange={(d) => edit({ background: d })}
          title="Ejecutar en segundo plano"
          tooltip="YouTube Downloader se seguirá ejecutando en segundo plano. Con esta opción activa, puedes cerrarlo en la bandeja del sistema."
          value={settings.background}
        />
        <Dropdown
          onChange={(theme) => edit({ theme })}
          title="Tema"
          options={[
            { label: 'Oscuro', value: 'dark' },
            { label: 'Claro', value: 'light' },
          ]}
          value={settings.theme}
        />
      </Col>
      <Divider />
      <Col>
        <FolderPicker
          onChange={(f) => edit({ downloadsDir: f.path })}
          title="Carpeta de descargas"
          pickerTooltip="Selecciona una carpeta para guardar tus descargas"
          tooltip="En esta carpeta se guardarán tus descargas."
          path={settings.downloadsDir}
        />
        <FolderPicker
          onChange={(f) => edit({ cacheDir: f.path })}
          title="Carpeta de caché"
          pickerTooltip="Selecciona una carpeta para guardar las miniaturas de tus descargas"
          tooltip="En esta carpeta se guardarán las miniaturas de tus descargas."
          path={settings.cacheDir}
        />
      </Col>
    </div>
  );
}
