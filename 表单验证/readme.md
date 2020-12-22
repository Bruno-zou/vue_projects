## 表单验证/数据验证/强大灵活验证

### 家族成员

[【actionSheet弹窗/底部菜单/底部弹出/底部弹出层】](https://ext.dcloud.net.cn/plugin?id=2304)
<br>
[【全局modal弹窗/可覆盖原生/弹出层/alert】](https://ext.dcloud.net.cn/plugin?id=2280)
<br>
欢迎下载匹配使用，统一度更强

### 插件亮点

1、支持批量方法检查<br>
2、支持单一方法检查<br>
3、支持每个字段自由设置检查规则<br>
4、可单独某个字段下某个规则自定义错误信息<br>

### 在你的项目中使用

1、将common复制到你的common下<br>
2、在需要使用的页面<script>中加入：
```
var validate = require("../../common/validate.js");
```
3、开始验证：
```
formSubmit(e) {
	let formData = e.detail.value;
	var rule = [
		{
			// 字段名
			name: 'formName',
			
			// 用于出现错误信息替换英文字段名（不设置此参数则使用英文name）
			nameChn: '字段的中文名',
			
			/*
			验证规则（详细规则请在下方【验证规则说明】中查看）
			格式：['require', 'min:3', ['min', 3]]
			别名格式： ['>', 10] 等同于 ['gt', 10]
			*/
			rules: ['require', ['min', 3]],
			
			/*
			自定义错误信息（如不设置此参数则使用默认信息）
			格式：{
				验证规则的名称(支持别名): '自定错误信息的文本',
				…… …… ……
			}
			*/
			errorMsg: {
				require: '必填项不能为空', 
				min: '公司名称格式：xxxxxxx有限公司'
			},
			*/
		},
		
		…… …… ……
	];
	
	// 是否全部通过，返回Boolean
	validate.check(formData, rule);
	// 获取错误信息
	validate.getError();
	
	// 除了以上批量用法，还支持单一用法
	validate.checkResult('require', formData.formName);
}
```

### 验证规则说明

规则名称  |  用法  |  描述  
-|-|-|
require | ['require'] | 必填项<br>（如不设置此项，则数据不为空时才进行其他规则验证）
number | ['number'] | 是否为数值
chn | ['chn'] | 是否为汉字
chnNum | ['chnNum'] | 是否为汉字和数值
chnOrNum | ['chnOrNum'] | 是否为汉字或数值
alphaLine | ['alphaLine'] | 只能包含英文和下划线，首尾不能是下划线、且不能只是下划线
mobile | ['mobile'] | 手机号码格式验证
alphaNum | ['alphaNum'] | 只能是字母的数字
email | ['email'] | 电子邮箱格式验证
zipCode | ['zipCode'] | 邮政编码格式验证
min | ['min:5' 或 ['min', 5]] | 长度不能小于某值
max | ['max:5' 或 ['max', 5]] | 长度不能大于某值
length | ['length:1,10' 或 ['length', '1,10']] | 在某长度范围内
notbetween | ['notbetween:1,10' 或 ['length', '1,10']] | 不再某长度范围内
in | ['in:1,2,3,5,6,8' 或 ['in', '1,2,3,6,5,89,9']] | 在指定的字符内
notIn | ['notIn:1,2,3,5,6,8' 或 ['notIn', '1,2,3,6,5,89,9']] | 不在指定的字符内
different | ['different:formName' 或 ['different', 'formName']] | 对比两个字段的值是否相同
gt (>) | ['gt:100' 或 ['gt', 100]] | 必须大于某个数值
egt (>=) | ['egt:100' 或 ['egt', 100]] | 必须大于等于某个数值
elt (<=) | ['elt:100' 或 ['elt', 100]] | 必须小于或等于某个数值
lt (<) | ['lt:100' 或 ['lt', 100]] | 必须小于某个数值
eq (= 或 same) | ['eq:100' 或 ['eq', 100]] | 必须等于某个数值
notEq (<> 或 !=) | ['notEq:100' 或 ['notEq', 100]] | 不等于某个数值
regex | ['regex', /(^[1-9]\d*$)/] | 支持使用正则验证