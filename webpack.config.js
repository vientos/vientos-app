const path = require('path')
// const Uglify = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname)
  },
  // plugins: [
  //   new Uglify()
  // ],
  devtool: 'source-map'
}
