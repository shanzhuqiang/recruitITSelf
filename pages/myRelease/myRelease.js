// pages/myRelease/myRelease.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    tabType: 'tiezi',
    userType: '',
    projectList: [],
    projectMask: false,
    projectName: '项目',
    projectType: '1',
    quartersList: [],
    gangweiMask: false,
    gangweiName: '岗位',
    gangweiType: '1',
    page: 1,
    bbsList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userType: app.globalData.userType,
      imgSrc: app.globalData.imgSrc
    })
    // 初始化Bbs
    this.initBbs()
    // if (this.data.userType === 'hr') {
    //   wx.showLoading({
    //     mask: true,
    //     title: '加载中...',
    //   })
    // }
  },
  // 切换类型
  chooseType(e) {
    let key = e.currentTarget.dataset.id
    if (key == this.data.tabType && key == 'xiangmu') {
      this.setData({
        projectMask: !this.data.projectMask
      })
    } else if (key == this.data.tabType && key == 'gangwei') {
      this.setData({
        gangweiMask: !this.data.gangweiMask
      })
    } else {
      this.setData({
        tabType: key,
        gangweiName: '岗位',
        projectName: '项目',
        projectType: '1',
        gangweiType: '1',
        projectMask: false,
        gangweiMask: false,
        projectList: [],
        quartersList: [],
        bbsList: [],
        page: 1
      })
      if (key == 'xiangmu') {
        this.initProjectData()
      }
      if (key == 'gangwei') {
        this.initQuartersData()
      }
      if (key == 'tiezi') {
        this.initBbs()
      }
    }
  },
  // 工时核对
  goCheckTime(e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    let company = e.currentTarget.dataset.company
    let hourstatus = e.currentTarget.dataset.hourstatus
    if (hourstatus == 0) {
      wx.showToast({
        icon: 'none',
        title: '未提交工时',
      })
    } else if ( hourstatus == 1) {
      wx.navigateTo({
        url: `../checkTime/checkTime?id=${id}&name=${name}&company=${company}&hourstatus=${hourstatus}&fromStep=1`
      })
    } else if (hourstatus == 2) {
      wx.navigateTo({
        url: `../checkTimeStep/checkTimeStep?id=${id}&name=${name}&company=${company}&hourstatus=${hourstatus}`
      })
    } else if (hourstatus == 3) {
      wx.navigateTo({
        url: `../checkTimeStep/checkTimeStep?id=${id}&name=${name}&company=${company}&hourstatus=${hourstatus}`
      })
    } else if (hourstatus == 4) {
      wx.navigateTo({
        url: `../checkTimePull/checkTimePull?id=${id}&fromStep=1`
      })
    } else if (hourstatus == 5) {
      wx.navigateTo({
        url: `../checkTimeStep/checkTimeStep?id=${id}&name=${name}&company=${company}&hourstatus=${hourstatus}`
      })
    } else if (hourstatus == 6) {
      wx.navigateTo({
        url: `../checkTimeStep/checkTimeStep?id=${id}&name=${name}&company=${company}&hourstatus=${hourstatus}`
      })
    } else if (hourstatus == 7) {
      wx.navigateTo({
        url: `../checkTimePullLast/checkTimePullLast?id=${id}&fromStep=1`
      })
    } else if (hourstatus == 8) {
      wx.navigateTo({
        url: `../checkTimeStep/checkTimeStep?id=${id}&name=${name}&company=${company}&hourstatus=${hourstatus}`
      })
    } else if (hourstatus == 9) {
      wx.navigateTo({
        url: `../checkTimeStep/checkTimeStep?id=${id}&name=${name}&company=${company}&hourstatus=${hourstatus}`
      })
    }
  },
  // 选择项目status
  chooseProject(e) {
    this.setData({
      projectList: [],
      projectName: e.currentTarget.dataset.ida,
      projectType: e.currentTarget.dataset.id,
      projectMask: false,
      page: 1
    })
    this.initProjectData()
  },
  // 选择岗位status
  chooseGangwei(e) {
    this.setData({
      quartersList: [],
      gangweiName: e.currentTarget.dataset.ida,
      gangweiType: e.currentTarget.dataset.id,
      gangweiMask: false,
      page: 1
    })
    this.initQuartersData()
  },
  goProjectDetail(e) {
    wx.navigateTo({
      url: `../projectDetail2/projectDetail2?id=${e.currentTarget.dataset.id}`
    })
  },
  goWordDetail(e) {
    wx.navigateTo({
      url: `../postDetail2/postDetail2?id=${e.currentTarget.dataset.id}`
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
  // 论坛详情
  goBbsInfo(e) {
    wx.navigateTo({
      url: `../bbsInfo/bbsInfo?id=${e.currentTarget.dataset.id}`
    })
  },
  // 我发布的帖子
  initBbs () {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/Post/getMemberPostList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        page: this.data.page,
        page_size: 20
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          let listData = res.data.bizobj.data.post_list
          this.setData({
            bbsList: listData
          })
          console.log(listData)
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
  // 我的发布项目
  initProjectData() {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/Project/projectList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        is_bonus: 2,
        hr_key: app.globalData.sess_key,
        status: this.data.projectType,
        page: this.data.page,
        page_size: 20
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          let listData = res.data.bizobj.data.project_list
          if (listData.length > 0) {
            listData.forEach((el, index) => {
              if (el.salary_type == 1) {
                el['salaryStr'] = el.day_salary + "元/日"
              } else {
                if (el.max_salary) {
                  el['salaryStr'] = Math.round(el.mini_salary / 1000) + 'k-' + Math.round(el.max_salary / 1000) + 'k/月'
                } else {
                  el['salaryStr'] = '不限'
                }
              }
            })
            let oldList = this.data.projectList
            this.setData({
              projectList: [...listData, ...oldList],
              page: this.data.page + 1
            })
          }
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
  // 我发布的岗位
  initQuartersData() {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/Work/workList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        is_bonus: 2,
        hr_key: app.globalData.sess_key,
        status: this.data.gangweiType,
        page: this.data.page,
        page_size: 20
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          let listData = res.data.bizobj.data.job_list
          if (listData.length > 0) {
            listData.forEach((el, index) => {
              if (el.salary_type == 1) {
                el['salaryStr'] = el.day_salary + "元/日"
              } else {
                if (el.max_salary) {
                  el['salaryStr'] = Math.round(el.mini_salary / 1000) + 'k-' + Math.round(el.max_salary / 1000) + 'k/月'
                } else {
                  el['salaryStr'] = '不限'
                }
              }
            })
            let oldList = this.data.quartersList
            this.setData({
              quartersList: [...listData, ...oldList],
              page: this.data.page + 1
            })
          }
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
    if (this.data.tabType === 'xiangmu') {
      this.initProjectData()
    } else if (this.data.tabType === 'gangwei') {
      this.initQuartersData()
    }
  }
})