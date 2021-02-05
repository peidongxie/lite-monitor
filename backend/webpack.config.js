const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const NodemonWebpackPlugin = require('nodemon-webpack-plugin');

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
  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new ESLintWebpackPlugin({
      extensions: ['.js', '.json', '.ts'],
      files: 'src',
      fix: true,
    }),
  ],
  optimization: {
    moduleIds: 'deterministic',
    splitChunks: {
      cacheGroups: {
        koa: {
          test: /node_modules/,
          name: 'koa',
          chunks: 'all',
        },
        mongodb: {
          test: /node_modules/,
          name: 'mongodb',
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
