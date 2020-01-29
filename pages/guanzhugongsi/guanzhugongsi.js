// pages/guanzhugongsi/guanzhugongsi.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    listData: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgSrc: app.globalData.imgSrc
    })
    this.getList()
  },
  // 进入企业详情
  goEnterpriseInfo(e) {
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: `../enterpriseInfo/enterpriseInfo?id=${e.currentTarget.dataset.id}`
    })
  },
  // 获取关注的公司
  getList() {
    wx.request({
      url: `${app.globalData.baseUrl}/Company/CollectCompanyList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        page: 1,
        page_size: 99999
      },
      method: 'POST',
      success: (res) => {
        let listData = res.data.bizobj.data.company_list
        console.log(listData)
        this.setData({
          listData: listData
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

  }
})