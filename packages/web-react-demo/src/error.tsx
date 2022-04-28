import {
  getCallbackWithErrorCatch,
  useCallbackWithErrorCatch,
} from '@lite-monitor/web';
import { Fragment, useCallback, useState, type FC } from 'react';
import { ref } from './global';

const Error: FC<{ messages: string[] }> = ({ messages }) => {
  const message = messages[1];
  const [syncError, setSyncError] = useState(false);
  const [asyncError, setAsyncError] = useState(false);
  if (syncError) {
    message.toLowerCase();
  }
  if (asyncError) {
    setAsyncError(false);
    // Report error events
    const wrapped = getCallbackWithErrorCatch(fetch, ref);
    wrapped('http://localhost:21');
  }
  const handleClickSyncError = useCallback(() => {
    setSyncError(true);
  }, []);
  const handleClickAsyncError = useCallback(() => {
    setAsyncError(true);
  }, []);
  // Report error events
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

export { Error as default };
