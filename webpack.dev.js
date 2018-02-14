const merge = require('webpack-merge')
const common = require('./webpack.common')

module.exports = merge(common, {
  output: {
    filename: '[name].js'
  },
  devtool: 'eval',
  devServer: {
    compress: true,
    historyApiFallback: true,
    contentBase: './',
    host: '0.0.0.0',
    disableHostCheck: true
  }
})
