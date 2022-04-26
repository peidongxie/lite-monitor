import config from '../../rollup.config';

export default {
  ...config,
  external: ['react', 'react-dom', '@lite-monitor/base'],
};
