const util = require('../../utils/util')
const api = require('../../api/api')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    // this.util();
    this.getHeight();
  },
  util: function (obj) {
    console.log(obj);
    console.log(-obj.list);
    var continueTime = (parseInt(obj.list / obj.container) + 1) * 400;
    var setIntervalTime = 500 + continueTime;

    var animation = wx.createAnimation({
      duration: 5,  //动画时长
      timingFunction: "linear", //线性
      delay: 0  //0则不延迟
    });
    this.animation = animation;
    animation.translateY(20).step({ duration: 400, timingFunction: 'step-start' }).translateY(-24).step({ duration: continueTime });
    this.setData({
      animationData: animation.export()
    })
    setInterval(() => {
      animation.translateY(20).step({ duration: 400, timingFunction: 'step-start' }).translateY(-24).step({ duration: continueTime });
      this.setData({
        animationData: animation.export()
      })
    }, 2000)
    // setInterval(() => {
    //   animation.translateY(50).step({ duration: 50, timingFunction: 'step-start' }).translateY(-250).step({ duration: 5000 });
    //   this.setData({
    //     animationData: animation.export()
    //   })
    // }, 6000)
  },
  getHeight() {
    var obj = new Object();
    //创建节点选择器
    var query = wx.createSelectorQuery();
    query.select('.container').boundingClientRect()
    query.select('.list').boundingClientRect()
    query.exec((res) => {
      obj.container = res[0].height; // 框的height
      obj.list = res[1].height; // list的height
      // return obj;
      this.util(obj);
      console.log(obj)
      console.log('obj')
    })
  }
})