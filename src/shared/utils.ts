import { indexOf, path } from "ramda";
import { Component } from "../core/component-builder";

const getType = (value: any): string => {
  const type: string = Object.prototype.toString.call(value);
  return type.slice(1, type.length - 1).split(' ')[1];
}

export const isPlainObject: (value: any) => boolean = value => getType(value) === 'Object';

export const isArray: (value: any) => boolean = value => getType(value) === 'Array';

export const isFn: (value: any) => boolean = value => getType(value) === 'Function';

export const hasProp: (obj: any, key: string) => boolean = (obj, key) => obj.hasOwnProperty(key);

/**
 * 扁平化数组 [[[1, 2]]] => [1, 2]
 * @param array 要结构的数组
 */
export const flatArray = array => _flatArray(array, []);

function _flatArray(children, target) {
  if (children instanceof Array) {
    children.forEach(i => _flatArray(i, target));
  } else {
    target.push(children);
  }

  return target;
}

export function callHook(name: string, rf: Component) {
  const hook = path(['lifecycle', name], rf);
  if (typeof hook === 'function') {
    hook.call(rf);
  }
}

interface PropertyDescriptor {
  configurable?: boolean;
  enumerable?: boolean;
  value?: any;
  writable?: boolean;
  get?(): any;
  set?(v: any): void;
}
interface ThisType<T> { }

export const def = (obj: object, key: string, options: PropertyDescriptor & ThisType<any>) => Object.defineProperty(obj, key, options);

export const log = {
  error(...msg) {
    console.error(...msg);
  },

  info(...msg) {
    console.log(...msg);
  },

  wran(...msg) {
    console.warn(...msg);
  }
}