import { forEach } from "ramda";

const _tasks = {};

function push(watcherId, cb) {
  if (_tasks[watcherId]) {
    return;
  }
  _tasks[watcherId] = cb;
  _run();
}

function _run() {
  setTimeout(() => {
    forEach(watcherId => {
      if (typeof _tasks[watcherId] === 'function') {
        _tasks[watcherId]();
        delete _tasks[watcherId];
      }
    }, Object.keys(_tasks));
  }, 0);
}

export default {
  push
}