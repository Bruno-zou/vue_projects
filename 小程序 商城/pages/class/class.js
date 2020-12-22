const app = getApp()
const http = require('../../utils/http')

let that, cid = ''
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		StatusBar: app.local.StatusBar,
		CustomBar: app.local.CustomBar,
		classList: [],
		childList: [],
		current: 0
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		that = this

		this.getClass()
	},

	getClass: function() {
		http.post('v1/category/childlist', {
			basecode: 'CategoryManage'
		}).then(res => {
			console.log(res)
			if(res.data.code === 0) {
				that.setData({
					classList: res.data.data
				})

				cid = res.data.data[that.data.current].id
				that.getChild()
			}
		})
	},

	getChild: function() {
		http.post('v1/category/secondchild', {
			parentid: that.data.classList[that.data.current].id
		}).then(res => {
			console.log(res)
			if(res.data.code === 0) {
				that.setData({
					childList: res.data.data
				})
			}
		})
	},

	//切换分类
	switchTab: function(e) {
		const evt = e.currentTarget.dataset
		cid = evt.cid

		this.setData({
			current: evt.ind
		})
		this.getChild()
	}

})