import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC, Fragment } from 'react';
import Header from '../components/header';
import '../styles/globals.css';

const App: FC<AppProps> = (props) => {
  console.log(props);
  const { Component, pageProps } = props;
  return (
    <Fragment>
      <Header />
      <Head>
        <title>Lite Monitor</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Component {...pageProps} />
    </Fragment>
  );
};

export default App;
