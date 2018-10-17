// pages/testData/testData.js
const util = require('../../utils/util')
const api = require('../../api/api')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIdx: '', //当前商品id
    refreshTime: '', // 刷新的时间 
    qualitiesData: [], //放置返回数据的数组
    isQualitiesSearch: true, // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    pageNum: 1, // 设置加载的第几次，默认是第一次
    callbackcount: 20, //返回数据的个数
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏
    searchLoadingComplete: false, //“没有数据”的变量，默认false，隐藏
    winH: '',
    // date of select
    sortTimeList: [
      {
        sortTime: '时间倒序',
        order_typpe: -1
      },
      {
        sortTime: '时间正序',
        order_typpe: 1
      }
    ],
    sortTimeSelected: '时间倒序',
    orderType: -1,//时间倒序
    selected: 0,
    mask1Hidden: true,
    mask2Hidden: true,
    mask3Hidden: true,
    discountSelected1: null,
    selectedNumb1: 0,
    discountSelected2: null,
    selectedNumb2: 0,
    //三级菜单--商品
    sIndex: 0,
    tIndex: 0,
    activeIndex: 0,
    tab:[],
    tabType: [],
    tabTypeChild: '',
    currentType: '',
    //三级菜单--地区
    areaIndex:0,
    third_areaIndex: 0,
    local_activeIndex: 0,
    area: [],
    areaChild: [],
    currentArea: '',
    //search
    currentSearchTxt: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.getSystemInfo({
      success: (res) => { // 用这种方法调用，this指向Page
        this.setData({
          winH: res.windowHeight
        });
      }
    })
   
    this.initResult();
    this.getQualityGoodsTypes()
    this.getQualityAreas()
  },
  /**
   * 获取质检商品信息
   */
  getQualityGoodsTypes: function (e) {
    var that = this
    util.get(api.globalUrl + '/qualityTypes')
    .then(function (res) {
      if (res.data != '' && res.data.code == 200) {
        console.log(res.data.data)
        that.setData({
          tab: res.data.data
        })
        //三级菜单
        var tabData = that.data.tab
        var typeAry = []
        tabData.forEach((value, key) => {
          var obj = { name: value.name, id: value.id }
          typeAry.push(obj)
        })
        var t1 = tabData.map(function (value, key) {
          return value.child
        })
        that.setData({
          tabType: typeAry,
          tabTypeChild: t1
        })
        console.log(typeAry)
      }
    }).catch(function (res) {
      console.log(res + '14')
    })
  },
  /**
   * 获取地区信息
   */
  getQualityAreas: function (e) {
    var that = this
    util.get(api.globalUrl + '/qualityAreas')
      .then(function (res) {
        if (res.data != '' && res.data.code == 200) {
          console.log(res.data.data)
          that.setData({
            area: res.data.data
          })
          //三级菜单
          var tabData = that.data.area
          var typeAry = []
          tabData.forEach((value, key) => {
            var obj = { name: value.name, code: value.code }
            typeAry.push(obj)
          })
          var t1 = tabData.map(function (value, key) {
            return value.child
          })
          that.setData({
            areaChild: t1
          })
          console.log(typeAry)
        }
      }).catch(function (res) {
        console.log(res + '14')
      })
  },
  /**
   * 下拉筛选 start 
   */
  clearSelectedNumb: function (e) {
    if (e.target.dataset.finish == 'type'){
      this.setData({
        discountSelected2: null,
        selectedNumb2: 0,
        currentType: ''
      })
    } else if (e.target.dataset.finish == 'area'){
      this.setData({
        discountSelected1: null,
        selectedNumb1: 0,
        currentArea: ''
      })
    }
  },
  
  discountSelected: function (e) {
    console.log(e.currentTarget.dataset.code)
    console.log(e.currentTarget.dataset.id)
    var area_code = e.currentTarget.dataset.code
    var type_id = e.currentTarget.dataset.id
    if (area_code) {
      this.setData({
        currentArea: area_code,
        discountSelected1: e.currentTarget.dataset.index,
        selectedNumb1: this.data.selectedNumb1 + (this.data.discountSelected1 == null ? 1 : 0)
      })
    }
    if (type_id){
      this.setData({
        currentType: type_id,
        discountSelected2: e.currentTarget.dataset.index,
        selectedNumb2: this.data.selectedNumb2 + (this.data.discountSelected2 == null ? 1 : 0)
      })
    }
  },
  onTapTag: function (e) {
    this.setData({
      selected: e.currentTarget.dataset.index
    });
  },
  mask1Cancel: function () {
    this.setData({
      mask1Hidden: true
    })
  },
  mask2Cancel: function () {
    this.setData({
      mask2Hidden: true
    })
  },
  mask3Cancel: function () {
    this.setData({
      mask3Hidden: true
    })
  },
  onOverallTag: function () {
    this.setData({
      mask1Hidden: false
    })
  },
  onFilter: function () {
    this.setData({
      mask2Hidden: false
    })
  },
  onArea: function () {
    this.setData({
      mask3Hidden: false
    })
  },
  /**
   * 下拉筛选 end
   */
  /**
   * 三级菜单
   */
  changeTab: function (e) {
    console.log(e)
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    })
  },
  changeTab2: function (e) {
    console.log(e)
    this.setData({
      local_activeIndex: e.currentTarget.dataset.index
    })
  },
  s_changeTab: function (e) {
    console.log(e)
    this.setData({
      sIndex: e.currentTarget.dataset.index
    })
  },
  t_changeTab: function (e) {
    console.log(e)
    this.setData({
      tIndex: e.currentTarget.dataset.index
    })
  },
  a_changeTab: function (e) {
    console.log(e)
    this.setData({
      areaIndex: e.currentTarget.dataset.index
    })
  },
  a_changeTab2: function (e) {
    console.log(e)
    this.setData({
      third_areaIndex: e.currentTarget.dataset.index
    })
  },
  /**
   * search-input 
   */
  input: function (e) {
    console.log(e.detail.value)
    if (e.detail.value) {
      this.setData({
        currentSearchTxt: e.detail.value
      })
    } else {
      this.setData({
        currentSearchTxt: ''
      })
    }
  },
  search: function (text) {
    console.log('search')
    this.filterGetQualities()
  },

  /**
   * sortTimeChoosed
   */
  sortTimeChoosed: function(e) {
    console.log(e.currentTarget.dataset.timetype)
    var timeType = e.currentTarget.dataset.timetype
    if (timeType == 1) {
      this.setData({
        sortTimeSelected: '时间正序'
      })
    } else if (timeType == -1) {
      this.setData({
        sortTimeSelected: '时间倒序'
      })
    }
    this.setData({
      orderType: timeType
    })
    console.log(this.data.orderType +'that.data.orderType')
    this.filterGetQualities()
    
  },

  /**
   * area & type filter
   */
  finish: function (e) {
    console.log(e.target.dataset.finish)
    if (e.target.dataset.finish == 'type'){
      this.filterGetQualities()
    }else if (e.target.dataset.finish == 'area'){
      this.filterGetQualities()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.isQualitiesSearch == true){
      this.data.searchLoadingComplete = true
    }else{
      this.data.searchLoadingComplete = false
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {},

  /**
   * 筛选获取质检数据
   */
  filterGetQualities: function (e) {
    var that = this
    this.setData({
      pageNum: 1
    })
    wx.request({
      url: api.globalUrl + '/qualities',
      method: 'POST',
      header: {
        //设置参数内容类型为json
        'content-type': 'application/json'
      },
      data: {
        category: that.data.currentType,
        page_number: 1,//that.data.pageNum,
        goods_name: that.data.currentSearchTxt,
        area_code: that.data.currentArea,
        order_type: that.data.orderType
      },
      success: function (res) {
        console.log(res.data)
        //判断是否有数据，有则取数据
        if (res.data.data != '' && res.data.data != null && res.data.data != undefined) {
          //没有数据了，把“没有数据”显示，把“上拉加载”隐藏
          that.setData({
            qualitiesData: res.data.data,
            searchLoading: true, //把"上拉加载"的变量设为true，显示
            isQualitiesSearch: false,
            searchLoadingComplete: false
          })
        } else {
          that.setData({
            qualitiesData: res.data.data,
            searchLoadingComplete: true, //把“没有数据”设为true，显示
            searchLoading: false, //把"上拉加载"的变量设为false，隐藏
            isQualitiesSearch: true
          });
        }
      }
    })
  },

  /**
   * 获取质检数据 
   */
  getQualities: function() {
    let that = this
    let _pageNum = that.data.pageNum
    let pageNum = _pageNum.toString()
    console.log(pageNum)
    wx.request({
      url: api.globalUrl + '/qualities',
      method: 'POST',
      header: {
        //设置参数内容类型为json
        'content-type': 'application/json'
      },
      data: {
        category: that.data.currentType,
        page_number: that.data.pageNum,
        goods_name: that.data.currentSearchTxt,
        area_code: that.data.currentArea,
        order_type: that.data.orderType
      },
      success: function (res) {
        console.log(res.data)
        //判断是否有数据，有则取数据
        if (res.data.data != '' && res.data.data != null && res.data.data != undefined) {
          //没有数据了，把“没有数据”显示，把“上拉加载”隐藏
          let resultData = []
          //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加
          that.data.isQualitiesSearch ? resultData = res.data.data : resultData = that.data.qualitiesData.concat(res.data.data)
          console.log(resultData)
          that.setData({
            qualitiesData: resultData, //获取数据数组
            searchLoading: true, //把"上拉加载"的变量设为true，显示
            searchLoadingComplete: false,
            isQualitiesSearch: false
          })
        } else {
          that.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示
            searchLoading: false //把"上拉加载"的变量设为false，隐藏
          });
        }
      }
    })
  },
  /**
   *滚动到底部触发事件
   */
  searchScrollLower: function() {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        pageNum: that.data.pageNum + 1, //每次触发上拉事件，把pageNum+1
        isQualitiesSearch: false //触发到上拉事件，把isFromSearch设为为false
      });
      that.getQualities();
    }
  },

  /**
   * 初始化数据
   */
  initResult: function(e) {
    let that = this
    that.setData({
      pageNum: 1, //第一次加载，设置1
      qualitiesData: [], //放置返回数据的数组,设为空
      isQualitiesSearch: true, //第一次加载，设置true
      searchLoading: true, //把"上拉加载"的变量设为true，显示
      searchLoadingComplete: false //把“没有数据”设为false，隐藏
    })
    that.getQualities();
  },

  /**
   * 质检历史跳转
   */
  viewHistory: function (e) {
    console.log(e)
    let goodId = e.currentTarget.dataset.currentidx
    //let goodPage = this.data.pageNum
   //console.log(goodId + ' ' + goodPage)
    //let param = '/quality/' + goodId + '/' + goodPage
    // 获取子质检历史数据
    // util.get(api.globalUrl + param)
    // .then(function (res) {
    //   if (res.data != '' && res.data.code == 200) {
    //     console.log(res.data.data)
    //     let qualityData = JSON.stringify(res.data.data)
    //     wx.navigateTo({
    //       url: '../childQualityHistory/childQualityHistory?qData=' + qualityData
    //     })
    //   }
    // }).catch(function (res) {
    //   console.log(res + '14')
    // })
    wx.navigateTo({
      url: '../childQualityHistory/childQualityHistory?goodId=' + goodId
    })
  },
})