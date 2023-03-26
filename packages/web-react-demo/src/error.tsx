import {
  getCallbackWithErrorCatch,
  useCallbackWithErrorCatch,
} from '@lite-monitor/web';
import { Fragment, useState, type FC } from 'react';
import { ref } from './global';

const Error: FC<{ messages: string[] }> = ({ messages }) => {
  const message = messages[1];
  const [commonError, setCommonError] = useState(false);
  if (commonError) message.toLowerCase();
  const handleClickCommonError = () => setCommonError(true);
  const handleClickUncaughtException = getCallbackWithErrorCatch(() => {
    return message.toString();
  }, ref);
  const handleClickUnhandledRejection = useCallbackWithErrorCatch(async () => {
    return message.toString();
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
