const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: {
    app: '/src/index.js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
    ],
  },
  plugins: [new VueLoaderPlugin()],
}
