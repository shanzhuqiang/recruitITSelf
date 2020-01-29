// pages/bbsInfo/bbsInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    bbsInfo: {},
    is_collect: 1,
    shoucang: 2,
    id: '',
    parent_id: 0,
    focus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgSrc: app.globalData.imgSrc
    })
    this.getInfo(options.id)
  },
  // 回复
  huifu (e) {
    this.setData({
      parent_id: e.currentTarget.dataset.id,
      focus: true
    })
  },
  huifuTheme () {
    this.setData({
      parent_id: 0,
      focus: true
    })
  },
  // 点赞按钮
  thumbUp () {
    if (this.data.bbsInfo.is_collect == 1) {
      // 已点赞，取消点赞
      this.upThumbUp()
    } else if (this.data.bbsInfo.is_collect == 2) {
      // 未点赞，点赞
      this.doThumbUp()
    }
  },
  // 未点赞，点赞
  doThumbUp() {
    wx.showLoading({
      mask: true,
      title: '点赞中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/Post/postThumbUp.html`,
      data: {
        sess_key: app.globalData.sess_key,
        post_id: this.data.id
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          wx.showToast({
            title: '点赞成功',
            mask: true,
            icon: 'success',
            success: () => {
              this.getInfo(this.data.id)
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
  // 已点赞，取消点赞
  upThumbUp() {
    wx.showLoading({
      mask: true,
      title: '取消中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/Post/postUnThumbUp.html`,
      data: {
        sess_key: app.globalData.sess_key,
        post_id: this.data.id
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          wx.showToast({
            title: '取消成功',
            mask: true,
            icon: 'success',
            success: () => {
              this.getInfo(this.data.id)
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
  // 评论
  iptChange(e) {
    wx.showLoading({
      mask: true,
      title: '评论中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/Post/replyPost.html`,
      data: {
        sess_key: app.globalData.sess_key,
        post_id: this.data.id,
        content: e.detail.value,
        parent_id: this.data.parent_id
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          wx.showToast({
            title: '评论成功',
            mask: true,
            icon: 'success',
            success: () => {
              this.getInfo(this.data.id)
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
  // 关注
  guanzhuBtn(e) {
    wx.showLoading({
      mask: true,
      title: '关注中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/user/collect.html`,
      data: {
        sess_key: app.globalData.sess_key,
        user_id: e.currentTarget.dataset.id
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          wx.showToast({
            title: '关注成功',
            mask: true,
            icon: 'success',
            success: () => {
              this.setData({
                is_collect: 1
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
  // 获取帖子详情
  getInfo(id) {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    this.setData({
      id: id
    })
    wx.request({
      url: `${app.globalData.baseUrl}/Post/getPostInfo.html`,
      data: {
        sess_key: app.globalData.sess_key,
        id: id
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          let resData = res.data.bizobj.data.post_info
          console.log(resData.is_collect)
          this.setData({
            bbsInfo: resData,
            is_collect: resData.user_info.is_collect,
            shoucang: resData.is_collect
          })
          console.log(resData)
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let userType = this.data.userType
    wx.request({
      url: `${app.globalData.baseUrl}/Post/rePost.html`,
      data: {
        sess_key: app.globalData.sess_key,
        user_type: userType === 'engineer' ? 1 : userType === 'hr' ? 2 : 3,
        post_id: this.data.id
      },
      method: 'POST',
      success: (res) => {
        this.getInfo(this.data.id)
      },
      fail: (res) => {
        wx.showToast({
          icon: 'none',
          title: '网络请求失败',
        })
      }
    })
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