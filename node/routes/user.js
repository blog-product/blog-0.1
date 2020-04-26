const router = require('koa-router')()
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix("/api/server/user")

// 用户登录
router.post('/login', async (ctx, next) => {
    const loginData = await login(ctx.request.body)
    if(loginData && loginData.username) {
        // 设置session
        ctx.session.username = loginData.username
        ctx.session.realname = loginData.realname

        ctx.body = new SuccessModel('0000', '登录成功')
        return
    }
    ctx.body = new ErrorModel('1000', '登录失败')
});

module.exports = router