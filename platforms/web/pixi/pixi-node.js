import { renderList, valueList } from "./config/handleConfig";
import { DisplayObject } from "pixi.js-legacy";

const list = renderList;
/**
 * 在一个node被加入时，加入是从底到高被加入时。一般尽可能将
 * @param {DisplayObject} node
 */
// const getValueVnode = (vnode) => {
//   if (!vnode.children || vnode.children.length !== 1) return null;
//   const node = vnode.children[0];
//   if (node.tag !== undefined || !node.text) return null;
//   return node;
// };

const getValue = (vnode) => {
  if (vnode.children && vnode.children.length === 1) {
    const node = vnode.children[0];
    if (node.tag === undefined && node.text) return node.text.trim();
  }
  if (valueList[vnode]) return valueList(vnode.data);
  return null;
};
// const updateValue = (textNode, parent) => {
//   if (parent) {
//     textNode.parent = parent;
//     parent.valueNode = textNode;
//   }
//   const node = textNode.parent;
//   if (!node) return;
//   if (typeof valueList[node.tagName] === "function") {
//     valueList[node.tagName](node, textNode.text, textNode.oldText);
//   }
// };
// 流程控制，应该不加的
const performance = window.performance;
const controller = {
  list: [],
  func: {},
  count: 40,
  update: null,
  // 比如子节点 ，元素生成了，还不能插入进去，因为可能前面节点还没加入，因此会有乱序错误
  insertController() {},
  loop() {
    if (this.list.length === 0) return;
    const start = performance.now();
    const { list, maxTime, count } = this;
    let now = start;
    while (now - start < maxTime && list.length !== 0) {
      const data = list.splice(0, count);
      data.forEach((args) => {
        this.update(...args);
      });
      now = performance.now();
    }
  },
};

export function createElement(tagName, vnode) {
  if (!list[tagName]) throw new Error(`无${tagName}节点`);
  const value = getValue(vnode);
  const node = list[tagName](value, vnode);
  node.tagName = tagName;
  return node;
}

export function createElementNS() {
  throw new Error("不应该创建NS");
}

export function createTextNode(text) {
  // return {
  //   isTextNode: true,
  //   parent: null,
  //   text: text,
  //   oldText: "",
  // };
  return null;
}

export function createComment(text) {
  const node = new DisplayObject();
  node.name = "comment";
  node.text = text;
  return node;
}

export function insertBefore(parentNode, newNode, referenceNode) {
  // parentNode.insertBefore(newNode, referenceNode);
  const index = parentNode.getChildIndex(referenceNode);
  if (index === -1) throw new Error("插入时找不到");
  // if (!newNode.isTextNode) parentNode.addChildAt(newNode, index);
  // else {
  //   updateValue(newNode, parentNode);
  // }
  if (newNode !== null) parentNode.addChildAt(newNode, index);
}

export function removeChild(node, child) {
  // node.removeChild(child);
  // child 是否destroy？
  if (child !== null) node.removeChild(child);
}

export function appendChild(node, child) {
  // node.appendChild(child);
  // if (!child.isTextNode) node.addChild(child);
  // else {
  //   child.parent = node;
  //   updateValue(child);
  // }
  if (child !== null) node.addChild(child);
}

export function parentNode(node) {
  // return node.parentNode;
  if (node === null) return null;
  return node.parent;
}

export function nextSibling(node) {
  const parent = node.parent;
  if (parent === null) return null;
  const childCount = parent.children.length;
  const index = parent.getChildIndex(node);
  if (index >= childCount - 1) return null;
  return parent.getChildAt(index + 1);
}

export function tagName(node) {
  return node.tagName;
}

export function setTextContent(node, text) {
  // return;
  // node.oldText = node.text;
  // node.text = text;
  // updateValue(node);
}

export function setStyleScope(node, scopeId) {
  throw new Error("不支持Scope Style");
}
