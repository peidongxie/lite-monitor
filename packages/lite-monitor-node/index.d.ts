import { NodeMonitor } from './src/monitor';

declare module 'koa' {
  interface DefaultState {
    monitor: NodeMonitor;
  }
}

export * from './src';
