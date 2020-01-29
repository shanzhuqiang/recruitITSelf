// pages/baseInfo/baseInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    xingbieArray: [
      {
        id: 1,
        name: '男'
      },
      {
        id: 2,
        name: '女'
      }
    ],
    xingbie: {},
    birthday: '',
    shenfenArray: [
      {
        id: 1,
        name: '职场人生'
      },
      {
        id: 2,
        name: '应届生'
      }
    ],
    shenfen: {},
    workTime: '',
    tagArray: [],
    addTag: false,
    tagVal: '',
    maxlengthModal: false,
    delModal: false,
    delId: '',
    baseInfo: '',
    name: '',
    phone: '',
    email: '',
    work: '',
    workName: '',
    workNameIpt: "",
    // city: '',
    // cityChooseMask: false,
    // chooseActive: 'used',
    // btnChoose: '',
    userInfo: null,
    // common: null,
    // cityList: [],
    // areaList: [],
    // district: '',
    // districtCode: '',
    // showDistrictList: false,
    // districtList: [],
    workOne: false,
    workTwo: false,
    workNameList: [],
    region: [],
    codeArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let baseInfo = app.globalData.baseInfo.user_info
    console.log(baseInfo)
    let tagArray = []
    if (baseInfo.label1) {
      tagArray.push(baseInfo.label1)
    }
    if (baseInfo.label2) {
      tagArray.push(baseInfo.label2)
    }
    if (baseInfo.label3) {
      tagArray.push(baseInfo.label3)
    }
    let workNameListOne = ["FICO", "MM", "PM", "SD", "WM", "SRM", "CRM", "PP", "PI", "BW", "BASIA", "ABAP"]
    let workNameListTwo = ["JAVA", "WEB前端", "后端开发", "UI", "UE", "IOS", "Android", "Python", "PHP", "H5", "桌面工程师", "C#", "C++", "嵌入式", "大数据开发", "大数据运维"]
    if (workNameListOne.indexOf(baseInfo.job_name) != -1) {
      this.setData({
        work: "SAP",
        workName: baseInfo.job_name
      })
    } else if (workNameListTwo.indexOf(baseInfo.job_name) != -1) {
      this.setData({
        work: "工程师",
        workName: baseInfo.job_name
      })
    } else if (baseInfo.job_name == "需求分析师" || baseInfo.job_name == "产品经理" || baseInfo.job_name == "架构师") {
      this.setData({
        work: baseInfo.job_name
      })
    } else if (baseInfo.job_name){
      this.setData({
        work: "其他",
        workNameIpt: baseInfo.job_name
      })
    }
    if (baseInfo.prov_name) {
      this.setData({
        region: [baseInfo.prov_name, baseInfo.city_name, baseInfo.district_name],
        codeArray: [baseInfo.prov_code, baseInfo.city_code, baseInfo.district_code]
      }) 
    }
    this.setData({
      userInfo: app.globalData.userInfo,
      imgSrc: app.globalData.imgSrc,
      baseInfo: app.globalData.baseInfo,
      name: baseInfo.username,
      phone: baseInfo.mobile,
      email: baseInfo.email,
      birthday: baseInfo.birthday,
      xingbie: baseInfo.gender == 1 ? { id: 1, name: '男' } : baseInfo.gender == 2 ? { id: 2, name: '女' } : { id: null, name: '' },
      shenfen: baseInfo.identity == 1 ? { id: 1, name: '职场人生' } : baseInfo.identity == 2 ? { id: 2, name: '应届生' } : { id: null, name: '' },
      workTime: baseInfo.work_begin_time,
      // city: baseInfo.city_name, 
      // btnChoose: baseInfo.city_code,
      // district: baseInfo.district_name,
      // districtCode: baseInfo.district_code,
      tagArray: tagArray
    })
    // this.getData()
    // if (this.data.btnChoose) {
    //   this.getArea(this.data.btnChoose)
    // }
  },
  // 省市区选择改变
  bindRegionChange: function (e) {
    console.log(e.detail.code)
    this.setData({
      region: e.detail.value,
      codeArray: e.detail.code
    })
  },
  // 打开岗位选择
  openChooseWork() {
    this.setData({
      workOne: true
    })
  },
  // 关闭岗位遮罩
  toggleShowWorkOne() {
    this.setData({
      workOne: false
    })
  },
  // 选择岗位1
  chooseWorkOne(e) {
    let key = e.currentTarget.dataset.name
    this.setData({
      work: key,
      workName: "",
      workNameIpt: "",
      workOne: false
    })
    if (key == 'SAP') {
      let workNameList = ["FICO", "MM", "PM", "SD", "WM", "SRM", "CRM", "PP", "PI", "BW", "BASIA", "ABAP"]
      this.setData({
        workNameList: workNameList
      })
    } else if (key == '工程师') {
      let workNameList = ["JAVA", "WEB前端", "后端开发", "UI", "UE", "IOS", "Android", "Python", "PHP", "H5", "桌面工程师", "C#", "C++", "嵌入式", "大数据开发", "大数据运维"]
      this.setData({
        workNameList: workNameList
      })
    }
  },
  // 打开岗位选择
  openChooseWorkTwo() {
    this.setData({
      workTwo: true
    })
  },
  // 关闭岗位遮罩
  toggleShowWorkTwo() {
    this.setData({
      workTwo: false
    })
  },
  // 选择岗位2
  chooseWorkTwo(e) {
    this.setData({
      workName: e.currentTarget.dataset.name,
      workTwo: false
    })
  },
  // 获取区域
  // getArea(id) {
  //   wx.request({
  //     url: `${app.globalData.baseUrl}/Addr/city2DistrictList.html`,
  //     data: {
  //       sess_key: app.globalData.sess_key,
  //       city_code: id
  //     },
  //     method: 'POST',
  //     success: (res) => {
  //       this.setData({
  //         districtList: res.data.bizobj.data.area_list
  //       })
  //     },
  //     fail: (res) => {
  //       wx.showToast({
  //         icon: 'none',
  //         title: '网络请求失败',
  //       })
  //     }
  //   })
  // },
  // 打开区域遮罩
  // openDistrict () {
  //   if (this.data.btnChoose) {
  //     this.setData({
  //       showDistrictList: true
  //     })
  //   } else {
  //     wx.showModal({
  //       showCancel: false,
  //       title: '提示',
  //       content: '请先选择所在城市',
  //     })
  //   }
  // },
  // 关闭区域遮罩
  // toggleShowDistrictList() {
  //   this.setData({
  //     showDistrictList: false
  //   })
  // },
  // 选择区域
  // chooseDistrict(e) {
  //   this.setData({
  //     district: e.currentTarget.dataset.name,
  //     districtCode: e.currentTarget.dataset.id,
  //     showDistrictList: false
  //   })
  // },
  // 名字改变
  nameChange (e) {
    this.setData({
      name: e.detail.value
    })
  },
  // 手机号码改变
  phoneChange(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  // email改变
  emailChange(e) {
    this.setData({
      email: e.detail.value
    })
  },
  // 岗位改变
  workChange(e) {
    this.setData({
      workNameIpt: e.detail.value
      // work: e.detail.value
    })
  },
  // 添加标签
  addTag() {
    this.setData({
      tagVal: '',
      addTag: true
    })
  },
  // 监听输入改变
  tagValChange(e) {
    this.setData({
      tagVal: e.detail.detail.value
    })
  },
  // 取消删除
  cancelDel() {
    this.setData({
      delModal: false,
      delId: ''
    })
  },
  // 确认删除
  confirmDel() {
    let tagArray = this.data.tagArray
    let delId = this.data.delId
    let newTagArray = tagArray.filter((el, index) => {
      return el !== delId
    })
    this.setData({
      tagArray: newTagArray,
      delModal: false
    })
  },
  // 删除标签
  delTag(e) {
    this.setData({
      delModal: true,
      delId: e.currentTarget.dataset.id
    })
  },
  // 关闭最长提示
  maxlengthModalClose() {
    this.setData({
      maxlengthModal: false
    })
  },
  // 添加标签--确认
  addTagOk() {
    let tagVal = this.data.tagVal
    if (tagVal !== '') {
      let tagArray = this.data.tagArray
      console.log(tagArray)
      if (tagArray.length > 2) {
        this.setData({
          addTag: false,
          maxlengthModal: true
        })
      } else {
        tagArray.push(tagVal)
        this.setData({
          tagArray: tagArray,
          addTag: false
        })
      }
    }
  },
  // 添加标签--取消
  addTagCancel() {
    this.setData({
      addTag: false
    })
  },
  // 参加工作时间
  workTimeChange(e) {
    this.setData({
      workTime: e.detail.value
    })
  },
  // 当前身份
  shenfenChange(e) {
    this.setData({
      shenfen: this.data.shenfenArray[e.detail.value]
    })
  },
  // 出生日期
  birthdayChange(e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  // 性别
  xingbieChange(e) {
    this.setData({
      xingbie: this.data.xingbieArray[e.detail.value]
    })
  },
  // 打开选择城市
  // openChooseCity () {
  //   this.setData({
  //     cityChooseMask: true
  //   })
  // },
  // 保存
  saveInfo() {
    console.log(this.data.region)
    console.log(this.data.codeArray)
    let work = this.data.work
    let workName = this.data.workName
    let workNameIpt = this.data.workNameIpt
    let job_name = ""
    if (work == 'SAP' || work == '工程师') {
      job_name = workName
    } else if (work == "需求分析师" || work == "产品经理" || work == "架构师") {
      job_name = work
    } else if (work == "其他") {
      job_name = workNameIpt
    }
    let name = this.data.name
    let xingbie = this.data.xingbie.id
    let workTime = this.data.workTime
    let identity = this.data.shenfen.id
    let phone = this.data.phone
    let email = this.data.email
    let tagArray = this.data.tagArray
    let birthday = this.data.birthday
    var reg = /^0?1[3|4|5|6|7|8][0-9]\d{8}$/;

    let diquName = this.data.region
    let diquCode = this.data.codeArray
    if (!name) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入真实姓名',
      })
    } else if (!xingbie) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择性别',
      })
    } else if (!birthday) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择出生日期',
      })
    } else if (!identity) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择当前身份',
      })
    } else if (!workTime) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择参加工作时间',
      })
    } else if (!job_name) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入所在岗位',
      })
    } else if (diquName.length == 0 && diquCode.length == 0) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择所在地区',
      })
    } else if (!phone || !reg.test(phone)) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入手机号',
      })
    } else if (!email) {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入联系邮箱',
      })
    } else {
      wx.showLoading({
        mask: true,
        title: '保存中...',
      })
      let diquName = this.data.region
      let diquCode = this.data.codeArray
      wx.request({
        url: `${app.globalData.baseUrl}/Resume/resumeFillBasic.html`,
        data: {
          sess_key: app.globalData.sess_key,
          user_name: name,
          gender: xingbie,
          work_begin_time: workTime,
          identity: identity,
          mobile: phone,
          email: email,
          job_name: job_name,
          prov_name: diquName[0],
          prov_code: diquCode[0],
          city_name: diquName[1],
          city_code: diquCode[1],
          district_name: diquName[2],
          district_code: diquCode[2],
          label1: tagArray[0] || '',
          label2: tagArray[1] || '',
          label3: tagArray[2] || '',
          birthday: birthday
        },
        method: 'POST',
        success: (res) => {
          wx.hideLoading()
          if (res.data.error_code == 0) {
            wx.showToast({
              title: '保存成功',
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
    }
  },
  // 初始化获取数据
  // getData() {
  //   wx.request({
  //     url: `${app.globalData.baseUrl}/Addr/chooseDistrict.html`,
  //     data: {
  //       sess_key: app.globalData.sess_key,
  //       lat: this.data.userInfo.lat,
  //       lng: this.data.userInfo.lng
  //     },
  //     method: 'POST',
  //     success: (res) => {
  //       let resData = res.data.bizobj.data
  //       this.setData({
  //         cityList: resData.prov_list,
  //         common: resData.common
  //       })
  //       console.log(resData)
  //     },
  //     fail: (res) => {
  //       wx.showToast({
  //         icon: 'none',
  //         title: '网络请求失败',
  //       })
  //     }
  //   })
  // },
  // 左侧选择省份
  // chooseCity(e) {
  //   let key = e.currentTarget.dataset.id
  //   this.setData({
  //     chooseActive: key
  //   })
  //   if (key !== 'used') {
  //     this.getProv2CityList(key)
  //   }
  // },
  // getProv2CityList(code) {
  //   wx.request({
  //     url: `${app.globalData.baseUrl}/Addr/prov2CityList.html`,
  //     data: {
  //       sess_key: app.globalData.sess_key,
  //       prov_code: code
  //     },
  //     method: 'POST',
  //     success: (res) => {
  //       let resData = res.data.bizobj.data
  //       this.setData({
  //         areaList: resData.area_list
  //       })
  //       console.log(resData)
  //     },
  //     fail: (res) => {
  //       wx.showToast({
  //         icon: 'none',
  //         title: '网络请求失败',
  //       })
  //     }
  //   })
  // },
  // 选择城市
  // chooseBtn(e) {
  //   this.setData({
  //     btnChoose: e.currentTarget.dataset.id,
  //     city: e.currentTarget.dataset.ida,
  //     districtCode: '',
  //     district: '',
  //     cityChooseMask: false
  //   })
  //   this.getArea(e.currentTarget.dataset.id)
  // },
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