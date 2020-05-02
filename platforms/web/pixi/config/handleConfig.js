/**
 * 处理config，把便于用户输入的格式 整理成 程序运行效率高的格式(大概)(×
 */
import { utils, list, defaultUpdate } from "./userConfig";
import pixiConfig from "./pixiConfig.js";

const diffList = {};
const renderList = {};
const valueList = {};
/**
 * 处理 event 的update
 */
/**
 * vnode 没有data 时，不会进入到diff的程序，为了这种节点正常更新value
 *  更改patch内部了
 * 为了在value改变时进入diff程序 从而使fit实现，在此更改
 */
Object.keys(list).forEach((key) => {
  const data = list[key];
  const defaultDiff = utils.clone(defaultUpdate);
  if (data.update && typeof data.update !== "object")
    throw new Error(`list中${key}的update填写错误`);
  // diffObj
  if (data.update) utils.deepAssign(defaultDiff, data.update);
  diffList[key] = defaultDiff;
  // render
  if (typeof data.render !== "function") {
    throw new Error(`list中${key}的render填写错误`);
  }
  renderList[key] = data.render;

  if (typeof data.getValue === "function") {
    valueList[key] = data.getValue;
  }
});
export { diffList, renderList, valueList, pixiConfig };
