// pages/history/history.js
const util = require('../../utils/util')
const api = require('../../api/api')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList:[],
    record: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData)
    this.getHistory()
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
  
  },

  /**
   * 获取openid
   */
  // login: function () {
  //   var that = this
  //   wx.login({
  //     success: function (res) {
  //       console.log(res.code)
  //       that.setData({
  //         localOpenId: res.code 
  //       })
  //     }
  //   })
  // },

  /**
   * 获取溯源历史记录 getHistory
   */
  getHistory: function () {
    var that = this
    let local_openid = wx.getStorageSync('openid'); 
    util.get(api.traceUrl + '/history', { openid: local_openid})
      .then(function (res) {
        if (res.data.success == 200 && res.data.data.search_list != '' && res.data.data.search_list != null && res.data.data.search_list != undefined) {
          //that.setData({ goodsList: res.data.data })
          console.log(res.data.data)
          that.setData({
            historyList: res.data.data.search_list,
            record: true
          })
        } else {
          that.setData({
            record: false
          })
        }
      }).catch(function (res) {
        console.log(res + '14')
      })
  }
})