import amapFile from '../../libs/amap-wx.js'
import { KEY } from '../../libs/config.js'
const myAmapFun = new amapFile.AMapWX({key: KEY});

Page({
  data: {
    markers: [{
      iconPath: "../../img/mapicon_navi_s.png",
      id: 0,
      latitude: 31.249453,
      longitude: 121.455543,
      width: 23,
      height: 33
    }, {
      iconPath: "../../img/mapicon_navi_e.png",
      id: 0,
      latitude: 26.113949,
      longitude: 119.32020,
      width: 24,
      height: 34
    }, {
      iconPath: "../../img/mapicon_navi_e.png",
      id: 0,
      latitude: 25.69261,
      longitude: 117.84713,
      width: 24,
      height: 34
    }],
    distance: '',
    cost: '',
    polyline: []
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
          debugger
        }
      })
    })
  },
  onLoad: function() {
    var that = this;
    var polyline_points = [];
    var positions = [
      // ['116.481028,39.989643', '116.434446,39.90816'],
      [
        `${this.data.markers[0].longitude}, ${this.data.markers[0].latitude}`,
        `${this.data.markers[1].longitude}, ${this.data.markers[1].latitude}`
      ],
      [
        `${this.data.markers[1].longitude}, ${this.data.markers[1].latitude}`,
        `${this.data.markers[2].longitude}, ${this.data.markers[2].latitude}`
      ]
    ]
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

    // this.setData({
    //   polyline: [{
    //     points: points,
    //     color: "#0091ff",
    //     width: 6
    //   }]
    // });
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