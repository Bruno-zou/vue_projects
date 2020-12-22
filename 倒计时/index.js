// 记录定时器
let workerTime = null;

// 一天的时间
const onDay = 60 * 60 * 24;

// 监听主进程发来的事件
worker.onMessage(function(res) {
	startCalc(res);
})

// 返回展示
const showType = {
	day:'天',
	hour:'时',
	minute:'分',
	second:'秒'
}

// 根据主进程事件值做操作
/**
 * @param {Object} res 根据主进程事件值做操作
 */
function startCalc(res) {
	/* 类型  剩余时间  返回展示 自定义数据 数组时时间字段  结束时展示内容 */
	let { type, number, timeType,customValue,overTips = 0 } = res;
	// 开始
	if (type === 'start') {
		/* 如果存在 自定义字段则 */
		if(customValue){
			if(typeof number !== 'object'){
				console.error('内容错误 填写自定义字段时请传入数组');
				return false;
			}
			backArrMessage(res); 
			
			const newTime = () => {
				return res.number.map((item,key)=>{
					if(item[customValue] === undefined){
						console.error(key + '--字段错误 该字段不存在' + customValue + '请检查数组');
						return false;
					}
					(item[customValue] > 0) ? item[customValue]-- : item[customValue] = 0;
					return item;
				})
			}
			workerTime = setInterval(() => {
				res.number = newTime();
				backArrMessage(res);
			}, 1000 * 1);
			return false;
		}
		
		/* 没传入自定义字段 传入数组 */
		if(typeof number === 'object'){
			/* 进来就执行一次 */
			backArrMessage(res);
			
			const newTime = ()=> {
				return res.number.map((item,key)=>{
					(item > 0) ? item-- : item = 0;
					return item;
				})
			}
			
			workerTime = setInterval(() => {
				res.number = newTime();
				backArrMessage(res);
			}, 1000 * 1);
			
			return false;
		}
		
		// 单个值-计算时间
		// 进来直接先进行一次
		backMessage(number, timeType);
		// 计时器是1秒后才开始执行任务
		workerTime = setInterval(() => {
			let downNum = number--;
			backMessage(downNum, timeType);
		}, 1000 * 1);
		
	}
	// 结束
	if (type === 'end') {
		clearTimeout(workerTime);
	}
}


/**
 * check_one 0的时候是否阻止继续
 */
function backTips(number, timeType, check_one = false){
	
	// 多少天
	const days = Math.floor(number / onDay);

	// 剩余天数的-秒数
	const lastDay = days * onDay;

	// 剩余多少小时
	const hours = Math.floor((number - lastDay) / 3600);

	// 剩余分钟的秒数
	const lastMinute = (lastDay + (hours * 3600));

	// 剩余多少分钟
	const minute = Math.floor((number - lastMinute) / 60);

	// 剩余多少秒钟
	const second = Math.floor((number - lastMinute) % 60);

	// 返回的展示数据
	let postInfo = '';
	
	// 展示的字段-传入与默认
	let tipsStr = timeType || showType;
	// 显示
	const showTips = (type) => tipsStr[type] || ':';

	// 开始
	if (check_one && days < 0) {
		// 任务完成时间活动已经开始
		worker.postMessage({
			error: 1
		})
		clearTimeout(workerTime);
		return false;
	}

	// 判断天大于0显示
	days > 0 && (postInfo = `${days}${showTips('day')}`)

	// 小时
	number >= (onDay / 60) && (postInfo += `${hours}${showTips('hour')}`)

	// 分钟
	number >= 60 && (postInfo += `${minute}${showTips('minute')}`)

	// 秒钟
	postInfo += `${second}${showTips('second')}`
	
	return postInfo;
}


// 向主进程反馈值 ----- 传入需要计算的值是数组
function backArrMessage({number, timeType,customValue,overTips}){
	let overNum = 0;
	let backData = [];
	if(customValue){
		for (let item of number) {
			
			const tipsBack = (item[customValue] <= 0 && overTips) || backTips(item[customValue],timeType)
			
			backData.push({
				[customValue]:tipsBack
			})
			
			if(item[customValue] <= 0){
				overNum++;
			}
		}
	}
	else{
		let overNum = 0;
		backData = number.map((item)=>{
			return backTips(item,timeType)
			if(item <= 0){
				overNum++;
			}
		})
	}
	
	/* 已经全局结束 */
	if(overNum === number.length){
		worker.postMessage({
			error: 1
		})
		clearTimeout(workerTime);
		return false;
	}
	worker.postMessage({
		showTime: backData
	})
}

// 向主进程反馈值 ----- 传入需要计算的值是单个
function backMessage(number, timeType) {	
	// 反馈给主进程
	backTips(number, timeType,true) && worker.postMessage({
		showTime: backTips(number, timeType,true)
	})
}
