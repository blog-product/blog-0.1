const { exec, escape } = require('./../db/mysql')
const { genPassword } = require('./../utils/crypto')

// 用户登录
const login = async body => {
    // 获取请求参数
    let { username, password } = body
    // 生成加密密码
    password = genPassword(password)
    
    username = escape(username)
    password = escape(password)
    // 编写查询条件
    let sql = `select * from users where username=${username} and password=${password};`
    const rows = await exec(sql)
    return rows[0] || {}
}

// 用户列表
const list = async query => {
    // 获取请求参数
    // let { username, password } = query
    // 编写查询条件
    let sql = `select id, username, realname, create_time from users;`
    const rows = await exec(sql)
    return rows || {}
}

// 用户详情
const detail = async state => {
    // 获取请求参数
	console.log('=======',state)
    let { name } = state.data
    // 编写查询条件
    let sql = `select id, username, realname, create_time from users where username = '${name}';`
	console.log("--==", sql)
    const rows = await exec(sql)
    return rows[0] || {}
}

// 用户添加
const add = async body => {
    // 获取请求参数
    let { username, realname, password } = body
    password = genPassword(password)
    // 编写查询条件
    let sql = `
        INSERT INTO users (username, realname, password) SELECT 
        '${username}', '${realname}', '${password}' FROM DUAL WHERE NOT EXISTS(SELECT * FROM users WHERE username = '${username}');`
    // let sql = `select username from users where username=${username};`
    const rows = await exec(sql)

    console.log("---=,",rows)

    return rows || {}
}

// 用户编辑
const edit = async body => {
    // 获取请求参数
    let { id, username, realname, password } = body
    let sql = ` UPDATE users SET username='${username}', realname='${realname}'`
    if(password) {
        password = genPassword(password)
        sql += `, password='${password}'`
    }
    sql += ` WHERE id='${id}'; `
    const updateData = await exec(sql)
    return updateData.affectedRows > 0 ? true : false
}

// 用户删除
const del = async body => {
    const { id } = body
    let sql = `delete from users where id = ${id};`
    const delData = await exec(sql)
    return delData.affectedRows > 0 ? true : false
}

module.exports = {
    login,
    list,
	detail,
    add,
    edit,
    del
}