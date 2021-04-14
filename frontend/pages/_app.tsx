import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC, Fragment } from 'react';
import Header from '../components/header';
import '../styles/globals.css';

const App: FC<AppProps> = (props) => {
  const { Component, pageProps } = props;
  return (
    <Fragment>
      <Head>
        <title>Lite Monitor</title>
      </Head>
      <Header />
      <Component {...pageProps} />
    </Fragment>
  );
};

export default App;
