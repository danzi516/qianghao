// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')
cloud.init() 
exports.main = async (event, context) => {
  var state=true
  const app = new TcbRouter({ event });
  app.router('addData', async (ctx, next) => {
    const db = cloud.database({});
    const _ = db.command

    const data = await db.collection('s_data').where({
      open_id: ctx._req.event.userInfo.openId,
      state:0
    }).count()
    if (data.total == 0){
      await db.collection('s_params').where({
        id: "1558941060",
        number: _.gt(0)
      }).update({
        data: { number: _.inc(-1) }
      }).then(function (d) {
        if (d.stats.updated > 0) {
          
        }
        else {
        ctx.body = { code: 1 }
          state = false
        }
      })
    }
    else {
      state=false}
   
    await next();
  }, async (ctx) => {
    const db = cloud.database({});
    if (state){
      const date = new Date(new Date().getTime() + 28800000)
      await db.collection('s_data').add({
        data: {
          "open_id": ctx._req.event.userInfo.openId,
          "state":0,
          "register_time": date.toLocaleDateString() + " " + date.toLocaleTimeString()
        }
      })
      const dataList = await db.collection('s_data').limit(80).get()
      ctx.body = { code: 0, dataList: dataList, openId: ctx._req.event.userInfo.openId }
    }
   
  })

 
  app.router('getNumber', async (ctx, next) => {
    const db = cloud.database({});
    const dataList = await db.collection('s_data').limit(80).get()
    const params = await db.collection('s_params').get()

    ctx.body = { dataList: dataList, openId: ctx._req.event.userInfo.openId, params: params}
  })



  return app.serve();
}
