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
    // console.log(ast);
    // console.log(code);
    this.instance.$ast = ast;
    this.instance.$render = genRenderFn(
      this.instance,
      code
    );
  }
  methods(obj: Object) {
    Object.keys(obj).forEach(key => this.instance[key] = obj[key].bind(this.instance));
    return this;
  }

  /**
   * Defined the reactive data of the component
   * @param obj The reactive data
   */
  reactive(obj: Object) {
    this.instance.data = obj;
    observe(obj);
    return this;
  }

   /**
   * To execute callback when the data of the component to update
   * @param fn callback
   */
  onUpdate(fn: () => any) {
    this.instance.lifecycle.onUpdate = fn;
    return this;
  }

  /**
   * To execute callback when the component mounted
   * @param fn callback
   */
  onMount(fn: () => any) {
    this.instance.lifecycle.onMount = fn;
    return this;
  }

  /*
   * Component instance
   */
  instance: Component

  /**
   * The constructor of the component builder class
   * @param componentName The component name
   */
  constructor(componentName) {
    this.instance = new Component();
    this.instance.id = uid++;
    this.instance.name = componentName;
    this.instance.lifecycle = new Lifecycle();
  }

  /**
   * Creating a component builder
   * @param componentName The component name
   */
  static create(componentName: any) {
    return new ComponentBuilder(componentName);
  }

  /**
   * Declareing the root node that the component dom mount
   * @param selector the selector
   */
  el(selector) {
    if (typeof selector === 'string') {
      this.instance.el = document.querySelector(selector);
    }

    if (selector instanceof HTMLElement) {
      this.instance.el = selector;
    }

    return this;
  }

  /**
   * Returning the component instance
   */
  value() {
    return this.instance;
  }
}

export default ComponentBuilder;
