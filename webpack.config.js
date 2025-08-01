const path = require('path');

module.exports = {
    entry: {
        'content-scripts/main': './src/content-scripts/main.js',
        'popup/popup': './popup/popup.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    mode: 'production',
    module: {
        rules: [
          {
            test: /\.svg$/i,
            use: 'raw-loader',
          },
        ],
      },
};