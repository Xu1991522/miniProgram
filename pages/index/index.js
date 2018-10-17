// pages/index/index.js
// 获取应用实例
const util = require('../../utils/util')
const api = require('../../api/api')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _true: true,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showModalStatus: true,
    currentTab: 1,
    tabCont: [],
    goodsList: [],
    blockchain: { currentHash: '--', height: '--', previousHash: '--' },
    blockchainComplete: false, //把“没有数据”设为false，隐藏
    blockchainIdx: 0,
    //tab show or hidden
    winH: '',
    scrollHidden: false,
    scrollTop: '',
    scrollScan: false,
    //tabbar on
    tabbarOn1: false,
    tabbarOn2: false,
    tabbarOn3: true,
    //tabbar-list
    tabbarList: [
      { id: 1, name: '5优生鲜标准'},
      { id: 2, name: '食安快讯' },
      { id: 3, name: '优聚尚品' }
    ],
    activeTabbarId: 1,
    //newsList
    newsList: [],
    //食安快讯分页 start
    isNewsSearch: true, // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    newsPageNum: 1, // 设置加载的第几次，默认是第一次
    callbackcount: 20, //返回数据的个数
    newsSearchLoading: false, //"上拉加载"的变量，默认false，隐藏
    newsSearchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
    // winH: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
    //get tabbar
    //app.editTabBar()
    //get scroll height
    wx.getSystemInfo({
      success: (res) => { // 用这种方法调用，this指向Page
        console.log(res)
        console.log('scroll res')
        this.setData({
          winH: res.windowHeight
        });
      }
    })
    console.log(this.data.winH +', winH')
    //get blockLian
    //app.initBlockchain()
    // animation
    // login
    var start_userInfo = wx.getStorageSync('userIfo');
    var start_openid = wx.getStorageSync('openid');
    // if (start_userInfo != null && start_userInfo != undefined && start_userInfo != '')
    if (start_openid != null && start_openid != undefined && start_openid != '' && start_userInfo != null && start_userInfo != undefined && start_userInfo != '') {
      this.setData({
        showModalStatus: false
      })
    } else {
      this.setData({
        showModalStatus: true
      })
    }
    this.initBlockchain()
    this.initNews()
    this.getProductTypes()
    this.getProductLists()

    let q1 = decodeURIComponent(options.q)
    console.log(q1 + '===indx.js===q1')
    if(null == q1 || "undefined" == q1 || "" == q1) {
      return
    } else {
      wx.setStorageSync('qeryUrl', q1)
      const aaq = wx.getStorageSync('qeryUrl')
      console.log('setStorage=====q1' + aaq)
      wx.navigateTo({
        url: '../traceOut/traceOut'
      })
    }
  },

  /**
   * 初始化数据
   */
  initNews: function (e) {
    let that = this
    this.setData({
      newsPageNum: 1, //第一次加载，设置1
      newsList: [], //放置返回数据的数组,设为空
      isNewsSearch: true, //第一次加载，设置true
      newsSearchLoading: true, //把"上拉加载"的变量设为true，显示
      newsSearchLoadingComplete: false //把“没有数据”设为false，隐藏
    })
    this.getNewsData();
  },

  /**
   *滚动到底部触发食安快讯分页事件
   */
  newsSearchScrollLower: function () {
    let that = this;
    if (this.data.newsSearchLoading && !this.data.newsSearchLoadingComplete) {
      this.setData({
        newsPageNum: that.data.newsPageNum + 1, //每次触发上拉事件，把newsPageNum+1
        isNewsSearch: false, //触发到上拉事件，把isFromSearch设为为false
        newsSearchLoading: false
      });
      console.log(that.data.newsPageNum)
      this.getNewsData();
    }
  },

  /**
   * 获取食安快讯列表
   */
  getNewsData: function(e) {
    let that = this
    let _pageNum = that.data.newsPageNum
    let pageNum = _pageNum.toString()
    console.log('获取食安快讯列表')
    util.get(api.baseUrl + '/shianmessages/' + pageNum)
    .then(function (res) {
      console.log(res.data)
      console.log(res.data)
      //判断是否有数据，有则取数据
      if (res.data.data != '' && res.data.data != null && res.data.data != undefined) {
        //没有数据了，把“没有数据”显示，把“上拉加载”隐藏
        let resultData = []
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
        that.data.isNewsSearch ? resultData = res.data.data : resultData = that.data.newsList.concat(res.data.data)
        console.log(resultData)
        that.setData({
          newsList: resultData, //获取数据数组
          newsSearchLoading: true, //把"上拉加载"的变量设为true，显示
          newsSearchLoadingComplete: false,
          isNewsSearch: false
        })
      } else {
        that.setData({
          newsSearchLoadingComplete: true, //把“没有数据”设为true，显示
          newsSearchLoading: false //把"上拉加载"的变量设为false，隐藏
        });
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

  /*食安快讯跳转*/
  newsHots: function(e) {
    console.log(e.currentTarget.dataset.newsid)
    var newsId = e.currentTarget.dataset.newsid
    wx.navigateTo({
      url: '../newsOut/newsOut' + '?newsId=' + newsId
    })
  },

  /**
   * 初始化区块链数据
   */
  initBlockchain: function (e) {
    let that = this
    var blockchain = that.data.blockchain || {};
    if (Object.keys(blockchain).length != 0) {
      that.setData({
        blockchainComplete: true 
      })
      //return;
    } else {
      that.setData({
        blockchain: [
          { currentBlockHash: '--', height: '--', previousBlockHash: '--' },
          { currentBlockHash: '--', height: '--', previousBlockHash: '--' }
        ],
        blockchainComplete: false
      })
    }
    that.getBlockchain2();
  },

  /**
   * getBlockchain
   */
  getBlockchain2: function (e) {
    var that = this
    util.get(api.chainUrl + '/block/', {})
      .then(function (res) {
        //判断是否有数据，有则取数据
        if (res.data != 0) {
          // setTimeout(that.getBlockchain3, 1000);
          // that.getBlockchain3()
          let resultData = []
          let normalData = [
            { currentBlockHash: '--', height: '--', previousBlockHash: '--' },
            { currentBlockHash: '--', height: '--', previousBlockHash: '--' }
          ]
          // that.data.blockchainComplete ? resultData = [res.data.data, res.data.data] : resultData = normalData
          // that.data.blockchainComplete ? resultData = [that.data.blockchain3, res.data.data] : resultData = normalData
          that.data.blockchainComplete ? resultData = res.data.data : resultData = normalData
          console.log(resultData)
          that.setData({
            blockchain: resultData,
            blockchainComplete: true
          })
        } else {
          let resultData = []
          resultData = that.data.blockchain
          that.setData({
            blockchain: resultData,
            blockchainComplete: true
          })
        }
      }).catch(function (res) {
        console.log(res + '14')
      })
  },

  /**
   * startBlockchain
   */
  startBlockchain: function (e) {
    var that = this;
    var blockchain = that.data.blockchain || [];
    if (blockchain.length == 0) {
      return;
    }
    this.getBlockchain2()
  },
  /**
   * 启动定时器
   */
  start: function () {
    var that = this
    this.timer = setInterval(that.startBlockchain, 6000)
  },
  /**
   * 清楚定时器
   */
  // end: function () {
  //   clearInterval(this.timer)
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.start()
  },
  /**
   * 滚动监听
   */
  scroll: function (e) {
    var that = this
    console.log(e)
    console.log(e.detail.scrollHeight)
    var _scrollHeight = e.detail.scrollHeight
    this.setData({
      scrollTop: e.detail.scrollTop
    }) 
    console.log(this.data.scrollTop)
    console.log('this.data.scrollTop======')
    if (this.data.scrollTop >= 266) {
      this.setData({
        scrollHidden: true,
        scrollScan: true
      })
    } else {
      this.setData({
        scrollHidden: false,
        scrollScan: false
      })
    } 
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    //this.end()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    //this.end()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function(e) {
    console.log(e)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},

  /**
   * 获取ProductTypes
   */
  getProductTypes: function() {
    var that = this
    util.get(api.baseUrl + '/getProductTypes', {})
      .then(function(res) {
        if (res.data.success == 200) {
          // that.globalData.product_types = res.data.data
          that.setData({
            tabCont: res.data.data
          })
          console.log(res.data.data)
        }
      }).catch(function(res) {
        console.log(res + '14')
      })
  },

  /**
   * getProductLists
   */
  getProductLists: function() {
    var that = this
    util.get(api.baseUrl + '/getProductLists', {
        typeId: that.data.currentTab
      })
      .then(function(res) {
        if (res.data.success == 200) {
          that.setData({
            goodsList: res.data.data
          })
        }
      }).catch(function(res) {
        console.log(res + '14')
      })
  },

  /**溯源查询记录页面跳转 */
  viewHistory: function() {
    console.log('viewHistory')
    wx.navigateTo({
      url: '../history/history'
    })
  },

  /**检测记录页面跳转 */
  viewQualities: function () {
    console.log('viewQualities')
    wx.navigateTo({
      url: '../qualityData/qualityData'
    })
  },

  /**
   * 详情页面跳转
   */
  detailNav: function(e) {
    console.log(e.currentTarget)
    console.log(e.currentTarget.dataset.url)
    console.log(e.currentTarget.dataset.id)
    let detailUrl = e.currentTarget.dataset.url
    let detailId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detailOut/detailOut?detailUrl=' + detailUrl
    })
  },

  /**
   * 扫码溯源
   */
  scan: function() {
    wx.scanCode({
      success: (res) => {
        wx.showLoading({
          title: '处理中...',
        })
        setTimeout(function() {
          wx.hideLoading()
        }, 4000)
        console.log(res)
        let result = res.result
        let code = encodeURI(result)
        // let code = encodeURIComponent(result)
        console.log('code')
        console.log('result')
        console.log(code)
        let str = encodeURI('https://sy.yonghui.cn/trace/qr?productId=921108&traceId=123')
        console.log(str)
        if (res != null) {
          util.get(api.traceUrl + '/scan', {
            qrcode: code
          }).then(function(res) {
            console.log(res)
            console.log('res')
            if (res.data != null && res.data.success == 200) {
              console.log(res.data.router)
              console.log('router')
              wx.navigateTo({
                url: '../traceOut/traceOut' + '?url=' + res.data.router  
              })
            } else {
              wx.hideLoading()
            }
          }).catch(function(res) {
            console.log(res + '14')
          })
        } else {
          util.showModalPromisified({
            title: '',
            content: '暂无溯源信息',
            showCancel: false
          })
        }
      },
      fail: (res) => {
        console.log('scan error !')
      }
    })
  },

  /**tabbarOn */
  swithTtabbar: function (e) {
    var that = this;
    that.setData({
      activeTabbarId: e.target.dataset.current
    });
  },


  /** authorized */
  bindGetUserInfo: function(e) {
    wx.removeStorageSync('userIfo')
    wx.removeStorageSync('openid')
    this.setData({
      showModalStatus: false
    });
    let msg = e.detail.errMsg;
    console.log(e)
    console.log('eeeee')
    // start 
    if (msg === 'getUserInfo:ok') {
      this.setData({
        showModalStatus: false
      });
      wx.setStorageSync('userIfo', e.detail)
    } else {
      wx.removeStorageSync('userIfo')
      this.setData({
        showModalStatus: true
      });
      // app.authorized()
    }
    // end
    app.authorized()
    // console.log(app.globalData)
  },

  // swiper滑动时触发bindchange事件，获取事件对象e获取当前所在滑块的 index，并将其更新至data的currentTab中，视图渲染通过判断currentTab的让对应的tab hover。
  GetCurrentTab: function(e) {
    console.log(e.detail.current);
    var that = this
    this.setData({
      currentTab: e.detail.current
    });
    // console.log("11111"+this.data.currentTab);

  },
  swithNav: function(e) {
    var that = this;
    that.setData({
      currentTab: e.target.dataset.current
    });
    //
    util.get(api.baseUrl + '/getProductLists', {
        typeId: that.data.currentTab
      })
      .then(function(res) {
        if (res.data.success == 200) {
          that.setData({
            goodsList: res.data.data
          })
          console.log(res.data.data.pic_url)
        }
      }).catch(function(res) {
        console.log(res + '14')
      })
  },

  /**
   * model reDedind
   */
  powerDrawer: function(e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.ant(currentStatu)
  },
  ant: function(currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长
      timingFunction: "linear", //线性
      delay: 0 //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    setTimeout(function() {
      // 执行第二组动画
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })
    }.bind(this), 200)

    // 显示
    if (currentStatu == "open") {
      this.setData({
        showModalStatus: true
      });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') { // 来自页面内转发按钮 
      console.log(ops.target)
    }
    return {
      title: '物种起源U',
      path: 'pages/index/index',
      success: function (res) { // 转发成功 
        console.log("转发成功:" + JSON.stringify(res));
      },
      fail: function (res) { // 转发失败 
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  }

})