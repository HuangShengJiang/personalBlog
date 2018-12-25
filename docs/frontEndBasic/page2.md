---
title: 金额格式化处理数字，逗号隔开
---
## 记录对数字的千分位符的处理

### 方法一
```javascript
//处理千分位使用
var dealThousands = function(value) {
    if (value === 0) {
        return parseFloat(value).toFixed(2);
    }
    if (value != "") {
        var num = "";
        value += "";//转化成字符串
        value = parseFloat(value.replace(/,/g, '')).toFixed(2);//若需要其他小数精度，可将2改成变量
        if (value.indexOf(".") == -1) {
            num = value.replace(/\d{1,3}(?=(\d{3})+$)/g, function(s) {
                return s + ',';
            });
        } else {
            num = value.replace(/(\d)(?=(\d{3})+\.)/g, function(s) {
                return s + ',';
            });
        }
    } else {
        num = ""
    }
    return num;
}
```

### 方法二
```javascript
/*
 * formatMoney(s,type)
 * 功能：金额按千位逗号分割
 * 参数：s，需要格式化的金额数值.
 * 参数：type，（number类型）金额的小数位.
 * 返回：返回格式化后的数值.
 */
var formatMoney= function(val,type){
    if(val === '' || val === 0) return '0.00'
    val = Number(val)
    if(isNaN(val)) return ''
    return val.toFixed(type).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
 }
```

### 方法三
```javascript
var formatMoney = function(s, type) {
    // if (/[^0-9\.]/.test(s))
    //     return "0.00";
    // if(isNaN(val)) return ''
    if (s == null || s == "" || s == 0)
        return "0.00";
    s = Number(s)
    var result = s;
    if(s<0){
        s=0 - s;
    }
    if(isNaN(s)) return ''
    s = s.toString().replace(/^(\d*)$/, "$1.");
    s = (s + "00").replace(/(\d*\.\d\d)\d*/, "$1");
    s = s.replace(".", ",");
    var re = /(\d)(\d{3},)/;
    while (re.test(s))
        s = s.replace(re, "$1,$2");
    s = s.replace(/,(\d\d)$/, ".$1");
    if (type == 0) {// 不带小数位(默认是有小数位)
        var a = s.split(".");
        if (a[1] == "00") {
            s = a[0];
        }
    }
    if(result<0){
        s = '-'+s
    }
    return s;
}
```

## 参考链接
[金额格式化 处理千分位 金额逗号，隔开](https://segmentfault.com/a/1190000017468557)