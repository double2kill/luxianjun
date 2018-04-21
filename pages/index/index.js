const app = getApp()
const {
  PATHS: paths
} = app.globalData

Page({
  data: {
    paths
  },
  naviToNavi: function (event) {
    const {
      path_id
    } = event.currentTarget.dataset
    wx.navigateTo({
      url: `../amap/amap?pathId=${path_id}`
    })
  }
})