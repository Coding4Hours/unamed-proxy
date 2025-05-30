import path from 'path';

return {
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

