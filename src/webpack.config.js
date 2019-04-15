module.exports = (env = {}) => {
  return {
    entry: ['./scss/main.scss'],
    module: {
      rules: [
        {
          test: /.scss$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '/dist/styles.css',
                outputPath: 'dist/'
              }
            },
            {
              loader: 'extract-loader'
            },
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]
        }
      ]
    }
  }
};
