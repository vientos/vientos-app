'use strict'
/* global __dirname module require */
const path = require('path')
const webpack = require('webpack')
// const Uglify = require('uglifyjs-webpack-plugin')

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
    // filename: '[chunkhash].[name].js',
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
    publicPath: 'dist/'
  },
  resolve: {
    modules: ['node_modules', 'bower_components'],
    descriptionFiles: ['package.json'],
    alias: {
      // fix for script tag import in app-localize-behavior.html
      '../intl-messageformat/dist/intl-messageformat.min.js': 'intl-messageformat'
    }
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
    new webpack.NamedChunksPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    })
    // new Uglify()
  ]
}
