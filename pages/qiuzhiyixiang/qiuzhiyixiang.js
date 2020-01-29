// pages/qiuzhiyixiang/qiuzhiyixiang.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    reJob: '',
    xingzhiArray: ['短期兼职', '长期兼职'],
    xingzhi: '',
    yuexinArray: ["不限", "小于2k", "2-5k", "5-10k", "10-15k", "15-25k", "25-50k", "50k+"],
    yuexin: '',
    zhuangtaiArray: ["积极找工作", "暂时不换工作", "随便看看"],
    zhuangtai: '',
    shijianArray: ["2周以内", "2周-1个月", "1-3个月", "随时"],
    shijian: '',
    address: '',
    chooseActive: 'used',
    btnChoose: '',
    userInfo: null,
    common: null,
    cityList: [],
    areaList: [],
    cityChooseMask: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo,
      imgSrc: app.globalData.imgSrc
    })
    this.getData()
  },
  getIndex (array, str) {
    let i = ''
    array.forEach((el, index) => {
      if (el === str) i = index + 1
    })
    return i
  },
  // 完成
  finish() {
    let job_name = this.data.reJob
    let nature = this.getIndex(this.data.xingzhiArray, this.data.xingzhi)
    let salary_range = this.getIndex(this.data.yuexinArray, this.data.yuexin)
    let city_id = this.data.btnChoose
    let zhuangtai = this.getIndex(this.data.zhuangtaiArray, this.data.zhuangtai)
    let intime = this.getIndex(this.data.shijianArray, this.data.shijian)
    if (job_name == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入期望职务',
      })
    } else if (nature == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择工作性质',
      })
    } else if (salary_range == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择期望月薪',
      })
    } else if (city_id == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择工作地点',
      })
    } else if (zhuangtai == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择当前状态',
      })
    } else if (intime == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择到岗时间',
      })
    } else {
      wx.showLoading({
        mask: true,
        title: '提交中...',
      })
      wx.request({
        url: `${app.globalData.baseUrl}/Resume/intension.html`,
        data: {
          sess_key: app.globalData.sess_key,
          job_name: job_name,
          nature: nature,
          salary_range: salary_range,
          city_id: city_id,
          will: zhuangtai,
          intime: intime
        },
        method: 'POST',
        success: (res) => {
          if (res.data.error_code == 0) {
            wx.hideLoading()
            wx.showToast({
              title: '提交成功',
              mask: true,
              icon: 'success',
              success() {
                setTimeout(() => {
                  wx.reLaunch({
                    url: '../index/index'
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
    }
  },
  // 期望职务
  changeReJob (e) {
    this.setData({
      reJob: e.detail.value
    })
  },
  // 工作性质
  xingzhiChange (e) {
    this.setData({
      xingzhi: this.data.xingzhiArray[e.detail.value]
    })
  },
  // 期望薪资
  yuexinChange (e) {
    this.setData({
      yuexin: this.data.yuexinArray[e.detail.value]
    })
  },
  // 当前状态
  zhuangtaiChange(e) {
    this.setData({
      zhuangtai: this.data.zhuangtaiArray[e.detail.value]
    })
  },
  // 到岗时间
  shijianChange(e) {
    this.setData({
      shijian: this.data.shijianArray[e.detail.value]
    })
  },
  // 工作地点
  addressChange(e) {
    this.setData({
      cityChooseMask: true
    })
    // let addressArray = e.detail.value
    // this.setData({
    //   address: addressArray
    // })
  },
  // 选择城市
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
        let resData = res.data.bizobj.data
        this.setData({
          cityList: resData.prov_list,
          common: resData.common
        })
        console.log(resData)
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
        let resData = res.data.bizobj.data
        this.setData({
          areaList: resData.area_list
        })
        console.log(resData)
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
      address: e.currentTarget.dataset.ida,
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