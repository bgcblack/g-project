const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const {koaBody} = require('koa-body');
const index = require('./routes/index')
const users = require('./routes/users')
import fileRouter from "./controllers/index"
const path = require("path");
let staticPath = path.join(__dirname, '../public'); // 静态地址
let viewsPath = path.join(__dirname, '../views'); // 模板地址



// error handler
onerror(app)
// app.use(koaBody({
//   multipart: true
// }));
 
// middlewares
app.use(bodyparser({
  multipart: true,
  //enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
// 修改了目录结构后此处也要修改
app.use(require('koa-static')(staticPath))
app.use(views(viewsPath, {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(fileRouter.routes(), fileRouter.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
