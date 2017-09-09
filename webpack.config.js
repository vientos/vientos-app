'use strict'
/* global __dirname module require */
const path = require('path')
const webpack = require('webpack')
// const Uglify = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: {
    main: './index.js',
    engine: './src/main.js',
    vendor: [
      'raven-js',
      './bower_components/webcomponentsjs/webcomponents-loader.js',
      // './bower_components/intl-messageformat/dist/intl-messageformat.min.js',
      './bower_components/polymer/polymer.html'
    ]
  },
  output: {
    // filename: '[chunkhash].[name].js',
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: 'dist/'
  },
  resolve: {
    modules: ['node_modules', 'bower_components'],
    descriptionFiles: ['package.json']
  },
  // devtool: 'eval',
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
    new webpack.NamedChunksPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    })
    // new Uglify()
  ]
}
