## 什么是严格模式
通常我们的JavaScript代码都是在较宽松的条件下运行，也就是正常运行模式，
而JavaScript 严格模式（strict mode）即在严格的条件下运行JavaScript代码。

::: tip 为什么要用严格模式
 - 消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
 - 消除代码运行的一些不安全之处，保证代码运行的安全；
 - 提高编译器效率，增加运行速度；
 - 为未来新版本的Javascript做好铺垫。
:::

## 如何使用
1. 如果需要整个脚本都启用严格模式，在代码文件的第一行一字不漏的写下："use strict";
    ```
        <script>
    　　　　"use strict";
    　　　　 var v = "Hi!  I'm a strict mode script!";
            ……
        </script>
    ```
        
2. 如果只需要部分脚本都启用严格模式，那么最好在函数的第一行写下："use strict";

    ```javascript
        function strict(){
          // 函数级别严格模式语法
          'use strict';
          function nested() { return "And so am I!"; }
          return "Hi!  I'm a strict mode function!  " + nested();
        }
        function notStrict() { return "I'm not strict."; }
    ```

## 有哪些规则
1. 全局变量必须显式声明，平常我们定义一个变量可以不需要`var`声明，但在严格模式下，会报错。
    ```
        "use strict";
        
        a = 2;   //报错
     
        for(i = 0; i < 2; i++) { // 报错，i未声明
     　　
        }  
    ```


2. 禁止使用`with`语句，主要是为了杜绝使用`with`语句可能导致数据泄露，详情移步[JavaScript中 with的用法](https://blog.csdn.net/zwkkkk1/article/details/79725934) 
    ```
        "use strict";
        
        var obj = {
            a: 1
        };
     
        with (obj) {
            a = 3;
        }  //报错
    ``` 
    
3. 创建eval作用域

    正常模式下，Javascript语言有两种变量作用域（scope）：全局作用域和函数作用域。严格模式创设了第三种作用域：eval作用域。
    正常模式下，eval语句的作用域，取决于它处于全局作用域，还是处于函数作用域。严格模式下，eval语句本身就是一个作用域，不再能够生成全局变量了，它所生成的变量只能用于eval内部。
    
    ```
    "use strict";
    
    var x = 5;
    
    console.log(eval('var x = 10;console.log(x)')); //10
    
    console.log(x);  //5
    ```
    
4. 禁止使用`delete`语句,在严格模式下，禁止删除变量和对象的属性。（例外：configurable设置为true的对象属性，才能被删除。）
    
    ```
    "use strict";
    var b = 1;
    
  
   delete b;  //报错：Uncaught SyntaxError: Delete of an unqualified identifier in strict mode.
   
   var o = Object.create(null, {'x': {
   　　　　　　value: 1,
   　　　　　　configurable: false
   }});
   
   delete o.x;   //报错:Uncaught TypeError: Cannot delete property 'x' of [object Object]
   
   var a = {
           n:1
   }
   delete a.n;   //一般不会报错，因为对象的数据属性 configurable 默认为 true
    ```
    
5. 对象不能有重名属性，实际测试（Chrome、Firefox和IE edge不会报错，IE11会报错）

    ``` 
    "use strict";
    var o = {
        p:1,
        p:2
    }
      
    console.log(o.p);  //Chrome、Firefox和IE edge 结果都为 2，p属性被覆盖  
    //IE11则报错：Multiple definitions of a property not allowed in strict mode
    ```
   
6.   
 
 ## 可能会遇到的问题