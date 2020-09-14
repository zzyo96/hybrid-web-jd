const path = require('path');

// vue.config.js
module.exports = {
    devServer: {
        // proxy: {
        //     '/api': {
        //         target: 'http://localhost:8080', //路径指向本地主机地址及端口号
        //         ws: true,
        //         contentBase: path.join(__dirname, 'public'),
        //         changeOrigin: true,
        //         pathRewrite:{
        //             '^/api': '/json' //路径转发代理
        //         }
        //     }
        // }
    },
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            // 为生产环境修改配置...\
            return{
            }
        } else {
            // 为开发环境修改配置...
            // return {
            //     resolve: {
            //         alias: {
            //             '@js': path.resolve(__dirname, './src/assets/js'),
            //             '@css': path.resolve(__dirname, './src/assets/css'),
            //             '@imgs': path.resolve(__dirname, './src/assets/imgs'),
            //             '@c': path.resolve(__dirname, './src/components'),
            //         }
            //     }
            // }
        }

        return {
            resolve: {
                alias: {
                    '@js': path.resolve(__dirname, './src/assets/js'),
                    '@css': path.resolve(__dirname, './src/assets/css'),
                    '@img': path.resolve(__dirname, './src/assets/imgs'),
                    '@c': path.resolve(__dirname, './src/components'),
                }
            }
        }
    }
}