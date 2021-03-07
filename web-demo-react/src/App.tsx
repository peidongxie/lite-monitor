import React, { FC, useCallback, useState } from 'react';
import logo from './logo.svg';
import './App.css';

const App: FC<{ messages: string[] }> = ({ messages }) => {
  const message = messages[1];
  const [hasError, setHasError] = useState(false);
  const handleClickAsyncError = useCallback(() => {
    fetch('https://localhost');
  }, []);
  const handleClickEventError = useCallback(() => {
    message.toLowerCase();
  }, [message]);
  const handleClickRenderError = useCallback(() => {
    setHasError(true);
  }, []);
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <span className='App-link' onClick={handleClickAsyncError}>
          {'Async Error'}
        </span>
        <span className='App-link' onClick={handleClickEventError}>
          {'Event Error'}
        </span>
        <span className='App-link' onClick={handleClickRenderError}>
          {hasError ? message.toUpperCase() : 'Render Error'}
        </span>
      </header>
    </div>
  );
};

export default App;
