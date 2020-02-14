import ComponentBuilder, { Component } from "./component-builder";

let builder: ComponentBuilder;

export function createComponent(Component: any, options: object, children: []) {

  builder = ComponentBuilder.create(Component.name);

  Component({
    options,
    children
  });
  
  return builder.value();
}

export function onMount(fn: () => any) {
  builder.onMount(fn);
}

export function onUpdate(fn: () => any) {
  builder.onUpdate(fn);
}

export function reactive(obj: Object) {
  builder.reactive(obj);
}

export function methods(obj: Object) {
  builder.methods(obj);
}

export function template(tempStr: string) {
  builder.parse(tempStr);
}

export function register(name, component) {
  Component.register(name, component);
}