---
title: YDKJS(this & 原型)
date: 2019-05-07
categories:
 - 前端
tags:
 - javaScript
---
## You Don't Know JS(YDKJS)
《你不知道的Javascript》这本书的评价相当的高，某日闲逛github发现这本书的原著（Star数排行貌似还是前十呢）。想着一边看英文文档一边学习新知识也不错，便果断转向在线阅读这本书（嘻嘻，主要还是因为在线看免费~）。结果一看就入迷了，书里写的很多是我不知道或者说是我一直以来都存在误解的知识点。所以想着要把书里一些有趣的东西记录下来。

## this
JS中对`this`有足够的理解也是相当重要的，那么`this`是什么呢？文中作者给出如下解释：
>'this' is neither a reference to the function itself, nor is it a reference to the function's lexical scope.
 'this' is actually a binding that is made when a function is invoked, and what it references is determined entirely by the call-site where the function is called.
 
 意思就是`this`既不是函数本身的指针，也不是函数语义作用域的指针。它的指向是由函数调用时的调用点决定。
 我个人的理解就“ 谁调用了函数，那么 `this`就指向谁。”看看下面的例子。
 
 ```javascript 1.8
function foo() {
	var a = 2;
	this.bar();
}

function bar() {
	console.log( this.a );
}

foo(); //undefined
```
在`foo`函数中，使用`this`指针调用了`bar`函数，为什么不会报错，因为全局调用了`foo`函数，此时`this`指向 全局，那么接下来就很好理解为什么`console.log(this.a)`会报`undefined`,因为全局压根没有定义`a`变量

那么在看看下面的例子：
```javascript 1.8
function foo(num) {
	console.log( "foo: " + num );

	// keep track of how many times `foo` is called
	this.count++;
}

foo.count = 0;

var i;

for (i=0; i<10; i++) {
	if (i > 5) {
		foo( i );
	}
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// how many times was `foo` called?
console.log( foo.count ); // 0 
```
之所以`foo.count`一直都是`0`，问题还是出在`this`上,此时`this`指向全局，而全局并没有定义变量`count`
那么有人就会问，那我想要实现上面每次调用函数时自动叠加该咋整？实际上有两种方法：

方法一，使用函数名进行调用，缺点是匿名函数没戏（arguments.callee 已经启用，最好别再用了）：
```javascript 1.8
function foo(num) {
	console.log( "foo: " + num );

	// keep track of how many times `foo` is called
	foo.count++;
}

foo.count = 0;

var i;

for (i=0; i<10; i++) {
	if (i > 5) {
		foo( i );
	}
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// how many times was `foo` called?
console.log( foo.count ); // 4
```

方法二，使用`call`方法，使`this`指向 函数本身:
```javascript 1.8
function foo(num) {
	console.log( "foo: " + num );

	// keep track of how many times `foo` is called
	// Note: `this` IS actually `foo` now, based on
	// how `foo` is called (see below)
	this.count++;
}

foo.count = 0;

var i;

for (i=0; i<10; i++) {
	if (i > 5) {
		// using `call(..)`, we ensure the `this`
		// points at the function object (`foo`) itself
		foo.call( foo, i );
	}
}
// foo: 6
// foo: 7
// foo: 8
// foo: 9

// how many times was `foo` called?
console.log( foo.count ); // 4
```