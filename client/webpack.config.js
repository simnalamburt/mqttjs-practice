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
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      {
        test: /\.(?:jpg|png|(?:woff2?|ttf|eot|svg)(?:\?v=[0-9]\.[0-9]\.[0-9])?)$/,
        use: 'file-loader?name=[hash].[ext]'
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  plugins: [new MiniCssExtractPlugin({ filename: 'bundle.css' })]
}

// Development-mode configs
const dev = {
  devtool: 'inline-source-map'
}

// Production-mode configs
const test = /\.(?:css|js|svg|eot|ttf)$/
const prod = {
  plugins: [
    new webpack.LoaderOptionsPlugin({ minimize: true, debug: false }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new CompressionPlugin({
      test,
      algorithm: zopfli.gzip,
      minRatio: 1,
      compressionOptions: { numiterations: 15 }
    }),
    new CompressionPlugin({
      test,
      algorithm: 'brotliCompress',
      minRatio: 1,
      compressionOptions: { level: 11 },
      filename: '[path].br[query]'
    })
  ]
}

module.exports = (_, { mode }) =>
  merge(commonConfigs, mode === 'production' ? prod : dev)
