// pages/myGold/myGold.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    num: '',
    typeStr: 1,
    userType: '',
    listData: [],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userType: app.globalData.userType,
      imgSrc: app.globalData.imgSrc,
      page: 1
    }, () => {
      this.getList()
    })
  },
  // 提现
  goTixian() {
    wx.navigateTo({
      url: '../tixian/tixian'
    })
  },
  // 选择类型
  chooseType(e) {
    let key = e.currentTarget.dataset.id
    this.setData({
      listData: [],
      typeStr: key,
      page: 1
    }, () => {
      this.getList()
    })
  },
  // 获取收支
  getList() {
    let userType = this.data.userType
    wx.request({
      url: `${app.globalData.baseUrl}/Cash/cashLog.html`,
      data: {
        sess_key: app.globalData.sess_key,
        way: this.data.typeStr,
        user_type: userType === 'engineer' ? 1 : userType === 'hr' ? 2 : 3,
        page: this.data.page,
        page_size: 20
      },
      method: 'POST',
      success: (res) => {
        let listData = res.data.bizobj.data
        let data = this.data.listData
        this.setData({
          listData: [...data, ...listData.cash_log],
          num: listData.total_cash,
          page: this.data.page + 1
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
    this.getList()
  }
})