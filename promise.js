define([], function () {
	var PENDING = 0;
	var FULFILLED = 1;
	var REJECTED = 2;

	return function (fn) {
		var state = PENDING;
		var value = null;
		var handlers = [];

		var forEach = function (arr, fn) {
			for (var i = 0, len = arr.length; i < len; i++) {
				fn(arr[i]);
			}
		};

		function fulfill(result) {
			state = FULFILLED;
			value = result;
			forEach(handlers, handle);
			handlers = []; 
		}

		function reject(error) {
			state = REJECTED;
			value = error;
			forEach(handlers, handle);
			handlers = [];
		}

		function resolve(result) {
			try {
				var then = getThen(result);
				if (then) {
					doResolve(then, resolve, reject);
					return;
				}
				fulfill(result);
			} catch (e) {
				reject(e);
			}
		}

		function handle(handler) {
			if (state === PENDING) {
				handlers.push(handler);
			} else {
				if (state === FULFILLED && typeof handler.onFulfilled === 'function') {
					handler.onFulfilled(value);
				}
				if (state === REJECTED && typeof handler.onRejected === 'function') {
					handler.onRejected(value);
				}
			}
		}

		function doResolve(fn, onFulfilled, onRejected) {
			try {
				fn(function (value) {
					onFulfilled(value);
				}, function (error) {
					onRejected(error);
				});
			} catch(excption) {
				onRejected(excption);
			}
		}

		this.done = function (onFulfilled, onRejected) {
			setTimeout(function () {
				handle({
					onFulfilled: onFulfilled,
					onRejected: onRejected
				});
			}, 0);
		};

		this.then = function (onFulfilled, onRejected) {
			var self = this;
			return new Promise(function (resolve, reject) {
				self.done(function (result) {
					if (typeof onFulfilled === 'function') {
						try {
							resolve(onFulfilled(result));
						} catch (excption) {
							reject(excption);
						}
					} else {
						resolve(result);
					}
				}, function (error) {
					if (typeof onRejected === 'function') {
						try {
							resolve(onRejected(error));
						} catch (excption) {
							reject(excption);
						}
					} else {
						reject(error);
					}
				})
			})
		}

		doResolve(fn, resolve, reject);
	};
});