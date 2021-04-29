const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isDevMode = process.env.NODE_ENV !== 'production';

const plugins = [];
if (!isDevMode) {
    plugins.push(new MiniCssExtractPlugin({ filename: 'css/main.css' }));
}

module.exports = {
    mode: 'production',
    entry: './src/js/index.js',
    output: {
        filename: 'js/main.js',
        path: path.resolve(__dirname, 'dist')
    },
    resolve: {
        alias: {
            'jquery': 'jquery/dist/jquery.slim.js'
        }
    },
    watchOptions: {
        poll: 1000
    },
    plugins: plugins,
    module: {
        rules: [
            {
                test: /\.(s*)css$/,
                use: [
                    isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
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
