import { type AlertColor } from '@mui/material';
import {
  createContext,
  createElement,
  useCallback,
  useContext,
  type FC,
} from 'react';

interface Alert {
  (message: string, severity?: AlertColor): void;
}

const alert: Alert = (message, severity) => {
  switch (severity) {
    case 'success':
      console.log(severity, message);
      break;
    case 'info':
      console.info(severity, message);
      break;
    case 'warning':
      console.warn(severity, message);
      break;
    case 'error':
      console.error(severity, message);
      break;
    default:
      console.log(message);
      break;
  }
};

const AlertContext = createContext({
  alert,
});

interface AlertProviderProps {
  alert: Alert;
}

export const AlertProvider: FC<AlertProviderProps> = (props) => {
  const { alert, children } = props;
  return createElement(AlertContext.Provider, { value: { alert } }, children);
};

export const useAlert = (message: string, severity?: AlertColor) => {
  const { alert } = useContext(AlertContext);
  return useCallback(() => {
    alert(message, severity);
  }, [alert, message, severity]);
};
