// pages/myTask/myTask.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    tabType: '0',
    listData: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      imgSrc: app.globalData.imgSrc,
      listData: []
    })
    this.getDataList()
  },
  // 切换类型
  chooseType(e) {
    let key = e.currentTarget.dataset.id
    this.setData({
      tabType: key,
      listData: []
    })
    this.getDataList()
  },
  // 获取数据
  getDataList() {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/Project/myProjectList.html`,
      data: {
        sess_key: app.globalData.sess_key,
        status: this.data.tabType,
        page: 1,
        page_size: 99999
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
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
          listData: listData
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
  // 接受
  accept(e) {
    wx.showLoading({
      mask: true,
      title: '接受中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/Project/beginProject.html`,
      data: {
        sess_key: app.globalData.sess_key,
        id: e.currentTarget.dataset.id
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          wx.showToast({
            title: '接受成功',
            mask: true,
            icon: 'success',
            success: () => {
              this.getDataList()
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
  },
  // 进入项目详情
  goDetail (e) {
    wx.navigateTo({
      url: `../projectDetail/projectDetail?id=${e.currentTarget.dataset.id}`
    })
  },
  // 工时核对
  goCheckTime(e) {
    let id = e.currentTarget.dataset.id
    let name = e.currentTarget.dataset.name
    let company = e.currentTarget.dataset.company
    let hourstatus = e.currentTarget.dataset.hourstatus
    // let hourstatus = 0
    if (hourstatus == 0 || hourstatus == 1) {
      wx.navigateTo({
        url: `../checkTime/checkTime?id=${id}&name=${name}&company=${company}&hourstatus=${hourstatus}&fromStep=1`
      })
    } else if (hourstatus == 2) {
      wx.navigateTo({
        url: `../checkTimeStep/checkTimeStep?id=${id}&name=${name}&company=${company}&hourstatus=${hourstatus}`
      })
    } else if (hourstatus == 3) {
      wx.navigateTo({
        url: `../checkTimeStep/checkTimeStep?id=${id}&name=${name}&company=${company}&hourstatus=${hourstatus}`
      })
    } else if (hourstatus == 4) {
      wx.navigateTo({
        url: `../checkTimePull/checkTimePull?id=${id}&fromStep=1`
      })
    } else if (hourstatus == 5) {
      wx.navigateTo({
        url: `../checkTimeStep/checkTimeStep?id=${id}&name=${name}&company=${company}&hourstatus=${hourstatus}`
      })
    } else if (hourstatus == 6) {
      wx.navigateTo({
        url: `../checkTimeStep/checkTimeStep?id=${id}&name=${name}&company=${company}&hourstatus=${hourstatus}`
      })
    } else if (hourstatus == 7) {
      wx.navigateTo({
        url: `../checkTimePullLast/checkTimePullLast?id=${id}&fromStep=1`
      })
    } else if (hourstatus == 8) {
      wx.navigateTo({
        url: `../checkTimeStep/checkTimeStep?id=${id}&name=${name}&company=${company}&hourstatus=${hourstatus}`
      })
    } else if (hourstatus == 9) {
      wx.navigateTo({
        url: `../checkTimeStep/checkTimeStep?id=${id}&name=${name}&company=${company}&hourstatus=${hourstatus}`
      })
    }
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
})