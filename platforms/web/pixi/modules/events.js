/* @flow */

import { isDef, isUndef } from "shared/util";
import { updateListeners } from "core/vdom/helpers/index";

let target: any;

function createOnceHandler(event, handler, capture) {
  // const _target = target; // save current target element in closure
  // return function onceHandler() {
  //   const res = handler.apply(null, arguments);
  //   if (res !== null) {
  //     remove(event, onceHandler, capture, _target);
  //   }
  // };
  return {
    type: "once",
    fn: handler,
  };
}

function setInteractive(node, value) {
  if (node.interactive === value) return;
  if (value !== undefined) node.interactive = value;
  else {
    let shouldInteractiveChildren = false;
    node.children.forEach((child) => {
      if (child.interactive || child.interactiveChildren)
        shouldInteractiveChildren = true;
    });
    if (node.interactiveChildren !== shouldInteractiveChildren) {
      node.interactiveChildren = shouldInteractiveChildren;
    }
  }
  if (node.parent) {
    setInteractive(node.parent);
  }
}

function add(
  name: string,
  handler: Function,
  capture: boolean,
  passive: boolean
) {
  setInteractive(target, true);
  if (typeof handler === "function") {
    target.on(name, handler);
  } else if (typeof handler === "object" && handler.type === "once") {
    target.once(name, handler.fn);
  }
}

function remove(
  name: string,
  handler: Function,
  capture: boolean,
  _target?: HTMLElement
) {
  const node = _target || target;
  node.off(name, handler._wrapper || handler);
  if (node._eventsCount === 0) setInteractive(node, false);
}

function updateDOMListeners(oldVnode: VNodeWithData, vnode: VNodeWithData) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return;
  }
  const on = vnode.data.on || {};
  const oldOn = oldVnode.data.on || {};
  console.log(on, oldOn);
  target = vnode.elm;
  // normalizeEvents(on);
  updateListeners(on, oldOn, add, remove, createOnceHandler, vnode.context);
  target = undefined;
}

export default {
  create: updateDOMListeners,
  update: updateDOMListeners,
};
