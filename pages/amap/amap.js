import amapFile from '../../libs/amap-wx.js'
import { KEY } from '../../libs/config.js'
const myAmapFun = new amapFile.AMapWX({key: KEY});
const app = getApp()
const {
  PATHS
} = app.globalData

Page({
  data: {
    markers: [],
    distance: '',
    cost: '',
    polyline: [],
    steps_info: [],
    steps_info_points: [],
    currentItem: 0
  },
  onLoad: function() {
    // 解析路由跳转传过来的参数
    const { pathId } = this.options
    const path = PATHS.find(item => +item.id === +pathId)
    const { markers, positions, steps_info } = this.parseOptions(path)
    this.setData({ steps_info,  markers })
    var that = this;
    let polyline_points = [];
    const GETAllPath = positions.map(position => {
      return this.GETAmapPath(position)
    })
    Promise.all(GETAllPath)
      .then(result => {
        return [
          result.reduce((allPoints = [], points) => {
          return allPoints.concat(points)
        }),
        result
        ]
      })
      .then(([allPoints, result]) => {
        this.setData({
          steps_info_points: result,
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
  parseOptions(path) {
    const markers = path.points.map((point, index) => {
      const imgName = index === 0
        ? 'mapicon_navi_s'
        : (index !== path.points.length - 1) 
          ? 'marker'
          : 'mapicon_navi_e'
      const iconPath = `../../img/${imgName}.png`
      return { 
        id: index,
        iconPath,
        latitude: point.position[0],
        longitude: point.position[1],
        width: 23,
        height: 33
      }
    })
    const positions = []
    for (let i = 0; i < path.points.length - 1; i++) {
      positions.push([
        `${path.points[i].position[1]},${path.points[i].position[0]}`,
        `${path.points[i + 1].position[1]},${path.points[i + 1].position[0]}`,
      ])
    }
    const steps_info = []
    for (let i = 0; i < path.points.length - 1; i++) {
      steps_info.push({
        from: path.points[i].name,
        to: path.points[i + 1].name
      })
    }
    return { markers, positions, steps_info }
  },
  tagChoose: function (event) {
    const a = myAmapFun
    debugger
    console.log(22222222)
    var id = event.currentTarget.dataset.id;
    //设置当前样式
    this.setData({
      'currentItem': id
    })
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