// pages/improveResume/improveResume.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    resumeInfo: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgSrc: app.globalData.imgSrc
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDetail()
  },
  // 返回
  finish () {
    if (this.data.resumeInfo.user_info.mobile) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请先完善简历'
      })
    }
  },
  // 获取简历详情
  getDetail() {
    wx.request({
      url: `${app.globalData.baseUrl}/Resume/resumeDetail.html`,
      data: {
        sess_key: app.globalData.sess_key
      },
      method: 'POST',
      success: (res) => {
        let resData = res.data.bizobj.data.resume_info
        let year = 1000 * 60 * 60 * 24 * 365;
        let now = new Date();
        let birthday = new Date(resData.user_info.birthday);
        let workStartTime = new Date(resData.user_info.work_begin_time);
        let age = parseInt((now - birthday) / year);
        let workTime = parseInt((now - workStartTime) / year);
        if (resData.user_info.work_begin_time) {
          resData.user_info['workTime'] = workTime + '年'
        } else {
          resData.user_info['workTime'] = '未知'
        }
        if (resData.user_info.birthday) {
          resData.user_info['birthday2'] = age + '岁'
        } else {
          resData.user_info['birthday2'] = '未知'
        }
        app.globalData.baseInfo = resData
        this.setData({
          resumeInfo: resData
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
  // 项目经历
  goProjectHistory(e) {
    let key = e.currentTarget.dataset.id
    if (key === 'null') {
      app.globalData.baseInfo = {}
    }
    wx.navigateTo({
      url: `../projectHistory/projectHistory?id=${e.currentTarget.dataset.id}`
    })
  },
  // 教育经历
  goEducation(e) {
    let key = e.currentTarget.dataset.id
    if (key === 'null') {
      app.globalData.baseInfo = {}
    }
    wx.navigateTo({
      url: `../education/education?id=${key}`
    })
  },
  // 编辑基本信息
  goBaseInfo () {
    wx.navigateTo({
      url: '../baseInfo/baseInfo'
    })
  },
  // 工作经历
  goWorkHistory(e) {
    let key = e.currentTarget.dataset.id
    if (key === 'null') {
      app.globalData.baseInfo = {}
    }
    wx.navigateTo({
      url: `../workHistory/workHistory?id=${key}`
    })
  },
  // 自我描述
  goDesMyself() {
    wx.navigateTo({
      url: '../desMyself/desMyself'
    })
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

  }
})