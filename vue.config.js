const path = require('path');

// vue.config.js
module.exports = {
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...
        } else {
            // 为开发环境修改配置...
            return {
                resolve: {
                    alias: {
                        '@js': path.resolve(__dirname, './src/assets/js'),
                        '@css': path.resolve(__dirname, './src/assets/css'),
                        '@img': path.resolve(__dirname, './src/assets/img'),
                        '@c': path.resolve(__dirname, './src/assets/components'),
                    }
                }
            }
        }
    }
}