// pages/myMessage/myMessage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 1,
    listData: [],
    imgSrc: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgSrc: app.globalData.imgSrc
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      page:1,
      listData: []
    })
    this.getListData()
  },
  // 获取消息列表
  getListData () {
    wx.request({
      url: `${app.globalData.baseUrl}/notice/noticeInfo.html`,
      data: {
        sess_key: app.globalData.sess_key,
        page_size: 20,
        page: this.data.page
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code == 0) {
          let data = res.data.bizobj.data
          data.forEach(el => {
            if (el.is_read == 2) {
              if (el.type == 3 || el.type == 5 || el.type == 6 || el.type == 7 || el.type == 8) {
                this.noticeRead(el.id)
              }
            }
          })
          if (data && data.length > 0) {
            let oldListData = this.data.listData
            this.setData({
              listData: [...oldListData, ...data],
              page: this.data.page + 1
            })
          }
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
  noticeRead(id) {
    wx.request({
      url: `${app.globalData.baseUrl}/Notice/noticeRead.html`,
      data: {
        sess_key: app.globalData.sess_key,
        id: id
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code != 0) {
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
  // 进入消息详情
  goMessage(e) {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    let id = e.currentTarget.dataset.id
    let type = e.currentTarget.dataset.type
    let re_job_id = e.currentTarget.dataset.rejobid
    let re_project_id = e.currentTarget.dataset.reprojectid
    let re_resume_id = e.currentTarget.dataset.reresumeid
    let re_apply_id = e.currentTarget.dataset.reapplyid
    let from_sess_key = e.currentTarget.dataset.fromsesskey
    //该消息置为读取
    wx.request({
      url: `${app.globalData.baseUrl}/Notice/noticeRead.html`,
      data: {
        sess_key: app.globalData.sess_key,
        id: id
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          if (type == 1) {
            // 1是岗位
            wx.navigateTo({
              url: `../postDetail/postDetail?id=${re_job_id}&fromsesskey=${from_sess_key}`
            })
          } else if (type == 2) {
            // 2是项目
            wx.navigateTo({
              url: `../projectDetail/projectDetail?id=${re_project_id}&fromsesskey=${from_sess_key}`
            })
          } else if (type == 4) {
            // 4是面试消息提示
            if (re_job_id) {
              wx.navigateTo({
                url: `../faceInfo/faceInfo?id=${re_apply_id}&type=1`
              })
            } else {
              wx.navigateTo({
                url: `../faceInfo/faceInfo?id=${re_apply_id}&type=2`
              })
            }
          } else if (type == 5) {
            // 5是投递简历消息提示
            wx.navigateTo({
              url: `../resume/resume`
            })
          }
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
    this.getListData()
  }
})