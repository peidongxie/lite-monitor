import config from '../../rollup.config';

export default {
  ...config,
  external: ['@lite-monitor/base', 'systeminformation'],
};
