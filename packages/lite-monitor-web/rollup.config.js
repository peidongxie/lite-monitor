const { nodeResolve } = require('@rollup/plugin-node-resolve');
const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');

export default {
  input: './src/index.ts',
  output: [
    {
      name: 'cjs',
      file: './dist/index.js',
      format: 'cjs',
      exports: 'auto',
    },
    {
      name: 'mjs',
      file: './dist/index.es.js',
      format: 'es',
      exports: 'auto',
    },
  ],
  plugins: [typescript({ composite: false }), nodeResolve(), terser()],
  external: ['react', 'react-dom', '@lite-monitor/base'],
};
