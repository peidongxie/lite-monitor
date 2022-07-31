import { Fragment, type FC } from 'react';
import logo from '../public/logo.svg';

const Home: FC = () => {
  return (
    <Fragment>
      <img src={logo} className={'app-logo'} alt={'logo'} />
    </Fragment>
  );
};

export { Home as default };
