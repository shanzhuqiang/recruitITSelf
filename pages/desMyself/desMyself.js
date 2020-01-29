// pages/gangweizhize/gangweizhize.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyVal: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let baseInfo = app.globalData.baseInfo.user_info
    console.log(baseInfo.self_introduction)
    this.setData({
      keyVal: baseInfo.self_introduction
    })
  },
  // 输入框输入内容
  iptChange(e) {
    let val = e.detail.value
    this.setData({
      keyVal: val
    })
  },
  // 保存自我描述
  saveBtn() {
    let keyVal = this.data.keyVal
    if (keyVal == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入自我描述',
      })
    } else {
      wx.showLoading({
        mask: true,
        title: '保存中...',
      })
      wx.request({
        url: `${app.globalData.baseUrl}/Resume/resumeFillSelf.html`,
        data: {
          sess_key: app.globalData.sess_key,
          self_introduction: keyVal
        },
        method: 'POST',
        success: (res) => {
          wx.hideLoading()
          wx.showToast({
            title: '保存成功',
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