// pages/myDelivery/myDelivery.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    tabType: '1',
    typeAll: '全部',
    typeAllBtn: false,
    listData: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgSrc: app.globalData.imgSrc
    })
    this.getDataList()
  },
  // 切换类型
  chooseType(e) {
    let key = e.currentTarget.dataset.id
    this.setData({
      tabType: key,
      typeAllBtn: false
    })
    this.getDataList()
  },
  // 打开筛选
  openTypeAllBtn () {
    this.setData({
      typeAllBtn: true
    })
  },
  // 选择全部或项目或岗位
  chooseAll(e) {
    let key = e.currentTarget.dataset.id
    this.setData({
      typeAll: key,
      typeAllBtn: false
    })
    this.getDataList()
  },
  // 获取数据
  getDataList() {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/apply/applyList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        offer: this.data.tabType,
        type: this.data.typeAll == '项目' ? 2 : this.data.typeAll == '岗位' ? 1 : '',
        page: 1,
        page_size: 99999
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          let listData = res.data.bizobj.data.apply_list
          listData.forEach((el, index) => {
            if (el.max_salary) {
              el['salaryStr'] = Math.round(el.mini_salary / 1000) + 'k-' + Math.round(el.max_salary / 1000) + 'k/月'
            } else {
              el['salaryStr'] = '不限'
            }
          })
          this.setData({
            listData: listData
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
  // 进入岗位详情
  goPostDetail(e) {
    let id = e.currentTarget.dataset.id
    let re_interview_id = e.currentTarget.dataset.ida
    if (this.data.tabType == 3) {
      wx.navigateTo({
        url: `../faceInfo/faceInfo?id=${re_interview_id}&type=1`
      })
    } else {
      wx.navigateTo({
        url: `../postDetail/postDetail?id=${id}`
      })
    }
    
  },
  // 进入项目详情
  goProjectDetail(e) {
    let id = e.currentTarget.dataset.id
    let re_interview_id = e.currentTarget.dataset.ida
    if (this.data.tabType == 3) {
      wx.navigateTo({
        url: `../faceInfo/faceInfo?id=${re_interview_id}&type=2`
      })
    } else {
      wx.navigateTo({
        url: `../projectDetail/projectDetail?id=${id}`
      })
    }
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