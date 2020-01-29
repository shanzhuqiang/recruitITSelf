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
    listData: []
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
      imgSrc: app.globalData.imgSrc
    }, () => {
      this.getList()
    })
  },
  // 充值
  goRecharge() {
    wx.navigateTo({
      url: '../recharge/recharge'
    })
  },

  // 提现
  goTixian() {
    wx.navigateTo({
      url: `../tixian/tixian?totalCoin=${this.data.num}`
    })
  },
  // 选择类型
  chooseType(e) {
    let key = e.currentTarget.dataset.id
    this.setData({
      typeStr: key
    }, () => {
      this.getList()
    })
  },
  // 获取收支
  getList() {
    let userType = this.data.userType
    wx.request({
      url: `${app.globalData.baseUrl}/Coin/coinLog.html`,
      data: {
        sess_key: app.globalData.sess_key,
        way: this.data.typeStr,
        user_type: userType === 'engineer' ? 1 : userType === 'hr' ? 2 : 3
      },
      method: 'POST',
      success: (res) => {
        let listData = res.data.bizobj.data
        console.log(listData)
        this.setData({
          listData: listData.coin_log,
          num: listData.total_coin
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

  }
})