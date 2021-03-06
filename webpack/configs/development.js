const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('../utils/paths');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const configureStaticHtmlPages = require('../utils/static-pages');

module.exports = env => ({
  devtool: 'cheap-eval-source-map',
  output: {
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    ...configureStaticHtmlPages(),
  ],
  devServer: {
    contentBase: paths.BUILD_DIR,
    publicPath: '',
    historyApiFallback: true,
    compress: true,
    port: 4040,
    noInfo: true,
    quiet: true,
    clientLogLevel: 'warning',
    stats: 'errors-only',
    open: true,
    // host: '192.168.1.43',
    // disableHostCheck: true
  },
});
