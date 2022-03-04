import CssBaseline from '@mui/material/CssBaseline';
import { type AlertColor } from '@mui/material/Alert';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC, useCallback, useState } from 'react';
import AlertBar from '../components/alert-bar';
import Header from '../components/header';
import { AlertProvider } from '../utils/alert';
import { ThemeProvider } from '../utils/theme';

const App: FC<AppProps> = (props) => {
  const { Component, pageProps } = props;
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>();
  const [open, setOpen] = useState(false);

  const alert = useCallback((message: string, severity?: AlertColor) => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  }, []);

  return (
    <ThemeProvider>
      <AlertProvider alert={alert}>
        <CssBaseline />
        <Head>
          <title>Lite Monitor</title>
        </Head>
        <Header
          projectInfoApi={'/api/project/info'}
          userAuthApi={'/api/user/auth'}
        />
        <AlertBar
          message={message}
          open={open}
          setOpen={setOpen}
          severity={severity}
        />
        <Component {...pageProps} />
      </AlertProvider>
    </ThemeProvider>
  );
};

export default App;
