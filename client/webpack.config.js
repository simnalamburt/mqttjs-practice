'use strict'

const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const zopfli = require('@gfx/zopfli')

//
// Common configs
//
const commonConfigs = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../server/build')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [new MiniCssExtractPlugin({ filename: 'bundle.css' })]
}

// Development-mode configs
const dev = {
  devtool: 'inline-source-map'
}

// Production-mode configs
const prod = {
  plugins: [
    new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new CompressionPlugin({
      test: /\.(?:css|js|svg|eot|ttf)$/,
      algorithm: zopfli.gzip,
      minRatio: 1,
      compressionOptions: { numiterations: 15 }
    })
  ]
}

module.exports = (_, { mode }) =>
  merge(commonConfigs, mode === 'production' ? prod : dev)
