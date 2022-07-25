import createCache, { type EmotionCache } from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { createElement, type ComponentType } from 'react';

interface EmotionCacheProps {
  emotionCache?: EmotionCache;
}

const createEmotionApp = <T>(
  Component: ComponentType<T>,
  cacheProps: EmotionCacheProps,
): ComponentType<T> => {
  const EmotionApp = (props: T) =>
    createElement(Component, { ...cacheProps, ...props });
  return EmotionApp;
};

const createEmotionCache = (): EmotionCache => {
  const insertionPoint = globalThis.document?.querySelector<HTMLMetaElement>(
    'meta[name="emotion-insertion-point"]',
  );
  return createCache(
    insertionPoint
      ? { key: 'mui-style', insertionPoint }
      : { key: 'mui-style' },
  );
};

export {
  CacheProvider as EmotionCacheProvider,
  createEmotionApp,
  createEmotionCache,
  createEmotionServer,
  type EmotionCacheProps,
};
