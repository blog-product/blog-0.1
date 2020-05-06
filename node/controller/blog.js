const xss = require('xss')
const { exec } = require('../db/mysql')

// 获取文章列表
const getList = async query => {
    // 获取请求参数
    let { author, keyword } = query
    // 编写查询条件
    let sql = `select * from articles where 1=1 `
    if(author) {
        sql += `and author='${author}' `
    }
    if(keyword) {
        sql += `and keyword='%${keyword}%' `
    }
    sql += `order by create_time desc;`
    return await exec(sql)
}

// 获取文章详情 
const getDetail = async query => {
    let { id } = query
    if(id) {
        let sql = `select * from articles where id = ${id};`
        const rows = await exec(sql)
        return rows[0]
    }else {
        return ''
    }
}

// 添加文章
const addBlog = async body => {
    // 获取请求参数
    let { title, des, keyword, content, author } = body
    if(!des) des = ''
    if(!keyword) keyword = ''
    title = xss(title)
    content = xss(content)
    let sql = `
        insert into articles (title, des, keyword, content, author) values 
        ('${title}', '${des}', '${keyword}', '${content}', '${author}');
    `
    const insertData = await exec(sql)
    return insertData.insertId ? true : false
}

// 修改文章
const getUpdate = async body => {
    let { id, title, des, keyword, content } = body
    title = xss(title)
    content = xss(content)
    let sql = ` update articles set title='${title}', des='${des}', keyword='${keyword}', content='${content}' where id='${id}'; `
    const updateData = await exec(sql)
    return updateData.affectedRows > 0 ? true : false
}

// 删除文章
const delBlog = async body => {
    // 获取请求参数
    const { id, author } = body
    let sql = `delete from articles where id = ${id} and author = '${author}';`
    const delData = await exec(sql)
    return delData.affectedRows > 0 ? true : false
}

module.exports = {
    getList,
    getDetail,
    addBlog,
    delBlog,
    getUpdate
}