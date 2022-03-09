import CssBaseline from '@mui/material/CssBaseline';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import AlertBar from '../components/alert-bar';
import Header from '../components/header';
import { AlertProvider } from '../utils/alert';
import { ThemeProvider } from '../utils/theme';

const App: FC<AppProps> = (props) => {
  const { Component, pageProps } = props;

  return (
    <ThemeProvider>
      <AlertProvider>
        <CssBaseline />
        <Head>
          <title>Lite Monitor</title>
        </Head>
        <Header
          projectInfoApi={'/api/project/info'}
          userAuthApi={'/api/user/auth'}
        />
        <AlertBar />
        <Component {...pageProps} />
      </AlertProvider>
    </ThemeProvider>
  );
};

export default App;
