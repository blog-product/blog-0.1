const router = require('koa-router')()
const { login, list, detail, add, edit, del } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { setToken } = require("../middleware/tokenCheck")

router.prefix("/api/user")

// 用户登录
router.post('/login', async (ctx, next) => {
    const loginData = await login(ctx.request.body)
    const { username, realname } = loginData
    if(loginData && username) {
        const token = await setToken(username)
        const data = {
            username: realname,
            token
        }
        ctx.body = new SuccessModel('0000', data)
        return
    }
    ctx.body = new ErrorModel('1000', '登录失败')
});

// 用户登出
router.get('/logOut', async (ctx, next) => {
    ctx.body = new ErrorModel('0000', '退出成功')
});

// 用户列表
router.get('/list', async (ctx, next) => {
    console.log(ctx.query)
    const userList = await list(ctx.query)
    ctx.body = new SuccessModel('0000', userList)
});

// 用户详情
router.get('/detail', async (ctx, next) => {
    const userInfo = await detail(ctx.state)
    ctx.body = new SuccessModel('0000', userInfo)
});

// 用户添加
router.post('/add', async (ctx, next) => {
    console.log(ctx.request.body)
    const addresult = await add(ctx.request.body)
    if(addresult.insertId) {
        ctx.body = new SuccessModel('0000', "添加成功")
    } else {
        ctx.body = new ErrorModel('1000', addresult)
    }
});

// 用户编辑
router.post('/edit', async (ctx, next) => {
    console.log(ctx.request.body)
    const editResult = await edit(ctx.request.body)
    if(editResult) {
        ctx.body = new SuccessModel('0000', "修改成功")
    } else {
        ctx.body = new ErrorModel('1000', "修改失败")
    }
});

// 用户删除
router.post('/del', async (ctx, next) => {
    console.log(ctx.request.body)
    const delResult = await del(ctx.request.body)
    if(delResult) {
        ctx.body = new SuccessModel('0000', "删除成功")
    } else {
        ctx.body = new ErrorModel('1000', "删除失败")
    }
});

module.exports = router