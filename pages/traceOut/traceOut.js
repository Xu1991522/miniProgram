// pages/out/out.js
const util = require('../../utils/util')
const api = require('../../api/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    _url: '',
    _q1: '',
    data: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let local_openid = wx.getStorageSync('openid');
    let localUrl = options.url + '?openid=' + local_openid
    this.setData({
      _url: options.url
    })

    //在此函数中获取扫描普通链接二维码参数
    // let q1 = decodeURIComponent(options.q)
    let q1 = wx.getStorageSync('qeryUrl')

    console.log(q1 + 'q1=======outTrace.js')
    if (null == q1 || "undefined" == q1 || "" == q1) {
      this.setData({
        url: localUrl
      })
      // options.url ? this.setData({ url: localUrl }) : wx.navigateBack({ delta: 2 });
    } else {
      this.setData({
        url: q1,
        _q1: q1
      })
      wx.removeStorageSync('qeryUrl')
      console.log(wx.getStorageSync('qeryUrl')+ 'getStory===outTrace.js')
    }
    // options.url ? this.setData({ url: localUrl }) : wx.navigateBack({ delta: 2 });
    // this.bindGetMsg()
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
    // wx.removeStorageSync('qeryUrl')
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
    var that = this
    if (ops.from === 'button') { // 来自页面内转发按钮 
      console.log(ops.target)
    }
    return {
      title: '物种起源U',
      path: 'pages/index/index',
      // path: 'pages/traceOut/traceOut?url=' + that.data._url,
      success: function (res) { // 转发成功 
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) { // 转发失败 
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },

  /**
   * watch
   */
  bindGetMsg: function (e) {
    console.log(e)
  }
})