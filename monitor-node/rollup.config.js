import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      name: 'cjs',
      file: 'dist/index.cjs',
      format: 'cjs',
      exports: 'auto',
    },
    {
      name: 'mjs',
      file: 'dist/index.mjs',
      format: 'es',
      exports: 'auto',
    },
  ],
  plugins: [typescript()],
};
