const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const pkg = require('../package.json')

const {
  loaders,
  plugins,
  resolve,
  stats,
  externals,
  mode
} = require('./common.config.js');

module.exports = {
  mode,

  devtool: false,

  entry: path.join(__dirname, '../src/index.js'),

  output: {
    path: path.join(__dirname, '../dist'),
    filename: 'index.js',
    library: pkg.name,
    libraryTarget: 'umd'
  },

  module: {
    rules: [
      loaders.babel,
      loaders.css
    ]
  },

  plugins: [
    new CleanWebpackPlugin(),
    plugins.miniCssExtractPlugin
  ],

  resolve,

  stats,

  externals: ['react', 'react-dom'],
  // externals: {
  //   react: {
  //     root: 'react',
  //     amd: 'react',
  //     commonjs: 'react',
  //     commonjs2: 'react',
  //   },
  //   'ReactDOM': {
  //     root:
  //     'react-dom',
  //     amd: 'react-dom',
  //     commonjs: 'react-dom',
  //     commonjs2: 'react-dom'
  //   }
  // }
}
