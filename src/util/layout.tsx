import { Outlet, NavLink } from 'react-router-dom';
import styled from 'styled-components';

import routes from './routes';

const Main = styled.div`
  background-color: ${(props) => props.theme.backgroundMain};
  color: ${(props) => props.theme.colorMain};
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  display: flex;
  flex-wrap: nowrap;

  & > div:nth-child(2) {
    flex: 1 1 auto;
    padding-right: 1rem;
    overflow: hidden;
  }
`;

const Sidebar = styled.div`
  border-right: 0.15rem solid ${(props) => props.theme.accentColor};
  flex-shrink: 1;
  padding: 0.3rem;
  padding-right: 0;
  margin-right: 1rem;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
`;

const Link = styled(NavLink)`
  padding: 0.75rem;
  color: ${(props) => props.theme.colorMain};
  border-radius: 0.5rem 0rem 0rem 0.5rem;
  transition: 250ms;

  display: flex;
  justify-content: center;
  align-items: center;

  border: 0.15rem solid transparent;
  border-right: 0;
  &.active {
    border: 0.15rem solid ${(props) => props.theme.accentColor};
    border-right: 0;
  }

  & > * {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export function Layout() {
  return (
    <Main>
      <Sidebar>
        {routes.map((rs, i) => (
          <div key={i}>
            {rs.map((r) => (
              <Link to={r.path} key={r.path}>
                {r.icon}
              </Link>
            ))}
          </div>
        ))}
      </Sidebar>

      <Outlet />
    </Main>
  );
}
