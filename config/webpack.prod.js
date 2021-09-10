const path = require('path')
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const clearPath = path.resolve(__dirname, '../dist')

const REACT_MODULE =
  /[\\/]node_modules[\\/](react|react-dom|react-router-config|react-router-dom)[\\/]/

const CHART_MODULE = /[\\/]node_modules[\\/](bizcharts)[\\/]/

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[contenthash].css',
      chunkFilename: '[id].css'
    }),
    new CleanWebpackPlugin({
      dry: false,
      verbose: true,
      cleanOnceBeforeBuildPatterns: [clearPath, clearPath]
    })
    // new BundleAnalyzerPlugin()
  ],
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
    splitChunks: {
      // chunks: 'all',
      // minChunks: 3
      // cacheGroups: {
      //   react: {
      //     test: REACT_MODULE,
      //     name: 'react',
      //     minChunks: 1,
      //     priority: 10,
      //     enforce: true,
      //     chunks: 'all'
      //   },
      //   chart: {
      //     test: CHART_MODULE,
      //     name: 'bizchart',
      //     minChunks: 1,
      //     priority: 10,
      //     enforce: true,
      //     chunks: 'all'
      //   }
      // }
    }
    // runtimeChunk: {
    //   name: 'runtime'
    // }
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
})
