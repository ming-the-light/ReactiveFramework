class Subject {

  constructor() {
    this._observers = [];
    this._data = null;
  }

  attach(observer) {
    this._observers.push(observer);
  }

  detach(observer) {
    this._observers.slice(
      this._observers.indexOf(observer),
      1
    )
  }

  notify() {
    this._observers.forEach(i => i.update(this._data));
  }

  setData(data) {
    this._data = data;
    this.notify();
  }

}

class Observer {
  constructor(subject) {
    subject.attach(this);
  }
  update(data) {
    console.log(`subject is changed: \r\n ${data} \r\n `);
  }
}

/**
 * Exmple
 */

class WeatherSubject extends Subject {
  putWeather(weather) {
    this.setData(weather);
  }
}

class WeatherApp extends Observer {
  constructor(subject, appName) {
    super(subject);
    this._appName = appName;
  }
  update(weather) {
    console.log(`${this._appName} notifying you, weather is chaged: \r\n ${weather} \r\n`);
  }
}

const weatherService = new WeatherSubject();

const heFengApp = new WeatherApp(weatherService, 'He Feng');
const miApp = new WeatherApp(weatherService, 'MI');

weatherService.putWeather('Sunny days');
weatherService.putWeather('Rainy days');
weatherService.putWeather('cloudy days');
