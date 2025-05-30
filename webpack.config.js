import path from 'path';

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'src'),
    filename: 'build.js'
  },
  devtool: 'source-map',
  optimization: {
    minimize: false,
    usedExports: true, // Enables tree shaking
  },
  target: 'web',
};

