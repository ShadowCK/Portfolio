import { fileURLToPath } from 'url';
import { dirname, resolve as pathResolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  entry: {
    homepage: './client/homepage.jsx',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  // devtool: 'cheap-module-source-map',
  // mode: 'development',
  mode: 'production',
  watchOptions: {
    aggregateTimeout: 200,
  },
  output: {
    path: pathResolve(__dirname, 'hosted'),
    filename: '[name]Bundle.js',
  },
};
