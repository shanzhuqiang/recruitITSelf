// pages/postDetail/postDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    post: false,
    id: '',
    dataInfo: {},
    companyInfo: {},
    interviewInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    console.log(options)
    console.log(options.type)
    this.setData({
      imgSrc: app.globalData.imgSrc,
      id: options.id
    })
    this.getInfo(options.id, options.type)
  },
  // 面试信息
  getInfo(id, type) {
    wx.request({
      url: `${app.globalData.baseUrl}/apply/interviewDetail.html`,
      data: {
        sess_key: app.globalData.sess_key,
        re_apply_id: id
      },
      method: 'POST',
      success: (res) => {
        let data = res.data.bizobj.data.interview_info
        this.setData({
          interviewInfo: data
        })
        this.getCompany(data.re_company_id)
        if (type == 1) {
          // 1是岗位2是项目
          this.getWorkInfo(data.re_job_id)
        } else {
          this.getProjectInfo(data.re_project_id)
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
  // 获取项目详情
  getProjectInfo(id) {
    wx.request({
      url: `${app.globalData.baseUrl}/Project/projectDetail.html`,
      data: {
        sess_key: app.globalData.sess_key,
        id: id
      },
      method: 'POST',
      success: (res) => {
        let data = res.data.bizobj.data.job_info
        if (data.max_salary) {
          data['salaryStr'] = Math.round(data.mini_salary / 1000) + 'k-' + Math.round(data.max_salary / 1000) + 'k/月'
        } else {
          data['salaryStr'] = '不限'
        }
        this.setData({
          dataInfo: data
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
  // 获取岗位详情
  getWorkInfo(id) {
    wx.request({
      url: `${app.globalData.baseUrl}/Work/workDetail.html`,
      data: {
        sess_key: app.globalData.sess_key,
        id: id
      },
      method: 'POST',
      success: (res) => {
        let data = res.data.bizobj.data.job_info
        if (data.max_salary) {
          data['salaryStr'] = Math.round(data.mini_salary / 1000) + 'k-' + Math.round(data.max_salary / 1000) + 'k/月'
        } else {
          data['salaryStr'] = '不限'
        }
        this.setData({
          dataInfo: data
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
  // 获取企业信息
  getCompany(id) {
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
          companyInfo: company_info
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
  // 立即投递
  applyNow() {
    wx.showLoading({
      mask: true,
      title: '投递中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/apply/apply.html`,
      data: {
        sess_key: app.globalData.sess_key,
        re_project_id: this.data.id,
        type: 1
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        wx.showToast({
          title: '投递成功',
          mask: true,
          icon: 'success',
          success() {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          }
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