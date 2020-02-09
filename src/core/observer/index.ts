import { isPlainObject, isArray, def } from "../../shared/utils";
import { hasProp } from "../../shared/utils";
import Dep, { targetStack } from "./dep";
import patchedArrayProto from "./array";
import { forEach } from "ramda";
import Watcher from "./watcher";

let uid: number = 0;

class Observer {
  id: number
  dep: Dep

  constructor(value: any) {
    this.id = uid++;
    this.dep = new Dep();

    if (isArray(value)) {
      protoAugment(value, patchedArrayProto);
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  }

  observeArray(arr: any[]) {
    forEach(observe, arr);
  }

  walk(value: any) {
    function _definedReactive(key) {
      let val = value[key];
      const dep: Dep = this.dep;
      const childOb = observe(val);
      def(value, key, {
        configurable: true,
        enumerable: true,
        get: function reactiveGetter() {
          let target: Watcher = targetStack.top();
          if (target) {
            target.addDep(dep);
            if (childOb) {
              target.addDep(childOb.dep);
            }
          }
          return val;
        },
        set: function reactiveSetter(newVal) {
          const oldVal = val;
          if (oldVal === newVal) {
            return;
          }
          val = newVal;
          dep.notify();
        }
      });
    }

    forEach(_definedReactive.bind(this), Object.keys(value));
  }
}

function protoAugment(source: any, src: object) {
  source.__proto__ = src;
}

function observe(value: any) {
  if (
    !isPlainObject(value) &&
    !isArray(value)
  ) {
    return;
  }

  let ob: Observer;

  if (hasProp(value, '__ob__')) {
    ob = value.__ob__;
  } else {
    ob = new Observer(value);
    value.__ob__ = ob;
  }

  return ob;
}

export default observe;