// pages/qualityHistory/qualityHistory.js
// 获取应用实例
const util = require('../../utils/util')
const api = require('../../api/api')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qData: [],
    isData: false,
    qTimeList: '',
    goodId: '',
    //分页 start
    isQualitiesSearch: true, // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    pageNum: 1, // 设置加载的第几次，默认是第一次
    callbackcount: 20, //返回数据的个数
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
    winH: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => { // 用这种方法调用，this指向Page
        this.setData({
          winH: res.windowHeight
        });
      }
    })

    console.log(options.goodId)
    this.setData({
      goodId: options.goodId
    })
    this.initResult()
    // var that = this
    // var data = JSON.parse(options.qData)
    // if (data != null && data != '' && data != undefined){
    //   // do something ...
    //   this.setData({
    //     qData: data,
    //     isData: true
    //   })
    //   var timeAry = []
    //   data.forEach((value, key) => timeAry.push(value.test_time))
    //   console.log('timeAry')
    //   console.log(timeAry)
    //   var t2 = timeAry.map(function (v, k) {
    //     let src = new Date(v)
    //     let dev = src.getTime()
    //     return v = util.formatTime(new Date(dev))
    //   })
    //   console.log(t2)
    //   var t3 = t2.map(function (value, key) {
    //     return value = value.split(' ')
    //   })
    //   console.log(t3)
    //   var timeArr = this.data.qData
    //   t3.forEach(function(value,i){
    //     var obj = { t1: value[0], t2: value[1]}
    //     // timeArr.push(obj)
    //     timeArr[i].t1 = value[0]
    //     timeArr[i].t2 = value[1]
    //   })
    //   console.log(timeArr)
    //   this.setData({
    //     qTimeList: timeArr
    //   })
    // } else {
    //   this.setData({
    //     isData: false
    //   })
    // }
  },

  /**
   * getChildData
   */
  getChildData: function(e) {
    let that = this
    const goodId = this.data.goodId
    const pageNum = this.data.pageNum
    let param = '/quality/' + goodId + '/' + pageNum
    //获取子质检历史数据
    util.get(api.globalUrl + param)
    .then(function (res) {
      if (res.data != '' && res.data.code == 200 && res.data.data != null) {
        console.log(res.data.data)
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏
        let resultData = []
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
        that.data.isQualitiesSearch ? resultData = res.data.data : resultData = that.data.qData.concat(res.data.data)
        console.log(resultData)
        that.setData({
          //qualitiesData: resultData, //获取数据数组
          qData: resultData,
          isData: true,
          searchLoading: true, //把"上拉加载"的变量设为true，显示
          searchLoadingComplete: false,
          isQualitiesSearch: false
        })
        var data = res.data.data
        if (data != null && data != '' && data != undefined) {
          var timeAry = []
          data.forEach((value, key) => timeAry.push(value.test_time))
          console.log('timeAry')
          console.log(timeAry)
          var t2 = timeAry.map(function (v, k) {
            let src = new Date(v)
            let dev = src.getTime()
            return v = util.formatTime(new Date(dev))
          })
          console.log(t2)
          var t3 = t2.map(function (value, key) {
            return value = value.split(' ')
          })
          console.log(t3)
          var timeArr = res.data.data
          t3.forEach(function (value, i) {
            var obj = { t1: value[0], t2: value[1] }
            // timeArr.push(obj)
            timeArr[i].t1 = value[0]
            timeArr[i].t2 = value[1]
          })
          console.log(timeArr)
          that.setData({
            qTimeList: timeArr
          })
        } else {
          that.setData({
            isData: false
          })
        }
      }else{
        that.setData({
          //isData: false,
          searchLoadingComplete: true, //把“没有数据”设为true，显示
          searchLoading: false //把"上拉加载"的变量设为false，隐藏
        })
      }
    }).catch(function (res) {
      console.log(res + '14')
      that.setData({
        //isData: false,
        searchLoadingComplete: true, //把“没有数据”设为true，显示
        searchLoading: false //把"上拉加载"的变量设为false，隐藏
      })
    })
  },

  /**
   *滚动到底部触发事件
   */
  searchScrollLower: function () {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        pageNum: that.data.pageNum + 1, //每次触发上拉事件，把pageNum+1
        isQualitiesSearch: false, //触发到上拉事件，把isFromSearch设为为false
        searchLoading: false
      });
      console.log(that.data.pageNum)
      that.getChildData();
    }
  },

  /**
   * 初始化数据
   */
  initResult: function (e) {
    let that = this
    that.setData({
      pageNum: 1, //第一次加载，设置1
      qData: [], //放置返回数据的数组,设为空
      isQualitiesSearch: true, //第一次加载，设置true
      searchLoading: true, //把"上拉加载"的变量设为true，显示
      searchLoadingComplete: false //把“没有数据”设为false，隐藏
    })
    that.getChildData();
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
  
  }
})