// pages/releaseBbs/releaseBbs.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    typesArray: ['官方发布', '个人发布'],
    types: '',
    shenfenArray: ['IT精英', '企业金主', '赏金猎人'],
    shenfen: '',
    address: '',
    imgBox: '',
    title: '',
    latitude: '',
    longitude: '',
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgSrc: app.globalData.imgSrc
    })
  },
  // 标题改变
  titleChange(e) {
    this.setData({
      title: e.detail.value
    })
  },
  // 内容改变
  contentChange(e) {
    this.setData({
      content: e.detail.value
    })
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
          this.confirmAjax(res.data.bizobj.data.image_url)
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
  // 发布
  confirm() {
    let title = this.data.title
    let content = this.data.content
    let types = this.data.types
    let shenfen = this.data.shenfen
    let address = this.data.address
    if (title == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入标题',
      })
    } else if (content == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入内容',
      })
    } else if (types == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择发布类型',
      })
    } else if (shenfen == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择发布身份',
      })
    } else if (address == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择公司地址',
      })
    } else {
      wx.showLoading({
        mask: true,
        title: '提交中...',
      })
      this.urlTobase64()
    }
  },
  // 发布清秀
  confirmAjax(imgUrl) {
    let shenfen = this.data.shenfen
    wx.request({
      url: `${app.globalData.baseUrl}/Post/savePost.html`,
      data: {
        sess_key: app.globalData.sess_key,
        title: this.data.title,
        content: this.data.content,
        imgs: [imgUrl],
        type: this.data.types === '官方发布' ? 2 : 1,
        user_type: shenfen === 'IT精英' ? 1 : shenfen === '企业金主' ? 2 : 3,
        address: this.data.address,
        latitude: this.data.latitude,
        longitude: this.data.longitude
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          wx.showToast({
            title: '发布成功',
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
  // 发布类别
  typesChange(e) {
    this.setData({
      types: this.data.typesArray[e.detail.value]
    })
  },
  // 发布身份
  shenfenChange(e) {
    this.setData({
      shenfen: this.data.shenfenArray[e.detail.value]
    })
  },
  // 公司地址
  addressChange(e) {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          address: res.address,
          latitude: res.latitude,
          longitude: res.longitude
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