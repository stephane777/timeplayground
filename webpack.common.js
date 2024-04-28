const path = require('path');
const HtmlWEbpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
      {
        mimetype: 'image/svg+xml',
        scheme: 'data',
        type: 'asset/resource',
        generator: {
          filename: 'icons/[name][hash].svg',
        },
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    client: {
      overlay: false,
    },
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss'],
  },
  plugins: [new Dotenv(), new HtmlWEbpackPlugin({ template: './src/main.html' })],
  // optimization: {
  //     splitChunks: {
  //         chunks: 'all',
  //     },
  // },
  output: {
    filename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
};
