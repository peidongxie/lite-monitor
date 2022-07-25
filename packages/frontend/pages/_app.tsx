import { CssBaseline } from '@mui/material';
import { type AppProps } from 'next/app';
import Head from 'next/head';
import { type FC } from 'react';
import AlertBar from '../components/alert-bar';
import Header from '../components/header';
import { AlertProvider } from '../utils/alert';
import {
  EmotionCacheProvider,
  createEmotionCache,
  type EmotionCacheProps,
} from '../utils/emotion';
import { ThemeProvider } from '../utils/theme';

const cache = createEmotionCache();

const App: FC<AppProps & EmotionCacheProps> = (props) => {
  const { Component, emotionCache = cache, pageProps } = props;
  return (
    <EmotionCacheProvider value={emotionCache}>
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
    </EmotionCacheProvider>
  );
};

export default App;
