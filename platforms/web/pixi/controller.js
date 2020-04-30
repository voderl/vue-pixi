/**
 * 时间线管理，默认node的visible 为false，在经过diffAndPath之后
 * 节点发出 diff请求，处理时长超过一指定值 则继续到下一帧处理；
 */
import { Ticker } from "pixi.js-legacy";

const performance = window.performance;
const controller = {
  list: [],
  count: 100,
  maxTime: 50,
  loop() {
    if (this.list.length === 0) return;
    const start = performance.now();
    const { list, maxTime, count } = this;
    let now = start;
    while (now - start < maxTime && list.length !== 0) {
      const data = list.splice(0, count);
      data.forEach((op) => {
        op.update();
      });
      now = performance.now();
    }
  },
};
Ticker.shared.add(() => {
  controller.loop();
});
export default controller;
