// pages/setting/setting.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userType: '',
    imgSrc: '',
    mobile: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgSrc: app.globalData.imgSrc
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userType: app.globalData.userType
    })
    this.init()
  },
  init() {
    let mobile = app.globalData.userInfo.mobile
    let has_password = app.globalData.has_password
    this.setData({
      mobile: mobile
    })
    if (has_password == 1) {
      this.setData({
        password: '更改密码'
      })
    } else {
      this.setData({
        password: '设置密码'
      })
    }
  },
  // 切换身份
  changeUserType(e) {
    let key = e.currentTarget.dataset.id
    this.setData({
      userType: key
    })
    app.globalData.userType = key
    wx.showToast({
      title: '切换成功',
      mask: true,
      icon: 'success',
      success() {
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      }
    })
  },
  loginOut () {
    if (app.globalData.has_password === 1) {
      wx.showModal({
        title: '提示',
        confirmColor: '#0073ff',
        confirmText: '前往',
        content: '退出前请先设置密码',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '../settingPassword/settingPassword'
            })
          }
        }
      })
    } else {
      wx.reLaunch({
        url: '../login/login'
      })
    }
  },
  // 进入手机号页面
  goSettingPhone() {
      wx.navigateTo({
        url: `../settingPhone/settingPhone?mobile=${this.data.mobile}`
      })
    // }
  },
  goSettingPassword() {
    wx.navigateTo({
      url: '../settingPassword/settingPassword'
    })
  },
  goShouquan() {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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