const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
  entry: './dist/index.js',
  output: {
    path: path.resolve(__dirname, 'export'),
    filename: 'pattern-grab.js',
    publicPath: './dist',
    library: 'patternGrab',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
}
