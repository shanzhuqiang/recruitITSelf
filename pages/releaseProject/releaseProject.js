// pages/releaseGangwei/releaseGangwei.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    reward: '',
    jingyanArray: [
      {
        id: '0',
        name: '不限'
      },
      {
        id: '1',
        name: '应届毕业生'
      },
      {
        id: '2',
        name: '3年以内'
      },
      {
        id: '3',
        name: '3-5年'
      }, {
        id: '4',
        name: '5-10年'
      }, {
        id: '5',
        name: '10年以上'
      }
    ],
    jingyan: '',
    zhouqiArray: [
      {
        id: '3',
        name: '不限'
      },
      {
        id: '2',
        name: '长期兼职'
      },
      {
        id: '1',
        name: '短期兼职'
      }],
    zhouqi: '',
    xinziArray: [
      {
        id: 1,
        name: '日薪'
      },
      {
        id: 2,
        name: '月薪'
      }
    ],
    xinzi: '',
    moneyArray: [
      {
        id: '1',
        name: '不限'
      },
      {
        id: '2',
        name: '2K以下'
      },
      {
        id: '3',
        name: '2K-5K'
      },
      {
        id: '4',
        name: '5K-10K'
      },
      {
        id: '5',
        name: '10K-15K'
      },
      {
        id: '6',
        name: '15K-25K'
      },
      {
        id: '7',
        name: '25K-50K'
      },
      {
        id: '8',
        name: '50K以上'
      }
    ],
    rixin: '',
    money: '',
    chooseActive: 'used',
    address: '',
    btnChoose: '',
    userInfo: null,
    common: null,
    cityList: [],
    areaList: [],
    cityChooseMask: false,
    gangweiTextareaMaskBox: false,
    instruction: '',
    yaoqiuTextareaMaskBox: false,
    requirement: '',
    district: '',
    districtCode: '',
    showDistrictList: false,
    districtList: []
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
  // 获取区域
  getArea(id) {
    wx.request({
      url: `${app.globalData.baseUrl}/Addr/city2DistrictList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        city_code: id
      },
      method: 'POST',
      success: (res) => {
        this.setData({
          districtList: res.data.bizobj.data.area_list
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
  // 打开区域遮罩
  openDistrict() {
    if (this.data.btnChoose) {
      this.setData({
        showDistrictList: true
      })
    } else {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请先选择所在城市',
      })
    }
  },
  // 关闭区域遮罩
  toggleShowDistrictList() {
    this.setData({
      showDistrictList: false
    })
  },
  // 选择区域
  chooseDistrict(e) {
    this.setData({
      district: e.currentTarget.dataset.name,
      districtCode: e.currentTarget.dataset.id,
      showDistrictList: false
    })
  },
  // 项目名称
  nameChange (e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 赏金
  rewardChange(e) {
    this.setData({
      reward: e.detail.value
    })
  },
  // 打开城市选择
  openChooseCity() {
    this.setData({
      cityChooseMask: true
    })
  },
  // 选择城市
  chooseBtn(e) {
    this.setData({
      btnChoose: e.currentTarget.dataset.id,
      address: e.currentTarget.dataset.ida,
      districtCode: '',
      district: '',
      cityChooseMask: false
    })
    this.getArea(e.currentTarget.dataset.id)
  },
  // 项目职责
  goProjectZhize() {
    this.setData({
      gangweiTextareaMaskBox: true
    })
  },
  // 关闭岗位职责
  choseGangwei() {
    this.setData({
      gangweiTextareaMaskBox: false
    })
  },
  // 任职要求
  goRenzhiyaoqiu() {
    this.setData({
      yaoqiuTextareaMaskBox: true
    })
  },
  // 关闭任职要求
  choseYaoqiu() {
    this.setData({
      yaoqiuTextareaMaskBox: false
    })
  },
  // 岗位职责输入框输入内容
  gangweiChange(e) {
    this.setData({
      instruction: e.detail.value
    })
  },
  // 任职要求输入框输入内容
  zhizeChange(e) {
    this.setData({
      requirement: e.detail.value
    })
  },
  // 经验要求
  jingyanChange(e) {
    this.setData({
      jingyan: this.data.jingyanArray[e.detail.value]
    })
  },
  // 工作周期
  zhouqiChange(e) {
    this.setData({
      zhouqi: e.detail.value
    })
    // this.setData({
    //   zhouqi: this.data.zhouqiArray[e.detail.value]
    // })
  },
  // 薪资
  xinziChange(e) {
    this.setData({
      xinzi: this.data.xinziArray[e.detail.value],
      rixin: '',
      money: ''
    })
  },
  // 日薪
  rixinChange(e) {
    this.setData({
      rixin: e.detail.value
    })
  },
  // 月薪
  moneyChange(e) {
    this.setData({
      money: this.data.moneyArray[e.detail.value]
    })
  },
  // 发布
  saveRelease() {
    let name = this.data.name
    let reward = this.data.reward
    let btnChoose = this.data.btnChoose
    let district_code = this.data.districtCode
    let job_experience = this.data.jingyan.id
    let nature = this.data.zhouqi
    let xinzi = this.data.xinzi.id
    let rixin = this.data.rixin
    let salary_range = this.data.money.id
    let instruction = this.data.instruction
    let requirement = this.data.requirement
    console.log(nature)
    if (name === '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入项目名称',
      })
    } else if (!reward || reward < 100) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '赏金最少为100',
      })
    } else if (nature === "") {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入工作周期',
      })
    }  else if (!btnChoose) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择工作地点',
      })
    } else if (!district_code) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择所在区域',
      })
    } else if (typeof (job_experience) === 'undefined') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择经验要求',
      })
    }else if (typeof (xinzi) === 'undefined') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择薪资',
      })
    } else if (xinzi == 1 && !rixin) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入日薪',
      })
    } else if (xinzi == 2 && (!salary_range || typeof (salary_range) === 'undefined')) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择月薪范围',
      })
    } else if (!instruction) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入项目职责',
      })
    } else if (!requirement) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入任职要求',
      })
    } else {
      wx.showModal({
        title: '提示',
        content: `确认发布吗？确认发布后内容不得修改`,
        confirmText: '确认发布',
        cancelText: '检查一下',
        success: (res) => {
          if (res.confirm) {
            wx.showLoading({
              mask: true,
              title: '提交中...',
            })
            wx.request({
              url: `${app.globalData.baseUrl}/Project/publish.html`,
              data: {
                sess_key: app.globalData.sess_key,
                name: name,
                job_experience: job_experience,
                nature: nature,
                reward: reward,
                city_code: btnChoose,
                district_code: district_code,
                salary_type: xinzi,
                day_salary: rixin,
                salary_range: salary_range,
                instruction: instruction,
                requirement: requirement
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
                } else if (res.data.error_code == 3) {
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    success: (res) => {
                      wx.navigateBack({
                        delta: 1
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
              },
              fail: (res) => {
                wx.showToast({
                  icon: 'none',
                  title: '网络请求失败',
                })
              }
            })
          }
        }
      })
    }
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