/* @flow */

import { extend, isDef, isUndef } from "shared/util";

function updateAttrs(oldVnode: VNodeWithData, vnode: VNodeWithData) {
  const opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return;
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return;
  }

  let key, cur, old;
  const elm = vnode.elm;
  // data里面是一些属性的设置问题，
  const data = attrList.get(vnode.tag);
  const oldAttrs = oldVnode.data.attrs || {};
  let attrs: any = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }
  let dirty = false;
  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(data, elm, key, cur);
      if (!dirty) dirty = true;
    }
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      removeAttr(data, elm, key);
      if (!dirty) dirty = true;
    }
  }
  if (dirty && typeof data.$dirty === "function") {
    data.$dirty(elm, oldAttrs, attrs);
  }
}

function setAttr(data, el, key, value) {
  if (typeof data[key] === "function") {
    data[key](el, value);
    return;
  }
  el[key] = value;
}

/**
 * remove 暂时不会恢复默认值，感觉不是很需要
 * @param {*} data
 * @param {*} el
 * @param {*} key
 */
function removeAttr(data, el, key) {
  if (typeof data[key] === "function") {
    data[key](el);
    return;
  }
}
/* function setAttr(el: Element, key: string, value: any) {
  console.log(el, key, value);
  return;
  if (el.tagName.indexOf("-") > -1) {
    baseSetAttr(el, key, value);
  } else if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value =
        key === "allowfullscreen" && el.tagName === "EMBED" ? "true" : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, convertEnumeratedValue(key, value));
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    baseSetAttr(el, key, value);
  }
} */

// function baseSetAttr(el, key, value) {
//   if (isFalsyAttrValue(value)) {
//     el.removeAttribute(key);
//   } else {
//     // #7138: IE10 & 11 fires input event when setting placeholder on
//     // <textarea>... block the first input event and remove the blocker
//     // immediately.
//     /* istanbul ignore if */
//     if (
//       isIE &&
//       !isIE9 &&
//       el.tagName === "TEXTAREA" &&
//       key === "placeholder" &&
//       value !== "" &&
//       !el.__ieph
//     ) {
//       const blocker = (e) => {
//         e.stopImmediatePropagation();
//         el.removeEventListener("input", blocker);
//       };
//       el.addEventListener("input", blocker);
//       // $flow-disable-line
//       el.__ieph = true; /* IE placeholder patched */
//     }
//     el.setAttribute(key, value);
//   }
// }

export default {
  create: (...args) => {
    console.log("create", ...args);
    updateAttrs(...args);
  },
  update: updateAttrs,
};
