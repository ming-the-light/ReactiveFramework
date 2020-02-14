import Watcher from "./watcher";
import { remove, __, forEach } from "ramda";

let uid: number = 0;

class Dep {
  id: number
  subs: Watcher[]

  constructor() {
    this.id = uid++;
    this.subs = [];
  }

  addSub(sub: Watcher) {
    this.subs.push(sub);
  }

  removeSub(sub: Watcher) {
    return remove(this.subs.indexOf(sub), 1, this.subs);
  }

  notify() {
    forEach<Watcher>(sub => sub.update(), this.subs);
  }
}

export const targetStack = {
  _targets: [],

  push(watcher: Watcher) {
    this._targets.push(watcher);
  },

  top() {
    return this.hasElement() ? this._targets[0] : null;
  },

  hasElement() {
    return this._targets.length > 0;
  },

  pop() {
    return this._targets.pop();
  }
}

export default Dep;