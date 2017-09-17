const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common')
const CleanPlugin = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

const DIST_DIR = 'dist'

module.exports = merge(common, {
  output: {
    filename: '[name].[chunkhash].js'
  },
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new CleanPlugin([DIST_DIR]),
    new UglifyPlugin({
      sourceMap: true,
      uglifyOptions: { mangle: { safari10: true } }
    }),
    new WorkboxPlugin({
      globDirectory: DIST_DIR,
      globPatterns: ['**/*.{html,js,css}'],
      dontCacheBustUrlsMatching: /\.\w{20}\.js/,
      swSrc: './service-worker.js',
      swDest: path.join(DIST_DIR, 'service-worker.js')
    }),
    new CopyPlugin([
      { from: 'manifest.json' },
      { from: 'images', to: 'images' },
      { from: 'bower_components/webcomponentsjs', to: 'bower_components/webcomponentsjs' },
      { from: 'bower_components/leaflet', to: 'bower_components/leaflet' }
    ])
  ]
})
