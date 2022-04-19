import { type AlertColor } from '@mui/material';
import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type FC,
  type ReactNode,
} from 'react';

interface Alert {
  message: string;
  open: boolean;
  severity: AlertColor;
}

type SetAlert = (message: string, severity?: AlertColor) => void;

interface AlertContextValue extends Alert {
  setAlert: (value: Partial<Alert>) => void;
}

const AlertContext = createContext<AlertContextValue>({
  message: '',
  open: false,
  setAlert: ({ message, severity }) => {
    switch (severity) {
      case 'success':
        return console.log(message);
      case 'info':
        return console.info(message);
      case 'warning':
        return console.warn(message);
      case 'error':
        return console.error(message);
      default:
        return console.log(message);
    }
  },
  severity: 'success',
});

interface AlertProviderProps {
  children?: ReactNode | undefined;
}

const AlertProvider: FC<AlertProviderProps> = (props) => {
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState<AlertColor>('success');
  const setAlert = useCallback((value: Partial<Alert>) => {
    if (value.message !== undefined) setMessage(value.message);
    if (value.open !== undefined) setOpen(value.open);
    if (value.severity !== undefined) setSeverity(value.severity);
  }, []);
  return createElement(
    AlertContext.Provider,
    { value: { message, open, setAlert, severity } },
    props.children,
  );
};

const useAlert = (): Alert => {
  const { message, open, severity } = useContext(AlertContext);
  const alert = useMemo(
    () => ({ message, open, severity }),
    [message, open, severity],
  );
  return alert;
};

const useCloseAlert = (): (() => void) => {
  const { setAlert } = useContext(AlertContext);
  const closeAlert = useCallback(() => {
    setAlert({ open: false });
  }, [setAlert]);
  return closeAlert;
};

const useOpenAlert = (): ((message: string, severity?: AlertColor) => void) => {
  const { setAlert } = useContext(AlertContext);
  const openAlert = useCallback(
    (message: string, severity?: AlertColor) => {
      setAlert({
        message,
        open: true,
        severity: severity || 'success',
      });
    },
    [setAlert],
  );
  return openAlert;
};

export {
  AlertProvider,
  useAlert,
  useCloseAlert,
  useOpenAlert,
  type Alert,
  type SetAlert,
};
