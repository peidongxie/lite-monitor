import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC, useState } from 'react';
import Header from '../components/header';
import { Locale } from '../utils/locale';
import { themeMap } from '../utils/theme';

const App: FC<AppProps> = (props) => {
  const { Component, pageProps } = props;
  const [locale, setLocale] = useState<Locale>('zhCN');
  const theme = themeMap[locale];
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Lite Monitor</title>
      </Head>
      <Header name={'Lite Monitor'} />
      <Component {...pageProps} />
    </ThemeProvider>
  );
};

export default App;
