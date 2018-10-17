// pages/newsOut/newsOut.js
// pages/out/out.js
const util = require('../../utils/util')
const api = require('../../api/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '',
    newsId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _openid = options.newsId
    this.setData({
      newsId: options.newsId
    })
    console.log(_openid)
    // let _pageNum = that.data.newsPageNum
    let pageNum = _openid.toString()
    var _url = api.baseUrl + '/shianmessage/' + pageNum
    console.log(_url)
    this.setData({
      url: _url
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
    var that = this
    if (ops.from === 'button') { // 来自页面内转发按钮 
      console.log(ops.target)
    }
    return {
      title: '物种起源U',
      // path: 'pages/index/index',
      path: 'pages/newsOut/newsOut?newsId=' + that.data.newsId,
      success: function (res) { // 转发成功 
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) { // 转发失败 
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }
})