import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

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
  plugins: [typescript(), terser()],
};
