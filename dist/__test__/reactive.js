
const ReactiveTest = function (props) {
  reactive({
    title: 'Hello RF'
  })
  const { options } = props;
  const { attrs } = options;
  console.log(`ReactiveTest PROPS:`, attrs);
  methods({
    updateTitle(e) {
      console.log(e);
      this.data.title = e.target.value;
      for (let i = 0; i < 10000; i++) {
        this.data.title = e.target.value + i;
      }
    }
  })

  template(`
  <div>
    <h1 class="cls-{title}">{title}</h1>
    <input value="{title}" on:keyup="this.updateTitle"/>
    <p>Name of Props: ${attrs.name}</p>
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

  onMount(function () {
    const $this = this;
    // setTimeout(() => {
    //   $this.data.appName = 'hello';
    // }, 3000);
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