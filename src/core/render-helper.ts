import { Component } from './component-builder';
import patch from './patcher';
import { createComponent } from '.';
import { callHook } from '../shared/utils';

function h(tag, options, children) {
  let $tag = document.createElement(tag);
  if (options.attrs) {
    Object.keys(options.attrs).forEach(key => $tag.setAttribute(key, options.attrs[key]));
  }

  if (options.events) {
    Object.keys(options.events).forEach(key => $tag.addEventListener(key, options.events[key]));
  }
  let $fragment = document.createDocumentFragment();
  flatArray(children, []).forEach(i => {
    $fragment.append(i);
  });
  $tag.appendChild($fragment);
  return $tag;
}

/**
 * 由于 for 循环会返回一个 children 数组，并且随着 for 本身
 * 的嵌套，多层 for 循环后可能会造成 [[[Ele, Ele, Ele]]] 这
 * 种情况，需要将内部的元素解构出来
 */
function flatArray(children, target) {
  if (children instanceof Array) {
    children.forEach(i => flatArray(i, target));
  } else
    target.push(children);

  return target;
}

function createForElement(tag, options, children) {
  return (item, index) => {
    let $tag = document.createElement(tag);
    if (options.attrs) {
      Object.keys(options.attrs).forEach(
        key => $tag.setAttribute(key, options.attrs[key])
      );
    }
    if (options.events) {
      Object.keys(options.events).forEach(key =>
        $tag.addEventListener(key, options.events[key](item, index))
      );
    }
    let $fragment = document.createDocumentFragment();
    flatArray(children, []).forEach(i => {
      const c = i(item, index);
      if (c instanceof Array) {
        c.forEach(i => $fragment.append(i));
      } else {
        $fragment.append(c);
      }
    });
    $tag.appendChild($fragment);
    return $tag;
  }
}

function f(tag, items, options, children) {
  const $items = items.map(createForElement(tag, options, children));

  return $items;
}

function t(value) {
  return typeof value === 'function' ? value() : value;
}

function c(tag, options, children) {
  let comp = Component._components[tag];
  if (!comp) {
    throw new Error(`Component [${tag}] unregister.`);
  }
  return createComponent(
    comp,
    options,
    children
  ).$render();
}

const renderHelpers = {
  h,
  f,
  t,
  c
}

const _renderHelperKeys = renderHelpers => Object.keys(renderHelpers);
const _renderHelperFns = renderHelpers => Object.keys(renderHelpers).map(key => renderHelpers[key]);

function genRenderFn(rf: Component, code: string) {
  const renderHelperKeys = _renderHelperKeys(renderHelpers);
  const renderHelperFns = _renderHelperFns(renderHelpers).map(fn => fn.bind(rf));
  const renderFn = new Function(...renderHelperKeys, code);
  return () => {
    const newNode = renderFn.apply(rf, renderHelperFns);
    const oldNode = rf.$ref;

    if (oldNode && oldNode instanceof Node) {
      /* to patch old node */
      patch(oldNode, newNode).forEach(_ => _());
    }

    callHook('onMount', rf);

    return (rf.$ref = oldNode ? oldNode : newNode);
  }
}

export default genRenderFn;