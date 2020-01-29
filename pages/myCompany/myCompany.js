// pages/enterpriseInfo/enterpriseInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    company_info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgSrc: app.globalData.imgSrc
    })
    this.getInfo()
  },
  // 获取公司详情
  getInfo() {
    wx.request({
      url: `${app.globalData.baseUrl}/Company/companyInfo.html`,
      data: {
        sess_key: app.globalData.sess_key
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code == 0) {
          let company_info = res.data.bizobj.data.company_info
          if (Array.isArray(company_info)) {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: "未认证公司,后台审核",
              success: (res) => {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          } else{
            this.setData({
              company_info: company_info
            })
          } 
        } else if (res.data.error_code == 1) {
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: res.data.msg,
            success: (res) => {
              wx.navigateBack({
                delta: 1
              })
            }
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
  //编辑
  goEditCompany() {
    wx.navigateTo({
      url: '../editCompany/editCompany?edit=true'
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