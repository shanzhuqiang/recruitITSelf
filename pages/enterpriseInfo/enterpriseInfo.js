// pages/enterpriseInfo/enterpriseInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userType: '',
    imgSrc: '',
    tabCurrent: 'gongsi',
    guanzhuOnOff: false,
    company_info: {},
    projectList: [],
    quartersList: [],
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      userType: app.globalData.userType,
      imgSrc: app.globalData.imgSrc
    })
    this.getInfo(options.id)
    this.getProjectList(options.id)
    this.getQuartersList(options.id)
  },
  // 进入岗位详情
  goPostDetail(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: `../postDetail/postDetail?id=${e.currentTarget.dataset.id}`
    })
  },
  // 进入项目详情
  goProjectDetail(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: `../projectDetail/projectDetail?id=${e.currentTarget.dataset.id}`
    })
  },
  // 获取公司详情
  getInfo (id) {
    wx.request({
      url: `${app.globalData.baseUrl}/Company/companyInfo.html`,
      data: {
        sess_key: app.globalData.sess_key,
        id: id
      },
      method: 'POST',
      success: (res) => {
        let company_info = res.data.bizobj.data.company_info
        this.setData({
          guanzhuOnOff: company_info.attention == 1,
          company_info: company_info
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
  // 获取在招岗位
  getQuartersList(id) {
    wx.request({
      url: `${app.globalData.baseUrl}/Work/workList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        is_bonus: 2,
        re_company_id: id,
        page: 1,
        page_size: 99999
      },
      method: 'POST',
      success: (res) => {
        let listData = res.data.bizobj.data.job_list
        console.log(listData)
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
  // 获取在招项目
  getProjectList(id) {
    wx.request({
      url: `${app.globalData.baseUrl}/Project/projectList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        is_bonus: 2,
        re_company_id: id,
        page: 1,
        page_size: 99999
      },
      method: 'POST',
      success: (res) => {
        let listData = res.data.bizobj.data.project_list
        console.log(listData)
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
  // 关注/取消关注点击
  guanzhuClick () {
    if (!this.data.guanzhuOnOff) {
      this.gunzhuOn()
    } else {
      this.gunzhuOff()
    }
  },
  // 关注
  gunzhuOn() {
    wx.showLoading({
      mask: true,
      title: '关注中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/company/collectCompany.html`,
      data: {
        sess_key: app.globalData.sess_key,
        re_company_id: this.data.id
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code == 0) {
          wx.hideLoading()
          wx.showToast({
            title: '关注成功',
            mask: true,
            icon: 'success'
          })
          this.setData({
            guanzhuOnOff: true
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
  // 取消关注
  gunzhuOff() {
    wx.showLoading({
      mask: true,
      title: '取消中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/company/unCollectCompany.html`,
      data: {
        sess_key: app.globalData.sess_key,
        re_company_id: this.data.id
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code == 0) {
          wx.hideLoading()
          wx.showToast({
            title: '取消成功',
            mask: true,
            icon: 'success'
          })
          this.setData({
            guanzhuOnOff: false
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
  // 切换tab
  changeTabs(e) {
    let tabCurrent = e.currentTarget.dataset.id
    this.setData({
      tabCurrent: tabCurrent
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