const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const NodemonWebpackPlugin = require('nodemon-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const config = {
  mode: 'production',
  entry: {
    index: {
      import: './src/index.ts',
      filename: '[name].bundle.js',
    },
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.ts'],
  },
  target: 'node',
  ignoreWarnings: [/Critical dependency/, /Module not found/],
  experiments: {
    topLevelAwait: true,
  },
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new ESLintWebpackPlugin({
      extensions: ['.js', '.json', '.ts'],
      fix: true,
    }),
  ],
  optimization: {
    moduleIds: 'deterministic',
    minimize: true,
    minimizer: [new TerserWebpackPlugin()],
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',
          chunks: 'all',
        },
      },
    },
  },
  watch: false,
};

if (process.env.NODE_ENV === 'development') {
  config.mode = 'development';
  config.plugins.push(
    new NodemonWebpackPlugin({
      script: './dist/index.bundle.js',
      watch: path.resolve('./dist'),
      ext: 'js,json',
      delay: '1000',
      verbose: false,
    }),
  );
  config.watch = true;
}

module.exports = config;
