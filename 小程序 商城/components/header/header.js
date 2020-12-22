const app = getApp()

Component({

    /*
    组件的一些选项
    */    
    options: {
        addGlobalClass: true,
        multipleSlots: true
    },

    /*
    组件的对外属性
    */
    properties: {
        bgColor: {
            type: String,
            default: ''
        },
        isBack: {
            type: [Boolean, false],
            default: false
        },
        bgImage: {
            type: String,
            default: ''
        }
    },

    /*
    组件初始数据
    */
    data: {
        StatusBar: app.local.StatusBar,
        CustomBar: app.local.CustomBar
    },

    /*
    组件方法
    */
    methods: {
        goBack() {
            wx.navigateBack({
                delta: 1
            })
        }
    }

})