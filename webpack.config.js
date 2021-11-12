const path = require('path')

module.exports = {
    entry: path.resolve(__dirname, 'client/login', 'index.js'),
    output: {
        path: path.resolve(__dirname, 'hosted'),
        filename: 'loginBundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(jsx|js)$/,
                include: path.resolve(__dirname, 'client'),
                exclude: /node_modules/,
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {
                                "targets": "defaults"
                            }],
                            '@babel/preset-react'
                        ]
                    }
                }]
            }
        ]
    },
    mode: "development"
}