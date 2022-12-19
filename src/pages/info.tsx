import { getName, getTauriVersion, getVersion } from '@tauri-apps/api/app';
import { arch, platform, type, version } from '@tauri-apps/api/os';
import styled from 'styled-components';

import { dependencies } from '../../package.json';
import { useSettings } from '../context/Settings';

const Title = styled.h1`
  font-size: 1.75rem;
`;

const Subtitle = styled.h3`
  font-weight: normal;
  margin-bottom: 0;
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
`;

const Data = styled.span`
  color: ${(props) => props.theme.colorAlternate};
  margin-left: 0.5rem;

  &:before {
    content: '- ';
  }
`;

const appInfo = await Promise.all([getName(), getVersion(), getTauriVersion()]);
const systemInfo = await Promise.all([type(), version(), arch(), platform()]);

export function Info() {
  const { settings } = useSettings();

  return (
    <div>
      <Title>Información y créditos</Title>
      <Subtitle>Información del sistema</Subtitle>
      <Col>
        <Data>
          {appInfo[0]}: {appInfo[1]} (Tauri: {appInfo[2]})
        </Data>
        <Data>
          {systemInfo[0]} {systemInfo[1]} ({systemInfo[2]} {systemInfo[3]})
        </Data>
        <Data>ytdl-org/youtube-dl: {settings.YTDLTag}</Data>
      </Col>
      <Subtitle>Acerca de {appInfo[0]}</Subtitle>
      <Data>
        Creador con cariño por Drylozu, en su proceso de aprendizaje de Rust.
      </Data>
      <Subtitle>Dependencias - Hecho con</Subtitle>
      <Col>
        {Object.entries(dependencies).map(([name, version]) => (
          <Data key={name}>
            {name}: {version}
          </Data>
        ))}
      </Col>
    </div>
  );
}
