export enum ElementType {
  Tag,
  Text,
  Comment,
  Component,
}

export class KeyValuePair {
  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }
  key: string
  value: string
}

export enum ParseType {
  StartTag,
  StartComponent,
  EndTag,
  Text,
  Comment,
  SelfCloseTag,
  SelfCloseComponent
}

export class ParseObj {
  constructor(
    type: ParseType,
    content: string,
    attrs: KeyValuePair[],
    parent: ParseObj = null,
    children: ParseObj[] = []
  ) {
    this.type = type;
    this.content = content;
    this.attrs = attrs;
    this.parent = parent;
    this.children = children;
  }
  type: ParseType
  content: string
  attrs: KeyValuePair[]
  parent: ParseObj
  children: ParseObj[]
}