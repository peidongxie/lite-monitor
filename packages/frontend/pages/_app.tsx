import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { Color } from '@mui/lab/Alert';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC, useCallback, useState } from 'react';
import AlertBar from '../components/alert-bar';
import Header from '../components/header';
import { AlertProvider } from '../utils/alert';
import { Locale } from '../utils/locale';
import { themeMap } from '../utils/theme';

const App: FC<AppProps> = (props) => {
  const { Component, pageProps } = props;
  const [locale, setLocale] = useState<Locale>('zhCN');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<Color>();
  const [open, setOpen] = useState(false);
  const theme = themeMap[locale];

  const alert = useCallback((message: string, severity?: Color) => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AlertProvider alert={alert}>
        <CssBaseline />
        <Head>
          <title>Lite Monitor</title>
        </Head>
        <Header
          projectInfoApi={'/api/project/info'}
          setLocale={setLocale}
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
