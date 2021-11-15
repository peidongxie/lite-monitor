import { FC, Fragment, useCallback, useState } from 'react';
import {
  getCallbackWithErrorCatch,
  useCallbackWithErrorCatch,
} from '@lite-monitor/web';
import { ref } from './global';

const Error: FC<{ messages: string[] }> = ({ messages }) => {
  const message = messages[1];
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
    <Fragment>
      <span className={'app-link'} onClick={handleClickSyncError}>
        {'Sync Error'}
      </span>
      <span className={'app-link'} onClick={handleClickAsyncError}>
        {'Async Error'}
      </span>
      <span className={'app-link'} onClick={handleClickEventError}>
        {'Event Error'}
      </span>
    </Fragment>
  );
};

export default Error;
