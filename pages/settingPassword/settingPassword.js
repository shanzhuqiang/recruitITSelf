// pages/settingPassword/settingPassword.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mobile: '',
    targetTime: 0,
    clearTimer: false,
    code: '',
    codeWord: false,
    password1: '',
    password2: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let mobile = app.globalData.userInfo.mobile
    this.setData({
      mobile: mobile
    })
  },
  // 提交
  confirm () {
    if (this.data.code === '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入验证码',
      })
    } else if (this.data.password1 == '' || this.data.password2 === '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入密码',
      })
    } else if (this.data.password1 != this.data.password2) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请确认两次密码一次',
      })
    } else {
      wx.showLoading({
        mask: true,
        title: '提交中...',
      })
      wx.request({
        url: `${app.globalData.baseUrl}/User/changePass.html`,
        data: {
          sess_key: app.globalData.sess_key,
          mobile: this.data.mobile,
          code: this.data.code,
          new_pass: this.data.password1,
          confirm_pass: this.data.password2
        },
        method: 'POST',
        success: (res) => {
          wx.hideLoading()
          if (res.data.error_code == 0) {
            wx.showToast({
              title: '设置成功',
              mask: true,
              icon: 'success',
              success() {
                setTimeout(() => {
                  app.globalData.has_password = 1
                  wx.navigateBack({
                    delta: 1
                  })
                }, 1500)
              }
            })
          } else {
            wx.showModal({
              showCancel: false,
              title: '提示',
              content: res.data.msg,
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
    }
  },
  // 发送验证码
  sendCode() {
    if (!this.data.codeWord) {
      wx.showLoading({
        mask: true,
        title: '发送中...',
      })
      wx.request({
        url: `${app.globalData.baseUrl}/Sms/sendProfileSms.html`,
        data: {
          sess_key: app.globalData.sess_key,
          mobile: this.data.mobile,
          type: 3
        },
        method: 'POST',
        success: (res) => {
          wx.hideLoading()
          if (res.data.error_code == 0) {
            this.initCodeTime()
            wx.showToast({
              title: '发送成功',
              mask: true,
              icon: 'success'
            })
          } else {
            wx.showModal({
              showCancel: false,
              title: '提示',
              content: res.data.msg,
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
    }
  },
  myLinsterner() {
    this.setData({
      codeWord: false
    })
  },
  initCodeTime() {
    this.setData({
      codeWord: true,
      targetTime: new Date().getTime() + 59000
    });
  }, 
  // 验证码
  codeChange(e) {
    this.setData({
      code: e.detail.value
    })
  },
  // 密码
  password1Change(e) {
    this.setData({
      password1: e.detail.value
    })
  },
  // 确认密码
  password2Change(e) {
    this.setData({
      password2: e.detail.value
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
    this.setData({
      clearTimer: true
    })
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
})