// pages/enterprise/enterprise.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loading: false,
    page: 1,
    imgSrc: '',
    topFilterBtn: '',
    filterBtn: '',
    maskOnOff: false,
    filterTitle: '',
    filterList: [],
    rongziData: [
      [
        {
          id: 8,
          name: "不需要融资"
        },
        {
          id: 1,
          name: "未融资"
        },
        {
          id: 2,
          name: "天使轮"
        }
      ],
      [
        {
          id: 3,
          name: "A轮"
        },
        {
          id: 4,
          name: "B轮"
        },
        {
          id: 5,
          name: "C轮"
        }
      ],
      [
        {
          id: 6,
          name: "D轮及以上"
        },
        {
          id: 7,
          name: "上市公司"
        },
        {
          name: null
        }
      ]
    ],
    rongziDataFilter: 0,
    guimoData: [
      [
        {
          id: '',
          name: "不限"
        },
        {
          id: 1,
          name: "少于15人"
        },
        {
          id: 2,
          name: "15-50人"
        }
      ],
      [
        {
          id: 3,
          name: "50-150人"
        },
        {
          id: 4,
          name: "150-500人"
        },
        {
          id: 5,
          name: "500-2000人"
        }
      ],
      [
        {
          id: 6,
          name: "2000人以上"
        }
      ]
    ],
    guimoDataFilter: '',
    hangyeData: [],
    hangyeDataFilter: '',
    listData: []
  },
  // ["不限", "移动互联网", "电子商务"],
  // ["社交网络", "企业服务", "O2O"],
  // ["教育", "游戏", "旅游"],
  // ["金融", "医疗健康", "生活服务"],
  // ["信息安全", "数据服务", "广告营销"],
  // ["文化娱乐", "硬件", "分类信息"],
  // ["招聘", "其他", ""]
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgSrc: app.globalData.imgSrc
    })
    this.getHangye()
    this.getList()
  },
  // 获取行业
  getHangye () {
    wx.request({
      url: `${app.globalData.baseUrl}/Work/lineList.html`,
      data: {
        sess_key: app.globalData.sess_key
      },
      method: 'POST',
      success: (res) => {
        let data = res.data.bizobj.data.line_list
        data.unshift({
          id: '',
          name: '不限'
        })
        console.log(data)
        let hangyeData = []
        let length = parseInt(data.length / 3)
        let n = 0;
        for (let i = 1; i <= length; i++) {
          var star = (i - 1) * 3;
          hangyeData[n++] = data.slice(star, star + 3);
        }
        let y = data.length - length * 3;
        if (y > 0) {
          let newArr = data.slice(length * 3)
          if (newArr.length === 2) {
            newArr.push({
              id: '',
              name: null
            })
          }
          hangyeData[n++] = newArr
        }
        console.log(hangyeData)
        this.setData({
          hangyeData: hangyeData
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
  // 获取企业列表
  getList() {
    this.setData({
      loading: true
    })
    wx.request({
      url: `${app.globalData.baseUrl}/Company/companyList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        city_id: '',
        financing: this.data.rongziDataFilter,
        scale: this.data.guimoDataFilter,
        re_line_id: this.data.hangyeDataFilter,
        page_size: 10,
        page: this.data.page
      },
      method: 'POST',
      success: (res) => {
        let listData = res.data.bizobj.data.company_list
        console.log(listData)
        if (listData.length > 0) {
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
      if (id === 'rongzi') {
        this.setData({
          filterList: this.data.rongziData,
          filterTitle: '融资阶段',
          filterBtn: this.data.rongziDataFilter,
          topFilterBtn: 'rongzi'
        }, () => {
          this.setData({
            maskOnOff: true
          })
        })
      } else if (id === 'guimo') {
        this.setData({
          filterList: this.data.guimoData,
          filterTitle: '公司规模',
          filterBtn: this.data.guimoDataFilter,
          topFilterBtn: 'guimo'
        }, () => {
          this.setData({
            maskOnOff: true
          })
        })
      } else if (id === 'hangye') {
        this.setData({
          filterList: this.data.hangyeData,
          filterTitle: '行业领域',
          filterBtn: this.data.hangyeDataFilter,
          topFilterBtn: 'hangye'
        }, () => {
          this.setData({
            maskOnOff: true
          })
        })
      }
    }
  },
  // 进入详情
  goEnterpriseInfo(e) {
    wx.navigateTo({
        url: `../enterpriseInfo/enterpriseInfo?id=${e.currentTarget.dataset.id}`
    })
  },
  // 选择过滤内容按钮
  chooseFilter(e) {
    let id = e.currentTarget.dataset.id
    let topFilterBtn = this.data.topFilterBtn
    console.log(id)
    if (topFilterBtn === 'rongzi') {
      this.setData({
        rongziDataFilter: id,
        guimoDataFilter: '',
        hangyeDataFilter: '',
        page: 1,
        listData: []
      })
      this.getList()
    } else if (topFilterBtn === 'guimo') {
      this.setData({
        rongziDataFilter: 0,
        guimoDataFilter: id,
        hangyeDataFilter: '',
        page: 1,
        listData: []
      })
      this.getList()
    } else if (topFilterBtn === 'hangye') {
      this.setData({
        rongziDataFilter: 0,
        guimoDataFilter: '',
        hangyeDataFilter: id,
        page: 1,
        listData: []
      })
      this.getList()
    }
    this.setData({
      maskOnOff: false
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
    this.getList()
  }
})