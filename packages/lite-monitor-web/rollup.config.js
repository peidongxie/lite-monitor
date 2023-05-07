import config from '../../rollup.config';

export default {
  ...config,
  external: ['@lite-monitor/base', 'react', 'react-dom', 'ua-parser-js'],
};
