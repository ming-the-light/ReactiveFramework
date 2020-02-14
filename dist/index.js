(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.RF = factory());
}(this, (function () { 'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  function _isPlaceholder(a) {
         return a != null && (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object' && a['@@functional/placeholder'] === true;
  }

  /**
   * Optimized internal one-arity curry function.
   *
   * @private
   * @category Function
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */
  function _curry1(fn) {
    return function f1(a) {
      if (arguments.length === 0 || _isPlaceholder(a)) {
        return f1;
      } else {
        return fn.apply(this, arguments);
      }
    };
  }

  /**
   * Optimized internal two-arity curry function.
   *
   * @private
   * @category Function
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */
  function _curry2(fn) {
    return function f2(a, b) {
      switch (arguments.length) {
        case 0:
          return f2;
        case 1:
          return _isPlaceholder(a) ? f2 : _curry1(function (_b) {
            return fn(a, _b);
          });
        default:
          return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function (_a) {
            return fn(_a, b);
          }) : _isPlaceholder(b) ? _curry1(function (_b) {
            return fn(a, _b);
          }) : fn(a, b);
      }
    };
  }

  function _arity(n, fn) {
    /* eslint-disable no-unused-vars */
    switch (n) {
      case 0:
        return function () {
          return fn.apply(this, arguments);
        };
      case 1:
        return function (a0) {
          return fn.apply(this, arguments);
        };
      case 2:
        return function (a0, a1) {
          return fn.apply(this, arguments);
        };
      case 3:
        return function (a0, a1, a2) {
          return fn.apply(this, arguments);
        };
      case 4:
        return function (a0, a1, a2, a3) {
          return fn.apply(this, arguments);
        };
      case 5:
        return function (a0, a1, a2, a3, a4) {
          return fn.apply(this, arguments);
        };
      case 6:
        return function (a0, a1, a2, a3, a4, a5) {
          return fn.apply(this, arguments);
        };
      case 7:
        return function (a0, a1, a2, a3, a4, a5, a6) {
          return fn.apply(this, arguments);
        };
      case 8:
        return function (a0, a1, a2, a3, a4, a5, a6, a7) {
          return fn.apply(this, arguments);
        };
      case 9:
        return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
          return fn.apply(this, arguments);
        };
      case 10:
        return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
          return fn.apply(this, arguments);
        };
      default:
        throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
    }
  }

  /**
   * Internal curryN function.
   *
   * @private
   * @category Function
   * @param {Number} length The arity of the curried function.
   * @param {Array} received An array of arguments received thus far.
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */
  function _curryN(length, received, fn) {
    return function () {
      var combined = [];
      var argsIdx = 0;
      var left = length;
      var combinedIdx = 0;
      while (combinedIdx < received.length || argsIdx < arguments.length) {
        var result;
        if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
          result = received[combinedIdx];
        } else {
          result = arguments[argsIdx];
          argsIdx += 1;
        }
        combined[combinedIdx] = result;
        if (!_isPlaceholder(result)) {
          left -= 1;
        }
        combinedIdx += 1;
      }
      return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
    };
  }

  /**
   * Returns a curried equivalent of the provided function, with the specified
   * arity. The curried function has two unusual capabilities. First, its
   * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
   * following are equivalent:
   *
   *   - `g(1)(2)(3)`
   *   - `g(1)(2, 3)`
   *   - `g(1, 2)(3)`
   *   - `g(1, 2, 3)`
   *
   * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
   * "gaps", allowing partial application of any combination of arguments,
   * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
   * the following are equivalent:
   *
   *   - `g(1, 2, 3)`
   *   - `g(_, 2, 3)(1)`
   *   - `g(_, _, 3)(1)(2)`
   *   - `g(_, _, 3)(1, 2)`
   *   - `g(_, 2)(1)(3)`
   *   - `g(_, 2)(1, 3)`
   *   - `g(_, 2)(_, 3)(1)`
   *
   * @func
   * @memberOf R
   * @since v0.5.0
   * @category Function
   * @sig Number -> (* -> a) -> (* -> a)
   * @param {Number} length The arity for the returned function.
   * @param {Function} fn The function to curry.
   * @return {Function} A new, curried function.
   * @see R.curry
   * @example
   *
   *      const sumArgs = (...args) => R.sum(args);
   *
   *      const curriedAddFourNumbers = R.curryN(4, sumArgs);
   *      const f = curriedAddFourNumbers(1, 2);
   *      const g = f(3);
   *      g(4); //=> 10
   */
  var curryN = /*#__PURE__*/_curry2(function curryN(length, fn) {
    if (length === 1) {
      return _curry1(fn);
    }
    return _arity(length, _curryN(length, [], fn));
  });

  /**
   * Optimized internal three-arity curry function.
   *
   * @private
   * @category Function
   * @param {Function} fn The function to curry.
   * @return {Function} The curried function.
   */
  function _curry3(fn) {
    return function f3(a, b, c) {
      switch (arguments.length) {
        case 0:
          return f3;
        case 1:
          return _isPlaceholder(a) ? f3 : _curry2(function (_b, _c) {
            return fn(a, _b, _c);
          });
        case 2:
          return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function (_a, _c) {
            return fn(_a, b, _c);
          }) : _isPlaceholder(b) ? _curry2(function (_b, _c) {
            return fn(a, _b, _c);
          }) : _curry1(function (_c) {
            return fn(a, b, _c);
          });
        default:
          return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function (_a, _b) {
            return fn(_a, _b, c);
          }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function (_a, _c) {
            return fn(_a, b, _c);
          }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function (_b, _c) {
            return fn(a, _b, _c);
          }) : _isPlaceholder(a) ? _curry1(function (_a) {
            return fn(_a, b, c);
          }) : _isPlaceholder(b) ? _curry1(function (_b) {
            return fn(a, _b, c);
          }) : _isPlaceholder(c) ? _curry1(function (_c) {
            return fn(a, b, _c);
          }) : fn(a, b, c);
      }
    };
  }

  /**
   * Tests whether or not an object is an array.
   *
   * @private
   * @param {*} val The object to test.
   * @return {Boolean} `true` if `val` is an array, `false` otherwise.
   * @example
   *
   *      _isArray([]); //=> true
   *      _isArray(null); //=> false
   *      _isArray({}); //=> false
   */
  var _isArray = Array.isArray || function _isArray(val) {
    return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
  };

  function _isTransformer(obj) {
    return obj != null && typeof obj['@@transducer/step'] === 'function';
  }

  /**
   * Returns a function that dispatches with different strategies based on the
   * object in list position (last argument). If it is an array, executes [fn].
   * Otherwise, if it has a function with one of the given method names, it will
   * execute that function (functor case). Otherwise, if it is a transformer,
   * uses transducer [xf] to return a new transformer (transducer case).
   * Otherwise, it will default to executing [fn].
   *
   * @private
   * @param {Array} methodNames properties to check for a custom implementation
   * @param {Function} xf transducer to initialize if object is transformer
   * @param {Function} fn default ramda implementation
   * @return {Function} A function that dispatches on object in list position
   */
  function _dispatchable(methodNames, xf, fn) {
    return function () {
      if (arguments.length === 0) {
        return fn();
      }
      var args = Array.prototype.slice.call(arguments, 0);
      var obj = args.pop();
      if (!_isArray(obj)) {
        var idx = 0;
        while (idx < methodNames.length) {
          if (typeof obj[methodNames[idx]] === 'function') {
            return obj[methodNames[idx]].apply(obj, args);
          }
          idx += 1;
        }
        if (_isTransformer(obj)) {
          var transducer = xf.apply(null, args);
          return transducer(obj);
        }
      }
      return fn.apply(this, arguments);
    };
  }

  var _xfBase = {
    init: function init() {
      return this.xf['@@transducer/init']();
    },
    result: function result(_result) {
      return this.xf['@@transducer/result'](_result);
    }
  };

  function _map(fn, functor) {
    var idx = 0;
    var len = functor.length;
    var result = Array(len);
    while (idx < len) {
      result[idx] = fn(functor[idx]);
      idx += 1;
    }
    return result;
  }

  function _isString(x) {
    return Object.prototype.toString.call(x) === '[object String]';
  }

  /**
   * Tests whether or not an object is similar to an array.
   *
   * @private
   * @category Type
   * @category List
   * @sig * -> Boolean
   * @param {*} x The object to test.
   * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
   * @example
   *
   *      _isArrayLike([]); //=> true
   *      _isArrayLike(true); //=> false
   *      _isArrayLike({}); //=> false
   *      _isArrayLike({length: 10}); //=> false
   *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
   */
  var _isArrayLike = /*#__PURE__*/_curry1(function isArrayLike(x) {
    if (_isArray(x)) {
      return true;
    }
    if (!x) {
      return false;
    }
    if ((typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object') {
      return false;
    }
    if (_isString(x)) {
      return false;
    }
    if (x.nodeType === 1) {
      return !!x.length;
    }
    if (x.length === 0) {
      return true;
    }
    if (x.length > 0) {
      return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
    }
    return false;
  });

  var XWrap = /*#__PURE__*/function () {
    function XWrap(fn) {
      this.f = fn;
    }
    XWrap.prototype['@@transducer/init'] = function () {
      throw new Error('init not implemented on XWrap');
    };
    XWrap.prototype['@@transducer/result'] = function (acc) {
      return acc;
    };
    XWrap.prototype['@@transducer/step'] = function (acc, x) {
      return this.f(acc, x);
    };

    return XWrap;
  }();

  function _xwrap(fn) {
    return new XWrap(fn);
  }

  /**
   * Creates a function that is bound to a context.
   * Note: `R.bind` does not provide the additional argument-binding capabilities of
   * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
   *
   * @func
   * @memberOf R
   * @since v0.6.0
   * @category Function
   * @category Object
   * @sig (* -> *) -> {*} -> (* -> *)
   * @param {Function} fn The function to bind to context
   * @param {Object} thisObj The context to bind `fn` to
   * @return {Function} A function that will execute in the context of `thisObj`.
   * @see R.partial
   * @example
   *
   *      const log = R.bind(console.log, console);
   *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
   *      // logs {a: 2}
   * @symb R.bind(f, o)(a, b) = f.call(o, a, b)
   */
  var bind = /*#__PURE__*/_curry2(function bind(fn, thisObj) {
    return _arity(fn.length, function () {
      return fn.apply(thisObj, arguments);
    });
  });

  function _arrayReduce(xf, acc, list) {
    var idx = 0;
    var len = list.length;
    while (idx < len) {
      acc = xf['@@transducer/step'](acc, list[idx]);
      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }
      idx += 1;
    }
    return xf['@@transducer/result'](acc);
  }

  function _iterableReduce(xf, acc, iter) {
    var step = iter.next();
    while (!step.done) {
      acc = xf['@@transducer/step'](acc, step.value);
      if (acc && acc['@@transducer/reduced']) {
        acc = acc['@@transducer/value'];
        break;
      }
      step = iter.next();
    }
    return xf['@@transducer/result'](acc);
  }

  function _methodReduce(xf, acc, obj, methodName) {
    return xf['@@transducer/result'](obj[methodName](bind(xf['@@transducer/step'], xf), acc));
  }

  var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';

  function _reduce(fn, acc, list) {
    if (typeof fn === 'function') {
      fn = _xwrap(fn);
    }
    if (_isArrayLike(list)) {
      return _arrayReduce(fn, acc, list);
    }
    if (typeof list['fantasy-land/reduce'] === 'function') {
      return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
    }
    if (list[symIterator] != null) {
      return _iterableReduce(fn, acc, list[symIterator]());
    }
    if (typeof list.next === 'function') {
      return _iterableReduce(fn, acc, list);
    }
    if (typeof list.reduce === 'function') {
      return _methodReduce(fn, acc, list, 'reduce');
    }

    throw new TypeError('reduce: list must be array or iterable');
  }

  var XMap = /*#__PURE__*/function () {
    function XMap(f, xf) {
      this.xf = xf;
      this.f = f;
    }
    XMap.prototype['@@transducer/init'] = _xfBase.init;
    XMap.prototype['@@transducer/result'] = _xfBase.result;
    XMap.prototype['@@transducer/step'] = function (result, input) {
      return this.xf['@@transducer/step'](result, this.f(input));
    };

    return XMap;
  }();

  var _xmap = /*#__PURE__*/_curry2(function _xmap(f, xf) {
    return new XMap(f, xf);
  });

  function _has(prop, obj) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
  }

  var toString = Object.prototype.toString;
  var _isArguments = /*#__PURE__*/function () {
    return toString.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
      return toString.call(x) === '[object Arguments]';
    } : function _isArguments(x) {
      return _has('callee', x);
    };
  }();

  // cover IE < 9 keys issues
  var hasEnumBug = ! /*#__PURE__*/{ toString: null }.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];
  // Safari bug
  var hasArgsEnumBug = /*#__PURE__*/function () {

    return arguments.propertyIsEnumerable('length');
  }();

  var contains = function contains(list, item) {
    var idx = 0;
    while (idx < list.length) {
      if (list[idx] === item) {
        return true;
      }
      idx += 1;
    }
    return false;
  };

  /**
   * Returns a list containing the names of all the enumerable own properties of
   * the supplied object.
   * Note that the order of the output array is not guaranteed to be consistent
   * across different JS platforms.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Object
   * @sig {k: v} -> [k]
   * @param {Object} obj The object to extract properties from
   * @return {Array} An array of the object's own properties.
   * @see R.keysIn, R.values
   * @example
   *
   *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
   */
  var keys = typeof Object.keys === 'function' && !hasArgsEnumBug ? /*#__PURE__*/_curry1(function keys(obj) {
    return Object(obj) !== obj ? [] : Object.keys(obj);
  }) : /*#__PURE__*/_curry1(function keys(obj) {
    if (Object(obj) !== obj) {
      return [];
    }
    var prop, nIdx;
    var ks = [];
    var checkArgsLength = hasArgsEnumBug && _isArguments(obj);
    for (prop in obj) {
      if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
        ks[ks.length] = prop;
      }
    }
    if (hasEnumBug) {
      nIdx = nonEnumerableProps.length - 1;
      while (nIdx >= 0) {
        prop = nonEnumerableProps[nIdx];
        if (_has(prop, obj) && !contains(ks, prop)) {
          ks[ks.length] = prop;
        }
        nIdx -= 1;
      }
    }
    return ks;
  });

  /**
   * Takes a function and
   * a [functor](https://github.com/fantasyland/fantasy-land#functor),
   * applies the function to each of the functor's values, and returns
   * a functor of the same shape.
   *
   * Ramda provides suitable `map` implementations for `Array` and `Object`,
   * so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.
   *
   * Dispatches to the `map` method of the second argument, if present.
   *
   * Acts as a transducer if a transformer is given in list position.
   *
   * Also treats functions as functors and will compose them together.
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category List
   * @sig Functor f => (a -> b) -> f a -> f b
   * @param {Function} fn The function to be called on every element of the input `list`.
   * @param {Array} list The list to be iterated over.
   * @return {Array} The new list.
   * @see R.transduce, R.addIndex
   * @example
   *
   *      const double = x => x * 2;
   *
   *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
   *
   *      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
   * @symb R.map(f, [a, b]) = [f(a), f(b)]
   * @symb R.map(f, { x: a, y: b }) = { x: f(a), y: f(b) }
   * @symb R.map(f, functor_o) = functor_o.map(f)
   */
  var map = /*#__PURE__*/_curry2( /*#__PURE__*/_dispatchable(['fantasy-land/map', 'map'], _xmap, function map(fn, functor) {
    switch (Object.prototype.toString.call(functor)) {
      case '[object Function]':
        return curryN(functor.length, function () {
          return fn.call(this, functor.apply(this, arguments));
        });
      case '[object Object]':
        return _reduce(function (acc, key) {
          acc[key] = fn(functor[key]);
          return acc;
        }, {}, keys(functor));
      default:
        return _map(fn, functor);
    }
  }));

  /**
   * Retrieve the value at a given path.
   *
   * @func
   * @memberOf R
   * @since v0.2.0
   * @category Object
   * @typedefn Idx = String | Int
   * @sig [Idx] -> {a} -> a | Undefined
   * @param {Array} path The path to use.
   * @param {Object} obj The object to retrieve the nested property from.
   * @return {*} The data at `path`.
   * @see R.prop
   * @example
   *
   *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
   *      R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
   */
  var path = /*#__PURE__*/_curry2(function path(paths, obj) {
    var val = obj;
    var idx = 0;
    while (idx < paths.length) {
      if (val == null) {
        return;
      }
      val = val[paths[idx]];
      idx += 1;
    }
    return val;
  });

  /**
   * Returns a curried equivalent of the provided function. The curried function
   * has two unusual capabilities. First, its arguments needn't be provided one
   * at a time. If `f` is a ternary function and `g` is `R.curry(f)`, the
   * following are equivalent:
   *
   *   - `g(1)(2)(3)`
   *   - `g(1)(2, 3)`
   *   - `g(1, 2)(3)`
   *   - `g(1, 2, 3)`
   *
   * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
   * "gaps", allowing partial application of any combination of arguments,
   * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
   * the following are equivalent:
   *
   *   - `g(1, 2, 3)`
   *   - `g(_, 2, 3)(1)`
   *   - `g(_, _, 3)(1)(2)`
   *   - `g(_, _, 3)(1, 2)`
   *   - `g(_, 2)(1)(3)`
   *   - `g(_, 2)(1, 3)`
   *   - `g(_, 2)(_, 3)(1)`
   *
   * @func
   * @memberOf R
   * @since v0.1.0
   * @category Function
   * @sig (* -> a) -> (* -> a)
   * @param {Function} fn The function to curry.
   * @return {Function} A new, curried function.
   * @see R.curryN, R.partial
   * @example
   *
   *      const addFourNumbers = (a, b, c, d) => a + b + c + d;
   *
   *      const curriedAddFourNumbers = R.curry(addFourNumbers);
   *      const f = curriedAddFourNumbers(1, 2);
   *      const g = f(3);
   *      g(4); //=> 10
   */
  var curry = /*#__PURE__*/_curry1(function curry(fn) {
    return curryN(fn.length, fn);
  });

  /**
   * This checks whether a function has a [methodname] function. If it isn't an
   * array it will execute that function otherwise it will default to the ramda
   * implementation.
   *
   * @private
   * @param {Function} fn ramda implemtation
   * @param {String} methodname property to check for a custom implementation
   * @return {Object} Whatever the return value of the method is.
   */
  function _checkForMethod(methodname, fn) {
    return function () {
      var length = arguments.length;
      if (length === 0) {
        return fn();
      }
      var obj = arguments[length - 1];
      return _isArray(obj) || typeof obj[methodname] !== 'function' ? fn.apply(this, arguments) : obj[methodname].apply(obj, Array.prototype.slice.call(arguments, 0, length - 1));
    };
  }

  /**
   * Removes the sub-list of `list` starting at index `start` and containing
   * `count` elements. _Note that this is not destructive_: it returns a copy of
   * the list with the changes.
   * <small>No lists have been harmed in the application of this function.</small>
   *
   * @func
   * @memberOf R
   * @since v0.2.2
   * @category List
   * @sig Number -> Number -> [a] -> [a]
   * @param {Number} start The position to start removing elements
   * @param {Number} count The number of elements to remove
   * @param {Array} list The list to remove from
   * @return {Array} A new Array with `count` elements from `start` removed.
   * @see R.without
   * @example
   *
   *      R.remove(2, 3, [1,2,3,4,5,6,7,8]); //=> [1,2,6,7,8]
   */
  var remove = /*#__PURE__*/_curry3(function remove(start, count, list) {
    var result = Array.prototype.slice.call(list, 0);
    result.splice(start, count);
    return result;
  });

  /**
   * Iterate over an input `list`, calling a provided function `fn` for each
   * element in the list.
   *
   * `fn` receives one argument: *(value)*.
   *
   * Note: `R.forEach` does not skip deleted or unassigned indices (sparse
   * arrays), unlike the native `Array.prototype.forEach` method. For more
   * details on this behavior, see:
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description
   *
   * Also note that, unlike `Array.prototype.forEach`, Ramda's `forEach` returns
   * the original array. In some libraries this function is named `each`.
   *
   * Dispatches to the `forEach` method of the second argument, if present.
   *
   * @func
   * @memberOf R
   * @since v0.1.1
   * @category List
   * @sig (a -> *) -> [a] -> [a]
   * @param {Function} fn The function to invoke. Receives one argument, `value`.
   * @param {Array} list The list to iterate over.
   * @return {Array} The original list.
   * @see R.addIndex
   * @example
   *
   *      const printXPlusFive = x => console.log(x + 5);
   *      R.forEach(printXPlusFive, [1, 2, 3]); //=> [1, 2, 3]
   *      // logs 6
   *      // logs 7
   *      // logs 8
   * @symb R.forEach(f, [a, b, c]) = [a, b, c]
   */
  var forEach = /*#__PURE__*/_curry2( /*#__PURE__*/_checkForMethod('forEach', function forEach(fn, list) {
    var len = list.length;
    var idx = 0;
    while (idx < len) {
      fn(list[idx]);
      idx += 1;
    }
    return list;
  }));

  var FILTER_TOKENS = {
      '\r': true,
      '\n': true,
      ' ': true /* DEVLOPMENT */
  };
  function lexical(stream) {
      var LENGTH = stream.length;
      var tokens = [];
      if (LENGTH <= 0) return;
      var pos = 0;
      while (LENGTH > pos) {
          if (FILTER_TOKENS[stream[pos]]) {
              pos++;
              continue;
          }
          var newPos = handle(stream, pos);
          if (pos < newPos) {
              tokens.push(stream.slice(pos, newPos));
          } else {
              pos++;
          }
          pos = newPos;
      }
      return tokens;
  }
  function handle(stream, pos) {
      var c = stream[pos];
      var LENGTH = stream.length;
      var move = curry(loopMove)(pos, stream, function (pos) {
          return LENGTH > pos;
      });
      switch (c) {
          case '<':
              return handleTag(move);
          case '\r':
          case '\n':
              return ++pos;
          case '\\':
              if (stream[pos + 1] === '\\') {
                  return handleComment(move);
              } else {
                  return handleText(move);
              }
          default:
              return handleText(move);
      }
  }
  function handleTag(move) {
      return move(function (c) {
          return c === '>';
      }) + 1;
  }
  function handleComment(move) {
      return move(function (c) {
          return c === '\r';
      });
  }
  function handleText(move) {
      return move(function (c) {
          return c === '<';
      });
  }
  function loopMove(pos, stream, boundCondi, breakCondi) {
      while (boundCondi(++pos)) {
          if (breakCondi(stream[pos], pos)) {
              return pos;
          }
      }
      return pos;
  }
  //# sourceMappingURL=lexicer.js.map

  var ElementType;
  (function (ElementType) {
      ElementType[ElementType["Tag"] = 0] = "Tag";
      ElementType[ElementType["Text"] = 1] = "Text";
      ElementType[ElementType["Comment"] = 2] = "Comment";
      ElementType[ElementType["Component"] = 3] = "Component";
  })(ElementType || (ElementType = {}));
  var KeyValuePair = /** @class */function () {
      function KeyValuePair(key, value) {
          this.key = key;
          this.value = value;
      }
      return KeyValuePair;
  }();
  var ParseType;
  (function (ParseType) {
      ParseType[ParseType["StartTag"] = 0] = "StartTag";
      ParseType[ParseType["StartComponent"] = 1] = "StartComponent";
      ParseType[ParseType["EndTag"] = 2] = "EndTag";
      ParseType[ParseType["Text"] = 3] = "Text";
      ParseType[ParseType["Comment"] = 4] = "Comment";
      ParseType[ParseType["SelfCloseTag"] = 5] = "SelfCloseTag";
      ParseType[ParseType["SelfCloseComponent"] = 6] = "SelfCloseComponent";
  })(ParseType || (ParseType = {}));
  var ParseObj = /** @class */function () {
      function ParseObj(type, content, attrs, parent, children) {
          if (parent === void 0) {
              parent = null;
          }
          if (children === void 0) {
              children = [];
          }
          this.type = type;
          this.content = content;
          this.attrs = attrs;
          this.parent = parent;
          this.children = children;
      }
      return ParseObj;
  }();
  //# sourceMappingURL=types.js.map

  var selfCloseTagReg = /^<.+\/>$/;
  var startTagReg = /^<[^\/](.+)/;
  var endTagReg = /^<\/(.+)>$/;
  var commentReg = /\/\/.+/;
  var attrMatchReg = / .+?=".+?"/g;
  var tagNameMatchReg = /\w+/;
  var isComponentNameReg = /^[A-Z][_a-zA-Z]+$/;
  function parse(tokens) {
      var LENGTH = tokens.length;
      var pos = -1;
      var parseObjects = [];
      var statment;
      var ast;
      while (LENGTH > ++pos && (statment = tokens[pos])) {
          var obj = parseObj(statment);
          parseObjects.push(obj);
      }
      ast = genTree(parseObjects);
      return ast;
  }
  function genTree(parseObjects) {
      if (parseObjects.length < 1) return;
      var start = parseObjects.shift();
      return _genTree(start, parseObjects.shift(), parseObjects);
  }
  function _genTree(start, curNode, parseObjects) {
      if (!curNode || isPair(start, curNode)) return start;
      start.children.push(curNode.type === ParseType.StartTag || curNode.type === ParseType.StartComponent ? _genTree(curNode, parseObjects.shift(), parseObjects) : curNode);
      return _genTree(start, parseObjects.shift(), parseObjects);
  }
  function isPair(obj1, obj2) {
      return obj1.type === ParseType.StartTag && obj2.type === ParseType.EndTag && obj1.content === obj2.content;
  }
  function parseObj(statment) {
      var obj;
      if (selfCloseTagReg.test(statment)) {
          obj = parseSelfCloseTag(statment);
      } else if (startTagReg.test(statment) && statment.endsWith('>')) {
          obj = parseStartTag(statment);
      } else if (endTagReg.test(statment)) {
          obj = parseEndTag(statment);
      } else if (commentReg.test(statment)) {
          obj = parseComment(statment);
      } else {
          obj = parseText(statment);
      }
      return obj;
  }
  function parseStartTag(statment) {
      var body = statment.slice(1, statment.length - 1);
      var tagName;
      var type;
      var attrs = [];
      attrs = map(parseTagAttr, body.match(attrMatchReg) || []);
      tagName = path(['0'], body.match(tagNameMatchReg));
      type = isComponentNameReg.test(tagName) ? ParseType.StartComponent : ParseType.StartTag;
      var obj = new ParseObj(type, tagName, attrs);
      return obj;
  }
  function parseTagAttr(str) {
      var kv = str.split('=');
      return new KeyValuePair(kv[0].trim(), kv.length > 1 ? kv[1] : undefined);
  }
  function parseSelfCloseTag(statment) {
      var body = statment.slice(1, statment.length - 2);
      var tagName;
      var type;
      var attrs = [];
      attrs = map(parseTagAttr, body.match(attrMatchReg) || []);
      tagName = path(['0'], body.match(tagNameMatchReg));
      console.log(isComponentNameReg.test(tagName));
      type = isComponentNameReg.test(tagName) ? ParseType.SelfCloseComponent : ParseType.SelfCloseTag;
      var obj = new ParseObj(type, tagName, attrs);
      return obj;
  }
  function parseEndTag(statment) {
      var body = statment.slice(2, statment.length - 1);
      var obj = new ParseObj(ParseType.EndTag, body, null);
      return obj;
  }
  function parseComment(statment) {
      var obj = new ParseObj(ParseType.Comment, statment, null);
      return obj;
  }
  function parseText(statment) {
      var obj = new ParseObj(ParseType.Text, statment, null);
      return obj;
  }
  //# sourceMappingURL=parser.js.map

  var uid = 0;
  var Dep = /** @class */function () {
      function Dep() {
          this.id = uid++;
          this.subs = [];
      }
      Dep.prototype.addSub = function (sub) {
          this.subs.push(sub);
      };
      Dep.prototype.removeSub = function (sub) {
          return remove(this.subs.indexOf(sub), 1, this.subs);
      };
      Dep.prototype.notify = function () {
          forEach(function (sub) {
              return sub.update();
          }, this.subs);
      };
      return Dep;
  }();
  var targetStack = {
      _targets: [],
      push: function push(watcher) {
          this._targets.push(watcher);
      },
      top: function top() {
          return this.hasElement() ? this._targets[0] : null;
      },
      hasElement: function hasElement() {
          return this._targets.length > 0;
      },
      pop: function pop() {
          return this._targets.pop();
      }
  };
  //# sourceMappingURL=dep.js.map

  var getType = function getType(value) {
      var type = Object.prototype.toString.call(value);
      return type.slice(1, type.length - 1).split(' ')[1];
  };
  var isPlainObject = function isPlainObject(value) {
      return getType(value) === 'Object';
  };
  var isArray = function isArray(value) {
      return getType(value) === 'Array';
  };
  var isFn = function isFn(value) {
      return getType(value) === 'Function';
  };
  var hasProp = function hasProp(obj, key) {
      return obj.hasOwnProperty(key);
  };
  function callHook(name, rf) {
      var hook = path(['lifecycle', name], rf);
      if (typeof hook === 'function') {
          hook.call(rf);
      }
  }
  var def = function def(obj, key, options) {
      return Object.defineProperty(obj, key, options);
  };
  //# sourceMappingURL=utils.js.map

  var _tasks = {};
  function push(watcherId, cb) {
      if (_tasks[watcherId]) {
          return;
      }
      _tasks[watcherId] = cb;
      _run();
  }
  function _run() {
      setTimeout(function () {
          forEach(function (watcherId) {
              if (typeof _tasks[watcherId] === 'function') {
                  _tasks[watcherId]();
                  delete _tasks[watcherId];
              }
          }, Object.keys(_tasks));
      }, 0);
  }
  var asyncTask = {
      push: push
  };
  //# sourceMappingURL=async-task.js.map

  var uid$1 = 0;
  var Watcher = /** @class */function () {
      function Watcher(rf, expOrFn, cb) {
          this.id = uid$1++;
          this.deps = [];
          this.depIds = Object.create(null);
          this.rf = rf;
          this.cb = cb;
          rf.$watchers.push(this);
          this.getter = isFn(expOrFn) ? expOrFn : this._parseExp(expOrFn).bind(this);
          this.value = this.get();
      }
      Watcher.prototype.get = function () {
          var value;
          targetStack.push(this);
          try {
              value = this.getter();
          } catch (error) {
              throw error;
          } finally {
              targetStack.pop();
          }
          return value;
      };
      Watcher.prototype._parseExp = function (expOrFn) {
          return function () {
              var exp = expOrFn.toString();
              var statement = exp.split('.');
              return path(statement, this.rf);
          };
      };
      Watcher.prototype._exist = function (dep) {
          return this.depIds[dep.id];
      };
      Watcher.prototype.addDep = function (dep) {
          if (!this._exist(dep)) {
              this.depIds[dep.id] = true;
              this.deps.push(dep);
              dep.addSub(this);
          }
      };
      Watcher.prototype.removeDep = function (dep) {
          remove(this.deps.indexOf(dep), 1, this.deps);
      };
      Watcher.prototype.update = function () {
          var _this = this;
          var newValue = this.get();
          var oldValue = this.value;
          this.value = newValue;
          /* 添加到异步任务中，在值确定后再进行组件的渲染，避免重复渲染 */
          asyncTask.push(this.id, function () {
              return _this.cb.call(_this.rf, newValue, oldValue);
          });
          // this.cb.call(this.rf, newValue, oldValue);
      };
      return Watcher;
  }();

  var rf;
  var forStmtReg = /\(.+?\)/;
  var tempStmtReg = /\{(.+?)\}/g;
  function _genOptCode(type, options) {
      return type + ": {" + options.map(function (i) {
          return "'" + i.key + "': '" + i.value.slice(1, i.value.length - 1) + "'";
      }).join(',') + "}";
  }
  function _genEventOptCode(options) {
      return "events: {" + options.map(function (i) {
          return "'" + i.key.slice(3, i.key.length) + "': " + i.value.slice(1, i.value.length - 1);
      }).join(',') + "}";
  }
  function _genEventOptCodeOfFor(options, forStmt) {
      return "events: {" + options.map(function (i) {
          return "'" + i.key.slice(3, i.key.length) + "': " + forStmt + " => " + i.value.slice(1, i.value.length - 1);
      }).join(',') + "}";
  }
  function genOptCode(options, genFn) {
      var attrs = [];
      var events = [];
      var directives = [];
      forEach(function (opt) {
          if (opt.key.startsWith('on:')) {
              events.push(opt);
          } else if (opt.key.startsWith('rf-')) {
              directives.push(opt);
          } else {
              attrs.push(opt);
          }
      }, options);
      return "{" + genFn(attrs, events, directives) + "}";
  }
  function genElCode(vnode) {
      var codes = vnode.children.map(_codegen);
      return "h('" + vnode.content + "', " + genOptCode(vnode.attrs, function (attrs, events, directives) {
          return "\n        " + _genOptCode('attrs', attrs) + ",\n        " + _genEventOptCode(events) + ",\n        " + _genOptCode('directives', directives) + ",\n    ";
      }) + ", [" + codes.join(',') + "])";
  }
  function genForCode(vnode) {
      var v = vnode.attrs.filter(function (attr) {
          return attr.key === 'rf-for';
      })[0];
      var forStmt = v.value.match(forStmtReg);
      var forSource = v.value.split(' ').pop();
      forSource = forSource.substr(0, forSource.length - 1);
      addWatcher(rf, forSource);
      var codes = vnode.children.map(function (i) {
          return forStmt + " => { " + codegen(i, rf) + " }";
      });
      return "f('" + vnode.content + "'," + forSource + " , " + genOptCode(vnode.attrs, function (attrs, events, directives) {
          return "\n      " + _genOptCode('attrs', attrs) + ",\n      " + _genEventOptCodeOfFor(events, forStmt) + ",\n      " + _genOptCode('directives', directives) + ",\n    ";
      }) + ", [" + codes.join(',') + "])";
  }
  function genTextCode(vnode) {
      return "t('" + vnode.content.trim().replace(tempStmtReg, function ($1, $2) {
          addWatcher(rf, $2);
          return "'+" + $2 + "+'";
      }) + "')";
  }
  function genComponentCode(vnode) {
      var codes = vnode.children.map(_codegen);
      return "c('" + vnode.content + "', " + genOptCode(vnode.attrs, function (attrs, events, directives) {
          return "\n        " + _genOptCode('attrs', attrs) + ",\n        " + _genEventOptCode(events) + ",\n        " + _genOptCode('directives', directives) + ",\n    ";
      }) + ", [" + codes.join(',') + "])";
  }
  function genForComponentCode(vnode) {
      var v = vnode.attrs.filter(function (attr) {
          return attr.key === 'rf-for';
      })[0];
      var forStmt = v.value.match(forStmtReg);
      var forSource = v.value.split(' ').pop();
      forSource = forSource.substr(0, forSource.length - 1);
      addWatcher(rf, forSource);
      var codes = vnode.children.map(function (i) {
          return forStmt + " => { " + codegen(i, rf) + " }";
      });
      return "f('" + vnode.content + "'," + forSource + " , " + genOptCode(vnode.attrs, function (attrs, events, directives) {
          return "\n      " + _genOptCode('attrs', attrs) + ",\n      " + _genEventOptCodeOfFor(events, forStmt) + ",\n      " + _genOptCode('directives', directives) + ",\n    ";
      }) + ", [" + codes.join(',') + "])";
  }
  function _codegen(ast) {
      var code = '';
      if (ast.type === ParseType.StartTag || ast.type === ParseType.SelfCloseTag) {
          if (ast.attrs.some(function (i) {
              return i.key === 'rf-for';
          })) {
              code = genForCode(ast);
          } else {
              code = genElCode(ast);
          }
      }
      if (ast.type === ParseType.SelfCloseComponent || ast.type === ParseType.StartComponent) {
          if (ast.attrs.some(function (i) {
              return i.key === 'rf-for';
          })) {
              code = genForComponentCode(ast);
          } else {
              code = genComponentCode(ast);
          }
      }
      if (ast.type === ParseType.Text) {
          code = genTextCode(ast);
      }
      return code;
  }
  function codegen(ast, instance) {
      rf = instance;
      return "\n  with(this.data) {\n    return " + _codegen(ast) + ";\n  }\n  ";
  }
  function addWatcher(rf, expr) {
      new Watcher(rf, "data." + expr, function () {
          return rf.$render();
      });
  }
  //# sourceMappingURL=codegen.js.map

  var compiler = {
      Lexicer: lexical,
      Parser: parse,
      Codegen: codegen
  };
  //# sourceMappingURL=index.js.map

  /*! *****************************************************************************
  Copyright (c) Microsoft Corporation. All rights reserved.
  Licensed under the Apache License, Version 2.0 (the "License"); you may not use
  this file except in compliance with the License. You may obtain a copy of the
  License at http://www.apache.org/licenses/LICENSE-2.0

  THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
  KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
  WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
  MERCHANTABLITY OR NON-INFRINGEMENT.

  See the Apache Version 2.0 License for specific language governing permissions
  and limitations under the License.
  ***************************************************************************** */

  function __spreadArrays() {
      for (var s = 0, i = 0, il = arguments.length; i < il; i++) {
          s += arguments[i].length;
      }for (var r = Array(s), k = 0, i = 0; i < il; i++) {
          for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++) {
              r[k] = a[j];
          }
      }return r;
  }

  function patch(oldNode, newNode) {
      var patches = [];
      if (!compare(oldNode, newNode)) {
          patches.push(_patch(oldNode, newNode));
      }
      if (newNode.hasChildNodes()) {
          var childNodes = newNode.childNodes;
          var oldChildNodes_1 = oldNode.childNodes;
          var oldCur_1;
          var oldCurPos_1 = -1;
          forEach(function (newCur) {
              oldCurPos_1++;
              oldCur_1 = oldChildNodes_1.item(oldCurPos_1);
              if (!oldCur_1) {
                  return patches.push(appendPatch(oldNode, newCur));
              }
              forEach(patches.push.bind(patches), patch(newCur, oldCur_1));
          }, Array.from(childNodes));
          if (oldCurPos_1 < oldChildNodes_1.length - 1) {
              while (oldCur_1 = oldChildNodes_1.item(oldCurPos_1).nextSibling) {
                  patches.push(removePatch(oldCur_1));
              }
          }
      }
      return patches;
  }
  function compare(node1, node2) {
      if (!node1 || !node2) {
          return false;
      }
      if (node1 instanceof HTMLElement && node2 instanceof HTMLElement) {
          return node1.tagName === node2.tagName;
      }
      if (node1 instanceof Text && node2 instanceof Text) {
          return node1.nodeValue === node2.nodeValue;
      }
      return false;
  }
  function removePatch(node) {
      return function () {
          node.parentElement.removeChild(node);
      };
  }
  function appendPatch(root, node) {
      return function () {
          return root.appendChild(node);
      };
  }
  function _patch(oldNode, newNode) {
      return function () {
          var nextEle = oldNode.nextSibling;
          var parentEle = oldNode.parentElement;
          removePatch(oldNode)();
          if (nextEle) {
              parentEle.insertBefore(newNode, nextEle);
          } else {
              parentEle.append(newNode);
          }
      };
  }
  //# sourceMappingURL=patcher.js.map

  function h(tag, options, children) {
      var $tag = document.createElement(tag);
      if (options.attrs) {
          Object.keys(options.attrs).forEach(function (key) {
              return $tag.setAttribute(key, options.attrs[key]);
          });
      }
      if (options.events) {
          Object.keys(options.events).forEach(function (key) {
              return $tag.addEventListener(key, options.events[key]);
          });
      }
      var $fragment = document.createDocumentFragment();
      flatArray(children, []).forEach(function (i) {
          $fragment.append(i);
      });
      $tag.appendChild($fragment);
      return $tag;
  }
  /**
   * 由于 for 循环会返回一个 children 数组，并且随着 for 本身
   * 的嵌套，多层 for 循环后可能会造成 [[[Ele, Ele, Ele]]] 这
   * 种情况，需要将内部的元素解构出来
   */
  function flatArray(children, target) {
      if (children instanceof Array) {
          children.forEach(function (i) {
              return flatArray(i, target);
          });
      } else target.push(children);
      return target;
  }
  function createForElement(tag, options, children) {
      return function (item, index) {
          var $tag = document.createElement(tag);
          if (options.attrs) {
              Object.keys(options.attrs).forEach(function (key) {
                  return $tag.setAttribute(key, options.attrs[key]);
              });
          }
          if (options.events) {
              Object.keys(options.events).forEach(function (key) {
                  return $tag.addEventListener(key, options.events[key](item, index));
              });
          }
          var $fragment = document.createDocumentFragment();
          flatArray(children, []).forEach(function (i) {
              var c = i(item, index);
              if (c instanceof Array) {
                  c.forEach(function (i) {
                      return $fragment.append(i);
                  });
              } else {
                  $fragment.append(c);
              }
          });
          $tag.appendChild($fragment);
          return $tag;
      };
  }
  function f(tag, items, options, children) {
      var $items = items.map(createForElement(tag, options, children));
      return $items;
  }
  function t(value) {
      return typeof value === 'function' ? value() : value;
  }
  function c(tag, options, children) {
      var comp = Component._components[tag];
      if (!comp) {
          throw new Error("Component [" + tag + "] unregister.");
      }
      return createComponent(comp, options, children).$render();
  }
  var renderHelpers = {
      h: h,
      f: f,
      t: t,
      c: c
  };
  var _renderHelperKeys = function _renderHelperKeys(renderHelpers) {
      return Object.keys(renderHelpers);
  };
  var _renderHelperFns = function _renderHelperFns(renderHelpers) {
      return Object.keys(renderHelpers).map(function (key) {
          return renderHelpers[key];
      });
  };
  function genRenderFn(rf, code) {
      var renderHelperKeys = _renderHelperKeys(renderHelpers);
      var renderHelperFns = _renderHelperFns(renderHelpers).map(function (fn) {
          return fn.bind(rf);
      });
      var renderFn = new (Function.bind.apply(Function, __spreadArrays([void 0], renderHelperKeys, [code])))();
      return function () {
          var newNode = renderFn.apply(rf, renderHelperFns);
          var oldNode = rf.$ref;
          if (oldNode && oldNode instanceof Node) {
              /* to patch old node */
              patch(oldNode, newNode).forEach(function (_) {
                  return _();
              });
          }
          callHook('onMount', rf);
          return rf.$ref = oldNode ? oldNode : newNode;
      };
  }
  //# sourceMappingURL=render-helper.js.map

  var arrayProto = Array.prototype;
  var patchedArrayProto = Object.create(arrayProto);
  var methodsOfNeedPatch = ['push', 'shift', 'splice', 'unshift', 'sort', 'pop', 'reverse'];
  function _patch$1(proto, method) {
      var original = arrayProto[method];
      def(patchedArrayProto, method, {
          configurable: false,
          value: function mutator() {
              var args = [];
              for (var _i = 0; _i < arguments.length; _i++) {
                  args[_i] = arguments[_i];
              }
              var result = original.apply(this, args);
              var ob = this.__ob__;
              ob.dep.notify();
              return result;
          }
      });
  }
  var patch$1 = curry(_patch$1)(patchedArrayProto);
  forEach(patch$1, methodsOfNeedPatch);
  //# sourceMappingURL=array.js.map

  var uid$2 = 0;
  var Observer = /** @class */function () {
      function Observer(value) {
          this.id = uid$2++;
          this.dep = new Dep();
          if (isArray(value)) {
              protoAugment(value, patchedArrayProto);
              this.observeArray(value);
          } else {
              this.walk(value);
          }
      }
      Observer.prototype.observeArray = function (arr) {
          forEach(observe, arr);
      };
      Observer.prototype.walk = function (value) {
          function _definedReactive(key) {
              var val = value[key];
              var dep = this.dep;
              var childOb = observe(val);
              def(value, key, {
                  configurable: true,
                  enumerable: true,
                  get: function reactiveGetter() {
                      var target = targetStack.top();
                      if (target) {
                          target.addDep(dep);
                          if (childOb) {
                              target.addDep(childOb.dep);
                          }
                      }
                      return val;
                  },
                  set: function reactiveSetter(newVal) {
                      var oldVal = val;
                      if (oldVal === newVal) {
                          return;
                      }
                      val = newVal;
                      dep.notify();
                  }
              });
          }
          forEach(_definedReactive.bind(this), Object.keys(value));
      };
      return Observer;
  }();
  function protoAugment(source, src) {
      source.__proto__ = src;
  }
  function observe(value) {
      if (!isPlainObject(value) && !isArray(value)) {
          return;
      }
      var ob;
      if (hasProp(value, '__ob__')) {
          ob = value.__ob__;
      } else {
          ob = new Observer(value);
          value.__ob__ = ob;
      }
      return ob;
  }
  //# sourceMappingURL=index.js.map

  var Lifecycle = /** @class */function () {
      function Lifecycle() {}
      return Lifecycle;
  }();
  function $mount1(selector, cb) {
      if (typeof selector === 'string') {
          selector = document.querySelector(selector);
      }
      if (!(selector instanceof HTMLElement)) {
          throw Error("it is not find that the mount element of the component [" + this.name + "]");
      }
      selector.innerHTML === '';
      selector.appendChild(this.$render());
      if (typeof cb === 'function') {
          cb();
      }
  }
  var Component = /** @class */function () {
      function Component() {
          this.$watchers = [];
          this.$mount = $mount1;
      }
      Component.register = function (name, c) {
          this._components[name] = c;
      };
      Component._components = {};
      return Component;
  }();
  var uid$3 = 0;
  var ComponentBuilder = /** @class */function () {
      /**
       * The constructor of the component builder class
       * @param componentName The component name
       */
      function ComponentBuilder(componentName) {
          this.instance = new Component();
          this.instance.id = uid$3++;
          this.instance.name = componentName;
          this.instance.lifecycle = new Lifecycle();
      }
      ComponentBuilder.prototype.parse = function (tempStr) {
          var tokens = lexical(tempStr);
          var ast = parse(tokens);
          var code = codegen(ast, this.instance);
          this.instance.$ast = ast;
          this.instance.$render = genRenderFn(this.instance, code);
      };
      ComponentBuilder.prototype.methods = function (obj) {
          var _this = this;
          Object.keys(obj).forEach(function (key) {
              return _this.instance[key] = obj[key].bind(_this.instance);
          });
          return this;
      };
      /**
       * Defined the reactive data of the component
       * @param obj The reactive data
       */
      ComponentBuilder.prototype.reactive = function (obj) {
          this.instance.data = obj;
          observe(obj);
          return this;
      };
      /**
      * To execute callback when the data of the component to update
      * @param fn callback
      */
      ComponentBuilder.prototype.onUpdate = function (fn) {
          this.instance.lifecycle.onUpdate = fn;
          return this;
      };
      /**
       * To execute callback when the component mounted
       * @param fn callback
       */
      ComponentBuilder.prototype.onMount = function (fn) {
          this.instance.lifecycle.onMount = fn;
          return this;
      };
      /**
       * Creating a component builder
       * @param componentName The component name
       */
      ComponentBuilder.create = function (componentName) {
          return new ComponentBuilder(componentName);
      };
      /**
       * Declareing the root node that the component dom mount
       * @param selector the selector
       */
      ComponentBuilder.prototype.el = function (selector) {
          if (typeof selector === 'string') {
              this.instance.el = document.querySelector(selector);
          }
          if (selector instanceof HTMLElement) {
              this.instance.el = selector;
          }
          return this;
      };
      /**
       * Returning the component instance
       */
      ComponentBuilder.prototype.value = function () {
          return this.instance;
      };
      return ComponentBuilder;
  }();
  //# sourceMappingURL=component-builder.js.map

  var builder;
  function createComponent(Component, options, children) {
      builder = ComponentBuilder.create(Component.name);
      Component({
          options: options,
          children: children
      });
      return builder.value();
  }
  function onMount(fn) {
      builder.onMount(fn);
  }
  function onUpdate(fn) {
      builder.onUpdate(fn);
  }
  function reactive(obj) {
      builder.reactive(obj);
  }
  function methods(obj) {
      builder.methods(obj);
  }
  function template(tempStr) {
      builder.parse(tempStr);
  }
  function register(name, component) {
      Component.register(name, component);
  }
  //# sourceMappingURL=index.js.map

  var index = {
      compiler: compiler,
      createComponent: createComponent,
      onMount: onMount,
      onUpdate: onUpdate,
      reactive: reactive,
      methods: methods,
      template: template,
      register: register
  };
  //# sourceMappingURL=index.js.map

  return index;

})));
//# sourceMappingURL=index.js.map
