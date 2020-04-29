import pixiConfig from "../config/pixiConfig";

function keydownListener(e) {
  e.stopPropagation();
  keyEvent.do("keydown", e);
}
function keyupListener(e) {
  e.stopPropagation();
  keyEvent.do("keyup", e);
}
// function keypressListener(e) {
//   e.stopPropagation();
//   keyEvent.do("keypress", e);
// }
function filter(arr, func) {
  let keep = false;
  let start = 0;
  let deleteCount = 0;
  const len = arr.length;
  for (let i = 0; i < len - deleteCount; i++) {
    if (func(arr[i], deleteCount + i)) {
      if (keep) {
        keep = !keep;
        arr.splice(start, i - start);
        deleteCount += i - start;
        i = start;
      }
    } else if (!keep) {
      start = i;
      keep = !keep;
    }
  }
  if (keep) {
    arr.splice(start, arr.length - start);
  }
}
const keyEvent = {
  active: true,
  keydown: [],
  keyup: [],
  // keypress: [],
  keymap: {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
  },
  getKey(code) {
    if (this.keymap[code]) return this.keymap[code];
    return code;
  },
  on(el, type, handler) {
    if (!this.active) throw new Error("不支持key事件的监听");
    if (!this[type]) throw new Error(`不支持${type}事件的监听`);
    this[type].push(el);
    el.on(type, handler);
  },
  off(el, type, handler) {
    if (!this.active) throw new Error("不支持key事件的监听");
    if (!this[type]) throw new Error(`不支持${type}事件的监听`);
    if (!el._events[type]) return;
    if (typeof el._events[type] === "function") {
      const index = this[type].indexOf(el);
      if (index > -1) this[type].splice(index, 1);
    }
    el.off(type, handler);
  },
  do(type, e) {
    filter(this[type], (el) => {
      if (!el || el._destroyed) return false;
      el.emit(type, e, this.getKey(e.code));
      return true;
    });
  },
  enable() {
    this.active = true;
    this.addEventListener();
  },
  disable() {
    this.active = false;
    this.removeEventListener();
  },
  addEventListener() {
    window.addEventListener("keydown", keydownListener);
    window.addEventListener("keyup", keyupListener);
    // window.addEventListener("keypress", keypressListener);
  },
  removeEventListener() {
    this.keydown = this.keyup = this.keypress = [];
    window.removeEventListener("keydown", keydownListener);
    window.removeEventListener("keyup", keyupListener);
    // window.removeEventListener("keypress", keypressListener);
  },
};
keyEvent.enable();
pixiConfig.keyEvent = keyEvent;
export default keyEvent;
