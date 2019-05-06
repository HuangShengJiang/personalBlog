---
title: YDKJS(作用域 & 闭包)
---
## You Don't Know JS(YDKJS)
《你不知道的Javascript》这本书的评价相当的高，某日闲逛github发现这本书的原著（Star数排行貌似还是前十呢）。想着一边看英文文档一边学习新知识也不错，便果断转向在线阅读这本书（嘻嘻，主要还是因为在线看免费~）。结果一看就入迷了，书里写的很多是我不知道或者说是我一直以来都存在误解的知识点。所以想着要把书里一些有趣的东西记录下来。

## Scope、Engine、Compiler
1. Scope(作用域) 维护一个已经定义好的变量查找清单，并强制让 执行中的程序 遵循一系列规则 以获取变量；

2. engine(JS 引擎) 配合作用域执行 已经编译过的可执行代码；

3. compiler(编译器) 将程序员编写的JS代码 编译为 可执行代码；

## RHS查询与LHS查询
1. 在代码执行过程中：

如果JS引擎查找某个变量是为了给这个变量分配内存空间存放数据（也可以理解为给变量赋值），那么我们可以称这种查找为LHS查询(Left-Hand-Side Look-up) 

如果JS引擎查找某个变量是为了获得这个变量内存空间中的数据，那么我们可以称这种查找为RHS查询(Right-Hand-Side Look-up)

2. 查找变量的规则：

    1. 从变量当前的`作用域`开始查找该变量，如果有，则直接返回这个变量所指向的值；
    如果没有，则查询包裹当前作用域的`外层作用域`。如果外层作用域还是没有这个变量，则继续往更外层的作用域进行查找；
    一直查询到全局（顶层作用域）
    
    2. 如果依旧还没有找这个变量，这时`LHS查询`和`RHS查询`的表现会出现差异。
    
    先说`LHS查询`，在非严格模式（strict mode）下，LHS查询会悄咪咪的把这个变量定义到全局（顶层作用域）；而在严格模式下，LHS查询会报一个引用错误 `ReferenceError`；
    
    而`RHS查询`则是直接报一个引用错误 `ReferenceError`；

大家看看下面的代码：
```javascript
function foo(a) {
	console.log( a );
	b = a;
}

foo( 2 ); // 4
```
在上面的例子中，JS引擎一直在配合作用域(scope)在做`LHS查询`和`RHS查询`。

`LHS查询`分别在以下操作中使用到：
* 调用 `foo`函数时查找参数`a`并将数值`2`赋值参数`a`；
* 查找变量`b`并将已经找到的变量`a`的值赋予变量`b`；

`RHS查询`分别在以下操作中使用到：
* 调用 `foo`函数前先查找变量`foo`的指向；
* 在console.log调用前查找变量`console`和变量`log`的指向；
* 调用console.log时查找变量`a`的指向；
* 调用 `b=a`时，查找 变量 `a`的指向；

## eval与with
1. 在说到eval和with前，必须要先说说什么词法作用域（Lexical Scope），它指的是在你编写代码时就已经确认下来的作用域。也就是说一旦你编写好代码，代码中的各个作用域也就几乎不可变了。
看看下面这个例子。
```javascript
function foo(a) {
    var b = a * 2;
    
    function bar(c) {
        console.log( a, b, c );
    }
    
    bar(b * 3);
}

foo(2)
```
上面代码，在编写完成之后作用域也就确定下来了，分别是全局作用域(包含了函数`foo`的指向)、`foo`函数内的作用域(包含了变量`a`、`b`和函数`bar`指向)、`bar`函数内的作用域(包含了变量`c`的指向)。

之所以上面说到词法作用域在代码编写完后就“几乎”不会再变动，是因为还是有办法让作用域发生变化的。

接下来就是eval 方法登场了，看下面代码：
```javascript
    function foo(str, a) {
    	eval( str ); 
    	console.log( a, b );
    }
    
    var b = 2;
    
    foo( "var b = 3;", 1 ); // 1 3
```
在这里，eval()方法接收一行字符串 `var b = 3`即重新定义变量`b`的语句，并且很明显在执行`foo`函数时，`var b = 3`得到了执行，将原先已经定义好的全局变量`b`覆盖重新定义了，所以在`console.log()`中显示出来的是`1 3`。
不知道大家发现没有，eval方法的执行，直接改变了函数`foo`内的作用域，使之内部拥有新的变量`b`的指向。

ps：严格模式下eval()是改变不了作用域的，也就是说 上面的代码如果在严格模式下执行，变量`b`依旧是全局变量的`b`,输出也将会是`1 2`.


咱们接下来再来唠唠 `with` 语法，一般这个语法是用于快速更新对象的属性值的：
```javascript
var obj = {
	a: 1,
	b: 2,
	c: 3
};

// more "tedious" to repeat "obj"
obj.a = 2;
obj.b = 3;
obj.c = 4;

// "easier" short-hand
with (obj) {
	a = 3;
	b = 4;
	c = 5;
}
```
看着确实是挺便捷的，但是它有一个相当牛的缺点，稍有不慎，直接污染全局变量。

```javascript
function foo(obj) {
	with (obj) {
		a = 2;
	}
}

var o1 = {
	a: 3
};

var o2 = {
	b: 3
};

foo( o1 );
console.log( o1.a ); // 2

foo( o2 );
console.log( o2.a ); // undefined
console.log( a ); // 2 -- Oops, leaked global!
```
这也是一个很典型的改变词法作用域的例子，with语句在没有找到对象对应的属性时，他也没有修改到 函数 `foo`内的作用域，而是直接修改的全局作用域。

2333，说了上面这么多，就是为了给你解释为什么`不要用`这两个方法，正是因为这两个方法会改变词法作用域，并破坏引擎对作用域查找执行编译时优化的能力，因为引擎必须假设此类优化无效。也就是说程序会变慢。


## 防止变量名相同导致的冲突
现在大家都知道，定义一个变量，是有可能被当前作用域的另一个同名变量覆盖，或者在子作用域中被同名变量所屏蔽(shadow),看看下面的代码：
```javascript
var a = 0;

var a = 1;

function foo() {
  var a = 2;
  console.log(a); // 2
}

foo();

console.log(a) // 1
```
当使用他人编写的库的时候，这种变量名冲突引起的覆盖现象可能会导致不可预期的问题，那么有什么解决的办法呢？
1. 全局命名空间
```javascript
var MyReallyCoolLibrary = {
	awesome: "stuff",
	doSomething: function() {
		// ...
	},
	doAnotherThing: function() {
		// ...
	}
};
```
只要命名空间对象名够偏，别人就没有命中你的可能，哈哈哈，其实还是避免不了冲突的可能，这只是个治标不治本的解决方法。

2. 使用"模块"模式
```javascript 1.8
//module A
module.exports = {
    awesome: "stuff",
    doSomething: function() {
        // ...
    },
    doAnotherThing: function() {
        // ...
    }
}

//module B
//这时候你可以随便命名，只要不与当前模块的变量名重复就行
import AAA form 'moduleA';

//使用 A 模块中的方法和变量
var a = AAA.awesome;
AAA.doSomething();
```

## 立即执行函数(IIFE) 

```javascript
var a = 2;

(function foo(){ // <-- insert this

	var a = 3;
	console.log( a ); // 3

})(); // <-- and this

console.log( a ); // 2
```
立即执行函数的第一个`()`指的是使括号内的形成一个新的作用域，括号中的方法更像是一个函数表达式，而第二个`()`则是执行第一个括号中的函数表达式。

ps：立即执行函数虽然是允许使用匿名函数的，但是还是建议给方法一个名字。


## 块级作用域
在ES6之前，js是没有实现块级作用域的，看下面代码：
```javascript 1.8
var foo = true;

if(foo){
    //在{}中的代码块并不能形成作用域，其中定义的变量会放在外层的作用域中
    var a = 1;
}

console.log(a);
```

当然，又一次会有例外：

还记的上面说到 `with`语句吗？
```javascript 1.8
var a = {
    a:1,
    b:2,
    c:3
};

with(a){
    a = 1,
    b = 2,
    c = 3
}
```

另一个例外是`try/catch`语句：
```javascript 1.8
try {
	undefined(); // illegal operation to force an exception!
}
catch (err) {
	console.log( err ); // works!
}

console.log( err ); // ReferenceError: `err` not found
```
变量`err`只在 `catch`代码块中能够被找到。

从ES6开始引入了`let`，让我们可以实现块作用域
```javascript 1.8
var foo = true;

if(foo){
    //在{}中的代码块形成了块作用域，外层代码是不能用到这里面定义的变量。
    let a = 1;
}

console.log(a); // ReferenceError: a is not defined
```

## 变量提升(Hoisting)
以前在听到变量提升时，总是不明觉厉，觉得要解释通这个东西是挺复杂的，但是看完这一节关于变量提升的内容后，感觉理解的差不多。

```javascript 1.8
//例子1
a = 2;

var a;

console.log( a ); // 2
```

```javascript 1.8
//例子2
console.log( a );  // undefined

var a = 2;  
```

在咱们常人的理解中，`var a = 2;`在程序中是作为一条语句来执行的，但是实际上,JS引擎会把它当成两条语句来执行 `var a`（定义类语句）和`a =2`（赋值或者执行类语句）, 并且都是将代码中所有的定义类语句先执行了，包括变量的定义，方法的定义等，然后再执行剩余的 赋值/执行类语句。我们将这种先执行定义类语句的行为称为变量提升。

理解了上面这一点，那上面两个例子的表现就很好理解了。

例子1的实际执行顺序：
```javascript 1.8
var a;
a = 2;
console.log( a ); // 2
```

例子2的实际执行顺序：
```javascript 1.8
var a;

console.log( a );  // undefined

a = 2;  
```
是不是相当清晰明了？当然这里我们不得不提一下，函数 `function` 的变量提升优先级更高一些。

```javascript 1.8
foo(); // 1

var foo;

function foo() {
	console.log( 1 );
}

foo = function() {
	console.log( 2 );
};

// 输出 1
```

## 闭包(Closure)
闭包对于咱们前端学习来说是一道大坎，跨过去了就离大神更近一步，所以本笔记也来到了重点中的重点--闭包。

那么什么是闭包呢？我先把作者给出的解释放在这：

> 闭包就是一个函数即使它是在它的语义作用域外被调用，也能够记住并使用它的语义作用域。

什么意思呢？来看看例子
```javascript 1.8
function foo() {
	var a = 2;

	function bar() {
		console.log( a );
	}

	return bar;
}

var baz = foo(); // 这里的baz 实际上就是 foo 方法 暴露出来的 bar 方法

baz(); // 2  -- 这里执行 baz 方法 却能获取到属于 foo 方法 内部的作用域中的 变量a
```
上例中我们可以认为暴露出来的 bar 方法仍能获取到 foo 方法 内部的作用域的，故形成了一个闭包。

接下来，我们来一个著名的闭包面试题,请正确打印 i 变量：
```javascript 1.8
for (var i=1; i<=5; i++) {
	setTimeout( function timer(){
		console.log( i );
	}, i*1000 );
}
```
试试看上例就会发现，会连续打印5个6出来，因为 i 是一个全局变量，而timer方法在调用时 循环已经结束，i为6。

解法有好几个：
```javascript 1.8
//解法1 使用立即执行函数 将每次循环中的i存起来，给timer 执行时在用（看! 闭包来了!）
for (var i=1; i<=5; i++) {
    (function(){
        var j = i;
        setTimeout( function timer(){
        		console.log( j );
        	}, j*1000 );
    })()
}
//解法2 和解法1差不多，也是用的传变量i放着以后用的招数
for (var i=1; i<=5; i++) {
    (function(j){
        setTimeout( function timer(){
        		console.log( j );
        	}, j*1000 );
    })(i)
}

//解法3 使用ES6 新增的let 语句，在每个循环中形成一个块作用域，使 i 不再是一个全局变量
for (let i=1; i<=5; i++) {
	setTimeout( function timer(){
		console.log( i );
	}, i*1000 );
}
//解法4 和解法3原理一样
for (var i=1; i<=5; i++) {
    let j = i;
	setTimeout( function timer(){
		console.log( j );
	}, j*1000 );
}
```
## JS没有所谓的动态作用域
看下面例子：
```javascript 1.8
function foo() {
	console.log( a ); // 2 ,而不是你想象中的变量 a = 3
}

function bar() {
	var a = 3;
	foo();
}

var a = 2;

bar();
```
这里`foo`方法取得作用域是全局作用域，因为它定义于全局作用域，根据RHS搜索，它找到的是 全局变量a。
ps：JS都是`语义作用域`的，而没有 `动态作用域`。分辨的关键点是：语义作用域确定于编写代码时，动态作用域确定于运行时。


## 参考链接
1. [YDKJS（Scope & Closures）-原文地址](https://github.com/getify/You-Dont-Know-JS/blob/master/scope%20%26%20closures/ch1.md)