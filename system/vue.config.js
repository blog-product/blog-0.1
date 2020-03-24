let path = require('path')

// 路径处理
function resolve(dir) {
    return path.join(__dirname, dir)
}


module.exports = {
    lintOnSave: 'warning', // eslint在保存时提示警告
    publicPath: process.env.NODE_ENV === "production" ? './' : '/',
    productionSourceMap: false,
    // 启动配置项
    devServer: {
        host: '0.0.0.0',
        port: 9000,
        open: false,
        hotOnly: true
    },

    chainWebpack: config => {
        config.resolve.alias
            .set('@', resolve('./src'))
    }
}