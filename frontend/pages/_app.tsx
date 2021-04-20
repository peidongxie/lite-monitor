import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { Color } from '@material-ui/lab/Alert';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC, useCallback, useState } from 'react';
import Alertbar from '../components/alertbar';
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
  const alert = useCallback((message: string, severity?: Color) => {
    setMessage(message);
    setSeverity(severity);
    setOpen(true);
  }, []);
  const theme = themeMap[locale];
  return (
    <ThemeProvider theme={theme}>
      <AlertProvider alert={alert}>
        <CssBaseline />
        <Head>
          <title>Lite Monitor</title>
        </Head>
        <Header setLocale={setLocale} title={'Lite Monitor'} />
        <Alertbar
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
