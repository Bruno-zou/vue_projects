const app = getApp()
const http = require('../../utils/http')
const goods = require('../../utils/pro')

let that
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		StatusBar: app.local.StatusBar,
		CustomBar: app.local.CustomBar,
		swiperTop: [],
		classList: [],
		goods: [],
		kill: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		that = this
		let killarr = []
		for(let i=0; i<3; i++) {
			killarr.push(goods.list[Math.floor(Math.random()*10)])
		}
		console.log(killarr)
		this.setData({
			goods: goods.list,
			kill: killarr
		})

		this.getClass()
	},

	getClass: function() {
		let classArr = []
		for(let i=0; i<10; i++) {
			classArr.push({
				imgurl: `../../static/class/c${i}.png`,
				categoryname: '分类'+i
			})
		}

		this.setData({
			classList: classArr
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