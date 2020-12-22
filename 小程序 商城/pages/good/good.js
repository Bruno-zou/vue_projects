const app = getApp()
const http = require('../../utils/http')

let that, did = ''
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		StatusBar: app.local.StatusBar,
		CustomBar: app.local.CustomBar,
		alpha: 0,
		info: null,
		speci: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		that = this
		did = options.did
		console.log(did)
		this.getInfo()
	},

	getInfo: function() {
		wx.showLoading({
			title: '飞速加载中...',
			mask: true
		})
		http.post('v1/productinfo/detailkey', {
			baseid: did
		}).then(res => {
			console.log(res)
			if(res.data.code === 0) {
				let imgStr = ''
				res.data.data.descript.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
					imgStr += '<img src="'+ capture +'" style="max-width:100%;display:block">'
				})
				res.data.data.descript = imgStr
				that.setData({
					info: res.data.data
				})
				
				that.getSpeci()
			} else {
				wx.showToast({
				  title: res.data.msg,
				  icon: 'none'
				})

				setTimeout(function() {
					wx.navigateBack({
						delta: 1
					})
				}, 800)
			}
		})
	},

	//获取规格
	getSpeci: function() {
		http.post('v1/productinfo/specinfo', {
			baseid: did
		}).then(res => {
			console.log(res)
			if(res.data.code === 0) {
				that.setData({
					speci: res.data.data
				})
			}
			wx.hideLoading()
		})

		this.getSku()
	},

	//商品sku
	getSku: function() {
		http.post('v1/productinfo/skuinfo', {
			baseid: did
		}).then(res => {
			console.log(res)
			if(res.data.code === 0) {
				
			}
		})
	},

	buy: function() {
		wx.navigateTo({
		  url: '../order/order'
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		http.getSystem(app)
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function () {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function () {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},

	onPageScroll: function(e) {
		const alpha = e.scrollTop/100
		this.setData({
			alpha: alpha
		})
	},

	goBack: function() {
		wx.navigateBack({
			delta: 1
		})
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function () {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	}
})