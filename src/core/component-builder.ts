import Watcher from "./observer/watcher"
import lexical from "../compiler/lexicer"
import parser from '../compiler/parser';
import codegen from "../compiler/codegen";
import genRenderFn from "./render-helper";
import observe from "./observer";
import { callHook } from "../shared/utils";

class Lifecycle {
  onMount: Function
  onUpdate: Function
  onDestory: Function
}

function $mount1(selector, cb) {

  if (typeof selector === 'string') {
    selector = document.querySelector(selector);
  }

  if (!(selector instanceof HTMLElement)) {
    throw Error(`it is not find that the mount element of the component [${this.name}]`);
  }

  selector.innerHTML === '';
  selector.appendChild(
    this.$render()
  );

  if (typeof cb === 'function') {
    cb();
  }
}

export class Component {
  name: string
  id: any
  el: any
  $ast: object
  data: object
  render: Function
  lifecycle: Lifecycle
  template: string
  $render: Function
  $ref: Node
  $watchers: Watcher[] = []
  $mount = $mount1
  static _components = {}
  static register(name, c) {
    this._components[name] = c;
  }

}

let uid = 0;

class ComponentBuilder {
  parse(tempStr: string) {
    const tokens = lexical(tempStr);
    const ast = parser(tokens);
    const code = codegen(ast, this.instance);

    this.instance.$ast = ast;
    this.instance.$render = genRenderFn(
      this.instance,
      code,

    );
  }
  methods(obj: Object) {
    Object.keys(obj).forEach(key => this.instance[key] = obj[key].bind(this.instance));
    return this;
  }
  reactive(obj: Object) {
    this.instance.data = obj;
    observe(obj);
    return this;
  }
  onUpdate(fn: () => any) {
    this.instance.lifecycle.onUpdate = fn;
    return this;
  }
  onMount(fn: () => any) {
    this.instance.lifecycle.onMount = fn;
    return this;
  }

  instance: Component

  constructor(componentName) {
    this.instance = new Component();
    this.instance.id = uid++;
    this.instance.name = componentName;
    this.instance.lifecycle = new Lifecycle();
  }

  static create(componentName: any) {
    return new ComponentBuilder(componentName);
  }

  el(selector) {
    if (typeof selector === 'string') {
      this.instance.el = document.querySelector(selector);
    }

    if (selector instanceof HTMLElement) {
      this.instance.el = selector;
    }

    return this;
  }

  value() {
    return this.instance;
  }
}

export default ComponentBuilder;
