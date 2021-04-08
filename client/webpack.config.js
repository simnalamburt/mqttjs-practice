'use strict'

const { ProvidePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: './src/index.ts',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],

    // Required due to 'mqtt' module
    fallback: {
      buffer: require.resolve('buffer/'),
      events: require.resolve('events/'),
      process: require.resolve('process/'),
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),

    // Required due to 'mqtt' module
    new ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: ['process'],
    }),
  ],
}
