const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  "resolve": {
    "alias": {
      "slate-plugins-rich-text": path.join(__dirname, '..', 'packages/slate-plugins-rich-text/src'),
      "slate-plugins-image": path.join(__dirname, '..', 'packages/slate-plugins-image/src'),
      "slate-plugins-link": path.join(__dirname, '..', 'packages/slate-plugins-link/src'),
      "slate-plugins-paste-html": path.join(__dirname, '..', 'packages/slate-plugins-paste-html/src'),
    }
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: [
          __dirname,
          /packages\/.*?\/src/,
        ],
      },
      {
        test: /\.css?$/,
        loaders: [
          'style-loader',
          'css-loader?modules&sourceMap&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]',
          'postcss-loader'
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css?$/,
        loaders: [
          'style-loader',
          'css-loader',
        ],
        include: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: 'json',
      }
    ]
  },
  postcss: [autoprefixer({ browsers: ['> 1%'] })],
}
