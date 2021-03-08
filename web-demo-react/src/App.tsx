import React, { FC, useCallback, useState } from 'react';
import logo from './logo.svg';
import './App.css';

const App: FC<{ messages: string[] }> = ({ messages }) => {
  const message = messages[1];
  const [syncsError, setSyncError] = useState(false);
  const [asyncsError, setAsyncError] = useState(false);
  if (syncsError) message.toLowerCase();
  if (asyncsError) Promise.resolve().catch(() => message.toUpperCase());
  const handleClickSyncError = useCallback(() => {
    setSyncError(true);
  }, []);
  const handleClickAsyncError = useCallback(() => {
    setAsyncError(true);
  }, []);
  const handleClickEventError = useCallback(() => {
    message.toString();
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

export default App;
