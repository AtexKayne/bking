const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProduction = process.env.NODE_ENV == 'production'

const config = {
    context: path.resolve(__dirname, 'src'),
    entry: {
        main: './index.js',
        nominations: './index.js',
        oldschool: './index.js',
        abc: './index.js',
        future: './index.js',
        beard: './index.js',
        fade: './index.js',
        juniors: './index.js',
        team: './index.js',
        fastfade: './index.js',
        rules: './index.js',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    devServer: {
        open: true,
        host: 'localhost',
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            chunks: ['main']
        }),
        new HtmlWebpackPlugin({
            filename: 'nominations.html',
            template: 'nominations/index.html',
            chunks: ['nominations']
        }),
        new HtmlWebpackPlugin({
            filename: 'oldschool.html',
            template: 'nominations/oldschool.html',
            chunks: ['oldschool']
        }),
        new HtmlWebpackPlugin({
            filename: 'abc.html',
            template: 'nominations/abc.html',
            chunks: ['abc']
        }),
        new HtmlWebpackPlugin({
            filename: 'future.html',
            template: 'nominations/future.html',
            chunks: ['future']
        }),
        new HtmlWebpackPlugin({
            filename: 'beard.html',
            template: 'nominations/beard.html',
            chunks: ['beard']
        }),
        new HtmlWebpackPlugin({
            filename: 'fade.html',
            template: 'nominations/fade.html',
            chunks: ['fade']
        }),
        new HtmlWebpackPlugin({
            filename: 'juniors.html',
            template: 'nominations/juniors.html',
            chunks: ['juniors']
        }),
        new HtmlWebpackPlugin({
            filename: 'team.html',
            template: 'nominations/team.html',
            chunks: ['team']
        }),
        new HtmlWebpackPlugin({
            filename: 'fastfade.html',
            template: 'nominations/fastfade.html',
            chunks: ['fastfade']
        }),
        new HtmlWebpackPlugin({
            filename: 'rules.html',
            template: 'documents/rules.html',
            chunks: ['rules']
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: 'images',
                    to({ context, absoluteFilename }) {
                        return absoluteFilename.replace(context, 'src/images')
                    },
                },
            ],
        }),
    ],
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/i,
                loader: 'babel-loader',
            },
            {
                test: /\.(html)$/,
                include: path.join(__dirname, 'templates'),
                use: {
                    loader: 'html-loader',
                    options: {
                        interpolate: true
                    }
                }
            },
            {
                test: /\.less$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    "less-loader",
                ],
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/i,
                type: 'asset',
                generator: {
                    filename: 'src/fonts/[hash][ext]',
                },
            },
            {
                test: /\.(png|svg|jpeg|jpg|webp)/,
                type: 'asset/resource',
                generator: {
                    filename: 'src/cssimages/[hash][ext]',
                },
            }
        ],
    },
}

module.exports = () => {
    config.plugins.push(new MiniCssExtractPlugin({
        filename: 'src/styles/[name].css',
        chunkFilename: '[id].css',
    }))

    if (isProduction) {
        config.mode = 'production'
    } else {
        config.mode = 'development'
    }
    return config
}
