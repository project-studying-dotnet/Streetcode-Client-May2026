const Dotenv = require('dotenv-webpack');
const Webpack = require('webpack');
module.exports = {
    entry: {
        main: './src/index.tsx',
    },
    devtool: 'cheap-module-source-map',
    devServer: {
        open: true,
        port: "3000",
        historyApiFallback: true,
        client: {
            // Показывать оверлеем только ошибки, без потока предупреждений.
            overlay: {
                errors: true,
                warnings: false,
            },
        },
    },
    module: {
        rules: require('./webpack.rules'),
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        symlinks: false,
        alias: require('./webpack.aliases'),
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        publicPath: '/'
    },
    plugins: [
        ...require('./webpack.plugins'),
        new Dotenv({
            path: `./.env`,
        }),
      ],
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    performance: {
        hints: false,
    },
}