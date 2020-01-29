//app.js
App({
  onLaunch: function () {
    // 登录
    wx.login({
      success: res => {
        console.log(res)
        this.loginSesskey(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  loginSesskey(code) {
    wx.request({
      url: `${this.globalData.baseUrl}/Login/login.html`,
      data: {
        code: code
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code == 0) {
          let resData = res.data.bizobj.data
          console.log(resData)
          this.globalData.sess_key = resData.sess_key
          this.globalData.userInfo = resData.user_info || {}
          // this.globalData.has_password = resData.has_password
          // this.globalData.has_password = 2
          // this.globalData.need_auth = resData.need_auth
          // 是否需要强制授权 1: 需要 2: 不需要(不需要授权的情况下用户信息不为空)
          // 用户是否有密码 1: 有密码 2: 无密码
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
  globalData: {
    // baseUrl: 'http://118.31.72.207:3000/mock/16/api',
    baseUrl: 'https://headhunter.pinecc.cn/api',
    sess_key: '',
    need_auth: '',
    has_password: '',
    baseInfo: null,
    userInfo: null,
    imgSrc: '../../images',
    userType: '',
    companyObj: null
  }
})