// pages/checkTimePull/checkTimePull.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    imgBox: '',
    content: '',
    id: '',
    checkMaskBtn: false,
    fromStep: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id,
      fromStep: options.fromStep,
      imgSrc: app.globalData.imgSrc
    }, () => {
      this.init(options)
    })
  },
  init(options) {
    console.log(this.data.fromStep)
    if (this.data.fromStep == 1) {
      this.setData({
        checkMaskBtn: true
      })
    } else if (this.data.fromStep == 3) {
      this.setData({
        imgBox: options.images,
        content: options.content
      })
    }
  },
  // 返回首页
  goHome() {
    wx.reLaunch({
      url: '../index/index'
    })
  },
  // 返回上一页
  backBtn() {
    if (this.data.fromStep == 2 || this.data.fromStep == 3) {
      wx.navigateBack({
        delta: 2
      })
    } else {
      wx.navigateBack({
        delta: 1
      })
    }
  },
  // 描述改变
  contentChange (e) {
    this.setData({
      content: e.detail.value
    })
  },
  // 提交
  confirm () {
    let content = this.data.content
    let imgBox = this.data.imgBox
    if (content == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入描述内容',
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
  // 提交工时核对
  confirmUpdate(imgUrl) {
    wx.request({
      url: `${app.globalData.baseUrl}/Project/hourSubmit.html`,
      data: {
        sess_key: app.globalData.sess_key,
        re_hour_id: this.data.id,
        content: this.data.content,
        images: [imgUrl],
        rate: 2
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