import { Fragment } from 'react';
import type { FC } from 'react';
import logo from './logo.svg';

const Home: FC = () => {
  return (
    <Fragment>
      <img src={logo} className={'app-logo'} alt={'logo'} />
    </Fragment>
  );
};

export default Home;
