import ReactDropdown from 'react-dropdown';
import styled from 'styled-components';

import 'react-dropdown/style.css';

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
  margin: 0;
  flex: 1 1 auto;
`;

const Inline = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const RDropdown = styled(ReactDropdown)`
  flex: 0.25 1 auto;

  & > .Dropdown-control {
    background-color: ${(props) => props.theme.backgroundMain};
    color: ${(props) => props.theme.colorMain} !important;
    border: 0.2rem solid ${(props) => props.theme.accentColor};
    border-radius: 0.2rem;
  }

  & .Dropdown-menu {
    border: 0.1rem solid ${(props) => props.theme.colorAlternate};
    border-radius: 0 0 0.2rem 0.2rem;
    background-color: ${(props) => props.theme.accentColor};
  }

  & .Dropdown-option {
    color: ${(props) => props.theme.colorAlternate};
  }

  & .Dropdown-option.is-selected {
    background-color: inherit;
  }

  & .Dropdown-option:hover {
    background-color: ${(props) => props.theme.backgroundMain};
  }
`;

interface DropdownProps {
  title: string;
  tooltip?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange(value: string): unknown;
}

export function Dropdown({
  onChange,
  title,
  tooltip,
  options,
  value,
}: DropdownProps) {
  return (
    <Container>
      <Inline>
        <Title>{title}</Title>
        <RDropdown
          onChange={(o) => onChange(o.value)}
          options={options}
          value={value}
        />
      </Inline>
      {tooltip && <small>{tooltip}</small>}
    </Container>
  );
}
