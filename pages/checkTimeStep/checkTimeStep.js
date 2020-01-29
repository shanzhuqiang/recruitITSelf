// pages/checkTimeStep/checkTimeStep.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    success: false,
    current: 0,
    company: '',
    name: '',
    start_time: '',
    end_time: '',
    content: '',
    id: '',
    userType: '',
    hourstatus: '',
    images: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      userType: app.globalData.userType,
      imgSrc: app.globalData.imgSrc,
      company: options.company,
      id: options.id,
      name: options.name,
      hourstatus: options.hourstatus
    }, () => {
      this.getDetail()
      this.judgeStatus(options)
    })
  },
  judgeStatus(options) {
    let hourstatus = this.data.hourstatus
    if (hourstatus == 2) {
      this.setData({
        success: true
      })
    } else if (hourstatus == 5) {
      this.setData({
        success: true,
        current: 1
      })
    } else if (hourstatus == 6) {
      this.setData({
        current: 1
      })
    } else if (hourstatus == 8) {
      this.setData({
        success: true,
        current: 2
      })
    } else if (hourstatus == 9) {
      this.setData({
        current: 2
      })
    }
  },
  // 获取工时核对数据
  getDetail () {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/Project/hourSubmitInfo.html`,
      data: {
        sess_key: app.globalData.sess_key,
        re_apply_mission_id: this.data.id
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          let resData = res.data.bizobj.data.info
          this.setData({
            start_time: resData.start_time,
            end_time: resData.end_time,
            content: resData.content || "",
            images: resData.images
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
  // 完成1/2
  finishHalf () {
    wx.navigateTo({
      url: `../checkTimePull/checkTimePull?id=${this.data.id}&fromStep=2`
    })
  },
  // 第一步修改
  stepOneFail() {
    wx.navigateTo({
      url: `../checkTime/checkTime?id=${this.data.id}&name=${this.data.name}&company=${this.data.company}&hourstatus=0&fromStep=2`
    })
  },
  // 第二步修改
  stepTwoFail() {
    wx.navigateTo({
      url: `../checkTimePull/checkTimePull?id=${this.data.id}&images=${this.data.images}&content=${this.data.content}&fromStep=3`
    })
  },
  // 项目结束
  finishHalfLast() {
    wx.navigateTo({
      url: `../checkTimePullLast/checkTimePullLast?id=${this.data.id}&fromStep=2`
    })
  },
  // 三步修改
  stepLastFail() {
    wx.navigateTo({
      url: `../checkTimePullLast/checkTimePullLast?id=${this.data.id}&images=${this.data.images}&content=${this.data.content}&fromStep=3`
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