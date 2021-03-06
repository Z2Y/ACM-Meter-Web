/*eslint-disable*/
var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {
  entry: {
    app: ['./src/main.jsx']
  },

  output: {
    publicPath: '/',
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].bundle.js',
    chunkFilename: 'chunks/[name].chunk.js',
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.(gif|jpg|png)\??.*$/,
        loader: 'url-loader?limit=10000&name=images/[name].[ext]'
      },
      {
        test: /\.(woff|svg|eot|ttf)\??.*$/,
        loader: 'url-loader?limit=10000&name=fonts/[name].[ext]'
      }
    ]
  },

  devPort: 3001,

  postcss: function () {
    return [autoprefixer({ browsers: ['last 10 versions'] })];
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'src': path.resolve(__dirname, '../src'),
      'libs': path.resolve(__dirname, '../src/libs'),
      'components': path.resolve(__dirname, '../src/components'),
      'actions': path.resolve(__dirname, '../src/actions'),
      'reducers': path.resolve(__dirname, '../src/reducers'),
      'helpers': path.resolve(__dirname, '../src/helpers'),
      'constants': path.resolve(__dirname, '../src/constants'),
      'views': path.resolve(__dirname, '../src/views'),
      'styles': path.resolve(__dirname, '../src/styles')
    }
  },

  plugins: [
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, '../'),
      manifest: require('../dist/vendor_manifest.json')
    })
  ],
  
  node: {
    fs: "empty"
  }
};
