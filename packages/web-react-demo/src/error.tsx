import { Fragment, useState, type FC } from 'react';

const Error: FC<{ messages: string[] }> = ({ messages }) => {
  const message = messages[1];
  const [commonError, setCommonError] = useState(false);
  if (commonError) message.toLowerCase();
  const handleClickCommonError = () => setCommonError(true);
  const handleClickUncaughtException = () => message.toString();
  const handleClickUnhandledRejection = async () => message.toString();
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
