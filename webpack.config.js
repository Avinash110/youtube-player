const webpack = require('webpack');
const path = require("path");
module.exports = {
    entry: [
        'react-hot-loader/patch',
        'webpack-hot-middleware/client',
        './public/javascripts/index.js'
    ],
    output: {
        path: path.resolve(__dirname, "public"),
        filename: 'javascripts/bundle.js'
    },
    plugins: [
        // OccurrenceOrderPlugin is needed for webpack 1.x only
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        // Use NoErrorsPlugin for webpack 1.x
        new webpack.NoEmitOnErrorsPlugin()
    ],
    mode: "development",
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/react', { 'plugins': ['@babel/plugin-proposal-class-properties'] } ],
                        plugins: [
                          // "react-hot-loader/babel"
                        ]
                    },
                }]
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jp(e*)g|svg|gif)$/,
                use: [{
                    loader: 'url-loader'
                }]
            }
        ]
    }
}