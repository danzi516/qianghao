// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database({});
  const _ = db.command
  await db.collection('s_params').where({
    id: "1558941060"
  }).update({
    data: { number: 80 }
  });
  //await db.collection('s_data').remove()
  await db.collection('s_data').where({
    open_id: _.neq(66666)
  }).remove()
}