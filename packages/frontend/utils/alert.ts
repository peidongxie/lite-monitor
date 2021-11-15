import { Color } from '@material-ui/lab/Alert';
import {
  FC,
  createContext,
  createElement,
  useCallback,
  useContext,
} from 'react';

interface Alert {
  (message: string, severity?: Color): void;
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
  return createElement(AlertContext.Provider, { value: { alert }, children });
};

export const useAlert = (message: string, severity?: Color) => {
  const { alert } = useContext(AlertContext);
  return useCallback(() => {
    alert(message, severity);
  }, [alert, message, severity]);
};
