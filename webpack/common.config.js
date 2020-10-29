const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { NODE_ENV = 'development' } = process.env

exports.mode = NODE_ENV

exports.loaders = {
  babel: {
    test: /\.(js|jsx)$/,
    use: 'babel-loader',
    exclude: /node_modules/
  },
  css: {
    test: /\.s[ac]ss$/,
    exclude: /node_modules/,
    use: [
      MiniCssExtractPlugin.loader,
      { loader: 'css-loader' },
      { loader: 'sass-loader' }
    ]
  }
}

exports.plugins = {
  miniCssExtractPlugin: new MiniCssExtractPlugin({ filename: 'style.css' })
}

exports.resolve = {
  extensions: ['.js', '.jsx'],
  alias: {
    '@': path.resolve(__dirname, 'src')
  }
}

exports.stats = { colors: true }
