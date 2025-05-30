import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
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
