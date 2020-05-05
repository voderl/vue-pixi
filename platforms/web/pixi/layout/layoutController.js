import { Ticker } from "pixi.js-legacy";
import utils from "../config/utils";
import { isAbsolute, testSizeChange, parseSize } from "./elementUtils";
import layout from "./layout";

class Controller {
  constructor(update) {
    this.list = [];
    this.defaltFlashFrame = 3;
    this.updateFunc = update;
    this.tickerFunc = () => {
      this.update();
    };
    Ticker.shared.add(this.tickerFunc);
  }

  update() {
    if (this.list.length === 0) return;
    utils.filter(this.list, (data) => {
      const { el } = data;
      if (el._destroyed) return false;
      data.num -= 1;
      if (data.num === 0) {
        this.updateFunc(el);
        return false;
      } else return true;
    });
  }

  add(el, flashFrame = this.defaltFlashFrame) {
    const target = this.list.find((data) => data.el === el);
    if (target) {
      target.num = flashFrame;
    } else
      this.list.push({
        el,
        num: flashFrame,
      });
  }

  destroy() {
    Ticker.shared.remove(this.tickerFunc);
  }
}

function checkChildrenSize(el) {
  let change = false;
  el.children.forEach((child) => {
    if (isAbsolute(child)) return;
    if (testSizeChange(child)) change = true;
  });
  return change;
}
const resetLayOut = function (el) {
  // when child added(removed) or direct Child size change
  // 不是第一代child改变，比如child的child改变，要检查child的width或height是否变化
  // if (el.forceUpdate) {  可以考虑增加reCheck 参数
  //   el.forceUpdate = false;
  //   updateLayout(el);
  // } else console.log("check");
  console.log("dirty");
  const change = checkChildrenSize(el);
  if (!change && !el.forceUpdate) return;
  el.forceUpdate = false;
  const data = [];
  el.children.forEach((child) => {
    if (!isAbsolute(child)) data.push(parseSize(child));
  });
  layout(el, el.display, data);
};
const layoutController = new Controller(resetLayOut);

export default layoutController;
