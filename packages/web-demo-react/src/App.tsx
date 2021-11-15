import { FC } from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import { MonitorConfigProtocol, withReactMonitor } from '@lite-monitor/web';
import Component from './Component';
import Error from './Error';
import Home from './Home';
import { ref } from './global';
import './App.css';

const App: FC = () => {
  return (
    <Router>
      <div className={'App'}>
        <header className={'App-header'}>
          <Link className={'App-link'} to={'/error'}>
            {'Error'}
          </Link>
          <Link className={'App-link'} to={'/component'}>
            {'Component'}
          </Link>
          <Link className={'App-link'} to={'/'}>
            {'Home'}
          </Link>
        </header>
        <main className={'App-main'}>
          <Routes>
            <Route
              element={<Error messages={['Hello World!']} />}
              path={'/error'}
            />
            <Route element={<Component />} path={'/component'} />
            <Route element={<Home />} path={'/'} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const config = {
  protocol: MonitorConfigProtocol.HTTP,
  host: 'localhost',
  port: 3000,
  initToken: '0000000000003003',
};

export default withReactMonitor(App, config, ref);
