import { AppProps } from 'next/app';
import { FC } from 'react';
import '../styles/globals.css';

const App: FC<AppProps> = (props) => {
  const { Component, pageProps } = props;
  return <Component {...pageProps} />;
};

export default App;
