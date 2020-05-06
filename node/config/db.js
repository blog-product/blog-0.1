const env = process.env.NODE_ENV // 环境变量

// 配置
let MYSQL_CONFIG
let REDIS_CONFIG

if (env === 'dev') {
    MYSQL_CONFIG = {
        host: '47.106.144.123',
        user: 'blog-node',
        password: 'lyzw',
        port: '3344',
        database: 'blog-node'
    }
    REDIS_CONFIG = {
        host: '127.0.0.1',
        port: 6379
    }
}

if (env === 'production') {
    MYSQL_CONFIG = {
        host: '47.106.144.123',
        user: 'blog-node',
        password: 'lyzw',
        port: '3344',
        database: 'blog-node'
    }
    REDIS_CONFIG = {
        host: '47.106.144.123',
        port: 6379
    }
}

module.exports = {
    MYSQL_CONFIG,
    REDIS_CONFIG
}