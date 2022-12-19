import {
  AiOutlineHome,
  AiOutlineSearch,
  AiOutlineDownload,
  AiOutlineSetting,
  AiOutlineInfoCircle
} from 'react-icons/ai';

import { Settings } from '../pages/settings';
import { Home } from '../pages/home';
import { Info } from '../pages/info';

interface Route {
  path: string;
  element: JSX.Element;
  icon: JSX.Element;
}

export default [
  [
    {
      path: '/',
      element: <Home />,
      icon: <AiOutlineHome />,
    },
    {
      path: '/search',
      element: <Home />,
      icon: <AiOutlineSearch />,
    },
    {
      path: '/downloads',
      element: <Home />,
      icon: <AiOutlineDownload />,
    },
  ],
  [
    {
      path: '/settings',
      element: <Settings />,
      icon: <AiOutlineSetting />,
    },
    {
      path: '/info',
      element: <Info />,
      icon: <AiOutlineInfoCircle />,
    },
  ],
] as Route[][];
