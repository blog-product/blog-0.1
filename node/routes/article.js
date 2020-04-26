const router = require('koa-router')()
const path = require('path')
const multer = require('koa-multer');//加载koa-multer模块
const {
  getList,
  getDetail,
  addArticle,
  getUpdate,
  changeStatus,
  delArticle
} = require('../controller/article')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix("/api/server/article")

// 上传 图片
var storage = multer.diskStorage({
  //文件保存路径
  destination: function (req, file, cb) {
      cb(null, path.join(__dirname ,'../public/uploads'))
  },
  //修改文件名称
  filename: function(req, file, cb) {
    var fileFormat = (file.originalname).split(".");
    cb(null, Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
})
//文件上传限制
const limits = {
  fields: 10,//非文件字段的数量
  fileSize: 20 * 1024 * 1024,//文件大小 单位 b
  files: 1//文件数量
}
//加载配置
var upload = multer({
  storage, limits
});

// 文章列表
router.get('/list', async (ctx, next) => {
  const listData = await getList(ctx.query)
  console.log('route-list;',listData.total)
  ctx.body = new SuccessModel('0000', listData)
})
// 文章详情
router.get('/detail', async (ctx, next) => {
  const detailData = await getDetail(ctx.query)
  ctx.body = new SuccessModel('0000', detailData)
});
// 文章添加
router.post('/add', async (ctx, next) => {
  const addData = await addArticle(ctx.request.body)
  ctx.body = addData ? new SuccessModel('0000', '新增成功') : new ErrorModel('1000', '新增失败')
});
// 文章更新
router.post('/update', async (ctx, next) => {
  const updateData = await getUpdate(ctx.request.body)
  ctx.body = updateData ? new SuccessModel('0000', '更新成功') : new ErrorModel('1000', '更新失败')
});
// 状态更新
router.post('/status', async (ctx, next) => {
  const statusData = await changeStatus(ctx.request.body)
  ctx.body = statusData ? new SuccessModel('0000', '更新成功') : new ErrorModel('1000', '更新失败')
});
// 文章删除
router.post('/del', async (ctx, next) => {
  const delData = await delArticle(ctx.request.body)
  ctx.body = delData ? new SuccessModel('0000', '删除成功') : new ErrorModel('1000', '删除失败')
});
// 图片上传
router.post('/imgAdd', upload.single('file'), async (ctx, next) => {
  ctx.body = new SuccessModel('0000', ctx.req.file.filename)
})


module.exports = router