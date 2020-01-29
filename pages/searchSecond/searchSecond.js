// pages/searchFirst/searchFirst.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    // userInfo: null,
    dataList: [],
    filterStr: '',
    sortVal: '',
    historyArray: [],
    keyWord: '',
    maskOn: false,
    // quyuData: '',
    // quyuChoose: '',
    jingyanData: [
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
    jingyanChoose: '',
    xueliData: [
      [
        {
          id: 1,
          name: "不限"
        },
        {
          id: 5,
          name: "大专"
        },
        {
          id: 6,
          name: "本科"
        }
      ],
      [
        {
          id: 7,
          name: "硕士"
        }
      ]
    ],
    xueliChoose: '1',
    xinziData: [
      [
        {
          id: 1,
          name: "不限"
        },
        {
          id: 2,
          name: "小于2k"
        },
        {
          id: 3,
          name: "2-5k"
        }
      ],
      [
        {
          id: 4,
          name: "5-10k"
        },
        {
          id: 5,
          name: "10-15k"
        },
        {
          id: 6,
          name: "15-25k"
        }
      ],
      [
        {
          id: 7,
          name: "25-50k"
        },
        {
          id: 8,
          name: "50k+"
        },
        {
          id: '',
          name: null
        }
      ],
    ],
    xinziChoose: 1,
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
    // 获取搜索缓存记录
    this.initGetStorage()
    // 获取区域
    // this.getArea()
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
      dataList: []
    })
    this.getData()
  },
  // 获取搜索缓存记录
  initGetStorage() {
    wx.getStorage({
      key: 'firstSearchKey',
      success: (res) => {
        this.setData({
          historyArray: res.data
        })
      }
    })
  },
  // 点击历史记录搜索
  searchHistory(e) {
    let key = e.currentTarget.dataset.id
    this.setData({
      keyWord: key,
      region: ['全部', '全部', '全部'],
      codeArray: [],
      // quyuChoose: '',
      jingyanChoose: '',
      xueliChoose: '',
      salary_range: '1',
      sortVal: ''
    })
    this.getData()
  },
  // 切换城市
  goChooseCity() {
    wx.navigateTo({
      url: '../chooseCity/chooseCity'
    })
  },
  // 打开默认排序
  openSort() {
    if (this.data.filterStr === 'sort' && this.data.maskOn) {
      this.setData({
        maskOn: false
      }) 
    } else {
      this.setData({
        filterStr: 'sort',
        maskOn: true
      }) 
    }
  },
  // 选择排序方式
  chooseSort(e) {
    this.setData({
      sortVal: e.currentTarget.dataset.id,
      maskOn: false,
      // quyuChoose: '',
      jingyanChoose: '',
      xueliChoose: '',
      salary_range: '1'
    })
    this.getData()
  },
  // 打开过滤
  openFilter() {
    if (this.data.filterStr === 'filter' && this.data.maskOn) {
      this.setData({
        maskOn: false
      })
    } else {
      this.setData({
        filterStr: 'filter',
        maskOn: true
      })
    }
  },
  // 过滤经验
  jingyanChooseFilter (e) {
    this.setData({
      jingyanChoose: e.currentTarget.dataset.id
    })
  },
  // 过滤学历
  xueliChooseFilter(e) {
    this.setData({
      xueliChoose: e.currentTarget.dataset.id
    })
  },
  // 过滤薪资
  xinziChooseFilter(e) {
    this.setData({
      xinziChoose: e.currentTarget.dataset.id
    })
  },
  // 确认筛选
  gangweiConfirm() {
    this.setData({
      maskOn: false,
      sortVal: ''
    })
    this.getData()
  },
  // 输入框内容改变
  clearList(e) {
    let keyWord = e.detail.value
    this.setData({
      keyWord: keyWord
    })
    if (keyWord === '') {
      this.setData({
        dataList: []
      })
    }
  },
  // 确认输入
  iptChange(e) {
    let keyWord = this.data.keyWord
    if (keyWord == "") {
      return false
    }
    this.setData({
      keyWord: keyWord,
      region: ['全部', '全部', '全部'],
      codeArray: [],
      // quyuChoose: '',
      jingyanChoose: '',
      xueliChoose: '',
      salary_range: '1',
      sortVal: ''
    })
    this.getData()
    // 存入本地缓存
    let newHistoryArray = []
    let historyArray = this.data.historyArray
    if (historyArray.length > 4) {
      newHistoryArray = [keyWord, ...historyArray.slice(0, 4)]
    } else {
      newHistoryArray = [keyWord, ...historyArray]
    }
    this.setData({
      historyArray: newHistoryArray
    })
    wx.setStorage({
      key: 'firstSearchKey',
      data: newHistoryArray
    })
  },
  // 获取简历数据
  getData() {
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
        page: 1,
        page_size: 99999,
        keyword: this.data.keyWord,
        sort: this.data.sortVal,
        education: this.data.xueliChoose,
        job_experience: this.data.jingyanChoose,
        salary_range: this.data.xinziChoose
      },
      method: 'POST',
      success: (res) => {
        let listData = res.data.bizobj.data.resume_list
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
          dataList: listData
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
  // 区域选择
  // quyuChooseFilter(e) {
  //   this.setData({
  //     quyuChoose: e.currentTarget.dataset.id
  //   })
  // },
  // 获取区域
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
  // 进入简历详情
  goResumeDetail (e) {
    wx.navigateTo({
      url: `../resumeDetail/resumeDetail?id=${e.currentTarget.dataset.id}`
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