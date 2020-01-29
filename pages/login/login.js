// pages/login/login.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    targetTime: 0,
    clearTimer: false,
    codeWord: false,
    imgSrc: '',
    typeBtn: 'code',
    mobile: '',
    code: '',
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
  // 输入手机号
  mobileChange(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  // 输入验证码
  codeChange(e) {
    this.setData({
      code: e.detail.value
    })
  },
  // 输入密码
  passwordChange(e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 忘记密码
  goPassword () {
    wx.navigateTo({
      url: '../settingPassword/settingPassword'
    })
  },
  // 选择方式
  chooseType(e) {
    let key = e.currentTarget.dataset.id
    this.setData({
      typeBtn: key
    })
  },
  // 发送验证码
  sendCode() {
    if (!this.data.codeWord) {
      let mobile = this.data.mobile
      if (mobile == '') {
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '请输入手机号',
        })
      } else {
        wx.showLoading({
          mask: true,
          title: '发送中...',
        })
        wx.request({
          url: `${app.globalData.baseUrl}/Sms/sendProfileSms.html`,
          data: {
            sess_key: app.globalData.sess_key,
            mobile: this.data.mobile,
            type: 1
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
    }
  },
  // 密码登录
  loginPassword() {
    let mobile = this.data.mobile
    let password = this.data.password
    console.log(password)
    if (mobile == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入手机号',
      })
    } else if (password == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入登录密码',
      })
    } else {
      wx.showLoading({
        mask: true,
        title: '登录中...',
      })
      wx.request({
        url: `${app.globalData.baseUrl}/Login/passwordLogin.html`,
        data: {
          sess_key: app.globalData.sess_key,
          mobile: this.data.mobile,
          password: this.data.password
        },
        method: 'POST',
        success: (res) => {
          wx.hideLoading()
          if (res.data.error_code == 0) {
            wx.showToast({
              title: '登录成功',
              mask: true,
              icon: 'success',
              success() {
                setTimeout(() => {
                  wx.redirectTo({
                    url: '../index/index'
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
  // 验证码登录
  loginCode () {

  },
  // 登录
  loginIn () {
    if (this.data.typeBtn === 'password') {
      this.loginPassword()
    } else if (this.data.typeBtn === 'code') {
      this.loginCode()
    }
  },
  // 启动倒计时
  initCodeTime() {
    this.setData({
      codeWord: true,
      targetTime: new Date().getTime() + 59000
    });
  }, 
  // 倒计时结束
  myLinsterner() {
    this.setData({
      codeWord: false
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