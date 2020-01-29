// pages/resume/resume.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    topType: '1',
    listData: []
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
    this.getData()
  },
  // 获取列表信息
  getData () {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/apply/apply2MeList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        offer: this.data.topType,
        page: 1,
        page_size: 99999
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          let resData = res.data.bizobj.data.apply_list
          resData.forEach((el, index) => {
            if (el.salary_type == 1) {
              el['salaryStr'] = el.day_salary + "元/日"
            } else {
              if (el.max_salary) {
                el['salaryStr'] = Math.round(el.mini_salary / 1000) + 'k-' + Math.round(el.max_salary / 1000) + 'k/月'
              } else {
                el['salaryStr'] = '不限'
              }
            }
          })
          this.setData({
            listData: resData
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
  // 放弃
  giveup(e) {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    this.changeInterviewStatus(e.currentTarget.dataset.id, 2)
  },
  // 录用
  apply(e) {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    this.changeInterviewStatus(e.currentTarget.dataset.id, 1)
  },
  // 删除
  del(e) {
    wx.showLoading({
      mask: true,
      title: '删除中...',
    })
    this.changeInterviewStatus(e.currentTarget.dataset.id, 3)
  },
  changeInterviewStatus(id, type) {
    wx.request({
      url: `${app.globalData.baseUrl}/apply/interviewStatus.html`,
      data: {
        sess_key: app.globalData.sess_key,
        re_apply_id: id,
        type: type
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          wx.showToast({
            title: '操作成功',
            mask: true,
            icon: 'success',
            success: () => {
              setTimeout(() => {
                this.getData()
              }, 1500)
            }
          })
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
  // 简历详情/面试详情
  goResumeDetail(e) {
    if (this.data.topType == 1 || this.data.topType == 2) {
      wx.navigateTo({
        url: `../resumeDetail/resumeDetail?id=${e.currentTarget.dataset.id}&reApplyId=${e.currentTarget.dataset.ida}`
      })
    } else {
      wx.navigateTo({
        url: `../faceInfo/faceInfo?id=${e.currentTarget.dataset.ida}&type=${e.currentTarget.dataset.type}`
      })
    }
  },
  // 邀请面试
  goInvite(e) {
    wx.navigateTo({
      url: `../invite/invite?id=${e.currentTarget.dataset.id}`
    })
  },
  // 选择类型
  chooseType(e) {
    let key = e.currentTarget.dataset.id
    this.setData({
      topType: key
    })
    this.getData()
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

  }
})