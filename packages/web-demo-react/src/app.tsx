import { withReactMonitor } from '@lite-monitor/web';
import { FC } from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import './app.css';
import Component from './component';
import Error from './error';
import Home from './home';
import { ref } from './global';

const App: FC = () => {
  return (
    <Router>
      <div className={'app'}>
        <header className={'app-header'}>
          <Link className={'app-link'} to={'/error'}>
            {'Error'}
          </Link>
          <Link className={'app-link'} to={'/component'}>
            {'Component'}
          </Link>
          <Link className={'app-link'} to={'/'}>
            {'Home'}
          </Link>
        </header>
        <main className={'app-main'}>
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

// Report error events and access events
const config = {
  url: new URL('http://localhost:3001/events'),
  token: '0000000000003004',
};
const AppwithReactMonitor = withReactMonitor(App, config, ref);

export default AppwithReactMonitor;
