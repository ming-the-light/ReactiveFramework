import Dep, { targetStack } from "./dep";
import { remove, path, equals } from "ramda";
import { log, isFn } from "../../shared/utils";
import asyncTask from "../async-task";

let uid: number = 0;

class Watcher {
  id: number
  deps: Dep[]
  rf: any
  depIds: object
  value: any
  getter: Function
  cb: Function

  constructor(
    rf: any,
    expOrFn: string | Function,
    cb: Function
  ) {
    this.id = uid++;
    this.deps = [];
    this.depIds = Object.create(null);
    this.rf = rf;
    this.cb = cb;
    rf.$watchers.push(this);
    this.getter = isFn(expOrFn) ? expOrFn : this._parseExp(expOrFn).bind(this);
    this.value = this.get();
  }

  get() {
    let value;
    targetStack.push(this);
    try {
      value = this.getter();
    } catch (error) {
      throw error;
    } finally {
      targetStack.pop();
    }
    return value;
  }

  private _parseExp(expOrFn: string | Function) {
    return function () {
      let exp: string = expOrFn.toString();
      const statement: string[] = exp.split('.');
      return path(statement, this.rf);
    }
  }

  private _exist(dep: Dep): boolean {
    return this.depIds[dep.id];
  }

  addDep(dep: Dep) {
    if (!this._exist(dep)) {
      this.depIds[dep.id] = true;
      this.deps.push(dep);
      dep.addSub(this);
    }
  }

  removeDep(dep: Dep) {
    remove(this.deps.indexOf(dep), 1, this.deps);
  }

  update() {
    const newValue: any = this.get();
    const oldValue: any = this.value;

    this.value = newValue;

    /* 添加到异步任务中，在值确定后再进行组件的渲染，避免重复渲染 */
    asyncTask.push(
      this.id,
      () => this.cb.call(this.rf, newValue, oldValue)
    );
    // this.cb.call(this.rf, newValue, oldValue);
  }
}

export default Watcher;