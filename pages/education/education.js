// pages/education/education.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    xueliArray: [
      {
        id: 1,
        name: '无'
      },
      {
        id: 4,
        name: '高中'
      },
      {
        id: 5,
        name: '大专'
      },
      {
        id: 6,
        name: '本科'
      },
      {
        id: 7,
        name: '硕士'
      },
      {
        id: 8,
        name: '博士'
      }
    ],
    xueli: {},
    intime: '',
    outtime: '',
    id: '',
    name: '',
    major: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      imgSrc: app.globalData.imgSrc,
      id: options.id
    })
    this.getWorkItem(app.globalData.baseInfo)
  },
  // 判断是哪一个工作经历
  getWorkItem(data) {
    if (data.education) {
      let newDataItem = {}
      data.education.forEach((el, index) => {
        if (String(el.id) == String(this.data.id)) {
          newDataItem = el
        }
      })
      console.log(newDataItem)
      this.setData({
        name: newDataItem.name,
        major: newDataItem.major,
        intime: newDataItem.start_time,
        outtime: newDataItem.end_time
      })
      this.data.xueliArray.forEach((el, index) => {
        if (String(el.id) == String(newDataItem.level)) {
          this.setData({
            xueli: el
          })
        }
      })
    }
  },
  // 保存提交
  formSubmit(e) {
    let data = e.detail.value
    console.log('form发生了submit事件，携带数据为：', data)
    if (data.name == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入学校名称',
      })
    } else if (data.major == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请输入专业',
      })
    } else if (data.level == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择学历',
      })
    } else if (data.start_time == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择入学时间',
      })
    } else if (data.end_time == '') {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请选择毕业时间',
      })
    } else {
      let upData = {}
      if (app.globalData.baseInfo.education) {
        // 更新
        upData = {
          sess_key: app.globalData.sess_key,
          re_resume_education_id: this.data.id,
          type: 3,
          name: data.name,
          major: data.major,
          level: this.data.xueli.id,
          start_time: data.start_time,
          end_time: data.end_time
        }
      } else {
        // 添加
        upData = {
          sess_key: app.globalData.sess_key,
          type: 1,
          name: data.name,
          major: data.major,
          level: this.data.xueli.id,
          start_time: data.start_time,
          end_time: data.end_time
        }
      }
      this.updateWork(upData)
    }
  },
  // 修改/增加经验
  updateWork(upData) {
    wx.showLoading({
      mask: true,
      title: '保存中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/Resume/resumeFillEducation.html`,
      data: upData,
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
  // 删除教育经历
  delWork() {
    wx.showModal({
      title: '提示',
      confirmColor: '#0073ff',
      content: '确认删除该经验吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({
            mask: true,
            title: '删除中...',
          })
          wx.request({
            url: `${app.globalData.baseUrl}/Resume/resumeFillEducation.html`,
            data: {
              sess_key: app.globalData.sess_key,
              re_resume_education_id: this.data.id,
              type: 2
            },
            method: 'POST',
            success: (res) => {
              wx.hideLoading()
              if (res.data.error_code == 0) {
                wx.showToast({
                  title: '删除成功',
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
        }
      }
    })
  },
  // 入学时间
  intimeChange(e) {
    this.setData({
      intime: e.detail.value
    })
  },
  // 毕业时间
  outtimeChange(e) {
    this.setData({
      outtime: e.detail.value
    })
  },
  // 学历
  xueliChange(e) {
    console.log(e.detail.value)
    this.setData({
      xueli: this.data.xueliArray[e.detail.value]
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