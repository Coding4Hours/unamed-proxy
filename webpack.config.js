module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index},
  devtool: 'source-map',
  optimization: {
    minimize: false,
    usedExports: true, // Enables tree shaking
  },
  target: 'web',
};
