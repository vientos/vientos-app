// https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31

'use strict'
/* global __dirname module require */
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    vendor: [
      'raven-js',
      'intl-messageformat'
    ],
    engine: './src/engine.js',
    main: './index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    modules: ['node_modules', 'bower_components'],
    descriptionFiles: ['package.json'],
    alias: {
      // fix for script tag import in app-localize-behavior.html
      '../intl-messageformat/dist/intl-messageformat.min.js': 'intl-messageformat'
    }
  },
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
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'engine',
      chunks: ['engine', 'main'],
      minChunks: 2
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      template: 'index.ejs'
    })
  ]
}
