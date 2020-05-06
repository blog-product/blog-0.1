const router = require('koa-router')()
const {
    getList,
    getDetail,
    addBlog,
    getUpdate,
    delBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('./../middleware/loginCheck')

router.prefix("/api/blog")

// 博客列表
router.get('/list', async (ctx, next) => {
    if (ctx.query.isadmin) {
        // 管理员页面
        if (ctx.session.username == null) {
            ctx.body = new ErrorModel('0001', '请先登录')
            return
        }
        // 强制查询自己的博客
        ctx.query.author = ctx.session.realname
    }
    const listData = await getList(ctx.query)
    ctx.body = new SuccessModel('0000', listData)
})
// 博客详情
router.get('/detail', async (ctx, next) => {
    const detailData = await getDetail(ctx.query)
    ctx.body = new SuccessModel('0000', detailData)
  });
  // 博客添加
  router.post('/add', loginCheck, async (ctx, next) => {
    ctx.request.body.author = ctx.session.realname
    const addData = await addBlog(ctx.request.body)
    ctx.body = addData ? new SuccessModel('0000', '新增成功') : new ErrorModel('1000', '新增失败')
  });
  // 博客更新
  router.post('/update', loginCheck, async (ctx, next) => {
    ctx.request.body.author = ctx.session.realname
    const updateData = await getUpdate(ctx.request.body)
    ctx.body = updateData ? new SuccessModel('0000', '更新成功') : new ErrorModel('1000', '更新失败')
  });
  // 博客删除
  router.post('/del', loginCheck, async (ctx, next) => {
    ctx.request.body.author = ctx.session.realname
    const delData = await delBlog(ctx.request.body)
    ctx.body = delData ? new SuccessModel('0000', '删除成功') : new ErrorModel('1000', '删除失败')
  });


module.exports = router