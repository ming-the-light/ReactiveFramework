
function Singleton(cls) {
  let instance;
  return function (...args) {
    return instance ? instance : (instance = new cls(...args));
  }
}

class Store {
  constructor() {
    this.materials = 100;
  }
  show() {
    console.log(this);
  }
}

const StoreSingleton = Singleton(Store);

const store1 = new StoreSingleton();
const store2 = new StoreSingleton();

store1.materials = 99;
store2.materials = 90;
store1.show();
store2.show();

console.log(store1.materials, store2.materials, store1 === store2);

