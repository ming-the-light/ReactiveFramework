let testCode = `
with (this.data) {
  return c('div', {
  }, [
    c('ul', {
      attrs: {
        class: 'list'
      }
    }, [
      f('li', items, {
        attrs: {
          class: 'item',
        },
        events: [{
          click: ()=>(handler)()
        }]
      }, [
        (item, index) => {
          with (this.data) {
            return c('div', {
              'data-key': index
            }, [t(item), t(items)]);
          }
        }
      ]
      )]
    )]
  )
}
`



// COMPILER TEST
let forLoopTemp = `
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
</table>`;

let tempOfDireactiveBind = `
<div id="bind-test">
  <h1>{msg}</h1>
  <p>{msg}</p>
  <input rf-bind="msg"/>
</div>
`

let tokens = RF.compiler.Lexicer(forLoopTemp);
let ast = RF.compiler.Parser(tokens);
let code = RF.compiler.Codegen(ast);
console.log(tempOfDireactiveBind);
console.log(code);

const instance = {
  data: {
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
    }],
    msg: 'Hello RF'
  },
  handler: function (item) {
    return function (e) {
      alert(`You clicked the item of number ${item}, the item will removed`);
      let items = instance.data.items;
      items.splice(items.indexOf(item), 1);
    }
  }
};