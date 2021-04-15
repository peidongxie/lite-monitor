import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import Header from '../components/header';
import theme from '../utils/theme';

const App: FC<AppProps> = (props) => {
  const { Component, pageProps } = props;
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
