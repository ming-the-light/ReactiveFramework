import { forEach } from "ramda";

function patch(
  oldNode: Node,
  newNode: Node
) {
  const patches = [];

  if (!compare(oldNode, newNode)) {
    patches.push(_patch(oldNode, newNode));
  }

  if (newNode.hasChildNodes()) {
    let childNodes = newNode.childNodes;
    let oldChildNodes = oldNode.childNodes;
    let oldCur;
    let oldCurPos = -1;

    forEach(newCur => {
      oldCurPos++;
      oldCur = oldChildNodes.item(oldCurPos);

      if (!oldCur) {
        return patches.push(appendPatch(oldNode, newCur));
      }

      forEach(
        patches.push.bind(patches),
        patch(newCur, oldCur)
      );

    }, Array.from(childNodes));

    if (oldCurPos < oldChildNodes.length - 1) {
      while (oldCur = oldChildNodes.item(oldCurPos).nextSibling) {
        patches.push(removePatch(oldCur));
      }
    }
  }


  return patches;
}

function compare(node1: Node, node2: Node) {

  if (!node1 || !node2) {
    return false;
  }

  if (
    node1 instanceof HTMLElement &&
    node2 instanceof HTMLElement
  ) {
    return node1.tagName === node2.tagName;
  }

  if (
    node1 instanceof Text &&
    node2 instanceof Text
  ) {
    return node1.nodeValue === node2.nodeValue;
  }

  return false;
}

function removePatch(node: Node) {
  return () => {
    node.parentElement.removeChild(node);
  }
}

function appendPatch(root: Node, node: Node) {
  return () => root.appendChild(node);
}

function _patch(
  oldNode: Node,
  newNode: Node
) {
  return () => {
    const nextEle = oldNode.nextSibling;
    const parentEle = oldNode.parentElement;
    removePatch(oldNode)();
    if (nextEle) {
      parentEle.insertBefore(newNode, nextEle);
    } else {
      parentEle.append(newNode);
    }
  };
}

export default patch;