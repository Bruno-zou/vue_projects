class core {
    constructor(arg) {}

    //加法运算
    floatAdd(arg1, arg2) {
        let r1, r2, m
        try {
            r1 = arg1.toString().split(".")[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split(".")[1].length
        } catch (e) {
            r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2))
        return (arg1 * m + arg2 * m) / m
    }

    //减法
    floatSub(arg1, arg2) {
        let r1, r2, m, n
        try {
            r1 = arg1.toString().split(".")[1].length
        } catch (e) {
            r1 = 0
        }
        try {
            r2 = arg2.toString().split(".")[1].length
        } catch (e) {
            r2 = 0
        }
        m = Math.pow(10, Math.max(r1, r2))     //动态控制精度长度    
        n = (r1 >= r2) ? r1 : r2
        return ((arg1 * m - arg2 * m) / m).toFixed(n)
    }

    //乘法
    floatMul(arg1, arg2) {
        let m = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString()
        try {
            m += s1.split(".")[1].length
        } catch (e) {}
        try {
            m += s2.split(".")[1].length
        } catch (e) {}
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    }

    //除法 
    floatDiv(arg1, arg2) {
        let t1 = 0,
            t2 = 0,
            r1, r2
        try {
            t1 = arg1.toString().split(".")[1].length
        } catch (e) {}
        try {
            t2 = arg2.toString().split(".")[1].length
        } catch (e) {}

        r1 = Number(arg1.toString().replace(".", ""))
        r2 = Number(arg2.toString().replace(".", ""))
        return (r1 / r2) * Math.pow(10, t2 - t1)
    }

    //检查手机号
    isPhone(phone) {
        const regp = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
        return regp.test(phone)
    }

    //toast
    toast(tit) {
        wx.showToast({
            title: tit,
            icon: 'none'
        })
    }

    //排序
    sortJson(array, field, reverse) {
        /**              
         * json 数据排序              
         * @param <array> array    原始json字符串              
         * @param <field> string    排序字段             
         * @param <reverse>  string   倒序              
         */
        
        //数组长度小于2 或 没有指定排序字段 或 不是json格式数据
        if (array.length < 2 || !field || typeof array[0] !== "object") return array

        //数字类型排序
        if (typeof array[0][field] === "number") {
            array.sort(function (x, y) { return x[field] - y[field] })
        }

        //字符串类型排序
        if (typeof array[0][field] === "string") {
            array.sort(function (x, y) { return x[field].localeCompare(y[field]) })
        }

        //倒序
        if (reverse) {
            array.reverse()
        }
        return array
    }

}

module.exports = new core()