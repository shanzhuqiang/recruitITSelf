// pages/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    firstMask: true,
    imgSrc: '',
    authMask: false,
    noLocation: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSessKeySuccess()
    this.setData({
      imgSrc: app.globalData.imgSrc
    })
  },
  // 认证过直接进入
  goPage() {
    let userInfo = app.globalData.userInfo
    if (userInfo.identity_auth.is_engineer == 1) {
      app.globalData.userType = "engineer"
      wx.redirectTo({
        url: '../home/home'
      })
    } else if (userInfo.identity_auth.is_hr == 1) {
      app.globalData.userType = "hr"
      wx.redirectTo({
        url: '../home/home'
      })
    } else if (userInfo.identity_auth.is_agent == 1) {
      app.globalData.userType = "agent"
      wx.redirectTo({
        url: '../home/home'
      })
    } else {
      this.setData({
        firstMask: false
      })
      this.initLocation()
    }
  },
  // 判断用户信息拿到
  getSessKeySuccess() {
    if (app.globalData.sess_key != '') {
      if (app.globalData.userInfo.nickname && app.globalData.userInfo.lat) {
        this.goPage()
      } else {
        this.setData({
          firstMask: false
        })
        this.initLocation()
      }
    } else {
      setTimeout(() => {
        this.getSessKeySuccess()
      }, 500)
    }
  },
  // 初始化地理信息
  initLocation() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        console.log('位置授权成功回调', res)
        let obj = app.globalData.userInfo || {}
        obj['lat'] = res.latitude
        obj['lng'] = res.longitude
        Object.assign(app.globalData.userInfo, obj)
        this.initUserInfo()
      },
      fail: (res) => {
        this.setData({
          noLocation: true
        })
      }
    })
  },
  // 位置不授权提示弹框
  closeNoLocation() {
    wx.openSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation']) {
          this.initLocation()
          this.setData({
            noLocation: false
          })
        }
      }
    })
  },
  // 授权成功后添加用户信息
  addUserInfo(data) {
    console.log('个人信息', data)
    let obj = app.globalData.userInfo || {}
    obj['avatar'] = data.avatarUrl
    obj['gender'] = data.gender
    obj['nickname'] = data.nickName
    Object.assign(app.globalData.userInfo, obj)
    this.updateUserinfo()
  },
  // 更新用户信息
  updateUserinfo () {
    let data = app.globalData.userInfo
    wx.request({
      url: `${app.globalData.baseUrl}/User/updateUserInfo.html`,
      data: {
        sess_key: app.globalData.sess_key,
        nickname: data.nickname,
        avatar: data.avatar,
        gender: data.gender,
        lat: data.lat,
        lng: data.lng
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code == 0) {
          let userInfo = res.data.bizobj.data.user_info
          app.globalData.userInfo = userInfo
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
  // 初始化用户授权信息
  initUserInfo() {
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.addUserInfo(res.userInfo)
            }
          })
        } else {
          this.setData({
            authMask: true
          })
        }
      }
    })
  },
  // 用户授权结果回调
  bindgetuserinfo(res) {
    if (res.detail.errMsg != "getUserInfo:fail auth deny") {
      this.setData({
        authMask: false
      })
      this.addUserInfo(res.detail.userInfo)
    }
  },
  // 找兼职
  goHomePage () {
    if (app.globalData.userInfo.identity_auth.is_engineer == 1) {
      app.globalData.userType = "engineer"
      wx.redirectTo({
        url: '../home/home'
      })
    } else {
      wx.navigateTo({
        url: '../renzheng/renzheng?shenfen=engineer'
      }) 
    }
  },
  goHomePage2() {
    if (app.globalData.userInfo.identity_auth.is_hr == 1) {
      app.globalData.userType = "hr"
      wx.redirectTo({
        url: '../home/home'
      })
    } else {
      wx.navigateTo({
        url: '../renzheng/renzheng?shenfen=hr'
      })
    }
  },
  goHomePage3() {
    if (app.globalData.userInfo.identity_auth.is_agent == 1) {
      app.globalData.userType = "agent"
      wx.redirectTo({
        url: '../home/home'
      })
    } else {
      wx.navigateTo({
        url: '../renzheng/renzheng?shenfen=agent'
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