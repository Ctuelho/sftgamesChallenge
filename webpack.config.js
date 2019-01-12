const path = require('path');

module.exports = {
    mode: "production",
    entry: "./src/app.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js",
    },
    devServer: {
        contentBase: './dist',
        port: 5555,
    },
    module: {
        rules: 
        [
            {
                test: /.js?$/,
                exclude: '/node_modules/',
                use: {
                    loader: 'babel-loader',
                    options:{
                        presets: ['es2015'],
                    } 
                },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                loader: "file-loader?name=[name].[ext]"
            },
        ]
    },
};