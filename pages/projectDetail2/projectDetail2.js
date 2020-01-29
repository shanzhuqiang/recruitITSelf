// pages/postDetail/postDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    imgSrc: '',
    job_info: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getInfo(options.id)
    this.setData({
      imgSrc: app.globalData.imgSrc,
      id: options.id
    })
  },
  // 改变项目状态
  changeStatus(key) {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/Apply/changeOperateStatus.html`,
      data: {
        sess_key: app.globalData.sess_key,
        operate_status: key,
        id: this.data.id,
        type: 2
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          wx.showToast({
            title: '操作成功',
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
  changeStatus2(e) {
    let key = e.currentTarget.dataset.id
    if (this.data.job_info.operate_status == key) {
      return false
    }
    wx.showModal({
      title: '提示',
      confirmText: "联系客服",
      content: `如您已经享受平台服务我们将扣除30%作为服务费`,
      success: (res) => {
        if (res.confirm) {
          this.bottomBtn(key)
        }
      }
    })
  },
  // 联系后台
  bottomBtn(key) {
    wx.request({
      url: `${app.globalData.baseUrl}/User/getHrServiceMobile.html`,
      data: {
        sess_key: app.globalData.sess_key
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code == 0) {
          let phoneNumber = "010-68698480"
          if (res.data.bizobj.company_info.service_mobile) {
            phoneNumber = res.data.bizobj.company_info.service_mobile
          }
          wx.makePhoneCall({
            phoneNumber: phoneNumber
          })
          wx.request({
            url: `${app.globalData.baseUrl}/Apply/changeOperateStatus.html`,
            data: {
              sess_key: app.globalData.sess_key,
              operate_status: key,
              id: this.data.id,
              type: 2
            },
            method: 'POST',
            success: (res) => {
              wx.hideLoading()
              if (res.data.error_code == 0) {
                wx.navigateBack({
                  delta: 1
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
  changeStatus3(e) {
    let key = e.currentTarget.dataset.id
    if (this.data.job_info.operate_status == key) {
      return false
    }
    this.changeStatus(key)
  },
  // 获取项目详情
  getInfo(id) {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/Project/projectDetail.html`,
      data: {
        sess_key: app.globalData.sess_key,
        id: id
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          let data = res.data.bizobj.data.job_info
          if (data.salary_type == 1) {
            data['salaryStr'] = data.day_salary + "元/日"
          } else {
            if (data.max_salary) {
              data['salaryStr'] = Math.round(data.mini_salary / 1000) + 'k-' + Math.round(data.max_salary / 1000) + 'k/月'
            } else {
              data['salaryStr'] = '不限'
            }
          }
          // if (data.max_salary) {
          //   data['salaryStr'] = Math.round(data.mini_salary / 1000) + 'k-' + Math.round(data.max_salary / 1000) + 'k/月'
          // } else {
          //   data['salaryStr'] = '不限'
          // }
          this.setData({
            job_info: data
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