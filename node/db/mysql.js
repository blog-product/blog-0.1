const mysql = require('mysql')
const { MYSQL_CONFIG } = require('../config/db')

// 创建连接对象
var pool = mysql.createPool(MYSQL_CONFIG);

// 统一执行sql
const exec = sql => {
    return new Promise((resolve, reject) => {
        // 查询
        pool.getConnection((err, conn) => {
            if (err) {
                reject(err)
            } else {
                conn.query(sql, (err, result) => {
                    if (err) {
                        conn.connect()
                        reject(err)
                    }
                    resolve(result)
                });
                pool.releaseConnection(conn)
            }
        });
    })
}

module.exports =  {
    exec,
    escape: mysql.escape
}
