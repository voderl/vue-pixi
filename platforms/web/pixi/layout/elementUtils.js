export function isAbsolute(el) {
  if (el.$x !== undefined || el.$y !== undefined) return true;
  else return false;
}

export function isLayOutRoot(el) {
  return el.layoutRoot ? true : false;
}

function isArrayEquals(arr1, arr2) {
  if (arr1 === arr2) return true;
  if (typeof arr1 === "object" && typeof arr2 === "object") {
    const len = arr1.length;
    if (arr2.length !== len) return false;
    for (let i = 0; i < len; i++) {
      if (arr1[i] !== arr2[i]) return false;
    }
    return true;
  }
  return false;
}
/**
 * 如果设置为flex而自身不带宽高则从此获取其宽高
 * @param {DisplayObject} el
 */
export function getLayOutRootSize(el) {
  let width = el.display.width,
    height = el.display.height;
  if (width && height) return [width, height];
  const children = el.children;
  // el.children.forEach((child) => (child.renderable = false));
  el.children = [];
  const bounds = el.getLocalBounds();
  el.children = children;
  // el.children.forEach((child) => (child.renderable = true));
  if (bounds.width === 0 || bounds.height === 0) {
    throw new Error("使用了flex而未指定宽高，而且自身没有默认宽高");
  }
  if (!width) width = bounds.width;
  if (!height) height = bounds.height;
  return [width, height];
}

export function testSizeChange(el) {
  let newWidth, newHeight;
  let scale = el.scale.x;
  let newPadding;
  if (isLayOutRoot(el)) {
    scale = 1;
    [newWidth, newHeight] = getLayOutRootSize(el);
    newPadding = el.display.padding;
  } else {
    if (el.display) newPadding = el.display.padding;
    newWidth = el.width;
    newHeight = el.height;
  }
  newWidth = Math.floor(newWidth / scale);
  newHeight = Math.floor(newHeight / scale);
  if (!el.size) {
    el.size = { width: newWidth, height: newHeight, padding: newPadding };
    return true;
  }
  const { width, height, padding } = el.size;
  if (
    width !== newWidth ||
    height !== newHeight ||
    !isArrayEquals(newPadding, padding)
  ) {
    el.size = { width: newWidth, height: newHeight, padding: newPadding };
    return true;
  }
  return false;
}

function getPadding(arr) {
  if (arr instanceof Array) {
    let left;
    let right;
    let bottom;
    let top;

    if (arr.length === 1) {
      left = right = bottom = top = arr[0];
    } else if (arr.length === 2) {
      bottom = top = arr[0];
      left = right = arr[1];
    } else if (arr.length === 3) {
      top = arr[0];
      (left = right = arr[1]), (bottom = arr[2]);
    } else if (arr.length === 4) {
      [top, right, bottom, left] = arr;
    } else return false;
    return [top, right, bottom, left];
  }
  return [0, 0, 0, 0];
}
export function parseSize(el) {
  const { size } = el;
  const [top, right, bottom, left] = getPadding(size.padding);
  return {
    el,
    top,
    left,
    width: size.width + left + right,
    height: size.height + top + bottom,
  };
}
