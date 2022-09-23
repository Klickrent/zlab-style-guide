const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: './src/js/index.js',
    output: {
        filename: 'js/main.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: { 'jquery': 'jquery/dist/jquery.min.js' }
    },
    watchOptions: {
        poll: 1000
    },
    plugins: [
        new MiniCssExtractPlugin({ filename: 'css/main.css' }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            Popper: ['popper.js', 'default']
        })
    ],
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                loader: 'url-loader',
                options: {
                    limit: 5100000
                }
            }
        ]
    }
};
