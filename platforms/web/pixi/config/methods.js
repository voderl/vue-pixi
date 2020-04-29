/**
 * 为了userConfig页面的清爽，一些方法放在这里面
 */

const methods = {
  fitNode(node, fit) {
    if (typeof fit !== "object") return;
    if (fit instanceof Array) {
      this.fitNode(node, { zone: fit });
      return;
    }
    let { zone } = fit;
    const { ratio, type = "center" } = fit;
    if (zone.length === 2) {
      if (node.$x === undefined) {
        node.$x = node.x;
        node.$y = node.y;
      }
      zone = [node.$x || 0, node.$y || 0, ...zone];
    }
    const [x, y, w, h] = zone;
    node.scale.set(1, 1);
    let minRatio;
    let maxRatio;
    let realRatio;
    if (ratio instanceof Array) {
      if (ratio.length === 1) [realRatio] = ratio;
      else [minRatio, maxRatio] = ratio;
    } else realRatio = ratio;
    if (!realRatio) {
      realRatio = Math.min(h / node.height, w / node.width);
      if (maxRatio) realRatio = Math.min(realRatio, maxRatio);
      if (minRatio) realRatio = Math.max(realRatio, minRatio);
    }
    node.scale.set(realRatio, realRatio);
    const value = {
      center: [0.5, 0.5],
      left: [0, 0.5],
      right: [1, 0.5],
      top: [0.5, 0],
      bottom: [0.5, 1],
    };
    const arr = value[type];
    if (!arr) throw new Error("type应填数组或center、left、right、top、bottom");
    const left = x + arr[0] * w - arr[0] * node.width;
    const top = y + arr[1] * h - arr[1] * node.height;
    node.position.set(
      left + node.anchor.x * node.width,
      top + node.anchor.y * node.height
    );
  },
};
export default methods;
