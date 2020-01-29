// pages/postDetail/postDetail.js
const app = getApp()
let timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: '',
    userType: '',
    post: false,
    id: '',
    dataInfo: {},
    companyInfo: {},
    shareMask: false,
    maskOnOff: false,
    user_list: [],
    user_listCach: [],
    fromsesskey: null,
    bonus: '',
    showUsertList: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.getInfo(options.id)
    this.setData({
      userType: app.globalData.userType,
      imgSrc: app.globalData.imgSrc,
      id: options.id,
      bonus: options.bonus
    })
    if (options.bonus == 1) {
      this.getUserCollects()
    }
    if (options.fromsesskey) {
      this.setData({
        fromsesskey: options.fromsesskey
      })
    }
  },
  // 获取岗位详情
  getInfo(id) {
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/Work/workDetail.html`,
      data: {
        sess_key: app.globalData.sess_key,
        id: id
      },
      method: 'POST',
      success: (res) => {
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
        this.setData({
          dataInfo: data
        })
        this.getCompany(data.re_company_id)
      },
      fail: (res) => {
        wx.showToast({
          icon: 'none',
          title: '网络请求失败',
        })
      }
    })
  },
  // 获取企业信息
  getCompany (id) {
    wx.request({
      url: `${app.globalData.baseUrl}/Company/companyInfo.html`,
      data: {
        sess_key: app.globalData.sess_key,
        id: id
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        let company_info = res.data.bizobj.data.company_info
        this.setData({
          companyInfo: company_info
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
  // 立即投递
  applyNow() {
    wx.showLoading({
      mask: true,
      title: '投递中...',
    })
    wx.request({
      url: `${app.globalData.baseUrl}/apply/apply.html`,
      data: {
        sess_key: app.globalData.sess_key,
        re_job_id: this.data.id,
        type: 1,
        agent_sess_key: this.data.fromsesskey
      },
      method: 'POST',
      success: (res) => {
        wx.hideLoading()
        if (res.data.error_code == 0) {
          wx.showToast({
            title: '投递成功',
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
  },
  // 图片分享
  sharePhoto() {
    this.setData({
      shareMask: false,
      maskOnOff: true
    })
  },
  // 关闭图片分享
  closeMask() {
    this.setData({
      maskOnOff: false
    })
  },
  // 分享
  shareBtn() {
    this.setData({
      shareMask: true
    })
  },
  // 关闭分享
  cancalShare() {
    this.setData({
      shareMask: false
    })
  },
  // 打开推荐
  shareUser() {
    if (this.data.user_list.length > 0) {
      this.setData({
        showUsertList: true
      })
    } else {
      wx.showModal({
        showCancel: false,
        title: '提示',
        content: '请先关注工程师',
      })
    }
  },
  // 关闭推荐
  toggleshowUsertList() {
    this.setData({
      showUsertList: false
    })
  },
  // 选择推荐的人
  chooseDistrict (e) {
    this.shareUserFn(e.currentTarget.dataset.id)
  },
  // 站内分享方法
  shareUserFn(id) {
    wx.showLoading({
      mask: true,
      title: '推荐中...',
    })
    // 先检测是否已推荐
    wx.request({
      url: `${app.globalData.baseUrl}/Apply/checkRec.html`,
      data: {
        agent_key: app.globalData.sess_key,
        engineer_id: id,
        id: this.data.id,
        type: 1
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code == 0) {
          if (res.data.bizobj.flag == 0) {
            // 0为未推荐过
            let userType = this.data.userType
            wx.request({
              url: `${app.globalData.baseUrl}/work/shareInWork.html`,
              data: {
                sess_key: app.globalData.sess_key,
                user_type: userType === 'engineer' ? 1 : userType === 'hr' ? 2 : 3,
                re_job_id: this.data.id,
                to_user_id: id,
                type: 1
              },
              method: 'POST',
              success: (res) => {
                wx.hideLoading()
                if (res.data.error_code == 0) {
                  wx.showToast({
                    title: '推荐成功',
                    mask: true,
                    icon: 'success',
                    success: () => {
                      this.setData({
                        showUsertList: false
                      })
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
          } else if (res.data.bizobj.flag == 1) {
            wx.hideLoading()
            wx.showModal({
              showCancel: false,
              title: '提示',
              content: '已推荐，请勿重复推荐',
            })
          }
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
  // 搜索工程师
  comIptChange(e) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      let keyWord = e.detail.value
      let user_listCach = this.data.user_listCach
      let user_list = []
      user_listCach.forEach(el => {
        if (el.username.indexOf(keyWord) != -1) {
          user_list.push(el)
        }
      })
      this.setData({
        user_list: user_list
      })
    }, 300)
  },
  // 获取站内关注用户
  getUserCollects() {
    wx.request({
      url: `${app.globalData.baseUrl}/user/collects.html`,
      data: {
        sess_key: app.globalData.sess_key
      },
      method: 'POST',
      success: (res) => {
        if (res.data.error_code == 0) {
          this.setData({
            user_listCach: res.data.bizobj.data.user_list,
            user_list: res.data.bizobj.data.user_list
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '寻猿招聘',
      path: `/pages/index/index`
    }
    // return {
    //   title: '寻猿招聘',
    //   path: `/pages/resumeDetail/resumeDetail?id=${this.data.id}`
    // }
  }
})