/**
 * 处理事件的逻辑，从core/vdom/helpers/index 更改而来  啊，还是直接用vue的逻辑吧
 */
import { warn, invokeWithErrorHandling } from "core/util/index";
import { cached, isUndef, isTrue, isPlainObject } from "shared/util";
import keyEvent from "./keyEvent";

function createFnInvoker(fns, vm) {
  function invoker() {
    const fns = invoker.fns;
    if (Array.isArray(fns)) {
      const cloned = fns.slice();
      for (let i = 0; i < cloned.length; i++) {
        invokeWithErrorHandling(cloned[i], null, arguments, vm, `v-on handler`);
      }
    } else {
      // return handler return value for single handlers
      return invokeWithErrorHandling(fns, null, arguments, vm, `v-on handler`);
    }
  }
  invoker.fns = fns;
  return invoker;
}
const normalizeEvent = cached((name) => {
  const once = name.charAt(0) === "~"; // Prefixed last, checked first
  name = once ? name.slice(1) : name;
  return {
    name,
    once,
  };
});
function on(el, name, handler) {
  if (!name.startsWith("key")) {
    el.interactive = true;
    el.on(name, handler);
  } else {
    keyEvent.on(el, name, handler);
  }
}
function off(el, name, handler, isClear = false) {
  if (!name.startsWith("key")) {
    el.off(name, handler);
  } else {
    keyEvent.off(el, name, handler);
  }
  if (isClear || el.eventNames().every((id) => id.startsWith("key")))
    el.interactive = false;
}
function onceFunc(el, name, handler) {
  function onceHandler() {
    handler.apply(this, arguments);
    off(el, name, onceHandler);
  }
  on(el, name, onceHandler);
}
function updateOneListener(el, key, newValue, oldValue, options) {
  const newOn = options.newData.on;
  // options.newVnode.data.on[key] = function hello() {};
  // if (newValue !== undefined && interactive) {
  //   options.vnode.interactive = true;
  //   // console.log(options.vnode);
  // }
  if (newValue !== undefined && oldValue !== undefined) {
    oldValue.fns = newValue;
    newOn[key] = oldValue;
    return;
  }
  const { name, once } = normalizeEvent(key);
  if (oldValue === undefined) {
    let cur = newValue;
    if (newValue.fns === undefined) {
      cur = newOn[key] = createFnInvoker(cur, options.vm);
    }
    if (once) {
      onceFunc(el, name, cur);
    } else {
      on(el, name, cur);
    }
    return;
  }
  if (newValue === undefined) {
    off(el, name, oldValue, Object.keys(options.oldData.on).length === 0);
  }
}
function updateListeners(el, newListeners = {}, oldListeners = {}, options) {
  let key;
  for (key in oldListeners) {
    updateOneListener(el, key, newListeners[key], oldListeners[key], options);
  }
  for (key in newListeners) {
    if (oldListeners[key] === undefined) {
      updateOneListener(el, key, newListeners[key], oldListeners[key], options);
    }
  }
}
export default updateListeners;
