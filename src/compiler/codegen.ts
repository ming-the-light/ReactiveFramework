import { ParseObj, ParseType, KeyValuePair } from "./types";
import { forEach } from "ramda";
import { Component } from "../core/component-builder";
import Watcher from "../core/observer/watcher";

let rf: Component;

const forStmtReg = /\(.+?\)/;
const tempStmtReg = /\{(.+?)\}/g;

function _genTextCode(text: string) {
  return text.trim().replace(tempStmtReg, ($1, $2) => {
    addWatcher(rf, $2);
    return `'+${$2}+'`;
  });
}

function _genOptCode(type: string, options: KeyValuePair[]) {
  return `${type}: {${
    options.map(i => `'${i.key}': '${i.value}'`).join(',')
    }}`;
}

function _genEventOptCode(options: KeyValuePair[]) {
  return `events: {${
    options.map(i => `'${i.key.slice(3, i.key.length)
      }': ${i.value}`).join(',')}}`;
}

function _genEventOptCodeOfFor(options: KeyValuePair[], forStmt: any) {
  return `events: {${
    options.map(i => `'${i.key.slice(3, i.key.length)
      }': ${forStmt} => ${i.value}`).join(',')}}`;
}

function _genAttrOptCode(attrs: KeyValuePair[]) {
  return `attrs: {${
    attrs.map(i => `'${i.key}': '${_genTextCode(i.value)}'`).join(',')
    }}`
}

function genOptCode(
  options: KeyValuePair[],
  genFn: (attrs, events, directives) => string
) {
  const attrs: KeyValuePair[] = [];
  const events: KeyValuePair[] = [];
  const directives: KeyValuePair[] = [];

  forEach<KeyValuePair>(opt => {
    if (opt.key.startsWith('on:')) {
      events.push(opt);
    } else if (opt.key.startsWith('rf-')) {
      directives.push(opt);
    } else {
      attrs.push(opt);
    }
  }, options);

  return `{${genFn(attrs, events, directives)}}`;
}

function genElCode(vnode: ParseObj): string {
  const codes = vnode.children.map(_codegen);
  return `h('${vnode.content}', ${
    genOptCode(vnode.attrs, (attrs, events, directives) => {
      return `
        ${_genAttrOptCode(attrs)},
        ${_genEventOptCode(events)},
        ${_genOptCode('directives', directives)},
    `;
    })}, [${codes.join(',')}])`;
}

function genForCode(vnode: ParseObj): string {
  let v = vnode.attrs.filter(attr => attr.key === 'rf-for')[0];
  const forStmt = v.value.match(forStmtReg);
  let forSource = v.value.split(' ').pop();
  forSource = forSource;

  addWatcher(rf, forSource);

  const codes = vnode.children.map(i => `${forStmt} => { ${codegen(i, rf)} }`);
  return `f('${vnode.content}',${forSource} , ${
    genOptCode(vnode.attrs, (attrs, events, directives) => {
      return `
      ${_genAttrOptCode(attrs)},
      ${_genEventOptCodeOfFor(events, forStmt)},
      ${_genOptCode('directives', directives)},
    `;
    })}, [${codes.join(',')}])`;
}

function genTextCode(vnode: ParseObj): string {
  return `t('${_genTextCode(vnode.content)}')`;
}

function genComponentCode(vnode: ParseObj): string {
  const codes = vnode.children.map(_codegen);
  return `c('${vnode.content}', ${
    genOptCode(vnode.attrs, (attrs, events, directives) => {
      return `
        ${_genAttrOptCode(attrs)},
        ${_genEventOptCode(events)},
        ${_genOptCode('directives', directives)},
    `;
    })}, [${codes.join(',')}])`;
}

function genForComponentCode(vnode: ParseObj): string {
  let v = vnode.attrs.filter(attr => attr.key === 'rf-for')[0];
  const forStmt = v.value.match(forStmtReg);
  let forSource = v.value.split(' ').pop();
  forSource = forSource.substr(0, forSource.length - 1);

  addWatcher(rf, forSource);

  const codes = vnode.children.map(i => `${forStmt} => { ${codegen(i, rf)} }`);
  return `f('${vnode.content}',${forSource} , ${
    genOptCode(vnode.attrs, (attrs, events, directives) => {
      return `
      ${_genAttrOptCode(attrs)},
      ${_genEventOptCodeOfFor(events, forStmt)},
      ${_genOptCode('directives', directives)},
    `;
    })}, [${codes.join(',')}])`;
}

function _codegen(ast: ParseObj): string {
  let code = '';

  if (ast.type === ParseType.StartTag || ast.type === ParseType.SelfCloseTag) {
    if (ast.attrs.some(i => i.key === 'rf-for')) {
      code = genForCode(ast);
    } else {
      code = genElCode(ast);
    }
  }

  if (ast.type === ParseType.SelfCloseComponent || ast.type === ParseType.StartComponent) {
    if (ast.attrs.some(i => i.key === 'rf-for')) {
      code = genForComponentCode(ast);
    } else {
      code = genComponentCode(ast);
    }
  }

  if (ast.type === ParseType.Text) {
    code = genTextCode(ast);
  }

  return code;
}

function codegen(ast: ParseObj, instance: Component): string {
  rf = instance;
  return `
  with(this.data) {
    return ${_codegen(ast)};
  }
  `;
}

function addWatcher(rf, expr) {
  new Watcher(rf, `data.${expr}`, () => rf.$render());
}


export default codegen;