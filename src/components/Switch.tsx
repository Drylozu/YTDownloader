import styled from 'styled-components';
import { useState } from 'react';

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
`;

const Inline = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: space-between;
`;

const Capsule = styled.div<{ active: boolean }>`
  background-color: ${(props) =>
    props.active ? props.theme.active : props.theme.accentColor};
  border-radius: 1rem;
  padding: 0.2rem;
  width: 3rem;
  transition: 200ms;

  & > * {
    transform: ${(props) => `translateX(${props.active ? '100%' : '0%'})`};
  }
`;

const Circle = styled.div`
  background-color: ${(props) => props.theme.backgroundMain};
  border-radius: 100%;
  width: 1.5rem;
  height: 1.5rem;
  transition: 200ms;
`;

interface SwitchProps {
  title: string;
  tooltip: string;
  value: boolean;
  onChange(active: boolean): unknown;
}

export function Switch({ onChange, title, tooltip, value }: SwitchProps) {
  return (
    <Container>
      <Inline onClick={() => onChange(!value)}>
        <Title>{title}</Title>
        <Capsule active={value}>
          <Circle />
        </Capsule>
      </Inline>
      <small>{tooltip}</small>
    </Container>
  );
}
