// pages/chooseCity/chooseCity.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    chooseActive: 'used',
    btnChoose: null,
    userInfo: null,
    common: null,
    cityList: [],
    areaList: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      imgSrc: app.globalData.imgSrc
    })
    this.getData()
  },
  // 初始化获取数据
  getData () {
    wx.request({
      url: `${app.globalData.baseUrl}/Addr/chooseDistrict.html`,
      data: {
        sess_key: app.globalData.sess_key,
        lat: this.data.userInfo.lat,
        lng: this.data.userInfo.lng
      },
      method: 'POST',
      success: (res) => {
        let resData = res.data.bizobj.data
        this.setData({
          cityList: resData.prov_list,
          common: resData.common
        })
        console.log(resData)
      },
      fail: (res) => {
        wx.showToast({
          icon: 'none',
          title: '网络请求失败',
        })
      }
    })
  },
  // 左侧选择省份
  chooseCity (e) {
    let key = e.currentTarget.dataset.id
    this.setData({
      chooseActive: key
    })
    if (key !== 'used') {
      this.getProv2CityList(key)
    }
  },
  getProv2CityList(code) {
    wx.request({
      url: `${app.globalData.baseUrl}/Addr/prov2CityList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        prov_code: code
      },
      method: 'POST',
      success: (res) => {
        let resData = res.data.bizobj.data
        this.setData({
          areaList: resData.area_list
        })
        console.log(resData)
      },
      fail: (res) => {
        wx.showToast({
          icon: 'none',
          title: '网络请求失败',
        })
      }
    })
  },
  // 选择城市
  chooseBtn(e) {
    let data = e.currentTarget.dataset
    this.setData({
      btnChoose: data.id
    })
    let usrData = app.globalData.userInfo
    usrData.city_code = data.id
    usrData.city_name = data.ida
    app.globalData.userInfo = usrData
    wx.navigateBack({
      delta: 1
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