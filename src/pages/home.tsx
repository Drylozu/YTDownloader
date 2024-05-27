import { invoke } from '@tauri-apps/api/tauri';
import { FormEvent, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import styled from 'styled-components';

import { YTDLPath } from '../components/Updater';
import { Title } from '../components/common';
import { RDropdown } from '../components/Dropdown';
import { AiOutlineDownload } from 'react-icons/ai';
import { useSettings } from '../context/Settings';
import { join } from '@tauri-apps/api/path';

const Search = styled.form`
  display: flex;
  flex-shrink: 1;
  align-items: stretch;
  gap: 1rem;

  & *:disabled,
  & .Dropdown-disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  & > input {
    font-family: Montserrat, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
      'Segoe UI Emoji', 'Segoe UI Symbol';
    font-size: 16px;
    line-height: 24px;
    font-weight: 400;

    border: 0.2rem solid ${(props) => props.theme.accentColor};
    background-color: ${(props) => props.theme.backgroundMain};
    color: ${(props) => props.theme.colorMain};
    padding: 0.25rem 1rem;
    border-radius: 0.2rem;
    margin: 0;
    flex-grow: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    outline: none;
  }

  & > button {
    color: ${(props) => props.theme.colorMain};
    outline: none;
    border: none;
    background: transparent;
    cursor: pointer;
    display: flex;
    width: 2.5rem;
    align-items: center;
    justify-content: center;

    & > svg {
      width: 2.5rem;
      height: 2.5rem;
    }
  }
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  padding: 1rem 0;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-right: 1rem;

  & > div {
    // Video
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border: 0.1rem solid ${(props) => props.theme.accentColor};
    border-radius: 0.2rem;
    background-color: ${(props) => props.theme.backgroundMain};
    flex-grow: 1;
    position: relative;

    & > img {
      border-radius: 0.2rem;
    }

    & > div:nth-child(1) {
      pointer-events: none;
      opacity: 0;
    }

    &:hover > div:nth-child(1) {
      pointer-events: all;
      opacity: 1;
    }
  }
`;

const Hover = styled.div`
  position: absolute;
  inset: 0;
  backdrop-filter: blur(0.2rem);
  background-color: rgba(0, 0, 0, 0.4);
  color: #fff;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: opacity 0.2s;

  & > svg {
    width: 5rem;
    height: 5rem;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;

  & > h3 {
    margin-top: 0;
    margin-bottom: 0;
  }

  & > p {
    overflow: hidden;
    white-space: break-spaces;
    word-break: break-all;
    text-overflow: ellipsis;
    margin: 0;
    max-height: 150px;
  }
`;

export function Home() {
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState('5');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { settings } = useSettings();

  const search = async (event: FormEvent) => {
    event.preventDefault();
    if (searching) return;

    setSearching(true);
    try {
      const result = await invoke<string>('search', {
        quantity: limit,
        file: YTDLPath,
        query,
      });
      const videos = [];
      for (const line of result.split('\n')) {
        videos.push(JSON.parse(line));
      }
      setResults(videos);
    } finally {
      setSearching(false);
    }
  };

  const download = async (video: any) => {
    console.log(video)
    await invoke('download', {
      file: YTDLPath,
      url: video.original_url,
      output: await join(settings.downloadsDir, `%(title)s.%(ext)s`),
    });
  };

  return (
    <Main>
      <Title>Inicio</Title>
      <p>¡Bienvenido a YouTube Downloader!</p>
      <Search onSubmit={search}>
        <RDropdown
          disabled={searching}
          onChange={(l) => setLimit(l.value)}
          value={limit}
          options={Array.from({ length: 5 }).map((_, i) => ({
            value: (i + 1).toString(),
            label: `${i + 1} resultados`,
          }))}
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Escribe algo para buscar..."
          disabled={searching}
        />
        <button type="submit" disabled={searching}>
          <FaSearch />
        </button>
      </Search>

      <Content>
        <List>
          {results.map((video) => (
            <div key={video.id}>
              <Hover onClick={() => download(video)}>
                <AiOutlineDownload />
                <p>Download</p>
              </Hover>

              <img
                src={video.thumbnail}
                alt={video.title}
                width={200}
                height={100}
              />
              <Info>
                <h3>{video.title}</h3>
                <p>{video.description}</p>
              </Info>
            </div>
          ))}
        </List>
      </Content>
    </Main>
  );
}
