// pages/goldVote/goldVote.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    imgSrc: '' ,
    maskOnOff: false,
    listData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgSrc: app.globalData.imgSrc
    })
    this.getList()
  },
  openRule () {
    this.setData({
      maskOnOff: true
    })
  },
  closeRule() {
    this.setData({
      maskOnOff: false
    })
  },
  // 获取数据
  getList() {
    wx.request({
      url: `${app.globalData.baseUrl}/Topic/topicList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        page: this.data.page,
        page_size: 20,
        type: 2
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code == 0) {
          let listData = res.data.bizobj.data.topic_list
          listData.forEach((el, index) => {
            el['blue_percent'] = (el.blue_percent * 100).toFixed(2)
            el['red_percent'] = (el.red_percent * 100).toFixed(2)
            if (el.coin_gain != 0) {
              let str = String(el.coin_gain).substr(1, String(el.coin_gain).length - 1)
              if (el.coin_gain > 0) {
                el['coin_gain'] = `获得${str}金币`
              } else {
                el['coin_gain'] = `消耗${str}金币`
              }
            }
          })
          if (listData.length > 0) {
            let oldList = this.data.listData
            this.setData({
              listData: [...oldList, ...listData],
              page: this.data.page + 1
            })
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: res.data.msg,
          })
        }
      },
      fail: (res) => {
        wx.showToast({
          icon: 'none',
          title: '网络请求失败',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '寻猿招聘',
      path: `/pages/index/index`,
      success: res => {
        console.log(res)
      },
      fail: res => {
        console.log(res)
      }
    }
  }
})