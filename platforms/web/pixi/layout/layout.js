/**
 * 实际控制layout 的绘制方法
 */

import { getLayOutRootSize } from "./elementUtils";

// 主轴的排列方式
const justify = {
  start(info, data) {
    let x = 0;
    data.forEach((size) => {
      size.x = x;
      x += size.width * size.scale;
    });
  },
  end(info, data) {
    let x = info.width;
    for (let i = data.length - 1; i >= 0; i--) {
      let size = data[i];
      x -= size.width * size.scale;
      size.x = x;
    }
  },
  center(info, data) {
    let x = (info.width - info.dataWidth) / 2;
    data.forEach((size) => {
      size.x = x;
      x += size.width * size.scale;
    });
  },
  between(info, data) {
    if (data.length === 1) return this.center(info, data);
    let x = 0;
    const interval = (info.width - info.dataWidth) / (data.length - 1);
    data.forEach((size) => {
      size.x = x;
      x += size.width * size.scale + interval;
    });
  },
  around(info, data) {
    const interval = (info.width - info.dataWidth) / (2 * data.length);
    let x = 0;
    data.forEach((size) => {
      x += interval;
      size.x = x;
      x += size.width * size.scale + interval;
    });
  },
};
// 纵轴的排列方式
const align = {
  start(info, data) {
    data.forEach((size) => (size.y = 0));
  },
  end(info, data) {
    data.forEach((size) => (size.y = info.height - size.height * size.scale));
  },
  center(info, data) {
    let y = info.height / 2;
    data.forEach((size) => (size.y = y - (size.height * size.scale) / 2));
  },
};
// 不同方向的排列方式
const direction = {
  row(info, data) {
    return data;
  },
  rowReverse(info, data) {
    const { width } = info;
    data.forEach((size) => {
      size.x = width - size.x - size.width * size.scale;
    });
  },
  col(info, data) {
    const { height } = info;
    data.forEach((size) => {
      [size.x, size.y] = [height - size.y - size.height * size.scale, size.x];
    });
  },
  colReverse(info, data) {
    const { width } = info;
    this.col(info, data);
    data.forEach((size) => {
      size.y = width - size.y - size.width * size.scale;
    });
  },
};
function doFunc(display, key, search, info, data) {
  const value = display[key];
  if (typeof search[value] === "function") {
    search[value](info, data);
  } else
    throw new Error(
      `display的${key}属性暂不支持${value}，请使用${Object.keys(search).join(
        ","
      )}中的一个`
    );
}
/**
 * 获取一组中数据的宽之和以及高的最大值
 * @param {array} data 序列
 */
function measure(data) {
  const height = [];
  let width = 0;
  data.forEach((config) => {
    width += config.width;
    height.push(config.height);
  });
  return [width, Math.max(...height)];
}
/**
 * 根据计算出的数据更新节点
 * @param {object} size
 */
function update(size) {
  const { scale, el } = size;
  const x = size.x + size.left * scale;
  const y = size.y + size.top * scale;
  el.scale.set(scale, scale);
  el.position.set(x, y);
  el.renderable = true;
}
/**
 * 绘制一行,计算每个的坐标和位置并绘制，config为行的配置，包括x,y,width,height
 * @param {*} config
 * @param {*} display
 * @param {*} data
 */
function drawLine(config, display, data) {
  const [width, height] = measure(data);
  const widthRatio = config.width / width;
  const heightRatio = config.height / height;
  const ratio = Math.min(widthRatio, heightRatio, 1);
  data.forEach((s) => (s.scale = ratio));
  let info = {
    width: config.width,
    height: config.height,
    dataWidth: width * ratio,
    dataHeight: height * ratio,
  };
  doFunc(display, "justify", justify, info, data);
  doFunc(display, "align", align, info, data);
  doFunc(display, "direction", direction, info, data);
  // justify[display.justify](info, data);
  // align[display.align](info, data);
  // direction[display.direction](info, data);
  data.forEach((size) => {
    size.x += config.x;
    size.y += config.y;
    update(size);
  });
}
/**
 * 换行的分割函数，首先不计算scale来分割，在面临一个新加入项时，不加不够长度要扩大，加入将放缩时
 * 根据相对变化，选取变化小的来决定是否分割以及新行换新
 * @param {object} display
 * @param {array} data
 */
function splitLines(display, data) {
  const lines = [];
  let line = [];
  let nowWidth = 0;
  for (let i = 0, len = data.length; i < len; i++) {
    const size = data[i];
    if (nowWidth + size.width >= display.width) {
      const scaleWidth1 = nowWidth / display.width; // < 1
      const scaleWidth2 = (nowWidth + size.width) / display.width; // >1
      if (scaleWidth1 <= 1 / scaleWidth2) {
        // add
        line.push(size);
        lines.push(line);
        line = [];
        nowWidth = 0;
      } else {
        // newLine
        lines.push(line);
        line = [];
        nowWidth = 0;
        i--;
      }
    } else {
      nowWidth += size.width;
      line.push(size);
    }
  }
  if (line.length > 0) {
    lines.push(line);
  }
  return lines;
}

function calWrap(display, data) {
  if (display.wrap === "nowrap") {
    // 不分行
    const lineConfig = {
      x: 0,
      y: 0,
      width: display.width,
      height: display.height,
    };
    drawLine(lineConfig, display, data);
    return;
  }
  // 分完行
  const lines = splitLines(display, data);
  if (lines.length === 0) return;
  // 确定每行的配置，注意使用justify的配置处理，因此先将width和height反转
  // 计算完成后再反转回来
  const lineConfigs = [];
  let dataWidth = 0;
  for (let i = 0; i < lines.length; i++) {
    // 确定每行的高度
    const [, height] = measure(lines[i]);
    dataWidth += height;
    lineConfigs.push({
      width: height,
      height: display.width,
      scale: 1,
    });
  }
  if (dataWidth > display.width) {
    // 如果过长则统一缩放
    let scale = display.width / dataWidth;
    dataWidth = display.width;
    lineConfigs.forEach((config) => (config.scale = scale));
  }
  const info = {
    width: display.height,
    height: display.width,
    dataWidth: dataWidth,
    dataHeight: display.width,
  };
  doFunc(display, "alignContent", justify, info, lineConfigs);
  lineConfigs.forEach((config) => {
    const { scale } = config;
    // 计算结束后反转回来，得到每行线的配置
    [config.width, config.height] = [
      Math.floor(config.height * scale),
      Math.floor(config.width * scale),
    ];
    config.y = config.x;
    config.x = 0;
  });
  if (display.wrap === "wrapReverse") {
    lineConfigs.reverse();
  }
  lines.forEach((data, i) => {
    drawLine(lineConfigs[i], display, data);
  });
}

function layout(el, display, data) {
  console.log("updateLayout", display, data);
  const _display = {
    width: display.width,
    height: display.height,
    wrap: display.wrap || "nowrap",
    direction: display.direction || "row",
    align: display.align || "center",
    justify: display.justify || "center",
    alignContent: display.alignContent || "center",
  };
  if (!_display.width || !_display.height) {
    [_display.width, _display.height] = getLayOutRootSize(el);
  }
  console.log(_display);
  if (_display.direction.startsWith("col")) {
    data.forEach((size) => {
      [size.width, size.height] = [size.height, size.width];
    });
    [_display.height, _display.width] = [_display.width, _display.height];
  }
  // 换行与否
  calWrap(_display, data);
}

export default layout;
