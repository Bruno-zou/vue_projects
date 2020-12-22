class Http {

    baseUrl = 'https://www.iwecore.cn/'

    constructor(arg) {}

    post = (url, data, sign, header = {}) => {
        if (wx.getStorageSync('token') && sign) {
            header.token = wx.getStorageSync('token')
        }
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseUrl + url,
                data: data,
                method: 'POST',
                header: {
                    ...this._header,
                    ...header
                },
                success: res => resolve(res),
                fail: reject
            })
        })
    }

    get = (url, data, sign, header = {}) => {
        if (wx.getStorageSync('token') && sign) {
            header.token = wx.getStorageSync('token')
        }
        return new Promise((resolve, reject) => {
            wx.request({
                url: this.baseUrl + url,
                data: data,
                method: 'GET',
                header: {
                    ...this._header,
                    ...header
                },
                success: res => resolve(res),
                fail: reject
            })
        })
    }

    getSystem = (app) => {
        wx.getSystemInfo({
            success: e => {
                app.local.winHeight = e.windowHeight
                app.local.winWidth = e.windowWidth
                app.local.StatusBar = e.statusBarHeight
              let custom = wx.getMenuButtonBoundingClientRect()
              app.local.CustomBar = custom.bottom + custom.top - e.statusBarHeight
            }
        })
    }

    saveUserInfo = (info) => {
        if(!info) {
            return
        }
        this.post('saveUserInfo', {
            avatar_url: info.avatarUrl,
            nick_name: info.nickName,
            city: info.city,
            sex: info.gender,
            province: info.province
        }, true).then(res => {
            //console.log(res)
        })
    }

    //签名
    getsign = (arr) => {
        let arrs = []
        for(let item in arr) {
            arrs.push(item + '=' + arr[item] + '&')
        }
        arrs = arrs.sort()
        let signStr = ''
        for(let i=0; i<arrs.length; i++) {
            signStr += arrs[i]
        }
        signStr += 'token='+ wx.getStorageSync('token')
        return this.hex_md5(signStr).toUpperCase()
    }

    //MD5 加密
    hexcase = 0

    hex_md5 = (a) => {
        return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(a)))
    }

    hex_hmac_md5 = (a, b) => {
        return this.rstr2hex(this.rstr_hmac_md5(this.str2rstr_utf8(a), this.str2rstr_utf8(b)))
    }

    md5_vm_test = () => {
        return this.hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72"
    }

    rstr_md5 = (a) => {
        return this.binl2rstr(this.binl_md5(this.rstr2binl(a), a.length * 8))
    }

    rstr_hmac_md5 = (c, f) => {
        var e = this.rstr2binl(c);
        if (e.length > 16) {
            e = binl_md5(e, c.length * 8)
        }
        var a = Array(16),
            d = Array(16);
        for (var b = 0; b < 16; b++) {
            a[b] = e[b] ^ 909522486;
            d[b] = e[b] ^ 1549556828
        }
        var g = this.binl_md5(a.concat(this.rstr2binl(f)), 512 + f.length * 8);
        return this.binl2rstr(this.binl_md5(d.concat(g), 512 + 128))
    }

    rstr2hex = (c) => {
        try {
            this.hexcase
        } catch (g) {
            this.hexcase = 0
        }
        var f = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var b = "";
        var a;
        for (var d = 0; d < c.length; d++) {
            a = c.charCodeAt(d);
            b += f.charAt((a >>> 4) & 15) + f.charAt(a & 15)
        }
        return b
    }

    str2rstr_utf8 = (c) => {
        var b = "";
        var d = -1;
        var a, e;
        while (++d < c.length) {
            a = c.charCodeAt(d);
            e = d + 1 < c.length ? c.charCodeAt(d + 1) : 0;
            if (55296 <= a && a <= 56319 && 56320 <= e && e <= 57343) {
                a = 65536 + ((a & 1023) << 10) + (e & 1023);
                d++
            }
            if (a <= 127) {
                b += String.fromCharCode(a)
            } else {
                if (a <= 2047) {
                    b += String.fromCharCode(192 | ((a >>> 6) & 31), 128 | (a & 63))
                } else {
                    if (a <= 65535) {
                        b += String.fromCharCode(224 | ((a >>> 12) & 15), 128 | ((a >>> 6) & 63), 128 | (a & 63))
                    } else {
                        if (a <= 2097151) {
                            b += String.fromCharCode(240 | ((a >>> 18) & 7), 128 | ((a >>> 12) & 63), 128 | ((a >>> 6) & 63), 128 | (a & 63))
                        }
                    }
                }
            }
        }
        return b
    }

    rstr2binl = (b) => {
        var a = Array(b.length >> 2);
        for (var c = 0; c < a.length; c++) {
            a[c] = 0
        }
        for (var c = 0; c < b.length * 8; c += 8) {
            a[c >> 5] |= (b.charCodeAt(c / 8) & 255) << (c % 32)
        }
        return a
    }

    binl2rstr = (b) => {
        var a = "";
        for (var c = 0; c < b.length * 32; c += 8) {
            a += String.fromCharCode((b[c >> 5] >>> (c % 32)) & 255)
        }
        return a
    }

    binl_md5 = (p, k) => {
        p[k >> 5] |= 128 << ((k) % 32);
        p[(((k + 64) >>> 9) << 4) + 14] = k;
        var o = 1732584193;
        var n = -271733879;
        var m = -1732584194;
        var l = 271733878;
        for (var g = 0; g < p.length; g += 16) {
            var j = o;
            var h = n;
            var f = m;
            var e = l;
            o = this.md5_ff(o, n, m, l, p[g + 0], 7, -680876936);
            l = this.md5_ff(l, o, n, m, p[g + 1], 12, -389564586);
            m = this.md5_ff(m, l, o, n, p[g + 2], 17, 606105819);
            n = this.md5_ff(n, m, l, o, p[g + 3], 22, -1044525330);
            o = this.md5_ff(o, n, m, l, p[g + 4], 7, -176418897);
            l = this.md5_ff(l, o, n, m, p[g + 5], 12, 1200080426);
            m = this.md5_ff(m, l, o, n, p[g + 6], 17, -1473231341);
            n = this.md5_ff(n, m, l, o, p[g + 7], 22, -45705983);
            o = this.md5_ff(o, n, m, l, p[g + 8], 7, 1770035416);
            l = this.md5_ff(l, o, n, m, p[g + 9], 12, -1958414417);
            m = this.md5_ff(m, l, o, n, p[g + 10], 17, -42063);
            n = this.md5_ff(n, m, l, o, p[g + 11], 22, -1990404162);
            o = this.md5_ff(o, n, m, l, p[g + 12], 7, 1804603682);
            l = this.md5_ff(l, o, n, m, p[g + 13], 12, -40341101);
            m = this.md5_ff(m, l, o, n, p[g + 14], 17, -1502002290);
            n = this.md5_ff(n, m, l, o, p[g + 15], 22, 1236535329);
            o = this.md5_gg(o, n, m, l, p[g + 1], 5, -165796510);
            l = this.md5_gg(l, o, n, m, p[g + 6], 9, -1069501632);
            m = this.md5_gg(m, l, o, n, p[g + 11], 14, 643717713);
            n = this.md5_gg(n, m, l, o, p[g + 0], 20, -373897302);
            o = this.md5_gg(o, n, m, l, p[g + 5], 5, -701558691);
            l = this.md5_gg(l, o, n, m, p[g + 10], 9, 38016083);
            m = this.md5_gg(m, l, o, n, p[g + 15], 14, -660478335);
            n = this.md5_gg(n, m, l, o, p[g + 4], 20, -405537848);
            o = this.md5_gg(o, n, m, l, p[g + 9], 5, 568446438);
            l = this.md5_gg(l, o, n, m, p[g + 14], 9, -1019803690);
            m = this.md5_gg(m, l, o, n, p[g + 3], 14, -187363961);
            n = this.md5_gg(n, m, l, o, p[g + 8], 20, 1163531501);
            o = this.md5_gg(o, n, m, l, p[g + 13], 5, -1444681467);
            l = this.md5_gg(l, o, n, m, p[g + 2], 9, -51403784);
            m = this.md5_gg(m, l, o, n, p[g + 7], 14, 1735328473);
            n = this.md5_gg(n, m, l, o, p[g + 12], 20, -1926607734);
            o = this.md5_hh(o, n, m, l, p[g + 5], 4, -378558);
            l = this.md5_hh(l, o, n, m, p[g + 8], 11, -2022574463);
            m = this.md5_hh(m, l, o, n, p[g + 11], 16, 1839030562);
            n = this.md5_hh(n, m, l, o, p[g + 14], 23, -35309556);
            o = this.md5_hh(o, n, m, l, p[g + 1], 4, -1530992060);
            l = this.md5_hh(l, o, n, m, p[g + 4], 11, 1272893353);
            m = this.md5_hh(m, l, o, n, p[g + 7], 16, -155497632);
            n = this.md5_hh(n, m, l, o, p[g + 10], 23, -1094730640);
            o = this.md5_hh(o, n, m, l, p[g + 13], 4, 681279174);
            l = this.md5_hh(l, o, n, m, p[g + 0], 11, -358537222);
            m = this.md5_hh(m, l, o, n, p[g + 3], 16, -722521979);
            n = this.md5_hh(n, m, l, o, p[g + 6], 23, 76029189);
            o = this.md5_hh(o, n, m, l, p[g + 9], 4, -640364487);
            l = this.md5_hh(l, o, n, m, p[g + 12], 11, -421815835);
            m = this.md5_hh(m, l, o, n, p[g + 15], 16, 530742520);
            n = this.md5_hh(n, m, l, o, p[g + 2], 23, -995338651);
            o = this.md5_ii(o, n, m, l, p[g + 0], 6, -198630844);
            l = this.md5_ii(l, o, n, m, p[g + 7], 10, 1126891415);
            m = this.md5_ii(m, l, o, n, p[g + 14], 15, -1416354905);
            n = this.md5_ii(n, m, l, o, p[g + 5], 21, -57434055);
            o = this.md5_ii(o, n, m, l, p[g + 12], 6, 1700485571);
            l = this.md5_ii(l, o, n, m, p[g + 3], 10, -1894986606);
            m = this.md5_ii(m, l, o, n, p[g + 10], 15, -1051523);
            n = this.md5_ii(n, m, l, o, p[g + 1], 21, -2054922799);
            o = this.md5_ii(o, n, m, l, p[g + 8], 6, 1873313359);
            l = this.md5_ii(l, o, n, m, p[g + 15], 10, -30611744);
            m = this.md5_ii(m, l, o, n, p[g + 6], 15, -1560198380);
            n = this.md5_ii(n, m, l, o, p[g + 13], 21, 1309151649);
            o = this.md5_ii(o, n, m, l, p[g + 4], 6, -145523070);
            l = this.md5_ii(l, o, n, m, p[g + 11], 10, -1120210379);
            m = this.md5_ii(m, l, o, n, p[g + 2], 15, 718787259);
            n = this.md5_ii(n, m, l, o, p[g + 9], 21, -343485551);
            o = this.safe_add(o, j);
            n = this.safe_add(n, h);
            m = this.safe_add(m, f);
            l = this.safe_add(l, e)
        }
        return Array(o, n, m, l)
    }

    md5_cmn = (h, e, d, c, g, f) => {
        return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(e, h), this.safe_add(c, f)), g), d)
    }

    md5_ff = (g, f, k, j, e, i, h) => {
        return this.md5_cmn((f & k) | ((~f) & j), g, f, e, i, h)
    }

    md5_gg = (g, f, k, j, e, i, h) => {
        return this.md5_cmn((f & j) | (k & (~j)), g, f, e, i, h)
    }

    md5_hh = (g, f, k, j, e, i, h) => {
        return this.md5_cmn(f ^ k ^ j, g, f, e, i, h)
    }

    md5_ii = (g, f, k, j, e, i, h) => {
        return this.md5_cmn(k ^ (f | (~j)), g, f, e, i, h)
    }

    safe_add = (a, d) => {
        var c = (a & 65535) + (d & 65535);
        var b = (a >> 16) + (d >> 16) + (c >> 16);
        return (b << 16) | (c & 65535)
    }

    bit_rol = (a, b) => {
        return (a << b) | (a >>> (32 - b))
    }

}

module.exports = new Http()