const app = getApp()
const http = require('../../utils/http')
const goods = require('../../utils/pro')

let that, cid = '', page = 1
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		scroll: 0,
		StatusBar: app.local.StatusBar,
		CustomBar: app.local.CustomBar,
		tit: '',
		list: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		that = this
		this.setData({
			tit: options.tit
		})
		cid = options.cid

		this.getList()
	},

	getList: function() {
		const pageSize = 10

		wx.showLoading({
			title: '飞速加载中...',
			mask: true
		})
		http.post('v1/productinfo/pagelist', {
			categoryids: cid,
			pageSize: pageSize,
			pageNum: page
		}).then(res => {
			console.log(res)
			if(res.data.code === 0) {
				that.setData({
					list: res.data.rows
				})
			}

			wx.hideLoading()
		})
	},

	onPageScroll: function(e) {
		this.setData({
			scroll: e.scrollTop
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

	}

})