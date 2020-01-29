// pages/settingPhone/settingPhone.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    targetTime: 0,
    clearTimer: false,
    oldMobile: '',
    newMobile: '',
    code: '',
    codeWord: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      oldMobile: options.mobile
    })
    console.log(options)
  },
  // 提交
  confirm () {
    if (this.data.newMobile == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入手机号',
      })
    } else if (this.data.code === ''){
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入验证码',
      })
    } else {
      wx.showLoading({
        mask: true,
        title: '提交中...',
      })
      wx.request({
        url: `${app.globalData.baseUrl}/User/changeMobile.html`,
        data: {
          sess_key: app.globalData.sess_key,
          mobile: this.data.newMobile,
          code: this.data.code
        },
        method: 'POST',
        success: (res) => {
          wx.hideLoading()
          if (res.data.error_code == 0) {
            wx.showToast({
              title: '更改成功',
              mask: true,
              icon: 'success',
              success() {
                setTimeout(() => {
                  let newUserInfo = app.globalData.userInfo.mobile
                  newUserInfo['mobile'] = this.data.newMobile
                  app.globalData.userInfo = newUserInfo
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
  sendCode () {
    if (!this.data.codeWord) {
      let mobile = this.data.newMobile
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
            mobile: mobile,
            type: 2
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
  myLinsterner () {
    this.setData({
      codeWord: false
    })
  },
  initCodeTime () {
    this.setData({
      codeWord: true,
      targetTime: new Date().getTime() + 59000
    });
  },
  // 电话
  newMobileChange(e) {
    this.setData({
      newMobile: e.detail.value
    })
  },
  // 验证码
  codeChange(e) {
    this.setData({
      code: e.detail.value
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

  }
})