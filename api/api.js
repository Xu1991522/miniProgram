const util = require('../utils/util')
const globalUrl = "https://sy.yonghui.cn/trace" // dev
// const globalUrl = "https://syproduct.yonghui.cn/trace" // build
const qualitiesUrl = globalUrl + "/qualities"
const traceUrl = globalUrl + "/trace"
const baseUrl = globalUrl + "/base"
const chainUrl = globalUrl + "/chain"

//  获取ProductTypes
// const getProductTypes = opts => {
function getProductTypes () {
  var opts = Object.assign({}, defaultOptions, opts)
  const that = this
  wx.request({
    url: opts.requestUrl + '/getProductTypes',
    header: {
      'content-type': 'application/json' // 默认值
    },
    // header: { 'Content-Type': 'application/x-www-form-urlencoded', 'Cookie': 'JSESSIONID=' + that.globalData.sessionId },
    method: opts.method_get,
    success: function (res) {
      // console.log(res.data.data)
      if (res.data.code == 200) {
        that.list = res.data.data
      }
    }
  })
}


module.exports = {
  globalUrl,
  qualitiesUrl,
  baseUrl,
  traceUrl,
  chainUrl
}