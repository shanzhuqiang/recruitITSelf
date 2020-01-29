// pages/recharge/recharge.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userType: '',
    listData: [],
    typeCur: '',
    chooseprice: '',
    current: '1',
    imgSrc: '',
    iptPrice: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userType: app.globalData.userType,
      imgSrc: app.globalData.imgSrc
    })
    this.getList()
  },
  // 获取冲币列表
  getList() {
    let userType = this.data.userType
    wx.request({
      url: `${app.globalData.baseUrl}/Coin/coinConfigList.html`,
      data: {
        is_agent: userType == 'agent' ? 1 : 2,
        sess_key: app.globalData.sess_key
      },
      method: 'POST',
      success: (res) => {
        let listData = res.data.bizobj.data.config_list
        console.log(listData)
        this.setData({
          typeCur: listData.length > 0 ? listData[0].id : '',
          chooseprice: listData.length > 0 ? listData[0].price : '',
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
  // 输入金额
  inputNum (e) {
    this.setData({
      iptPrice: e.detail.value,
      chooseprice: '',
      typeCur: ''
    })
  },
  // 切换充值金额
  choosePrice (e) {
    this.setData({
      typeCur: e.currentTarget.dataset.id,
      chooseprice: e.currentTarget.dataset.price,
      iptPrice: ''
    })
  },
  // 切换支付方式
  radioChange({ detail = {} }) {
    this.setData({
      current: detail.value
    });
  },
  // 确认
  confirm () {
    if (this.data.typeCur == '' && this.data.iptPrice == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择或输入充值金额',
      })
    } else {
      wx.showModal({
        confirmText: '确认充值',
        confirmColor: '#0073ff',
        title: '提示',
        content: `您将充值${this.data.iptPrice || this.data.chooseprice}元,请确认`,
        success: (res) => {
          if (res.confirm) {
            this.payCoin()
          }
        }
      })
    }
  },
  // 调用充值接口
  payCoin () {
    // this.wechartPay()
    // return false
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    let userType = this.data.userType
    wx.request({
      url: `${app.globalData.baseUrl}/Weixinpay/payCoin.html`,
      data: {
        sess_key: app.globalData.sess_key,
        user_type: userType === 'engineer' ? 1 : userType === 'hr' ? 2 : 3,
        paytype: this.data.current,
        method: this.data.iptPrice === '' ? 1 : 2,
        config_id: this.data.typeCur,
        amount: this.data.iptPrice
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          wx.showToast({
            title: '充值成功',
            mask: true,
            icon: 'success', success() {
              setTimeout(() => {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            }
          })
        } else if (res.data.error_code == 1) {
          this.wechartPay(res.data.bizobj.data.wxconfig)
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
  },
  // 微信支付
  wechartPay (data) {
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: 'MD5',
      paySign: data.paySign,
      success: (res) => {
        wx.showToast({
          title: '充值成功',
          mask: true,
          icon: 'success', success() {
            setTimeout(() => {
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          }
        })
      },
      fail(res) {}
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