import { forEach, remove, map, path } from "ramda";
import { ParseObj, ParseType, KeyValuePair } from "./types";

const selfCloseTagReg = /^<.+\/>$/;
const startTagReg = /^<[^\/](.+)/;
const endTagReg = /^<\/(.+)>$/;
const commentReg = /\/\/.+/;
const attrMatchReg = / .+?=".+?"/g;
const tagNameMatchReg = /\w+/;
const isComponentNameReg = /^[A-Z][_a-zA-Z]+$/;

function parse(tokens: string[]) {
  const LENGTH: number = tokens.length;
  let pos: number = -1;
  let parseObjects: ParseObj[] = [];
  let statment: string;
  let objs = [];
  let ast: ParseObj;
  while (LENGTH > ++pos && (statment = tokens[pos])) {
    let obj = parseObj(statment);
    objs.push(obj);
    parseObjects.push(obj);
  }
  ast = genTree(parseObjects);

  return ast;
}

function genTree(
  parseObjects: ParseObj[]
): ParseObj {
  if (parseObjects.length < 1) return;
  const start: ParseObj = parseObjects.shift();

  return _genTree(start, parseObjects.shift(), parseObjects);
}

function _genTree(
  start: ParseObj,
  curNode: ParseObj,
  parseObjects: ParseObj[]
): ParseObj {
  if (!curNode || isPair(start, curNode)) return start;
  start.children.push(
    (
      curNode.type === ParseType.StartTag ||
      curNode.type === ParseType.StartComponent
    ) ? _genTree(
      curNode,
      parseObjects.shift(),
      parseObjects
    ) : curNode
  );

  return _genTree(start, parseObjects.shift(), parseObjects);
}

function isPair(obj1, obj2) {
  return obj1.type === ParseType.StartTag &&
    obj2.type === ParseType.EndTag &&
    obj1.content === obj2.content;
}

function parseObj(statment: string): ParseObj {
  let obj: ParseObj;
  if (selfCloseTagReg.test(statment)) {
    obj = parseSelfCloseTag(statment);
  } else if (startTagReg.test(statment) && statment.endsWith('>')) {
    obj = parseStartTag(statment);
  } else if (endTagReg.test(statment)) {
    obj = parseEndTag(statment);
  } else if (commentReg.test(statment)) {
    obj = parseComment(statment);
  } else {
    obj = parseText(statment);
  }

  return obj;
}

function parseStartTag(statment: string): ParseObj {
  let body = statment.slice(1, statment.length - 1);

  let tagName: string;
  let type: ParseType;
  let attrs: KeyValuePair[] = [];

  attrs = map(parseTagAttr, body.match(attrMatchReg) || []);
  tagName = path(['0'], body.match(tagNameMatchReg));

  type = isComponentNameReg.test(tagName) ?
    ParseType.StartComponent :
    ParseType.StartTag;

  let obj = new ParseObj(type, tagName, attrs);
  return obj;
}

function parseTagAttr(str: string): KeyValuePair {
  let kv = str.split('=');
  return new KeyValuePair(kv[0].trim(), kv.length > 1 ? kv[1] : undefined);
}


function parseSelfCloseTag(statment: string): ParseObj {
  let body = statment.slice(1, statment.length - 2);

  let tagName: string;
  let type: ParseType;
  let attrs: KeyValuePair[] = [];

  attrs = map(parseTagAttr, body.match(attrMatchReg) || []);
  tagName = path(['0'], body.match(tagNameMatchReg));
  console.log(isComponentNameReg.test(tagName));

  type = isComponentNameReg.test(tagName) ?
    ParseType.SelfCloseComponent :
    ParseType.SelfCloseTag;

  let obj = new ParseObj(type, tagName, attrs);
  return obj;
}

function parseEndTag(statment: string): ParseObj {
  let body = statment.slice(2, statment.length - 1);
  let obj = new ParseObj(ParseType.EndTag, body, null);
  return obj;
}

function parseComment(statment: string): ParseObj {
  let obj = new ParseObj(ParseType.Comment, statment, null);
  return obj;
}

function parseText(statment: string): ParseObj {
  let obj = new ParseObj(ParseType.Text, statment, null);
  return obj;
}

export default parse;