const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const {
  loaders,
  plugins,
  resolve,
  stats,
  mode
} = require('./common.config.js');

module.exports = {
  mode,

  devtool: 'inline-source-map',

  devServer: {
    port: 3002,
    open: true,
    openPage: '?invoice_id=1'
  },

  entry: path.join(__dirname, '../examples/src/index.js'),

  module: {
    rules: [
      loaders.babel,
      loaders.css
    ]
  },

  plugins: [
    plugins.miniCssExtractPlugin,
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../examples/src/index.html'),
      filename: './index.html',
    })
  ],

  resolve,

  stats
}
