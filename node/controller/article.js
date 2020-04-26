const xss = require('xss')
const moment = require('moment')
const { exec } = require('../db/mysql')
const { delImg } = require('../utils/common')

// 获取文章列表
const getList = async query => {
    // 获取请求参数
    let { isOpen, username, timeStart, timeEnd, pageNum, pageSize } = query
    // 编写查询条件
    let getTotal = `select count(*) as total from article where isOpen=${isOpen} `
    let getList = `select id, username, last_time, isOpen from article where isOpen=${isOpen} `
    if(username) {
        getTotal += `and username LIKE '%${username}%' `
        getList += `and username LIKE '%${username}%' `
    }
    if(timeStart && timeEnd) {
        getTotal += `and last_time between '${timeStart}' and '${timeEnd}' `
        getList += `and last_time between '${timeStart}' and '${timeEnd}' `
    }
    getTotal += ";"
    getList += `order by last_time desc `
    getList += `limit ${(pageNum-1)*pageSize},${pageSize}; `
    // 查询总数
    const total = await exec(getTotal)
    // 查询分页
    const list = await exec(getList)
    return {
        list,
        ...total[0]
    }
}

// 获取文章详情
const getDetail = async query => {
    let { id } = query
    if(id) {
        let sql = `select * from article where id = ${id};`
        const rows = await exec(sql)
        return rows[0]
    }else {
        return ''
    }
}

// 添加文章
const addArticle = async body => {
    // 获取请求参数
    let { username, phone, des, content, mark, image, last_time, isOpen } = body
    if(!image) image = ""
    isOpen = isOpen ? 1 : 0
    username = xss(username)
    des = xss(des)
    content = xss(content)
    mark = xss(mark)
    const finish_time = isOpen ? moment().format("YYYY-MM-DD") : ""
    // let sql = `
    //     INSERT INTO article (username, phone, des, content, mark, image, last_time, finish_time, isOpen) SELECT 
    //     '${username}', '${phone}', '${des}', '${content}', '${mark}', '${image}', '${last_time}', '${finish_time}', '${isOpen}' FROM DUAL WHERE NOT EXISTS(SELECT * FROM article WHERE username = '${username}');
    // `
    let sql = `
        INSERT INTO article (username, phone, des, content, mark, image, last_time, finish_time, isOpen) values 
        ('${username}', '${phone}', '${des}', '${content}', '${mark}', '${image}', '${last_time}', '${finish_time}', '${isOpen}');
    `
    const insertData = await exec(sql)
    console.log('result;',insertData)
    return insertData.insertId ? true : false
}

// 修改文章
const getUpdate = async body => {
    let { id, username, phone, des, content, mark, image, last_time, isOpen } = body
    if(!image) image = ""
    isOpen = isOpen ? 1 : 0
    username = xss(username)
    des = xss(des)
    content = xss(content)
    mark = xss(mark)
    const finish_time = isOpen ? moment().format("YYYY-MM-DD") : ""
    // let getOtherName = `select count(*) as total from article where username='${username}' and id != ${id};`
    // let searchResult = await exec(getOtherName)
    // if(searchResult[0].total > 0) return false
    let sql = ` UPDATE article SET username='${username}', phone='${phone}', des='${des}', content='${content}', mark='${mark}', image='${image}', last_time='${last_time}', finish_time='${finish_time}', isOpen='${isOpen}' WHERE id='${id}'; `
    const updateData = await exec(sql)
    return updateData.affectedRows > 0 ? true : false
}

// 更新状态
const changeStatus = async body => {
    let { id, isOpen } = body
    isOpen = isOpen ? 1 : 0
    const finish_time = isOpen ? moment().format("YYYY-MM-DD") : ""
    let sql = ` update article set finish_time='${finish_time}', isOpen='${isOpen}' where id='${id}'; `
    const updateData = await exec(sql)
    return updateData.affectedRows > 0 ? true : false
}

// 删除文章
const delArticle = async body => {
    let { image } = await getDetail(body)
    let imgPath = `public/uploads/${image}`
    let delResult = await delImg(imgPath)
    if(delResult) {
        const { id } = body
        let sql = `delete from article where id = ${id};`
        const delData = await exec(sql)
        return delData.affectedRows > 0 ? true : false
    }else {
        return false
    }
}

module.exports = {
    getList,
    getDetail,
    addArticle,
    delArticle,
    getUpdate,
    changeStatus
}