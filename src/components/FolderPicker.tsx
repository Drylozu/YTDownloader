import { AiOutlineFolderOpen } from 'react-icons/ai';
import { invoke } from '@tauri-apps/api/tauri';
import { open } from '@tauri-apps/api/dialog';
import styled from 'styled-components';
import { useEffect, useState } from 'react';

const Container = styled.div`
  display: flex;
  flex-direction: column;

  & > small {
    color: ${(props) => props.theme.colorAlternate};
    padding: 0 1rem;
  }
`;

const Title = styled.h3`
  font-weight: normal;
  margin: 0.5rem 0;
`;

const SelectFolder = styled.div`
  display: flex;
  flex-shrink: 1;
  align-items: center;
  gap: 1rem;

  & > p {
    border: 0.2rem solid ${(props) => props.theme.accentColor};
    padding: 0.25rem 1rem;
    border-radius: 0.2rem;
    margin: 0;
    flex-grow: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  & > div:nth-child(2) {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;

    & > * {
      width: 2rem;
      height: 2rem;
    }
  }
`;

interface FolderPickerProps {
  title: string;
  tooltip?: string;
  pickerTooltip: string;
  path: string;
  onChange(folder: Folder): unknown;
}
interface Folder {
  path: string;
  free: string;
}

export function FolderPicker({
  onChange,
  title,
  pickerTooltip,
  tooltip,
  path,
}: FolderPickerProps) {
  const [free, setFree] = useState('0 B');

  useEffect(() => {
    invoke<string>('free_space', { dir: path }).then(setFree);
  }, [path]);

  const set = async () => {
    const dir = await open({
      directory: true,
      title: pickerTooltip,
      defaultPath: path,
    });
    if (typeof dir === 'string') {
      const newFree = await invoke<string>('free_space', { dir });
      setFree(newFree);
      onChange({ path: dir, free: newFree });
    }
  };

  return (
    <Container>
      <Title>{title}</Title>
      <SelectFolder>
        <p>{path}</p>
        <div onClick={() => set()}>
          <AiOutlineFolderOpen />
        </div>
      </SelectFolder>
      <small>
        {tooltip} Espacio libre: {free}
      </small>
    </Container>
  );
}
