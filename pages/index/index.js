// pages/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    authMask: false,
    noLocation: false,
    // home
    imgSrc: '',
    userInfo:  null,
    bannerImg: [{ url: '../../images/banner1.png', title: "与时间赛跑，提升企业招聘效率" }, { url: '../../images/banner2.jpg', title: "闲置资源变现，让你的付出获得更多回报" }, { url: '../../images/banner3.jpg', title: "伯乐常在，让更多人发现你的价值" }],
    titleChoosed: 'project',
    projectList: [],
    quartersList: [],
    talentResumeList: [],
    userType: '',
    releaseMark: false,
    // getPhoneMaskOnOff: true
    getPhoneMaskOnOff: false,
    unReadNum: 0,
    basePage: '',
    cityName: '全国',
    cityCode: '',
    firstBtn: true
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 工程师加载项目和岗位
    this.getUnRead()
    // 初始化
    this.initTimes()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgSrc: app.globalData.imgSrc
    })
    // 初始化
    this.getSessKeySuccess()
  },
  initTimes() {
    // 拿到登陆信息
    if (app.globalData.sess_key != '') {
      let userInfo = app.globalData.userInfo
      this.setData({
        userInfo: app.globalData.userInfo
      })
      if (!this.data.firstBtn) {
        this.setData({
          cityName: app.globalData.userInfo.city_name,
          cityCode: app.globalData.userInfo.city_code
        })
      }
      console.log("首页", userInfo)
      // 认证过了
      let userType = ""
      if (userInfo.identity_auth) {
        if (userInfo.identity_auth.is_engineer == 1) {
          userType = "engineer"
          app.globalData.userType = userType
          this.setData({
            userType: userType,
            basePage: 'two'
          })
          this.initProjectData()
          this.initQuartersData()
        } else if (userInfo.identity_auth.is_hr == 1) {
          userType = "hr"
          app.globalData.userType = userType
          this.setData({
            userType: userType,
            basePage: 'two'
          })
          this.initResumeData()
        } else if (userInfo.identity_auth.is_agent == 1) {
          userType = "agent"
          app.globalData.userType = userType
          this.setData({
            userType: userType,
            basePage: 'two'
          })
          this.initResumeData()
        } else {
          this.setData({
            basePage: 'one'
          })
        }
      } else {
        this.setData({
          basePage: 'one'
        })
      }
      this.setData({
        firstBtn: false
      })
    } else {
      setTimeout(() => {
        this.initTimes()
      }, 100)
    }
  },
  // 判断用户信息拿到
  getSessKeySuccess() {
    // 拿到登陆信息
    if (app.globalData.sess_key != '') {
      this.initLocation()
    } else {
      setTimeout(() => {
        this.getSessKeySuccess()
      }, 100)
    }
  },
  // 初始化地理信息
  initLocation() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
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
    this.updateUserinfo(data)
  },
  // 更新用户信息
  updateUserinfo(data) {
    let data2 = app.globalData.userInfo
    wx.request({
      url: `${app.globalData.baseUrl}/User/updateUserInfo.html`,
      data: {
        sess_key: app.globalData.sess_key,
        nickname: data.nickName,
        avatar: data.avatarUrl,
        gender: data.gender,
        lat: data2.lat,
        lng: data2.lng
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code == 0) {
          let userInfo = res.data.bizobj.data.user_info
          app.globalData.userInfo = userInfo
          this.setData({
            userInfo: userInfo
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
  // 初始化用户授权信息
  initUserInfo() {
    wx.getSetting({
      success: res => {
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
  getUnRead () {
    if (app.globalData.sess_key) {
      wx.request({
        url: `${app.globalData.baseUrl}/notice/noticeCount.html`,
        data: {
          sess_key: app.globalData.sess_key
        },
        method: 'POST',
        success: (res) => {
          this.setData({
            unReadNum: res.data.bizobj.data.new_message
          })
        },
        fail: (res) => {
          wx.showToast({
            icon: 'none',
            title: '网络请求失败',
          })
        }
      })
    } else {
      setTimeout(() => {
        this.getUnRead()
      }, 100)
    }
  },
  // 前往认证
  goHomePage(e) {
    wx.navigateTo({
      url: `../renzheng/renzheng?shenfen=${e.currentTarget.dataset.id}`
    })
  },
  // getPhoneNumber(e) {
  //   if (e.detail.errMsg === 'getPhoneNumber:ok') {
  //     this.setData({
  //       getPhoneMaskOnOff: false
  //     })
  //     console.log(e)
  //     console.log(e.detail.errMsg)
  //     console.log(e.detail.iv)
  //     console.log(e.detail.encryptedData)
  //   }
  // },
  // 进入赏金平台
  goBountyPlatform() {
    if (this.data.userType === 'agent') {
      wx.redirectTo({
        url: '../bountyPlatform/bountyPlatform'
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '该功能仅经纪人可用'
      })
    }
  },
  // 发布帖子
  goReleaseBbs() {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '该功能暂未开放'
    })
    // wx.navigateTo({
    //   url: '../releaseBbs/releaseBbs'
    // })
    // this.setData({
    //   releaseMark: false
    // })
  },
  // 发布岗位
  goReleaseGangwei() {
    wx.navigateTo({
      url: '../releaseGangwei/releaseGangwei'
    })
    this.setData({
      releaseMark: false
    })
  },
  // 发布项目
  goReleaseProject() {
    wx.navigateTo({
      url: '../releaseProject/releaseProject'
    })
    this.setData({
      releaseMark: false
    })
  },
  // 发布
  goRelease() {
    this.setData({
      releaseMark: true
    })
  },
  closeRelease() {
    this.setData({
      releaseMark: false
    })
  },
  // 进入论坛
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
  // 进入我的
  goMy() {
    wx.redirectTo({
      url: '../my/my'
    })
  },
  // 简历
  goResumeDetail(e) {
    wx.navigateTo({
      url: `../resumeDetail/resumeDetail?id=${e.currentTarget.dataset.id}`
    })
  },
  // 岗位信息
  goPostDetail(e) {
    wx.navigateTo({
      url: `../postDetail/postDetail?id=${e.currentTarget.dataset.id}`
    })
  },
  // 项目信息
  goProjectDetail(e) {
    wx.navigateTo({
        url: `../projectDetail/projectDetail?id=${e.currentTarget.dataset.id}`
    })
  },
  // 最新项目初始化
  initProjectData() {
    wx.request({
      url: `${app.globalData.baseUrl}/Project/projectList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        // city_code: this.data.userInfo.city_code,
        city_code: this.data.cityCode,
        is_bonus: 2,
        sort: 1,
        page: 1,
        page_size: 20
      },
      method: 'POST',
      success: (res) => {
        let listData = res.data.bizobj.data.project_list
        listData.forEach((el, index) => {
          if (el.max_salary) {
            el['salaryStr'] = Math.round(el.mini_salary / 1000) + 'k-' + Math.round(el.max_salary / 1000) + 'k/月'
          } else {
            el['salaryStr'] = '不限'
          }
        })
        this.setData({
          projectList: listData
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
  // 最新岗位初始化
  initQuartersData() {
    wx.request({
      url: `${app.globalData.baseUrl}/Work/workList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        education: "1",
        // city_code: this.data.userInfo.city_code,
        city_code: this.data.cityCode,
        is_bonus: 2,
        sort: 1,
        page: 1,
        page_size: 20
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        let listData = res.data.bizobj.data.job_list
        listData.forEach((el, index) => {
          if (el.max_salary) {
            el['salaryStr'] = Math.round(el.mini_salary / 1000) + 'k-' + Math.round(el.max_salary / 1000) + 'k/月'
          } else {
            el['salaryStr'] = '不限'
          }
        })
        this.setData({
          quartersList: listData
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
  // 最新简历初始化
  initResumeData () {
    wx.request({
      url: `${app.globalData.baseUrl}/Resume/resumeList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        // city_code: this.data.userInfo.city_code,
        city_code: this.data.cityCode,
        sort: 1,
        page: 1,
        page_size: 20
      },
      method: 'POST',
      success: (res) => {
        let listData = res.data.bizobj.data.resume_list
        listData.forEach((el, index) => {
          if (el.max_salary) {
            el['salaryStr'] = Math.round(el.mini_salary / 1000) + 'k-' + Math.round(el.max_salary / 1000) + 'k/月'
          } else {
            el['salaryStr'] = '不限'
          }
        })
        this.setData({
          talentResumeList: listData
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
  // title切换
  chooseTitle (e) {
    let key = e.currentTarget.dataset.id
    this.setData({
      titleChoosed: key
    })
  },
  // 搜索
  goHomeSearch () {
    if (this.data.userType === 'engineer') {
      wx.navigateTo({
        url: '../searchFirst/searchFirst'
      })
    // } else if (this.data.userType === 'hr') {
     } else {
       wx.navigateTo({
        url: '../searchSecond/searchSecond'
      })
    }
  },
  // 切换城市
  goChooseCity() {
    wx.navigateTo({
      url: '../chooseCity/chooseCity'
    })
  },
  // 平台推广
  goSpread() {
    wx.navigateTo({
      url: '../spread/spread'
    })
  },
  // 金币投票
  goGoldVote() {
    wx.navigateTo({
      url: '../goldVote/goldVote'
    })
  },
  // 名企专区
  goEnterprise() {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '该功能暂未开放'
    })
    // wx.navigateTo({
    //   url: '../enterprise/enterprise'
    // })
  },
  // 职位精选
  goGoodJob() {
    wx.navigateTo({
      url: '../goodJob/goodJob'
    })
  },
  // 项目大厅
  goProjectHall() {
    wx.navigateTo({
      url: '../projectHall/projectHall'
    })
  },
  // 人才简历
  goTalentResume() {
    if (this.data.userType === 'engineer') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '当前身份不可查看',
      })
    } else {
      wx.navigateTo({
        url: '../talentResume/talentResume'
      })
    }
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '寻猿招聘',
      path: `/pages/index/index`
    }
  }
})