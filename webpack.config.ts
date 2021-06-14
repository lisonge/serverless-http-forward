/*
 * @Date: 2021-02-22 19:32:17
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2021-06-14 14:50:27
 */
import path from 'path';
import { Configuration } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

export default {
  entry: './src/index.ts',
  devtool: 'source-map',
  // mode: 'production',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'esbuild-loader',
        options: {
          loader: 'ts',
        },
        // exclude: /node_modules/,
      },
    ],
  },
  ignoreWarnings: [/(Critical dependency)/],
  resolve: {
    extensions: ['.js', '.mjs', '.cjs', '.json', '.ts'],
  },
  // externals: [],
  output: {
    filename: 'index.js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'dist'),
  },
  // optimization: {
  //   minimize: true,
  // },
  plugins: [new CleanWebpackPlugin()],
} as Configuration;
