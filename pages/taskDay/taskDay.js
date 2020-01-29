// pages/taskDay/taskDay.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    qiandao: false,
    signCount: 0,
    num: 0,
    userType: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSignInfo()
    this.getMoney()
    this.setData({
      userType: app.globalData.userType,
      imgSrc: app.globalData.imgSrc
    })
  },
  // 获取签到信息
  getSignInfo () {
    wx.request({
      url: `${app.globalData.baseUrl}/Sign/signLog.html`,
      data: {
        sess_key: app.globalData.sess_key
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code == 0) {
          let listData = res.data.bizobj.data
          if (listData.sign_count) {
            this.setData({
              signCount: listData.sign_count,
              qiandao: listData.today_sign == 1
            })
          }
          console.log(listData)
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
  // 签到
  qiandaoBtn() {
    if (this.data.qiandao) {
      return false
    }
    wx.showLoading({
      mask: true,
      title: '签到中...',
    })
    let userType = this.data.userType
    wx.request({
      url: `${app.globalData.baseUrl}/Sign/sign.html`,
      data: {
        sess_key: app.globalData.sess_key,
        user_type: userType === 'engineer' ? 1 : userType === 'hr' ? 2 : 3
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          wx.showToast({
            title: '签到成功',
            mask: true,
            icon: 'success',
            success: () => {
              this.getSignInfo()
            }
          })
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
  // 获取收支
  getMoney() {
    let userType = this.data.userType
    wx.request({
      url: `${app.globalData.baseUrl}/Cash/cashLog.html`,
      data: {
        sess_key: app.globalData.sess_key,
        way: 1,
        user_type: userType === 'engineer' ? 1 : userType === 'hr' ? 2 : 3,
        page: 1,
        page_size: 20
      },
      method: 'POST',
      success: (res) => {
        let listData = res.data.bizobj.data
        this.setData({
          num: parseInt(listData.total_cash)
        })
      },
      fail: (res) => {
        wx.showToast({
          icon: 'none',
          title: '网络请求失败',
        })
      }
    })
  },
  // 立即分享
  shareNow () {

  },
  openRule () {

  },
  // 进入微信步数兑换
  goWalk() {
    wx.navigateTo({
      url: '../walk/walk'
    })
  },
  // 进入论坛阅读
  goBbs() {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '该功能暂未开放'
    })
    // wx.redirectTo({
    //   url: '../bbs/bbs'
    // })
  },
  // 进入金币投票
  goGoldVote() {
    wx.navigateTo({
      url: '../goldVote/goldVote'
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
  onShow: function (option) {
    // console.log(shareTicket)
    // wx.getShareInfo({
    //   shareTicket
    // })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    let userType = this.data.userType
    wx.request({
      url: `${app.globalData.baseUrl}/Coin/coinInc.html`,
      data: {
        sess_key: app.globalData.sess_key,
        user_type: userType === 'engineer' ? 1 : userType === 'hr' ? 2 : 3,
        method: 8
      },
      method: 'POST',
      success: (res) => {
      },
      fail: (res) => {
        wx.showToast({
          icon: 'none',
          title: '网络请求失败',
        })
      }
    })
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