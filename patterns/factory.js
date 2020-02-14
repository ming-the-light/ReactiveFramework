class Factory {

  static getWheel() {
    return {
      color: 'gray'
    }
  }
  
  static getBody() {
    return {
      color: 'gold'
    }
  }

  static getEngine() {
    return {
      horsepower: 500
    }
  }
  
}

class Car {
  constructor() {
    this.wheel = Factory.getWheel();
    this.engine = Factory.getEngine();
    this.body = Factory.getBody();
  }

  show() {
    console.log(`This is a ${this.body.color}' car`);
  }

  run() {
    console.log(`The car running, speed is ${this.engine.horsepower} km`);
  }

}

const car = new Car();

car.show();
car.run();