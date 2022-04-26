import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';

const extensions = ['.js', '.jsx', '.ts', '.tsx'];

export default {
  input: './src/index.ts',
  output: [
    {
      name: 'cjs',
      file: './dist/index.cjs',
      format: 'cjs',
      exports: 'auto',
    },
    {
      name: 'mjs',
      file: './dist/index.mjs',
      format: 'es',
      exports: 'auto',
    },
  ],
  plugins: [
    resolve({
      extensions,
    }),
    babel({
      extensions,
      babelHelpers: 'bundled',
    }),
    terser(),
  ],
};
