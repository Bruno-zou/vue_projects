# 倒计时


**  使用worker子进程进行倒计时 **
可用于秒杀，倒计时等活动时间
不占用主进程-减少阻塞问题

**使用方法**

小程序ps:
1、需要在app.json里面添加workers字段而且需要找到workers代码的目录
2、把workers代码放到static/workers目录下则需要吧static/workers填写为workers的值

uniapp ps:
1、需要在manifest.json找到mp-weixin节点下面添加workers 而且需要找到workers代码的目录
2、把workers代码放到static/workers目录下则需要吧static/workers填写为workers的值


#worker启动时可用参数
| 属性名        | 类型     |  默认值  |  是否必填  |    说明 |
| --------     | -----:   |  :----:  |  :----:  |  :----:  |
| type         | string   |   无     |   是     |  开始结束的条件字段 start:启动计算服务  end:结束并清除定时器
| number       |   Number/Array | 无  |   是    |  需要计算的时间倒计时（秒钟
| customValue  |    string    |  无  | 否  |      倒计时的时间是数组则填写的字段
| overTips  |    string    |  无  | 否  |      倒计时结束显示的字段默认0秒
| timeType  |    Object    |  :  | 否  |      时间显示间隔
```
timeType = {          //自定义展示的 天 时 分 秒
	day:'天',
	hour:'时',
	minute:'分',
	second:'秒'
}
```

** 在uniapp使用方法 **
```
//当前页面定义全局worker整个页面都可使用worker
let worker = null;
	export default {
		data() {},
		onReady() {
			//创建worker连接
			worker= uni.createWorker('/static/workers/index.js');
			//发送开始指令
			worker.postMessage({
				type:'start',    //开始结束的条件字段
				// number:['10','5',],   //倒计时的时间  --秒钟
				// number:10,   //倒计时的时间  --秒钟
				number:[{time:10},{time:5}],   //倒计时的时间  --秒钟
				
				customValue: 'time',     //倒计时的时间是数组---如果没有则吧数组里面的值当成值[]
				// overTips:'倒计时结束',             //倒计时结束展示什么
				
				timeType: {          //自定义展示的 天 时 分 秒
					day:'天',
					hour:'时',
					minute:'分',
					second:'秒'
				}
			})
			
			//worker计算返回结果  --计算结束会返回error字段
			worker.onMessage((res)=>{
				console.log(res); 
			})			
		}
	}
```
