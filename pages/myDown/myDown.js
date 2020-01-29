// pages/myDown/myDown.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData()
  },
  // 简历详情/面试详情
  goResumeDetail(e) {
    wx.navigateTo({
      url: `../resumeDetail/resumeDetail?id=${e.currentTarget.dataset.id}`
    })
  },
  // 获取列表信息
  getData() {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/resume/resumeDownloadList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        page: 1,
        page_size: 99999
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          let resData = res.data.bizobj.data.resume_list
          resData.forEach((el, index) => {
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
          this.setData({
            listData: resData
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