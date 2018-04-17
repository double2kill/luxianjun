import amapFile from '../../libs/amap-wx.js'
import { KEY } from '../../libs/config.js'
const myAmapFun = new amapFile.AMapWX({key: KEY});

Page({
  data: {
    markers: [],
    distance: '',
    cost: '',
    polyline: []
  },
  onLoad: function() {
    // 解析路由跳转传过来的参数
    let { points = "[]" } = this.options
    const { markers, positions } = this.parseOptions(points)
    this.setData({ markers })
    var that = this;
    let polyline_points = [];
    const GETAllPath = positions.map(position => {
      return this.GETAmapPath(position)
    })
    Promise.all(GETAllPath)
      .then(result => {
        return result.reduce((allPoints = [], points) => {
          return allPoints.concat(points)
        })
      })
      .then(allPoints => {
        this.setData({
          polyline: [{
            points: allPoints,
            color: "#0091ff",
            width: 6
          }]
        });
      })
  },
 
  GETAmapPath([origin, destination]) {
    return new Promise((resolve, reject) => {
      myAmapFun.getDrivingRoute({
        origin,
        destination,
        success: function(data){
          let points = []
          if(data.paths && data.paths[0] && data.paths[0].steps){
            const { steps } = data.paths[0]
            steps.forEach(step => {
              const poLens = step.polyline.split(';')
              poLens.forEach(poLen => {
                points.push({
                  longitude: parseFloat(poLen.split(',')[0]),
                  latitude: parseFloat(poLen.split(',')[1])
                })
              })
            })
          }
          resolve(points)
        },
        fail: function (data) {
        }
      })
    })
  },
  parseOptions(points) {
    points = JSON.parse(points)
    const markers = points.map((point, index) => {
      const imgName = index === 0
        ? 'mapicon_navi_s'
        : (index !== points.length - 1) 
          ? 'marker'
          : 'mapicon_navi_e'
      const iconPath = `../../img/${imgName}.png`
      return { 
        id: index,
        iconPath,
        latitude: point[0],
        longitude: point[1],
        width: 23,
        height: 33
      }
    })
    const positions = []
    for(let i = 0; i < points.length - 1; i++) {
      positions.push([
        `${points[i][1]},${points[i][0]}`,
        `${points[i + 1][1]},${points[i + 1][0]}`,
      ])
    }
    return { markers, positions }
  },
  goDetail: function(){
    wx.navigateTo({
      url: '../navigation_car_detail/navigation'
    })
  },
  goToCar: function (e) {
    wx.redirectTo({
      url: '../navigation_car/navigation'
    })
  },
  goToBus: function (e) {
    wx.redirectTo({
      url: '../navigation_bus/navigation'
    })
  },
  goToRide: function (e) {
    wx.redirectTo({
      url: '../navigation_ride/navigation'
    })
  },
  goToWalk: function (e) {
    wx.redirectTo({
      url: '../navigation_walk/navigation'
    })
  }
})