// pages/walk/walk.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    walkNum: 0,
    maskOnOff: false,
    needAuto: false,
    ruleOnOff: false,
    money: 0,
    lessWalk: false,
    getMoneySuccess: false,
    userType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWeRunData()
    this.setData({
      userType: app.globalData.userType,
      imgSrc: app.globalData.imgSrc
    })
  },
  getWeRunData () {
    wx.getWeRunData({
      success: (res) => {
        this.getUserStep(res.encryptedData, res.iv)
      }
    })
  },
  // 解密获取步数
  getUserStep(encryptedData, iv) {
    wx.request({
      url: `${app.globalData.baseUrl}/User/getUserStep.html`,
      data: {
        sess_key: app.globalData.sess_key,
        encryptedData: encryptedData,
        iv: iv
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code == 0) {
          // let today_step = res.data.bizobj.today_step
          let today_step = 2499
          this.setData({
            walkNum: today_step,
            money: parseInt(today_step / 500)
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
  // 规则说明
  openRule () {
    this.setData({
      ruleOnOff: true
    })
  },
  closeRuleOnOff() {
    this.setData({
      ruleOnOff: false
    })
  },
  // 立即邀请
  yaoqingNow() {
    this.setData({
      maskOnOff: true
    })
  },
  // 立即邀请
  closeMask() {
    this.setData({
      maskOnOff: false
    })
  },
  // 关闭未授权点击兑换,弹出授权
  closeNoAuto() {
    this.setData({
      needAuto: false
    })
  },
  // 未授权点击兑换,弹出授权
  openAuto() {
    wx.openSetting({
      success: (res) => {
        if (res.authSetting['scope.werun']) {
          console.log(res)
          this.getWeRunData()
          this.setData({
            needAuto: false
          })
        }
      }
    })
  },
  // 步数不够提示
  closeLessWalk() {
    this.setData({
      lessWalk: false
    })
  },
  // 确认兑换
  closeGetMoneySuccess() {
    wx.showLoading({
      mask: true,
      title: '兑换中...',
    })
    let userType = this.data.userType
    wx.request({
      url: `${app.globalData.baseUrl}/Coin/coinInc.html`,
      data: {
        sess_key: app.globalData.sess_key,
        user_type: userType === 'engineer' ? 1 : userType === 'hr' ? 2 : 3,
        method: 9,
        coin_num: this.data.money
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          wx.showToast({
            title: '兑换成功',
            mask: true,
            icon: 'success',
            success: () => {
              this.setData({
                getMoneySuccess: false
              })
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
  // 点击步数兑换
  shouquan() {
    if (this.data.walkNum == 0) {
      this.setData({
        needAuto: true
      })
    } else if (this.data.walkNum < 500) {
      this.setData({
        lessWalk: true
      })
    } else if (this.data.walkNum >= 500) {
      this.setData({
        getMoneySuccess: true
      })
    }
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