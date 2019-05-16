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
 
 我原本个人的理解就是“ 谁调用了函数，那么 `this`就指向谁。”（实际上这个理解并不够透彻，但是这个后面再说）先看看下面的例子。
 
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
在`foo`函数中，使用`this`指针调用了`bar`函数，为什么不会报错，因为调用`foo`函数的调用点处于全局，此时`this`指向 全局，那么接下来就很好理解为什么`console.log(this.a)`会报`undefined`,因为全局压根没有定义`a`变量

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

方法一，使用函数名进行调用，缺点是匿名函数没戏（有同学会说还有arguments.callee， 这个方法目前已经弃用，所以最好别再用了）：
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

方法二，使用`call`、`apply`或者`bind`方法，使`this`指向 函数本身:
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
前面说到我个人的理解并不完全正确，接下来就开始来看看`this`是如何确定绑定的指向的。

## this的默认绑定
先看代码：
```javascript 1.8
function foo() {
	console.log( this.a );
}

var a = 2;

foo(); // 2
```
`this`的默认绑定就是默认指向全局对象,如上面的例子就是，在全局调用了`foo`函数，`this`指向全局对象，所以运行程序会得到输出结果2.

在以前说严格模式的时候,有提到在严格模式下，禁止`this`关键字指向全局对象,要使用this必须给它赋值，`this`已不再默认指向全局对象，而是`undefined`  [JavaScript严格模式](strictMode.html) 

所以下面代码会有问题：

```javascript 1.8
function foo() {
	"use strict";

	console.log( this.a );
}

var a = 2;

foo(); // TypeError: `this` is `undefined
```
## this的隐式绑定
先看代码：
```javascript 1.8
function foo() {
	console.log( this.a );
}

var obj = {
	a: 2,
	foo: foo
};

obj.foo(); // 2
```
上面代码我们可以看到，`obj`对象中的属性`foo`指向了`foo`函数，那么我们可以认为`obj`对象‘包含了’`foo`函数，那么在调用`obj.foo`时，`this`会隐式绑定到
`obj`对象上，此时`this.a`实际上就是`obj.a`。

### this的隐式丢失
看代码：
```javascript 1.8
function foo() {
	console.log( this.a );
}

var obj = {
	a: 2,
	foo: foo
};

var bar = obj.foo; // function reference/alias!

var a = "oops, global"; // `a` also property on global object

bar(); // "oops, global"
```
这里我们把`obj.foo`的指向赋给了`bar`变量，当`bar`函数调用时，`this`隐式改成指向全局对象，所以这里的`this.a`指的是 全局对象下的变量`a`。
 
总结一句就是，函数调用时的this根据函数的调用点来决定指向哪个对象。下面几个例子都能很好的说明：
```javascript 1.8
function foo() {
	console.log( this.a );
}

function doFoo(fn) {
	// `fn` is just another reference to `foo`

	fn(); // <-- call-site! 调用点在这。
}

var obj = {
	a: 2,
	foo: foo
};



var kk = {
    a:333
};
kk.foo = obj.foo;

var a = "oops, global"; // `a` also property on global object

doFoo( obj.foo ); // "oops, global"

setTimeout( obj.foo, 100 ); // "oops, global"

kk.foo(); // "333"
```
`doFoo`函数虽然是在函数内部调用了回调函数，当本质和`setTimeOut`一样都是拿着`foo`函数的指向作为回调函数来执行。那么`foo`函数此时的调用点就是在`doFoo`函数内部，又因为默认`this`都是指向全局对象，所以输出了`oops, global`

在看`kk.foo`函数的调用，实际上也是拿着`foo`函数的指向来执行，那么根据上面提到的`this`的隐式绑定，`this`会指向`kk`对象，所以输出了`kk.a`。

是不是越看越清晰了呢？咱们继续。

## this的显式绑定
this的显式绑定指的是由程序的编写者指定this的指向，这里需要用到函数的内置方法`call(..)`和`apply(..)`

```javascript 1.8
function foo() {
	console.log( this.a );
}

var obj = {
	a: 2
};

foo.call( obj ); // 2
```
`foo.call(..)`使我们能够强制把`foo`的`this`指向`obj`

### this的强绑定（Hard Binding ）
this的强绑定指的是，this一旦使用`call(..)`和`apply(..)`进行指向的绑定，那么再次指定将不会覆盖之前的绑定。
```javascript 1.8
function foo() {
	console.log( this.a );
}

var obj = {
	a: 2
};

var bar = function() {
	foo.call( obj );
};

bar(); // 2
setTimeout( bar, 100 ); // 2

// `bar` hard binds `foo`'s `this` to `obj`
//`bar` 将`foo`的 `this`强绑定给 `obj`
// so that it cannot be overriden
//所以不能再重新绑定给 window  
bar.call( window ); // 2
```
## new 绑定
当一个函数通过使用new进行调用时，会自动触发以下操作：
1. 构建一个对象
2. 这个构建好的对象就是‘原型链’
3. this 被设定指向这个构建好的对象
4. 除非函数返回自己的备用对象，否则新调用的函数调用将自动返回新构造的对象。

```javascript 1.8
function foo(a) {
	this.a = a;
}

var bar = new foo( 2 );
console.log( bar.a ); // 2
```
## this各种绑定的优先级
优先级排序如下：
1. new 绑定
2. 显式绑定
3. 隐式绑定
4. 默认绑定

## ES6 箭头函数
ES6出现箭头函数`=>`允许我们通过语义作用域确定`this`的绑定,并且是强绑定。
```javascript
function foo() {
	// return an arrow function
	return (a) => {
		// `this` here is lexically adopted from `foo()`
		console.log( this.a );
	};
}

var obj1 = {
	a: 2
};

var obj2 = {
	a: 3
};

var bar = foo.call( obj1 );
bar.call( obj2 ); // 2, not 3!
```