//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
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
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    PATHS: [{
      id: '1',
      name: '上海-福州-大田',
      points: [{
          name: '上海火车站',
          position: [31.249453, 121.455543]
        },
        {
          name: '福州火车站',
          position: [31.249453, 121.455543]
        },
        {
          name: '大田',
          position: [25.69261, 117.84713]
        }
      ]
    }, {
      id: '2',
      name: '昆明-大理-丽江',
      points: [{
          name: '昆明长水国际机场',
          position: [25.0981450000, 102.9299120000],
        },
        {
          name: '昆明火车站',
          position: [25.0159890000, 102.7217160000],
        },
        {
          name: '大理火车站',
          position: [25.5891900000, 100.2497500000],
        },
        {
          name: '丽江火车站',
          position: [26.8108200000, 100.2524200000],
        },
        {
          name: '丽江机场',
          position: [26.6666600000, 100.2481100000],
        },
      ]
    }]
  }
})