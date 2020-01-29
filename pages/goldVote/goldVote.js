// pages/goldVote/goldVote.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    targetTime: {},
    clearTimer: false,
    imgSrc: '' ,
    maskOnOff: false,
    visible: false,
    openModalType: '',
    page: 1,
    listData: [],
    userType: '',
    total_coin: '',
    costCoin: '',
    chooseTopicId: ''
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
    this.getTotalMoney()
  },
  // 获取金币数
  getTotalMoney() {
    let userType = this.data.userType
    wx.request({
      url: `${app.globalData.baseUrl}/Coin/coinLog.html`,
      data: {
        sess_key: app.globalData.sess_key,
        way: 1,
        user_type: userType === 'engineer' ? 1 : userType === 'hr' ? 2 : 3
      },
      method: 'POST',
      success: (res) => {
        this.setData({
          total_coin: res.data.bizobj.data.total_coin
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
  // 获取数据
  getList() {
    wx.request({
      url: `${app.globalData.baseUrl}/Topic/topicList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        page: this.data.page,
        page_size: 20,
        type: 1
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code == 0) {
          let listData = res.data.bizobj.data.topic_list
          if (listData.length > 0) {
            let oldList = this.data.listData
            let targetTime = {}
            listData.forEach((el, index) => {
              targetTime['id' + el.id] = new Date().getTime() + el.time_left * 1000
            })
            this.setData({
              targetTime: targetTime,
              listData: [...oldList, ...listData],
              page: this.data.page + 1
            })
          }
          console.log(this.data.targetTime)
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
  openRule () {
    this.setData({
      maskOnOff: true
    })
  },
  closeRule() {
    this.setData({
      maskOnOff: false
    })
  },
  // 选择信或不信
  openModal(e) {
    let on = e.currentTarget.dataset.on
    let coin = e.currentTarget.dataset.coin
    this.setData({
      chooseTopicId: e.currentTarget.dataset.id,
      openModalType: on,
      coin: coin
    }, () => {
      this.setData({
        visible: true
      })
    })
  },
  // 确认投票
  bindOk() {
    wx.showLoading({
      mask: true,
      title: '投票中...',
    })
    let userType = this.data.userType
    wx.request({
      url: `${app.globalData.baseUrl}/Topic/chooseTopic.html`,
      data: {
        sess_key: app.globalData.sess_key,
        re_topic_id: this.data.chooseTopicId,
        vote_side: this.data.openModalType,
        user_type: userType === 'engineer' ? 1 : userType === 'hr' ? 2 : 3
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          this.getTotalMoney()
          wx.showToast({
            title: '投票成功',
            mask: true,
            icon: 'success',
            success: () => {
              setTimeout(() => {
                this.setData({
                  visible: false
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
  },
  bindClose() {
    this.setData({
      visible: false
    })
  },
  goOldGoldVote() {
    wx.navigateTo({
      url: '../oldGoldVote/oldGoldVote'
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
    this.setData({
      clearTimer: true
    })
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
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '寻猿招聘',
      path: `/pages/index/index`,
      success: res => {
        console.log(res)
      },
      fail: res => {
        console.log(res)
      }
    }
  }
})