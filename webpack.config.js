var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var path = require('path');

module.exports = {
    context: path.join(__dirname, '/src/renderer'),
    entry: {
        settings: "./settings.tsx",
        auth: "./auth.tsx",
    },
    output: {
        path: path.join(__dirname, '/dist/renderer'),
        filename: "[name].js"
    },
    target: 'electron',
    module: {
        loaders: [
            {
                test: /\.tsx?/,
                loader: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.js$/,
                loader: "file-loader?name=[name].[ext]",
                include: /^qml|qmlweb|qt/
            },
            {
                test: /\.css$/,
                loader: "file-loader?name=[name].[ext]"
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'initial.html',
            filename: 'initial.html',
            inject: false,
            minify: {
                html5: true
            }
        }),
        new HtmlWebpackPlugin({
            template: 'renderer.html',
            filename: 'settings.html',
            minify: {
                html5: true
            },
            chunks: ['settings'],
        }),
        new HtmlWebpackPlugin({
            template: 'renderer.html',
            filename: 'auth.html',
            minify: {
                html5: true
            },
            chunks: ['auth'],
        }),
        new HtmlWebpackPlugin({
            template: 'qmltab.html',
            filename: 'qmltab.html',
            inject: false,
            minify: {
                html5: true
            }
        })
    ],
    devtool: 'source-map'
};