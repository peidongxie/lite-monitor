import { getMonitor } from '@lite-monitor/web';
import { Fragment, type FC } from 'react';
import { ref } from './global';

const Home: FC = () => {
  const handleClick = () =>
    globalThis.alert(
      getMonitor(ref) ? 'Monitor is found' : 'Monitor is not found',
    );
  return (
    <Fragment>
      <span className={'app-link'} onClick={handleClick}>
        {'Check'}
      </span>
    </Fragment>
  );
};

export { Home as default };
