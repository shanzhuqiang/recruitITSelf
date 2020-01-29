// pages/vip/vip.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userType: '',
    imgSrc: '',
    active: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userType: app.globalData.userType,
      imgSrc: app.globalData.imgSrc
    })
  },
  // 选择包年
  chooseType() {
    this.setData({
      active: 1
    })
  },
  // 选择包月
  chooseType2() {
    this.setData({
      active: 2
    })
  },
  // 确认充值
  confirm() {
    wx.showLoading({
      mask: true,
      title: '充值中...',
    })
    let userType = this.data.userType
    wx.request({
      url: `${app.globalData.baseUrl}/Weixinpay/payMember.html`,
      data: {
        sess_key: app.globalData.sess_key,
        paytype: 1,
        type: this.data.active,
        user_type: userType === 'engineer' ? 1 : userType === 'hr' ? 2 : 3
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          wx.showToast({
            title: '充值成功',
            mask: true,
            icon: 'success',
            success: () => {
              wx.navigateBack({
                delta: 1
              })
            }
          })
        } else if (res.data.error_code == 1) {
          this.wechartPay(res.data.bizobj.data.wxconfig)
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
  // 微信支付
  wechartPay(data) {
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: 'MD5',
      paySign: data.paySign,
      success: (res) => {
        wx.showToast({
          title: '充值成功',
          mask: true,
          icon: 'success'
        })
      },
      fail(res) { }
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

  }
})