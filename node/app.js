const Koa = require('koa')
const app = new Koa()
const cors = require('koa2-cors')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')
const koa_jwt = require("koa-jwt")
const { verToken } = require("./middleware/tokenCheck")

const sequelize = require("./db/sequelize")

const blog = require('./routes/blog')
const user = require('./routes/user')

// error handler
onerror(app)

// 处理跨域
app.use(cors())

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 日志环境区分
const ENV = process.env.NODE_ENV
if (ENV != 'production') {
  // 开发/测试环境
  app.use(morgan('dev'));
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(morgan('combined', {
    stream: writeStream
  }));
}

app.use(async(ctx, next)=> {
  var token = ctx.headers.authorization;
  if(token == undefined){
      await next();
  }else{
      verToken(token).then((data)=> {
      //这一步是为了把解析出来的用户信息存入全局state中，这样在其他任一中间价都可以获取到state中的值
          ctx.state = {
              data:data
          };
      })
      await next();
  }
})

app.use(async(ctx, next)=>{
  return next().catch((err) => {
      if (401 == err.status) {
        ctx.status = 401;
          ctx.body = {
              code:401,
              msg:'登录过期，请重新登录'
          }
      } else {
          throw err;
      }
  });
});

app.use(koa_jwt({
secret: "longyzw"
}).unless({
path: ['/api/user/login'] //除了这个地址，其他的URL都需要验证
}));

// routes
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
