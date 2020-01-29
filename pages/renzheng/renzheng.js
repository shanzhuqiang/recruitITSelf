// pages/renzheng/renzheng.js
const app = getApp()
let timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    shenfen: '我的身份',
    name: '',
    xingbie: "性别",
    phone: '',
    birthday: '出生年月',
    shenfenKey: '',
    gongsi: "选择公司",
    companyListCach: [],
    companyList: [],
    showCompanyList: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let shenfen = options.shenfen
    this.setData({
      shenfenKey: shenfen,
      shenfen: shenfen == 'engineer' ? 'IT精英' : shenfen == 'hr' ? "企业金主" : "赏金猎人"
    })
    this.setData({
      imgSrc: app.globalData.imgSrc
    })
    if (this.data.shenfenKey === 'hr') {
      this.getCompany()
    }
  },
  // 搜索公司
  comIptChange (e) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      let keyWord = e.detail.value
      let companyListCach = this.data.companyListCach
      let companyList = []
      companyListCach.forEach(el => {
        if (el.name.indexOf(keyWord) != -1) {
          companyList.push(el)
        }
      })
      this.setData({
        companyList: companyList
      })
    }, 300)
  },
  // 获取公司列表
  getCompany () {
    wx.request({
      url: `${app.globalData.baseUrl}/Company/companyList.html`,
      data: {
        sess_key: app.globalData.sess_key
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          this.setData({
            companyListCach: res.data.bizobj.data.company_list,
            companyList: res.data.bizobj.data.company_list
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
  },
  // 输入名字
  getName(e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 输入手机号
  getPhone(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // 联系后台
  bottomBtn() {
    wx.request({
      url: `${app.globalData.baseUrl}/User/getHrServiceMobile.html`,
      data: {
        sess_key: app.globalData.sess_key
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code == 0) {
          let phoneNumber = "010-68698480"
          if (res.data.bizobj.company_info.service_mobile) {
            phoneNumber = res.data.bizobj.company_info.service_mobile
          }
          wx.makePhoneCall({
            phoneNumber: phoneNumber
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
  },
  // 工程师下一步
  nextStep() {
    let shenfen = this.data.shenfen
    let name = this.data.name
    let gongsi = this.data.gongsi
    let phone = this.data.phone
    let xingbie = this.data.xingbie
    let birthday = this.data.birthday
    var reg = /^0?1[3|4|5|6|7|8][0-9]\d{8}$/;
    if (shenfen == '我的身份') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择身份',
      })
    } else if (name == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入真实姓名',
      })
    } else if (xingbie == '性别') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择性别',
      })
    } else if (phone == '' || !reg.test(phone)) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入正确的手机号码',
      })
    } else if (birthday == '出生年月') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择出生年月',
      })
    } else {
      if (this.data.shenfenKey == 'hr') {
        if (gongsi == '选择公司') {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: '请选择公司',
          })
        } else {
          wx.showLoading({
            mask: true,
            title: '认证中...',
          })
          this.applyCompany()
        }
      } else {
        wx.showLoading({
          mask: true,
          title: '认证中...',
        })
        this.identify()
      }
    }
  },
  // 认证公司
  applyCompany () {
    wx.request({
      url: `${app.globalData.baseUrl}/Company/applyCompany.html`,
      data: {
        sess_key: app.globalData.sess_key,
        re_company_id: this.data.gongsiVal
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          this.identify()
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
  },
  // 认证
  identify() {
    let type = this.data.shenfen === 'IT精英' ? 1 : this.data.shenfen === '企业金主' ? 2 : 3
    wx.request({
      url: `${app.globalData.baseUrl}/User/identify.html`,
      data: {
        sess_key: app.globalData.sess_key,
        mobile: this.data.phone,
        type: type,
        gender: this.data.xingbie == '男' ? 1 : 2,
        username: this.data.name,
        birthday: this.data.birthday
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          let shenfenKey = this.data.shenfenKey
          if (shenfenKey == "engineer") {
            let userInfo = app.globalData.userInfo
            userInfo["identity_auth"]["is_engineer"] = 1
            app.globalData.userInfo = userInfo
            app.globalData.userType = "engineer"
            wx.showModal({
              title: '提示',
              content: '认证成功，前往完善简历',
              success(res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../improveResume/improveResume'
                  })
                } else {
                  wx.reLaunch({
                    url: '../index/index'
                  })
                }
              }
            })
          } else if (shenfenKey == 'hr') {
            let userInfo = app.globalData.userInfo
            userInfo["identity_auth"]["is_hr"] = 1
            app.globalData.userInfo = userInfo
            app.globalData.userType = "hr"
            wx.showModal({
              title: '提示',
              content: '关联成功，该公司审核中',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../index/index'
                  })
                }
              }
            })
          } else if (shenfenKey == 'agent') {
            let userInfo = app.globalData.userInfo
            userInfo["identity_auth"]["is_agent"] = 1
            app.globalData.userInfo = userInfo
            app.globalData.userType = "agent"
            wx.showModal({
              title: '提示',
              content: '认证成功',
              showCancel: false,
              success(res) {
                if (res.confirm) {
                  wx.reLaunch({
                    url: '../index/index'
                  })
                }
              }
            })
          }
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
  },
  gotuiguang () {
    wx.navigateTo({
      url: '../spread/spread'
    })
  },
  // hr,经纪人完成认证
  finish() {
    this.nextStep()
  },
  // 关闭遮罩
  toggleShowCompanyList () {
    this.setData({
      showCompanyList: false
    })
  },
  // 选择公司
  chooseCompany(e) {
    this.setData({
      gongsi: e.currentTarget.dataset.name,
      gongsiVal: e.currentTarget.dataset.id,
      showCompanyList: false
    })
  },
  // 打开选择公司
  openChooseCompany () {
    this.setData({
      showCompanyList: true
    })
    // return false
    // let that = this
    // let shenfenList = []
    // let shenfenValList = []
    // this.data.companyList.forEach(el => {
    //   shenfenList.push(el.name)
    //   shenfenValList.push(el.id)
    // })
    // wx.showActionSheet({
    //   itemList: shenfenList,
    //   success(res) {
    //     that.setData({
    //       gongsi: shenfenList[res.tapIndex],
    //       gongsiVal: shenfenValList[res.tapIndex]
    //     })
    //   }
    // })
  },
  // 选择性别
  chooseXingbie() {
    let that = this
    let shenfenList = ["男", "女"]
    wx.showActionSheet({
      itemList: shenfenList,
      success(res) {
        that.setData({
          xingbie: shenfenList[res.tapIndex]
        })
      }
    })
  },
  // 选择生日
  bindDateChange(e) {
    this.setData({
      birthday: e.detail.value
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