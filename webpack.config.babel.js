'use strict';

import path from 'path';
import fs from 'fs';
import lessToJs from 'less-vars-to-js';
import ExtractTextPlugin from 'extract-text-webpack-plugin';


const themeVariables = lessToJs(fs.readFileSync(path.join(
  __dirname,
  './css/ant-default-vars.less'
), 'utf8'));
const src = path.resolve(__dirname, 'src');
const dst = path.resolve(__dirname, 'docs');


export default {

  entry: {main: path.resolve(src, 'main.jsx')},

  output: {
    path: dst,
    filename: '[name].bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                'env',
                'react',
              ],
              plugins: [
                [
                  'import',
                  {
                    libraryName: 'antd',
                    style: true,
                  },
                ],
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          use: [
            {loader: 'css-loader'},
            {
              loader: 'less-loader',
              options: {
                modifyVars: themeVariables,
                root: path.resolve(__dirname, './'),
              },
            },
          ],
          fallback: 'style-loader',
        }),
      },
    ],
  },

  devtool: 'source-map',

  plugins: [
    new ExtractTextPlugin('bundle.css'),
  ],
};
