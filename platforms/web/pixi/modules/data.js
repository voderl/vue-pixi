import { diffList, valueList } from "../config/handleConfig";
import { createElement } from "../pixi-node";
import updateListeners from "../event/listener";
import keyEvent from "../event/keyEvent";

const emetyFunction = () => {};
/**
 * object 更新时 ，往下 更新结构 当$update不存在时默认 向下拓展
 */
const objectUpdate = function (el, newValue, oldValue, options) {
  diffAndPatch(el, newValue, {}, this, options);
};

function handleDiffObj(diffObj) {
  if (typeof diffObj !== "object") return;
  let value;
  if (typeof diffObj.$dirty !== "function") diffObj.$dirty = emetyFunction;
  if (typeof diffObj.$update !== "function") diffObj.$update = objectUpdate;
  for (let key in diffObj) {
    if (!key.startsWith("$")) {
      value = diffObj[key];
      if (typeof value === "function") {
        diffObj[key] = handleDiffObj({
          $update: value,
        });
      } else if (typeof value === "object") {
        handleDiffObj(value);
      }
    }
  }
  return diffObj;
}

Object.keys(diffList).forEach((key) => {
  handleDiffObj(diffList[key]);
});
/**
 * 实现 $proxy属性，即代理子属性的更改，当可能变化的属性太多且都是同一种处理方案时使用
 */
const proxyPath = {
  $set(path, key) {
    this.key = key;
    this.path = path;
    return this;
  },
  $dirty() {},
  $update(el, newValue, oldValue, options) {
    this.path.$proxy(el, this.key, newValue, oldValue, options);
  },
};
const emptyPath = {
  $dirty() {},
  $update() {},
};
// 没有path的话就默认，可以正常下层diff
function diffAndPatch(el, newData, oldData, path, options) {
  let key;
  let oldValue;
  let newValue;
  let currentPath;
  let dirty = false;
  const useProxy = typeof path.$proxy === "function" ? true : false;
  for (key in oldData) {
    oldValue = oldData[key];
    newValue = newData[key];
    if (oldValue !== newValue) {
      currentPath = useProxy
        ? proxyPath.$set(path, key)
        : path[key] || emptyPath;
      if (typeof oldValue === "object" && typeof newValue === "object") {
        if (diffAndPatch(el, newValue, oldValue, currentPath, options)) {
          dirty = true;
        }
      } else {
        dirty = true;
        currentPath.$update(el, newValue, oldValue, options);
      }
    }
  }
  for (key in newData) {
    // 更好的应该是？ !oldData.hasOwnProperty(key) 效率差个10倍左右吧
    if (oldData[key] === undefined) {
      currentPath = useProxy
        ? proxyPath.$set(path, key)
        : path[key] || emptyPath;
      dirty = true;
      currentPath.$update(el, newData[key], oldData[key], options);
    }
  }
  if (dirty) {
    path.$dirty(el, newData, oldData, options);
  }
  return dirty;
}
// diffAndPatch(
//   "el",
//   {
//     anchor: {
//       x: 0.5,
//       y: 0.5,
//     },
//   },
//   {},
//   realObj
// );
const formatData = (data) => {
  const result = {};
  if (data.value) result.value = data.value;
  const attrs = data.attrs;
  if (attrs) result.attrs = attrs;
  const style = data.style || data.staticStyle;
  if (style) result.style = style;
  const klass = data.class || data.staticClass;
  if (klass) result.class = klass;
  // const on = data.on;
  // if (on) result.on = on;
  return result;
};
const getValue = (vnode) => {
  if (vnode.children && vnode.children.length === 1) {
    const node = vnode.children[0];
    if (node.tag === undefined && node.text) return node.text.trim();
  }
  if (valueList[vnode.tag]) return valueList[vnode.tag](vnode.data);
  return null;
};

const updateNode = function (oldVnode, newVnode) {
  const opts = newVnode.componentOptions;
  if (opts && opts.Ctor.options.inheritAttrs === false) {
    return;
  }
  const value = getValue(newVnode);
  if (value) {
    newVnode.data.value = value;
  }
  const diffObj = diffList[newVnode.tag] || diffList[newVnode.elm.tagName];
  if (typeof diffObj !== "object") {
    throw new Error(
      `${newVnode.tag}可能是标签填写错误，没有找到对应的diff对象`
    );
  }
  const options = {
    diffObj,
    vnode: newVnode,
    vm: newVnode.context,
    newData: newVnode.data,
    oldData: oldVnode.data,
    reRender: false,
    update,
  };
  options.update();
  // controller.list.push(options);
};
// update 来更新 ，包括判断是否需要reRender， 以及可以diff，自动推断diffObj
function update(el = this.vnode.elm, newData, oldData) {
  const options =
    newData === undefined
      ? this
      : {
          diffObj: this.diffObj,
          vm: this.vm,
          vnode: this.vnode,
          newData,
          oldData,
          reRender: false,
          update,
        };
  newData = options.newData;
  oldData = options.oldData;
  diffAndPatch(
    el,
    formatData(newData),
    formatData(oldData),
    options.diffObj,
    options
  );
  // diff And Listener listener处理方式是不同的，每次diff都要刷新
  // 如果在diffAndPatch里面不好处理多个Listener是数组的情况，而且导致每次diff都触发dirty
  if (newData.on || oldData.on) {
    updateListeners(el, newData.on, oldData.on, options);
  }
  if (options.reRender) {
    reRender(options.vnode, options);
  }
}
/**
 * 重新渲染，不同diff，比如只改texture，
 */

function reRender(vnode, options) {
  console.log("reRender", vnode, options);
  if (options.count === undefined) options.count = 0;
  options.count += 1;
  if (options.count > 10)
    throw new Error("reRender了超过10次，可能陷入死循环，请检查");
  const oldNode = vnode.elm;
  const node = createElement(vnode.tag, vnode);
  const removed = oldNode.removeChildren();
  const parent = oldNode.parent;
  if (removed.length > 0) {
    node.addChild(...removed);
  }
  vnode.elm = node;
  options.update(node, vnode.data, {});
  if (parent) {
    const index = parent.getChildIndex(oldNode);
    if (index > -1) {
      parent.removeChildAt(index);
      parent.addChildAt(node, index);
    }
  }
  oldNode.destroy();
}
export default {
  create: updateNode,
  update: updateNode,
  destroy(vnode) {
    const { elm } = vnode;
    if (elm && !elm._destroyed) {
      if (elm._eventsCount) {
        ["keydown", "keyup"].forEach((key) => {
          if (elm._events[key]) {
            const index = keyEvent[key].indexOf(elm);
            if (index > -1) keyEvent[key].splice(index, 1);
          }
        });
      }
      elm.destroy();
    }
    vnode.elm = null;
  },
};
