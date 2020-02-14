
class Publisher {

  constructor() {
    this._subs = {};
  }

  subscribe(event, subscriber) {
    let subs = this._subs;
    subs[event] ?
      subs[event].push(subscriber) :
      subs[event] = [subscriber];
  }

  publish(event, data) {
    let subs = this._subs;

    if (subs[event])
      subs[event].forEach(i => i.publish(event, data));
  }

}

class Subscriber {

  constructor(publisher) {
    this._events = {};
    this._publisher = publisher;
  }

  subscribe(event, cb) {
    this._events[event] = cb;
    this._publisher.subscribe(event, this);
  }

  publish(event, data) {
    if (typeof this._events[event] === 'function')
      this._events[event](data);
  }

}

/**
 * Exmple
 */

class Hunter extends Subscriber {
  constructor(union, name) {
    super(union);
    this._name = name;
  }

  publish(event, data) {
    console.log(
      `${this._name}:
      ${event} appearance !!
          Properties:
            Height: ${data.height}
            Weight: ${data.weight}
            Power: ${data.power}
          Money reward: ${data.money}`
    );
    if (typeof this._events[event] === 'function')
      this._events[event](data);
  }
}

const huntUnion = new Publisher();

const brave = new Hunter(huntUnion, 'Brave');
const assassin = new Hunter(huntUnion, 'Assassin');

brave.subscribe('Fly Dragon of Thunder', data => {
  if (data.height < 50)
    console.log(`I can try...`)
  else
    console.log('It\'s too powerful...')

  console.log('\r\n\r\n')
});

assassin.subscribe('Ghost', data => {
  if (data.money > 50)
    console.log(`I can try...`)
  else
    console.log('Money reward is too little...')
  console.log('\r\n\r\n')
});

const fdt = {
  height: 340,
  weight: 345,
  money: 20000
};

const fdt2 = {
  height: 340,
  weight: 345,
  money: 20000
};

const gh = {
  height: 1.7,
  weight: 0,
  money: 10
};

const gh2 = {
  height: 1.8,
  weight: 0,
  money: 100
};

function delay(fn, cb) {
  fn();
  setTimeout(cb, 3000);
}

delay(
  () => huntUnion.publish('Fly Dragon of Thunder', fdt),
  () => delay(
    () => huntUnion.publish('Ghost', gh),
    () => delay(
      () => huntUnion.publish('Fly Dragon of Thunder', fdt),
      () => huntUnion.publish('Ghost', gh2)
    )
  )
)

