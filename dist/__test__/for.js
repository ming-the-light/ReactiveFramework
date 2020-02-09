
const TableTest = function (props) {
  reactive({
    tableHeaders: [{
      key: 'id',
      title: 'Id'
    }, {
      key: 'name',
      title: 'Name'
    }, {
      key: 'age',
      title: 'Age'
    }],
    tableData: [{
      id: 1,
      name: 'John',
      age: 19
    }, {
      id: 2,
      name: 'Bob',
      age: 18
    }, {
      id: 3,
      name: 'Anne',
      age: 19
    }]
  });

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
    // console.log(this);
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

{
  let comp = createComponent(TableTest);
  comp.$mount('#for-test');
}