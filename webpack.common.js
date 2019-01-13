const path = require('path');

module.exports = {
    entry: "./src/app.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js",
        publicPath: '/dist/'
    },
    module: {
        rules: 
        [
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                //loader: "file-loader?name=[name].[ext]"
                use: [
                    'file-loader'
                ]
            },
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
        ]
    },
};