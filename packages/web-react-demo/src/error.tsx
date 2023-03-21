import {
  getCallbackWithErrorCatch,
  useCallbackWithErrorCatch,
} from '@lite-monitor/web';
import { Fragment, useCallback, useState, type FC } from 'react';
import { ref } from './global';

const Error: FC<{ messages: string[] }> = ({ messages }) => {
  const message = messages[1];
  const [commonError, setCommonError] = useState(false);
  if (commonError) {
    message.toLowerCase();
  }
  const handleClickCommonError = useCallback(() => {
    return setCommonError(true);
  }, []);
  const handleClickUncaughtException = useCallback(() => {
    return setTimeout(() => message.toString());
  }, [message]);
  const handleClickUnhandledRejection = useCallback(() => {
    return Promise.resolve().then(() => message.toString());
  }, [message]);
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
