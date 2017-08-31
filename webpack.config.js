'use strict';
/* global __dirname module require*/
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    main: './app/vientos-shell/vientos-shell.html',
    engine: './src/main.js'
  },
  output: {
    // filename: '[name].[chunkhash].bundle.js',
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: 'dist/'
  },
  resolve: {
    modules: ['node_modules', 'bower_components'],
    descriptionFiles: ['package.json']
  },
  devtool: 'eval',
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'polymer-webpack-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.NamedChunksPlugin()
  ]
};
