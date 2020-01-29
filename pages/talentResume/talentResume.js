// pages/talentResume/talentResume.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    // userInfo: null,
    page: 1,
    loading: false,
    maskOnOff: false,
    topFilterBtn: '',
    // quyuData: [],
    // quyuChoose: '',
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
    yuexinData: [
      [{
        id: '1',
        name: '不限'
      }, {
        id: '2',
        name: '2K以下'
      }, {
        id: '3',
        name: '2K-5K'
        }],
      [{
        id: '4',
        name: '5K-10K'
      }, {
        id: '5',
        name: '10K-15K'
      }, {
        id: '6',
        name: '15K-25K'
        }],
      [{
        id: '7',
        name: '25K-50K'
      }, {
        id: '8',
          name: '50K以上'
      }, {
        id: '',
        name: null
      }]
    ],
    yuexinChoose: 1,
    listData: [],
    region: ['全部', '全部', '全部'],
    customItem: '全部',
    codeArray: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // userInfo: app.globalData.userInfo,
      imgSrc: app.globalData.imgSrc
    })
    // this.gitArea()
    this.getList()
  },
  // 取消省市区选择
  bindcancel() {
    this.setData({
      region: ['全部', '全部', '全部']
    })
  },
  // 省市区选择改变
  bindRegionChange: function (e) {
    console.log(e.detail.code)
    this.setData({
      region: e.detail.value,
      codeArray: e.detail.code,
      page: 1,
      listData: []
    })
    this.getList()
  },
  // 区域筛选确定
  // quyuChooseFilter(e) {
  //   let id = e.currentTarget.dataset.id
  //   this.setData({
  //     page: 1,
  //     maskOnOff: false,
  //     quyuChoose: id,
  //     jingyanChoose: '',
  //     yuexinChoose: 1,
  //     listData: []
  //   })
  //   this.getList()
  // },
  // 经验筛选确定
  jingyanChooseFilter(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      page: 1,
      maskOnOff: false,
      // quyuChoose: '',
      jingyanChoose: id,
      yuexinChoose: 1,
      listData: []
    })
    this.getList()

  },
  // 月薪确定
  yuexinChooseFilter(e) {
    let id = e.currentTarget.dataset.id
    this.setData({
      page: 1,
      maskOnOff: false,
      // quyuChoose: '',
      jingyanChoose: '',
      yuexinChoose: id,
      listData: []
    })
    this.getList()
  },
  goResumeDetail(e) {
    wx.navigateTo({
      url: `../resumeDetail/resumeDetail?id=${e.currentTarget.dataset.id}`
    })
  },
  // 获取区域
  // gitArea() {
  //   wx.request({
  //     url: `${app.globalData.baseUrl}/Addr/city2DistrictList.html`,
  //     data: {
  //       sess_key: app.globalData.sess_key,
  //       city_code: this.data.userInfo.city_code
  //     },
  //     method: 'POST',
  //     success: (res) => {
  //       let listData = res.data.bizobj.data.area_list
  //       listData.unshift({
  //         district_code: '',
  //         district_name: '不限'
  //       })
  //       console.log(listData)
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
  //             district_name: null
  //           })
  //         }
  //         hangyeData[n++] = newArr
  //       }
  //       this.setData({
  //         quyuData: hangyeData
  //       })
  //       console.log(hangyeData)
  //     },
  //     fail: (res) => {
  //       wx.showToast({
  //         icon: 'none',
  //         title: '网络请求失败',
  //       })
  //     }
  //   })
  // },
  // 获取简历列表
  getList() {
    this.setData({
      loading: true
    })
    let codeArray = this.data.codeArray
    let prov_code = codeArray[0] || ''
    let city_code = codeArray[1] || ''
    let district_code = codeArray[2] || ''
    wx.request({
      url: `${app.globalData.baseUrl}/Resume/resumeList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        prov_code: prov_code,
        city_code: city_code,
        district_code: district_code,
        job_experience: this.data.jingyanChoose,
        salary_range: this.data.yuexinChoose,
        page_size: 10,
        page: this.data.page
      },
      method: 'POST',
      success: (res) => {
        let listData = res.data.bizobj.data.resume_list
        if (listData.length > 0) {
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
          let newList = this.data.listData
          this.setData({
            listData: [...newList, ...listData],
            page: this.data.page + 1
          })
        }
        this.setData({
          loading: false
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
  // 选择过滤类型弹窗
  topFilter(e) {
    let id = e.currentTarget.dataset.id
    if (id === this.data.topFilterBtn && this.data.maskOnOff) {
      this.setData({
        maskOnOff: false
      })
    } else {
      this.setData({
        topFilterBtn: id,
        maskOnOff: true
      })
    }
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
    this.getList()
  }
})