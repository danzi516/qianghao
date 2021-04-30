//index.js
const app = getApp()

Page({
  data: {
    showData:'',
    time:'',
    buttonClicked:false,
  },
  
  onLoad() {
  },
  onShow(){
    wx.showLoading({
      title: '加载中...',
    })
    
    wx.cloud.callFunction({
      name: 'grabNumber',
      data: {
        $url: 'getNumber'
      },
      success: res => {
        console.log(res.result.dataList)
        console.log(res.result.openId)
        let num = res.result.dataList.data.findIndex(function (elem, index) {
          if (res.result.openId == elem.open_id && elem.state == 0) {
            return true
          }
        });
        console.log(num)
        if (num!=-1){
          this.setData({
            showData: num + 1,
            time: /\d{4}-\d{1,2}-\d{1,2}/g.exec(res.result.dataList.data[num].register_time),
            buttonClicked: false
          })
        }
        else if (num == -1 && res.result.params.data[0].number==0){
          this.setData({
            showData: '下次再来',
            buttonClicked: false
          })
        }
        else {
          this.setData({
            showData: '点我',
            buttonClicked: true
          }) }
        wx.hideLoading()
      },
      fail: err => {
        console.log(err)
        wx.showToast({
          title: '请稍后再试！',
          duration: 2000
        })
      }
    })
    wx.hideLoading()
  },
  addData(){
    wx.showLoading({
      title: '加载中...',
    })
    wx.cloud.callFunction({
      name: 'grabNumber',
      data: {
        $url: 'addData'
      },
      success: res => {

        if (res.result.code==1){
          this.setData({
            showData: '下次再来',
            buttonClicked: false
          })
        }
        else{
          console.log(res.result.dataList)
          console.log(res.result.openId)
          let num = res.result.dataList.data.findIndex(function (elem, index) {
            if (res.result.openId == elem.open_id && elem.state==0){
                return true
            }
            //return Object.is(res.result.openId, elem.open_id)
          });
          this.setData({
            showData: num + 1,
            time: /\d{4}-\d{1,2}-\d{1,2}/g.exec(res.result.dataList.data[num].register_time),
            buttonClicked: false
          })
        }
        wx.hideLoading()
      },
      fail: err => {
        console.log(err)
        wx.showToast({
          title: '请稍后再试！',
          duration: 2000
        })
        wx.hideLoading()
      }
    })
    
  },
})
