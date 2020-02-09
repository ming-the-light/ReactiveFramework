(function () {

  /*
   * Utils
   */

  function def(obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    })
  }

  /* VNode */

  function VNode(tagName, type, children, attrs) {
    this.tagName = tagName;
    this.type = type;
    this.children = children;
    this.attrs = attrs;
  }

  function Watcher(rf, expOrFn, cb, options, isRenderWatcher) {
    this.rf = rf;
    this.cb = cb;
    this.expOrFn = expOrFn;
    this.deps = [];

    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
    }
    this.value = this.get();

    rf.$watchers.push(this);
  }

  function parsePath(exp) {
    let segments = exp.split('.');
    return function (obj) {
      for (let i = 0; i < segments.length; i++) {
        if (!obj) {
          return;
        }
        obj = obj[segments[i]]
      }
      return obj;
    };
  }

  /*
   * Array Patch
   */

  const arrayProto = Array.prototype;
  const arrayMethods = Object.create(arrayProto);

  const methodsToPath = [
    'push',
    'shift',
    'splice',
    'unshift',
    'sort',
    'pop',
    'reverse'
  ];

  methodsToPath.forEach(function (method) {
    const original = arrayProto[method];
    def(arrayMethods, method, function mutator(...args) {
      const result = original.apply(this, args);
      const ob = this.$ob;
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
          break;
      }

      if (inserted) {
        ob.observeArray(inserted);
      }
      ob.$dep.notify();
      return result;
    });
  });

  Watcher.prototype.get = function () {
    const rf = this.rf;
    let value;
    Dep.pushTarget(this);
    try {
      value = this.getter.call(rf, rf);
    } catch (e) {
      console.error(e, vm, `getter for watcher ${this.expOrFn}`);
    } finally {
      Dep.popTarget();
      this.cleanupDeps();
    }

    return value;
  }

  Watcher.prototype.addDep = function (dep) {
    const deps = this.deps;
    if (deps.some(i => i.id === dep.id)) {
      return;
    }
    deps.push(dep);
    dep.addSub(this);
  }

  Watcher.prototype.cleanupDeps = function () {

  };

  Watcher.prototype.update = function () {
    this.run();
  };

  Watcher.prototype.run = function () {
    const value = this.get();
    console.log('run method inside value', value)
    const oldValue = this.value;
    this.value = value;
    this.cb.call(this.vm, value, oldValue);
  }

  const newGuid = (function () {
    let count = 0;
    return () => count++;
  })();

  function Dep() {
    this.id = newGuid();
    this.subs = [];

  }

  Dep.prototype.addSub = function (sub) {
    this.subs.push(sub);
  };

  Dep.prototype.removeSub = function (sub) {
    const index = this.subs.indexOf(sub);

    if (index > -1) {
      this.subs.splice(index, 1);
    }
  };

  Dep.prototype.depend = function () {
    Dep.target.addDep(this);
  };

  Dep.prototype.notify = function () {
    const subs = this.subs.slice();
    subs.forEach(sub => sub.update());
  };

  Dep.pushTarget = function (target) {
    if (Dep.target) {
      Dep.targetStack.push(target);
    } else {
      Dep.target = target;
    }
  };

  Dep.popTarget = function () {
    Dep.target = Dep.targetStack.pop();
  };

  Dep.targetStack = [];
  Dep.target = null;

  function Observer(value) {
    this.value = value;
    this.$dep = new Dep();
    def(value, '$ob', this);
    if (Array.isArray(value)) {
      protoAugment(value, arrayMethods);
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  function protoAugment(target, src) {
    target.__proto__ = src;
  }

  Observer.prototype.observeArray = function (value) {
    value.forEach(observe);
  }

  Observer.prototype.walk = function (obj) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key);
    });
  };

  function observe(value) {
    if (value instanceof VNode) {
      return;
    }

    if (value.hasOwnProperty('$ob') && value.$ob instanceof Observer) {
      return value.$ob;
    }

    let ob;

    if (Array.isArray(value) || Object.prototype.toString.call(value) === '[object Object]') {
      ob = new Observer(value);
    }
    return ob;
  }

  function defineReactive(
    obj,
    key,
    val,
    customSetter,
    shallow
  ) {
    const dep = new Dep();

    const prop = Object.getOwnPropertyDescriptor(obj, key);

    if (prop && prop.configurable === false) {
      return;
    }

    const getter = prop && prop.get;
    const setter = prop && prop.set;
    val = prop.value;
    let childOb = !shallow && observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter() {
        const value = getter ? getter.call(obj) : val;

        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.$dep.depend();
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        return value;
      },

      set: function reactiveSetter(newValue) {
        const value = getter ? getter.call(obj) : val;
        if (newValue === value || (newValue !== newValue && value !== value)) {
          return;
        }

        if (customSetter) {
          customSetter();
        }

        if (setter) {
          setter.call(obj, newValue);
        } else {
          val = newValue;
          console.log('val changed', val)
        }

        childOb = !shallow && observe(newValue);
        dep.notify();
      }
    });

    function dependArray(value) {
      value.forEach(i => {
        i && i.$ob && i.$ob.$dep.depend();
        if (Array.isArray(i)) {
          dependArray(i);
        }
      });
    }
  }

  vm = {
    data: {
      list: [1, 2, 3, { a: 1 }]
    },
    $watchers: []
  };

  function create() { }

  function value() { }

  function template() { }

  function el() { }

  function onMounted() { }

  const GlobalAPI = {
    create,
    value,
    template,
    el,
    onMounted
  }

  window.RF = GlobalAPI;

  /* Exmple */

  function __test__() {
    rf = {
      data: {
        title: ''
      },
      $watchers: []
    };
    const $title = document.querySelector('#title');
    observe(rf.data);
    new Watcher(rf, 'data.title', (value) => {
      $title.innerHTML = 'value changed to: ' + value;
    });
    rf.data.title = 'Reactive Framework';
  }


  window.onload = () => {
    __test__();
  }

})();