// pages/checkTime/checkTime.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    startTime: '',
    endTime: '',
    checkMaskBtn: false,
    id: '',
    name: '',
    company: '',
    imgBox: '',
    fromStep: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      imgSrc: app.globalData.imgSrc,
      id: options.id,
      name: options.name,
      company: options.company,
      fromStep: options.fromStep
    })
    if (options.hourstatus == 1) {
      this.setData({
        checkMaskBtn: true
      })
    }
  },
  // 选择图片
  chooseImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          imgBox: res.tempFilePaths[0]
        })
        // tempFilePath可以作为img标签的src属性显示图片
      }
    })
  },
  confirm() {
    let startTime = this.data.startTime
    let endTime = this.data.endTime
    let imgBox = this.data.imgBox
    if (startTime == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择开始时间',
      })
    } else if (endTime == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择预计结束时间',
      })
    } else if (imgBox == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请上传凭证',
      })
    } else {
      wx.showLoading({
        mask: true,
        title: '提交中...',
      })
      this.urlTobase64()
    }
  },
  // 提交工时核对
  confirmUpdate(imgUrl) {
    wx.request({
      url: `${app.globalData.baseUrl}/Project/hourSubmit.html`,
      data: {
        sess_key: app.globalData.sess_key,
        re_hour_id: this.data.id,
        start_time: this.data.startTime,
        end_time: this.data.endTime,
        images: [imgUrl],
        rate: 1
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          wx.showToast({
            title: '提交成功',
            mask: true,
            icon: 'success',
            success: () => {
              this.setData({
                checkMaskBtn: true
              })
            }
          })
        } else {
          wx.showModal({
            showCancel: false,
            title: '提示',
            content: res.data.msg,
          })
        }
        wx.hideLoading()
      },
      fail: (res) => {
        wx.showToast({
          icon: 'none',
          title: '网络请求失败',
        })
      }
    })
  },
  // 返回首页
  goHome () {
    wx.reLaunch({
      url: '../index/index'
    })
  },
  // 返回上一页
  backBtn () {
    if (this.data.fromStep == 2) {
      wx.navigateBack({
        delta: 2
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },
  // 选择开始时间
  startTimeChange(e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  // 选择结束时间
  endTimeChange(e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  // 转base64
  urlTobase64() {
    wx.getFileSystemManager().readFile({
      filePath: this.data.imgBox,
      encoding: 'base64',
      success: res => {
        let base64 = 'data:image/jpeg;base64,' + res.data
        this.updateImg(base64)
      }
    })
  },
  // 上传base64拿url
  updateImg(baseImage) {
    wx.request({
      url: `${app.globalData.baseUrl}/File/uploadImagesBase64.html`,
      data: {
        sess_key: app.globalData.sess_key,
        image: baseImage
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code == 0) {
          this.confirmUpdate(res.data.bizobj.data.image_url)
        } else {
          wx.hideLoading()
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