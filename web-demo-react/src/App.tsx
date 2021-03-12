import { FC, useCallback, useState } from 'react';
import {
  MonitorConfigProtocol,
  getCallbackWithErrorCatch,
  useCallbackWithErrorCatch,
  withReactMonitor,
} from '@lite-monitor/web';
import { ref } from './global';
import logo from './logo.svg';
import './App.css';

const App: FC<{ messages: string[] }> = ({ messages: [type, message] }) => {
  const [syncsError, setSyncError] = useState(false);
  const [asyncsError, setAsyncError] = useState(false);
  if (syncsError) {
    message.toLowerCase();
  }
  if (asyncsError) {
    setAsyncError(false);
    const wrapped = getCallbackWithErrorCatch(fetch, ref);
    wrapped('https://localhost');
  }
  const handleClickSyncError = useCallback(() => {
    setSyncError(true);
  }, []);
  const handleClickAsyncError = useCallback(() => {
    setAsyncError(true);
  }, []);
  const handleClickEventError = useCallbackWithErrorCatch(() => {
    message.toUpperCase();
  }, [message]);
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <span className='App-link' onClick={handleClickSyncError}>
          {'Sync Error'}
        </span>
        <span className='App-link' onClick={handleClickAsyncError}>
          {'Async Error'}
        </span>
        <span className='App-link' onClick={handleClickEventError}>
          {'Event Error'}
        </span>
      </header>
    </div>
  );
};

const config = {
  protocol: MonitorConfigProtocol.HTTP,
  host: 'localhost',
  port: 3000,
  initToken: '0000000000003003',
};

export default withReactMonitor(App, config, ref);
