import { forEach, curry } from 'ramda';
import { def } from '../../shared/utils';

const arrayProto = Array.prototype;
const patchedArrayProto = Object.create(arrayProto);

const methodsOfNeedPatch = [
  'push',
  'shift',
  'splice',
  'unshift',
  'sort',
  'pop',
  'reverse'
];

function _patch(
  proto: object,
  method: string
) {
  const original = arrayProto[method];
  def(patchedArrayProto, method, {
    configurable: false,
    value: function mutator(...args) {
      const result = original.apply(this, args);
      const ob = this.__ob__;
      let inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
          break;
      }
      ob.dep.notify();
      return result;
    }
  });
}

const patch = curry(_patch)(patchedArrayProto);

forEach(patch, methodsOfNeedPatch);

export default patchedArrayProto;