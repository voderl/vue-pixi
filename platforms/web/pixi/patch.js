/* @flow */

// import * as nodeOps from "./node-ops";
import * as nodeOps from "./pixi-node";
import { createPatchFunction, controller } from "core/vdom/patch";
import baseModules from "core/vdom/modules/index";
import platformModules from "./modules/index";

import { Ticker } from "pixi.js-legacy";

Ticker.shared.add(() => {
  controller.loop();
});
// the directive module should be applied last, after all
// built-in modules have been applied.
const modules = platformModules.concat(baseModules);

export const patch: Function = createPatchFunction({ nodeOps, modules });
