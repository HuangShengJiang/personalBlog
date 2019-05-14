---
title: Lodash
date: 2019-04-18
categories: 
 - Library
tags: 
 - javaScript
 - tool
---
>Lodash 通过降低 array、number、objects、string 等等的使用难度从而让 JavaScript 变得更简单。

## 写在前面
在项目实施的过程中，我们可能经常会发觉JS提供的很多对数组、数字的内置方法不能满足实际的业务需求，这时候我们通常的做法都尝试着自己去实现这些复杂的数据处理方法。当如果在时间比较紧急的情况下，重复造轮子就显得有些浪费时间。所以在没事做的时候，可以学一些别人造的轮子(经过多人验证的代码稳健性也可以得到保障)，在写代码时就可以少写一些。

## 常用方法
作者曾发表过一片文章介绍 lodash 的常用十个用法：

1. 循环N次(_.times)

    ```javascript 1.8
    // 1. Basic for loop.
    for(var i = 0; i < 5; i++) {
        // ....
    }
    
    // 2. Using Array's join and split methods
    Array.apply(null, Array(5)).forEach(function(){
        // ...
    });
    
    // Lodash
    _.times(5, function(){
        // ...
    });
    ```
2. 深层查找属性值(_.map)
    ```javascript 1.8
    // Fetch the name of the first pet from each owner
    var ownerArr = [{
        "owner": "Colin",
        "pets": [{"name":"dog1"}, {"name": "dog2"}]
    }, {
        "owner": "John",
        "pets": [{"name":"dog3"}, {"name": "dog4"}]
    }];
    
    // Array's map method.
    ownerArr.map(function(owner){
       return owner.pets[0].name;
    });
    
    // Lodash
    _.map(ownerArr, 'pets[0].name');
    //["dog1", "dog3"]
    ```
3. 加指定前缀(_.partial 与 _.uniqueId.bind)

    ```javascript 1.8
    // Create an array of length 6 and populate them with unique values. The value must be prefix with "ball_".
    // eg. [ball_0, ball_1, ball_2, ball_3, ball_4, ball_5]
    
    // Array's map method.
    Array.apply(null, Array(6)).map(function(item, index){
        return "ball_" + index;
    });
    
    
    // Lodash
    _.times(6, _.uniqueId.bind(null, 'ball_'));
    // Lodash  partial封装了 bind 方法
    _.times(6, _.partial(_.uniqueId, 'ball_'));
    ```

4. 深拷贝(_.cloneDeep)

    ```javascript 1.8
    var objA = {
        "name": "colin"
    }
    
    // Normal method? Too long. See Stackoverflow for solution: http://stackoverflow.com/questions/4459928/how-to-deep-clone-in-javascript
    
    // Lodash
    var objB = _.cloneDeep(objA);
    objB === objA // false
    ```
    
5. 获取指定范围随机数(_.random)
    ```javascript 1.8
    // Get a random number between 15 and 20.
    
    // Naive utility method
    function getRandomNumber(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    getRandomNumber(15, 20);
    
    // Lodash
    _.random(15, 20);
    
    _.random(20); // Return random number between 0 to 20
    _.random(15, 20, true); // Return random floating numbers between 15 and 20
    ```  

6. 对象拓展(_.assign)
    ```javascript 1.8
    // Adding extend function to Object.prototype
    Object.prototype.extend = function(obj) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                this[i] = obj[i];
            }
        }
    };
    
    var objA = {"name": "colin", "car": "suzuki"};
    var objB = {"name": "james", "age": 17};
    
    objA.extend(objB);
    objA; // {"name": "james", "age": 17, "car": "suzuki"};
    
    // Lodash
    _.assign(objA, objB);
    
    // Lodash 多对象拓展
    _.assign(objA, objB, objC)
    ```

7. 移除对象属性(_.omit)
    ```javascript
    // Naive method: Remove an array of keys from object
    Object.prototype.remove = function(arr) {
        var that = this;
        arr.forEach(function(key){
            delete(that[key]);
        });
    };
    
    var objA = {"name": "colin", "car": "suzuki", "age": 17};
    
    objA.remove(['car', 'age']);
    objA; // {"name": "colin"}
    
    // Lodash
    objA = _.omit(objA, ['car', 'age']); // {"name": "colin"}
    
    
    // Lodash 其他应用例子
    objA = _.omit(objA, 'car'); // {"name": "colin", "age": 17};
    objA = _.omit(objA, _.isNumber); // {"name": "colin"};
    ```

8. 从一个对象中选出指定属性到新的对象中(_.pick)
    ```javascript 1.8
    // Naive method: Returning a new object with selected properties 
    Object.prototype.pick = function(arr) {
        var _this = this;
        var obj = {};
        arr.forEach(function(key){
            obj[key] = _this[key];
        });
    
        return obj;
    };
    
    var objA = {"name": "colin", "car": "suzuki", "age": 17};
    
    var objB = objA.pick(['car', 'age']);
    // {"car": "suzuki", "age": 17}
    
    // Lodash
    var objB = _.pick(objA, ['car', 'age']);
    // {"car": "suzuki", "age": 17}
    ```

9. 从列表中随机选出元素(_.sample)
    ```javascript 1.8
    var luckyDraw = ["Colin", "John", "James", "Lily", "Mary"];
    
    function pickRandomPerson(luckyDraw){
        var index = Math.floor(Math.random() * (luckyDraw.length));
        return luckyDraw[index];
    }
    
    pickRandomPerson(luckyDraw); // John
    
    // Lodash
    _.sample(luckyDraw); // Colin
    
    // Lodash - Getting 2 random item
    _.sample(luckyDraw, 2); // ['John','Lily']
    ```

10. 捕获json转换的错误(_.attempt)
    ```javascript 1.8
    // Using try-catch to handle the JSON.parse error
    function parse(str){
        try {
            return JSON.parse(str);
        }
    
        catch(e) {
            return false;
        }
    }
    
    // With Lodash
    function parseLodash(str){
        return _.attempt(JSON.parse.bind(null, str));
    }
    
    parse('a'); // false
    parseLodash('a'); // Return an error object
    
    parse('{"name": "colin"}'); // Return {"name": "colin"}
    parseLodash('{"name": "colin"}'); // Return {"name": "colin"}
    ```


## 参考链接
1. [Lodash 中文文档](https://www.html.cn/doc/lodash/)
2. [Lodash 英文文档](https://www.lodashjs.com/docs/4.17.5.html)
3. [Lodash: 10 Javascript Utility ](https://colintoh.com/blog/lodash-10-javascript-utility-functions-stop-rewriting)
