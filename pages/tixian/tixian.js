// pages/tixian/tixian.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    totalCoin: 0,
    money: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.totalCoin)
    this.setData({
      imgSrc: app.globalData.imgSrc,
      totalCoin: options.totalCoin
    })
  },
  // 提现
  tixianBtn () {
    if (this.data.totalCoin < 30) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '余额不足',
      })
    } else {
      if (this.data.money < 30) {
        wx.showModal({
          showCancel: false,
          title: '提示',
          content: '30元起提现',
        })
      } else {
        wx.request({
          url: `${app.globalData.baseUrl}/Cash/withdraw.html`,
          data: {
            sess_key: app.globalData.sess_key,
            cash: this.data.money
          },
          method: 'POST',
          success: (res) => {
            wx.hideLoading()
            if (res.data.error_code == 0) {
              if (res.data.bizobj.result_code === 'SUCCESS') {
                wx.showToast({
                  title: '提现成功',
                  mask: true,
                  icon: 'success',
                  success: () => {
                    // this.getInfo(this.data.id)
                  }
                })
              } else {
                wx.showModal({
                  showCancel: false,
                  title: '提示',
                  content: res.data.bizobj.err_code_des,
                })
              }
              console.log(res)
            } else {
              wx.showModal({
                showCancel: false,
                title: '提示',
                content: res.data.msg,
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
    }
  },
  // 输入金融
  moneyChange (e) {
    let money = e.detail.value
    if (Number(money) > Number(this.data.totalCoin)) {
      money = this.data.totalCoin
    }
    this.setData({
      money: money
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