const path = require('path')

module.exports = {
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
    mode: "production"
}