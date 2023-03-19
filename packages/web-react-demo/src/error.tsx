import {
  getCallbackWithErrorCatch,
  useCallbackWithErrorCatch,
} from '@lite-monitor/web';
import { Fragment, useCallback, useState, type FC } from 'react';
import { ref } from './global';

const Error: FC<{ messages: string[] }> = ({ messages }) => {
  const message = messages[1];
  const [commonError, setCommonError] = useState(false);
  const [uncaughtException, setUncaughtException] = useState(false);
  const [unhandledRejection, setUnhandledRejection] = useState(false);
  if (commonError) {
    message.toLowerCase();
  }
  if (uncaughtException) {
    setTimeout(() => message.toString());
  }
  if (unhandledRejection) {
    Promise.resolve().then(() => message.toString());
  }
  const handleClickCommonError = useCallback(() => {
    setCommonError(true);
  }, []);
  const handleClickUncaughtException = useCallback(() => {
    setUncaughtException(true);
  }, []);
  const handleClickUnhandledRejection = useCallback(() => {
    setUnhandledRejection(true);
  }, []);
  return (
    <Fragment>
      <span className={'app-link'} onClick={handleClickCommonError}>
        {'Common Error'}
      </span>
      <span className={'app-link'} onClick={handleClickUncaughtException}>
        {'Uncaught Exception'}
      </span>
      <span className={'app-link'} onClick={handleClickUnhandledRejection}>
        {'Unhandled Rejection'}
      </span>
    </Fragment>
  );
};

export { Error as default };
