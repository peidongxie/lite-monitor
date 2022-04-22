import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

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
  plugins: [typescript({ composite: false }), terser()],
};
