// pages/bountyPlatform/bountyPlatform.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userType: '',
    // userInfo: null,
    imgSrc: '',
    releaseMark: false,
    topType: 'xiangmu',
    xiangmuFilter: '',
    xiangmuMask: false,
    quyuData: [],
    quyuChoose: '',
    mini_salary: '',
    max_salary: '',
    shaixuanData: [
      [
        {
          id: '',
          name: "不限"
        },
        {
          id: 1,
          name: "应届毕业生"
        },
        {
          id: 2,
          name: "3年以内"
        }
      ],
      [
        {
          id: 3,
          name: "3-5年"
        },
        {
          id: 4,
          name: "5-10年"
        },
        {
          id: 5,
          name: "10年以上"
        }
      ]
    ],
    shaixuan1: '',
    shaixuan2: '',
    page: 1,
    // 招聘
    zhaopinFilter: '',
    zhaopinMask: false,
    jingyanData: [
      [{
        id: '',
        name: '不限'
      }, {
        id: '1',
        name: '应届毕业生'
      }, {
        id: '2',
        name: '3年以内'
      }],
      [{
        id: '3',
        name: '3-5年'
      }, {
        id: '4',
        name: '5-10年'
      }, {
        id: '5',
        name: '10年以上'
      }]
    ],
    jingyanChoose: '',
    xueliData: [
      [{
        id: '1',
        name: '不限'
      }, {
        id: '5',
        name: '大专'
      }, {
        id: '6',
        name: '本科'
      }],
      [{
        id: '7',
        name: '硕士'
      }]
    ],
    xueliChoose: '1',
    zhouqiChoose: '',
    page: 1,
    projectList: [],
    quartersList: [],
    unReadNum: 0,
    region: ['全部', '全部', '全部'],
    customItem: '全部',
    codeArray: [],
    region2: ['全部', '全部', '全部'],
    codeArray2: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getUnRead()
  },
  onLoad: function (options) {
    this.setData({
      // userInfo: app.globalData.userInfo,
      userType: app.globalData.userType,
      imgSrc: app.globalData.imgSrc
    })
    // this.getArea()
    this.getProjectList()
  },
  // 取消省市区选择
  bindcancel() {
    this.setData({
      codeArray: [],
      region: ['全部', '全部', '全部']
    })
  },
  // 省市区选择改变
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value,
      codeArray: e.detail.code,
      projectList: [],
      quartersList: []
    })
    this.getProjectList()
  },
  // 取消省市区选择
  bindcancel2() {
    this.setData({
      codeArray2: [],
      region2: ['全部', '全部', '全部']
    })
  },
  // 省市区选择改变
  bindRegionChange2: function (e) {
    this.setData({
      region2: e.detail.value,
      codeArray2: e.detail.code,
      projectList: [],
      quartersList: []
    })
    this.getZhaopinList()
  },
  // 获取未读消息
  getUnRead() {
    wx.request({
      url: `${app.globalData.baseUrl}/notice/noticeCount.html`,
      data: {
        sess_key: app.globalData.sess_key
      },
      method: 'POST',
      success: (res) => {
        this.setData({
          unReadNum: res.data.bizobj.data.new_message
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
  // 岗位信息
  goPostDetail(e) {
    wx.navigateTo({
      url: `../postDetail/postDetail?id=${e.currentTarget.dataset.id}&bonus=1`
    })
  },
  // 项目信息
  goProjectDetail(e) {
    wx.navigateTo({
      url: `../projectDetail/projectDetail?id=${e.currentTarget.dataset.id}&bonus=1`
    })
  },
  // 获取项目
  getProjectList() {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    let codeArray = this.data.codeArray
    let prov_code = codeArray[0] || ''
    let city_code = codeArray[1] || ''
    let district_code = codeArray[2] || ''
    wx.request({
      url: `${app.globalData.baseUrl}/Project/projectList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        prov_code: prov_code,
        city_code: city_code,
        district_code: district_code,
        is_bonus: 1,
        mini_salary: this.data.mini_salary,
        max_salary: this.data.max_salary,
        job_experience: this.data.shaixuan1,
        nature: "",
        // nature: this.data.shaixuan2,
        // page_size: 10,
        // page: this.data.page
        page_size: 9999,
        page: 1
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          let listData = res.data.bizobj.data.project_list
          listData.forEach((el, index) => {
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
            projectList: listData
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
  // 获取岗位
  getZhaopinList() {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    let codeArray = this.data.codeArray2
    let prov_code = codeArray[0] || ''
    let city_code = codeArray[1] || ''
    let district_code = codeArray[2] || ''
    wx.request({
      url: `${app.globalData.baseUrl}/Work/workList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        prov_code: prov_code,
        city_code: city_code,
        district_code: district_code,
        is_bonus: 1,
        education: this.data.xueliChoose,
        job_experience: this.data.jingyanChoose,
        page_size: 9999,
        page: 1
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          let listData = res.data.bizobj.data.job_list
          listData.forEach((el, index) => {
            if (el.max_salary) {
              el['salaryStr'] = Math.round(el.mini_salary / 1000) + 'k-' + Math.round(el.max_salary / 1000) + 'k/月'
            } else {
              el['salaryStr'] = '不限'
            }
          })
          this.setData({
            quartersList: listData
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
  // // 获取区域
  // getArea() {
  //   wx.request({
  //     url: `${app.globalData.baseUrl}/Addr/city2DistrictList.html`,
  //     data: {
  //       sess_key: app.globalData.sess_key,
  //       city_code: this.data.userInfo.city_code
  //     },
  //     method: 'POST',
  //     success: (res) => {
  //       let listData = res.data.bizobj.data.area_list
  //       console.log(listData)
  //       listData.unshift({
  //         district_code: '',
  //         district_name: '不限'
  //       })
  //       let hangyeData = []
  //       let length = parseInt(listData.length / 3)
  //       let n = 0;
  //       for (let i = 1; i <= length; i++) {
  //         var star = (i - 1) * 3;
  //         hangyeData[n++] = listData.slice(star, star + 3);
  //       }
  //       let y = listData.length - length * 3;
  //       if (y > 0) {
  //         let newArr = listData.slice(length * 3)
  //         if (newArr.length === 2) {
  //           newArr.push({
  //             id: '',
  //             name: null
  //           })
  //         }
  //         hangyeData[n++] = newArr
  //       }
  //       this.setData({
  //         quyuData: hangyeData
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
  // 招聘过滤
  zhaopinBtn(e) {
    let key = e.currentTarget.dataset.id
    if (this.data.zhaopinFilter === key && this.data.zhaopinMask) {
      this.setData({
        zhaopinMask: false
      })
    } else {
      this.setData({
        zhaopinMask: true,
        zhaopinFilter: key
      })
    }
  },
  // 经验选择
  jingyanChooseFilter(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      jingyanChoose: id,
      xueliChoose: '1',
      zhouqiChoose: '',
      page: 1,
      projectList: [],
      quartersList: [],
      zhaopinMask: false
    })
    this.getZhaopinList()
  },
  // 学历选择
  xueliChooseFilter(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      xueliChoose: id,
      jingyanChoose: '',
      zhouqiChoose: '',
      page: 1,
      projectList: [],
      quartersList: [],
      zhaopinMask: false
    })
    this.getZhaopinList()
  },
  // 周期选择
  // zhouqiChooseFilter(e) {
  //   let id = e.currentTarget.dataset.id
  //   this.setData({
  //     zhouqiChoose: id,
  //     jingyanChoose: '',
  //     xueliChoose: '1',
  //     page: 1,
  //     listData: [],
  //     zhaopinMask: false
  //   })
  //   this.getZhaopinList()
  // },
  miniSalaryChange(e) {
    this.setData({
      mini_salary: Number(e.detail.value)
    })
  },
  maxSalaryChange(e) {
    this.setData({
      max_salary: Number(e.detail.value)
    })
  },
  // 区域选择过滤内容按钮
  quyuChooseFilter(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      page: 1,
      xiangmuMask: false,
      quyuChoose: id,
      mini_salary: '',
      max_salary: '',
      shaixuan1: '',
      shaixuan2: '',
      projectList: [],
      quartersList: []
    })
    this.getProjectList()
  },
  // 价格确定
  confirmFilterjiage() {
    this.setData({
      page: 1,
      xiangmuMask: false,
      quyuChoose: '',
      shaixuan1: '',
      shaixuan2: '',
      projectList: [],
      quartersList: []
    })
    this.getProjectList()
  },
  // 筛选确定
  confirmFilter() {
    this.setData({
      page: 1,
      xiangmuMask: false,
      quyuChoose: '',
      mini_salary: '',
      max_salary: '',
      projectList: [],
      quartersList: []
    })
    this.getProjectList()
  },
  // 项目过滤点击
  xiangmuBtn(e) {
    let key = e.currentTarget.dataset.id
    if (this.data.xiangmuFilter === key && this.data.xiangmuMask) {
      this.setData({
        xiangmuMask: false
      })
    } else {
      this.setData({
        xiangmuMask: true,
        xiangmuFilter: key
      })
    }
  },
  // 工作经验选择
  shaixuanchooseFilter1(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      page: 1,
      xiangmuMask: false,
      quyuChoose: '',
      shaixuan1: id,
      shaixuan2: '',
      mini_salary: '',
      max_salary: '',
      projectList: [],
      quartersList: []
    })
    this.getProjectList()
    // let id = e.currentTarget.dataset.id
    // console.log(id)
    // this.setData({
    //   shaixuan1: id
    // })
  },
  // 工作周期选择
  shaixuanchooseFilter2(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      page: 1,
      xiangmuMask: false,
      quyuChoose: '',
      shaixuan1: '',
      shaixuan2: id,
      mini_salary: '',
      max_salary: '',
      projectList: [],
      quartersList: []
    })
    this.getProjectList()
    // let id = e.currentTarget.dataset.id
    // this.setData({
    //   shaixuan2: id
    // })
  },
  // 项目/招聘切换
  changeTopType(e) {
    let key = e.currentTarget.dataset.id
    this.setData({
      topType: key,
      zhaopinMask: false,
      xiangmuMask: false,
      xiangmuFilter: '',
      zhaopinFilter: '',
      page: 1,
      xiangmuMask: false,
      quyuChoose: '',
      mini_salary: '',
      max_salary: '',
      projectList: [],
      quartersList: [],
      jingyanChoose: '',
      xueliChoose: '1',
      codeArray: [],
      codeArray2: [],
      region: ['全部', '全部', '全部'],
      region2: ['全部', '全部', '全部'],
      zhouqiChoose: ''
    })
    if (key === 'xiangmu') {
      this.getProjectList()
    } else {
      this.getZhaopinList()
    }
  },
  // 发布帖子
  goReleaseBbs() {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '该功能暂未开放'
    })
    // wx.navigateTo({
    //   url: '../releaseBbs/releaseBbs'
    // })
    // this.setData({
    //   releaseMark: false
    // })
  },
  // 发布岗位
  goReleaseGangwei() {
    wx.navigateTo({
      url: '../releaseGangwei/releaseGangwei'
    })
    this.setData({
      releaseMark: false
    })
  },
  // 发布项目
  goReleaseProject() {
    wx.navigateTo({
      url: '../releaseProject/releaseProject'
    })
    this.setData({
      releaseMark: false
    })
  },
  // 进入首页
  goHome() {
    wx.redirectTo({
      url: '../index/index'
    })
  },
  // 发布
  goRelease() {
    this.setData({
      releaseMark: true
    })
  },
  closeRelease() {
    this.setData({
      releaseMark: false
    })
  },
  // 进入论坛
  goBbs() {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: '该功能暂未开放'
    })
    // wx.redirectTo({
    //   url: '../bbs/bbs'
    // })
  },
  // 进入我的
  goMy() {
    wx.redirectTo({
      url: '../my/my'
    })
    // if (this.data.userType === 'engineer' && this.data.userInfo.identity_auth.is_engineer == 2) {
    //   wx.navigateTo({
    //     url: '../renzheng/renzheng'
    //   })
    // } else if (this.data.userType === 'hr' && this.data.userInfo.identity_auth.is_hr == 2) {
    //   wx.navigateTo({
    //     url: '../renzheng/renzheng'
    //   })
    // } else if (this.data.userType === 'agent' && this.data.userInfo.identity_auth.is_agent == 2) {
    //   wx.navigateTo({
    //     url: '../renzheng/renzheng'
    //   })
    // } else {
    //   wx.redirectTo({
    //     url: '../my/my'
    //   })
    // }
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
    // if (this.data.topType === 'xiangmu') {
    //   this.getProjectList()
    // } else {
    //   this.getZhaopinList()
    // }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})