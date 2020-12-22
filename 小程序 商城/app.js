const http = require('./utils/http')

App({
  onLaunch: function () {

    //系统信息
    http.getSystem(this)

    //版本更新
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })

    this.singIn()
  },

  //获取用户信息
  userInfo: function () {
    wx.getSetting({
      success: res => {
        const that = this
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            lang: 'zh_CN',
            success: res => {
              that.local.userInfo = res.userInfo

              if (that.userInfoReadyCallback) {
                that.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  //微信授权
  singIn: function () {
    wx.login({
      success: res => {
        console.log(res.code)
        wx.setStorageSync('code', res.code)
      }
    })
  },

  local: {
    userInfo: null,
    StatusBar: '',
    CustomBar: '',
    winHeight: '',
    winWidth: ''
  }

})