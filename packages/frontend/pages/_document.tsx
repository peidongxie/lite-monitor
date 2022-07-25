import NextDocument, {
  Html,
  Head,
  Main,
  NextScript,
  type DocumentContext,
  type DocumentInitialProps,
} from 'next/document';
import { type ReactElement } from 'react';
import { themeMap } from '../utils/theme';
import {
  createEmotionApp,
  createEmotionCache,
  createEmotionServer,
} from '../utils/emotion';

// Resolution order
//
// On the server:
// 1. app.getInitialProps
// 2. page.getInitialProps
// 3. document.getInitialProps
// 4. app.render
// 5. page.render
// 6. document.render
//
// On the server with error:
// 1. document.getInitialProps
// 2. app.render
// 3. page.render
// 4. document.render
//
// On the client
// 1. app.getInitialProps
// 2. page.getInitialProps
// 3. app.render
// 4. page.render

interface DocumentProps {
  emotionStyleTags: ReactElement[];
}

class Document extends NextDocument<DocumentProps> {
  static getInitialProps = async (
    ctx: DocumentContext,
  ): Promise<DocumentInitialProps & DocumentProps> => {
    const cache = createEmotionCache();
    const originalRenderPage = ctx.renderPage;
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => createEmotionApp(App, { emotionCache: cache }),
      });
    const initialProps = await ctx.defaultGetInitialProps(ctx);
    const emotionStyleTags = createEmotionServer(cache)
      .extractCriticalToChunks(initialProps.html)
      .styles.map((style) => (
        <style
          data-emotion={`${style.key} ${style.ids.join(' ')}`}
          key={style.key}
          dangerouslySetInnerHTML={{ __html: style.css }}
        />
      ));
    return {
      ...initialProps,
      emotionStyleTags,
    };
  };

  render(): ReactElement {
    return (
      <Html lang='en'>
        <Head>
          <meta
            name='theme-color'
            content={themeMap.default.palette.primary.main}
          />
          <link rel='shortcut icon' href='/favicon.ico' />
          <meta name='emotion-insertion-point' content='' />
          {this.props.emotionStyleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default Document;
