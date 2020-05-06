const jwt = require("jsonwebtoken");

// 生成token方法
const setToken = (username) => {
    return new Promise((resolve, reject) => {
        const token = jwt.sign({
            name: username
        }, "longyzw",{
            expiresIn: "2h"
        });
        resolve(token)
    }).catch(err => {
        console.error(err)
    })
}

// 解析token方法
const verToken = (token) => {
    return new Promise((resolve, reject) => {
        const userInfo = jwt.verify(token.split(" ")[1], "longyzw")
        resolve(userInfo)
    }).catch(err => {
        console.error(err)
    })
}

module.exports = {
    setToken,
    verToken
}