import { FC } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
import { MonitorConfigProtocol, withReactMonitor } from '@lite-monitor/web';
import Error from './Error';
import Home from './Home';
import { ref } from './global';
import './App.css';

const App: FC = () => {
  return (
    <Router>
      <div className={'App'}>
        <header className={'App-header'}>
          <Link to='/error' className={'App-link'}>
            Error
          </Link>
          <Link to='/' className={'App-link'}>
            Home
          </Link>
        </header>
        <main className={'App-main'}>
          <Switch>
            <Route path={'/error'}>
              <Error messages={['Hello World!']} />
            </Route>
            <Route path={'/'}>
              <Home />
            </Route>
          </Switch>
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
