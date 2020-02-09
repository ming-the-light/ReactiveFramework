
const ReactiveTest = function (props) {
  reactive({
    title: 'Hello RF'
  })

  methods({
    updateTitle(e) {
      this.data.title = e.target.value;
    }
  })

  template(`
  <div>
    <h1>{title}</h1>
    <input value="{title}" on:keyup="this.updateTitle"/>
  </div>
  `)
};

let id = -1;

const Clock = function (props) {
  reactive({
    dateNow: new Date()
  });

  onMount(function () {
    if (id < 0) {
      const $this = this;
      setInterval(() => {
        $this.data.dateNow = new Date();
      }, 1000);
      id++;
    }
  })

  template(`
  <div class="clock">
    <h3>{dateNow}</h3>
  </div>
  `);
}

register(ReactiveTest.name, ReactiveTest);
register(Clock.name, Clock);

const App = function () {
  reactive({
    appName: 'Reactive Test'
  });

  template(`
  <div>
    <ReactiveTest name="{appName}"/>
    <Clock />
  </div>
  `);
}

const app = createComponent(App);
console.log(app);
app.$mount('#reactive-test');  