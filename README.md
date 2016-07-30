# promise

> promise的简单实现。兼容CMD, AMD及CommonJS规范。

### 使用方法

引入并注册模块后：

通过`var promise = new Promise(function (resolve, reject) {...}); `产生一个promise对象，作为参数的回调函数中调用resolve或者reject方法来使该promise状态转向*success*或者*fail*；resolve函数接受一个具体值或者一个形如`{then: function (resolve, reject) {...}}`的thenable对象；

通过`promise.done(onFulfilled, onRejected)`注册promise*success*或者*fail*时的回调；

通过`var nextPromise = promise.then(onFulfilled, onRejected)`在注册promise*success*或者*fail*时的回调的同时生成一个新的promise，新的promise将尝试根据所注册回调onFulfilled或 onRejected的返回值进行resolve最终达到*success*或者*fail*的状态。