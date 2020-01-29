// pages/editCompany/editCompany.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    name: '',
    addressCity: '',
    rongziArray: [
      {
        id: 8,
        name: '不需要融资'
      },
      {
        id: 1,
        name: '未融资'
      },
      {
        id: 2,
        name: '天使轮'
      },
      {
        id: 3,
        name: 'A轮'
      },
      {
        id: 4,
        name: 'B轮'
      },
      {
        id: 5,
        name: 'C轮'
      },
      {
        id: 6,
        name: 'D轮及以上'
      },
      {
        id: 7,
        name: '上市公司'
      }],
    rongzi: '',
    // 1.少于15人 2.15-50人 3.50 - 150人 4.150 - 500人 5.500 - 2000人 6.2000人以上
    guimoArray: [
      {
        id: 1,
        name: '少于15人'
      },
      {
        id: 2,
        name: '15-50人'
      },
      {
        id: 3,
        name: '50-150人'
      },
      {
        id: 4,
        name: '150-500人'
      },
      {
        id: 5,
        name: '500-2000人'
      },
      {
        id: 6,
        name: '2000人以上'
      }],
    guimo: '',
    hangyeArray: [],
    hangye: '',
    latitude: '',
    longitude: '',
    addressInfo: '',
    introduce: '',
    chooseActive: 'used',
    btnChoose: '',
    userInfo: null,
    common: null,
    cityList: [],
    areaList: [],
    cityChooseMask: false,
    imgBox: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log()
    this.setData({
      userInfo: app.globalData.userInfo,
      imgSrc: app.globalData.imgSrc
    })
    this.getData()
    this.getLineList()
    if (options.edit) {
      this.getInfo()
    }
  },
  // 获取公司详情
  getInfo() {
    wx.request({
      url: `${app.globalData.baseUrl}/Company/companyInfo.html`,
      data: {
        sess_key: app.globalData.sess_key
      },
      method: 'POST',
      success: (res) => {
        let company_info = res.data.bizobj.data.company_info
        this.setData({
          name: company_info.name,
          addressCity: company_info.city_name,
          imgBox: company_info.image
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
  // 获取行业
  getLineList () {
    wx.request({
      url: `${app.globalData.baseUrl}/Work/lineList.html`,
      data: {
        sess_key: app.globalData.sess_key
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code == 0) {
          let data = res.data.bizobj.data.line_list
          this.setData({
            hangyeArray: data
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
  // 公司名字
  nameChange (e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 所在城市
  openCityChoose(e) {
    this.setData({
      cityChooseMask: true
    })
  },
  // 融资
  rongziChange(e) {
    this.setData({
      rongzi: this.data.rongziArray[e.detail.value]
    })
  },
  // 规模
  guimoChange(e) {
    this.setData({
      guimo: this.data.guimoArray[e.detail.value]
    })
  },
  // 行业
  hangyeChange(e) {
    this.setData({
      hangye: this.data.hangyeArray[e.detail.value]
    })
  },
  // 公司地址
  addressChange (e) {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          addressInfo: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
    // this.setData({
    //   address: e.detail.value
    // })
  },
  // 详细地址
  // addressInfoChange(e) {
    // this.setData({
    //   addressInfo: e.detail.value
    // })
  // },
  // 公司介绍
  introduceChange(e) {
    this.setData({
      introduce: e.detail.value
    })
  },
  // 下一步
  nextStep() {
    let data = this.data
    let companyObj = {
      name: data.name,
      addressCity: data.addressCity,
      btnChoose: data.btnChoose,
      financing: data.rongzi.id,
      scale: data.guimo.id,
      re_line_id: data.hangye.id,
      addressInfo: data.addressInfo,
      latitude: data.latitude,
      longitude: data.longitude,
      instruction: data.introduce,
      imgBox: data.imgBox
    }
    if (companyObj.name == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入公司名称',
      })
    } else if (companyObj.addressCity == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择所在城市',
      })
    } else if (companyObj.financing === '' || typeof(companyObj.financing) == 'undefined') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择融资情况',
      })
    } else if (companyObj.scale === '' || typeof(companyObj.scale) == 'undefined') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择企业规模',
      })
    } else if (companyObj.re_line_id === '' || typeof(companyObj.re_line_id) == 'undefined') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择行业',
      })
    }else if (companyObj.addressInfo == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择公司地址',
      })
    } else if (companyObj.instruction == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入公司介绍',
      })
    } else if (companyObj.imgBox == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择图片',
      })
    } else {
      wx.showLoading({
        mask: true,
        title: '提交中...',
      })
      if (this.data.imgBox.indexOf("https://headhunter.pinecc.cn") == 0) {
        companyObj.imgBox = this.data.imgBox
        app.globalData.companyObj = companyObj
        wx.navigateTo({
          url: '../businessLicense/businessLicense'
        })
      } else {
        this.urlTobase64(this.data.imgBox, companyObj) 
      }
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
  // 上传base64拿url
  updateImg(baseImage, companyObj) {
    console.log(2222, baseImage)
    wx.request({
      url: `${app.globalData.baseUrl}/File/uploadImagesBase64.html`,
      data: {
        sess_key: app.globalData.sess_key,
        image: baseImage
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          companyObj.imgBox = res.data.bizobj.data.image_url
          app.globalData.companyObj = companyObj
          wx.navigateTo({
            url: '../businessLicense/businessLicense'
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
  // 转base64
  urlTobase64(url, companyObj) {
    wx.getFileSystemManager().readFile({
      filePath: url,
      encoding: 'base64',
      success: res => {
        let base64 = 'data:image/jpeg;base64,' + res.data
        this.updateImg(base64, companyObj)
      }
    })
  },
  // 初始化获取数据
  getData() {
    wx.request({
      url: `${app.globalData.baseUrl}/Addr/chooseDistrict.html`,
      data: {
        sess_key: app.globalData.sess_key,
        lat: this.data.userInfo.lat,
        lng: this.data.userInfo.lng
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code == 0) {
          let resData = res.data.bizobj.data
          this.setData({
            cityList: resData.prov_list,
            common: resData.common
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
  // 左侧选择省份
  chooseCity(e) {
    let key = e.currentTarget.dataset.id
    this.setData({
      chooseActive: key
    })
    if (key !== 'used') {
      this.getProv2CityList(key)
    }
  },
  getProv2CityList(code) {
    wx.request({
      url: `${app.globalData.baseUrl}/Addr/prov2CityList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        prov_code: code
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code == 0) {
          let resData = res.data.bizobj.data
          this.setData({
            areaList: resData.area_list
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
  // 选择城市
  chooseBtn(e) {
    this.setData({
      btnChoose: e.currentTarget.dataset.id,
      addressCity: e.currentTarget.dataset.ida,
      cityChooseMask: false
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