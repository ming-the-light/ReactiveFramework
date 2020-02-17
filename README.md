
## Introduction

A front framework be based on MVVM and functional thought

## Progress
- [x] template syntax
- [x] support of component
- [x] events bindings.
- [x] reactive data bindings.
- [x] for loop.
- [ ] if and else statement.
- [ ] slots of component.
- [ ] with props.

## Using

``` js
// based
import { createComponent } from 'rf';

const App = function() {
  template(`
    <div>Hello World</div>
  `);
}

createComponent(App).$mount('#app');  
```
 
``` js
// Advanced 1

const TableTest = function (props) {

  // reactive data of the instance
  reactive({
    tableHeaders: [{
      key: 'id',
      title: 'Id'
    }, {
      key: 'name',
      title: 'Name'
    }],
    tableData: [{
      id: 1,
      name: 'John'
    }, {
      id: 2,
      name: 'Bob'
    }]
  });

  // methods of The instance
  methods({
    handler: function (item) {
      const $this = this;
      return function (e) {
        alert(`You clicked the item of number ${item}, the item will removed`);
        let items = $this.data.tableData;
        items.splice(items.indexOf(item), 1);
      }
    }
  });

  onMount(function () {
    // component on mounted that will execute the function
  });

  template(`
  <table id="table-test">
    <thead>
      <tr>
        <th rf-for="(item) in tableHeaders">{item.title}</th>
      </tr>
    </thead>
    <tbody>
      <tr rf-for="(item) in tableData" on:click="this.handler(item)">
        <td rf-for="(header) in tableHeaders">
          {item[header.key]}
        </td>
      </tr>
    </tbody>
  </table>
  `);
}

createComponent(TableTest)$mount('#for-test');
```

``` js
// Advanced 2

const ReactiveTest = function (props) {
  reactive({
    title: 'Hello RF'
  })
  const { options } = props;
  const { attrs } = options;
  
  methods({
    updateTitle(e) {
      this.data.title = e.target.value;      
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

// To register global component
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
app.$mount('#reactive-test');  
```

## bugs:

- Updated of parent components that will cause to display error of child components

- Value of attribute binding changed, but the attribute not changed