// pages/renzheng/renzheng.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inviteDate: '选择日期',
    inviteTime: '选择时间',
    address: '',
    name: '',
    phone: '',
    imgSrc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgSrc: app.globalData.imgSrc,
      id: options.id
    })
  },
  // 面试地点
  addressChange(e) {
    this.setData({
      address: e.detail.value
    })
  },
  // 联系人
  nameChange(e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 电话
  phoneChange(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  finish() {
    let inviteDate = this.data.inviteDate
    let inviteTime = this.data.inviteTime
    let address = this.data.address
    let name = this.data.name
    let phone = this.data.phone
    if (inviteDate == '选择日期') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择面试日期',
      })
    } else if (inviteTime == '选择时间') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择面试时间',
      })
    } else if (address == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入面试地点',
      })
    } else if (name == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入联系人',
      })
    } else if (phone == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入电话',
      })
    } else {
      wx.showLoading({
        mask: true,
        title: '提交中...',
      })
      wx.request({
        url: `${app.globalData.baseUrl}/apply/interview.html`,
        data: {
          sess_key: app.globalData.sess_key,
          re_apply_id: this.data.id,
          time: inviteDate + ' ' + inviteTime,
          address: address,
          contract: name,
          mobile: phone
        },
        method: 'POST',
        success: (res) => {
          wx.hideLoading()
          if (res.data.error_code == 0) {
            wx.showToast({
              title: '提交成功',
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
    }
  },
  bindDateChange(e) {
    this.setData({
      inviteDate: e.detail.value
    })
  }, 
  bindTimeChange(e) {
    this.setData({
      inviteTime: e.detail.value
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