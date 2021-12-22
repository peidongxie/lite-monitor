import { build, type BuildOptions } from 'esbuild';
import { copy, emptyDir } from 'fs-extra';

const buildOptions: BuildOptions = {
  bundle: true,
  define: {},
  entryPoints: ['./src/index.tsx'],
  external: [],
  format: 'esm',
  inject: ['./scripts/react-shim.ts'],
  loader: {
    '.ts': 'tsx',
    '.avif': 'file',
    '.bmp': 'file',
    '.gif': 'file',
    '.jpg': 'file',
    '.jpeg': 'file',
    '.png': 'file',
    '.webp': 'file',
    '.svg': 'file',
  },
  minify: true,
  minifyWhitespace: true,
  minifyIdentifiers: true,
  minifySyntax: true,
  outdir: './build/static/',
  platform: 'browser',
  sourcemap: true,
  splitting: true,
  target: 'es6',
  watch: false,
  write: true,
  metafile: false,
  publicPath: '/static/',
  sourceRoot: '/static/',
};

(async () => {
  await emptyDir('build');
  await copy('public', 'build');
  const { errors, warnings } = await build(buildOptions);
  for (const error of errors) console.error(error);
  for (const warning of warnings) console.warn(warning);
  if (errors.length === 0 && warnings.length === 0) {
    console.log('The \x1b[36mbuild\x1b[39m folder is ready to be deployed.');
  }
})();
