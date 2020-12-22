let price, market, buyNum, list = []
for(let i=1; i<11; i++) {
	price = Math.random()*100
	market = Math.random()*10 + price
	buyNum = Math.floor(Math.random()*1000)

	list.push({
		id: i,
		title: '商品'+i,
		price: price.toFixed(2),
		market: market.toFixed(2),
		buyNum: buyNum
	})

}

module.exports = {
	list: list
}