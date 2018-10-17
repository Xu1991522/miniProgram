//app.js
var util = require('./utils/util')
const api = require('./api/api')
App({
  onLaunch: function (options) {
    // console.log(this.globalData)
    var that = this;
    var local_userInfo = wx.getStorageSync('userIfo')
    var local_openid = wx.getStorageSync('openid')
    console.log(options)
    console.log("全局onLaunch options==" + JSON.stringify(options))
    let q = decodeURIComponent(options.query.q)
    if (q) {
      var local_scanUrl = q
      // wx.setStorageSync('qeryUrl', q)
      console.log("app.js=====local_scanUrl====" + local_scanUrl)
    } else {
      return
    }
  },
  authorized: function(e) {
    console.log('11111111111')
    var that = this
    // 登录
    wx.login({
      success: res => {
        console.log(res)
        console.log('res!!')
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: that.globalData.globalUrl + '/base/login',
          data: {
            code: res.code
          },
          success: function(res) {
            console.log(res.data)
            wx.setStorageSync('openid', res.data.openid)
            if (res.data.success != 200) {
              wx.showModal({
                title: '提示',
                content: '登录失败',
                showCancel: false
              })
            }
          },
          fail: function(res) {
            wx.showModal({
              title: '提示',
              content: '登录失败',
              showCancel: false
            })
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              that.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  editTabBar: function () {
    var tabbar = this.globalData.tabbar,
      currentPages = getCurrentPages(),
      _this = currentPages[currentPages.length - 1],
      pagePath = _this.__route__;
    (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (var i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].pagePath == pagePath) && (tabbar.list[i].selected = true);
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  globalData: {
    userInfo: null,
    globalUrl: "https://sy.yonghui.cn/trace",
    product_types: [],
    localOpenId: '',
    local_userInfo: '',
    local_scanUrl: '',
    tabbar: {
      color: "#000000",
      selectedColor: "#0f87ff",
      backgroundColor: "#ffffff",
      borderStyle: "black",
      list: [
        {
          pagePath: "/pages/tabbar/tabbar",
          text: "项目",
          iconPath: "/images/item.png",
          selectedIconPath: "/images/item_HL.png",
          selected: true
        },
        {
          pagePath: "/pages/address/address",
          text: "通讯录",
          iconPath: "/images/ts.png",
          selectedIconPath: "/images/ts1.png",
          selected: false
        },
        {
          pagePath: "/pages/tabGoods/tabGoods",
          text: "优聚尚品",
          iconPath: "/images/wjj.png",
          selectedIconPath: "/images/wjj1.png",
          selected: false
        }
      ],
      position: "top"
    },
    //blockLian
    blockchain: { currentHash: '--', height: '--', previousHash: '--' },
    blockchainComplete: false, //把“没有数据”设为false，隐藏
    blockchainIdx: 0,
    animationBlockchain: {},
  }
})