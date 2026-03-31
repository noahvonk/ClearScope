module.exports = {
  target: 'electron-preload',
  externals: {
    'fs': 'commonjs fs',
    'path': 'commonjs path',
    'node:fs': 'commonjs fs',
    'node:path': 'commonjs path',
    'node:console': 'commonjs console',
    'electron': 'commonjs electron',
  },
  module: {
    rules: require('./webpack.rules'),
  },
};