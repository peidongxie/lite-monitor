import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      name: 'cjs',
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'auto',
    },
    {
      name: 'mjs',
      file: 'dist/index.es.js',
      format: 'es',
      exports: 'auto',
    },
  ],
  plugins: [typescript(), nodeResolve()],
  external: ['react', 'react-dom'],
};
