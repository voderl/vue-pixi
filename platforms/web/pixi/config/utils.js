/* eslint-disable */
const colorsByName = {
  aliceblue: "#f0f8ff",
  antiquewhite: "#faebd7",
  aqua: "#00ffff",
  aquamarine: "#7fffd4",
  azure: "#f0ffff",
  beige: "#f5f5dc",
  bisque: "#ffe4c4",
  black: "#000000",
  blanchedalmond: "#ffebcd",
  blue: "#0000ff",
  blueviolet: "#8a2be2",
  brown: "#a52a2a",
  burlywood: "#deb887",
  cadetblue: "#5f9ea0",
  chartreuse: "#7fff00",
  chocolate: "#d2691e",
  coral: "#ff7f50",
  cornflowerblue: "#6495ed",
  cornsilk: "#fff8dc",
  crimson: "#dc143c",
  cyan: "#00ffff",
  darkblue: "#00008b",
  darkcyan: "#008b8b",
  darkgoldenrod: "#b8860b",
  darkgray: "#a9a9a9",
  darkgreen: "#006400",
  darkkhaki: "#bdb76b",
  darkmagenta: "#8b008b",
  darkolivegreen: "#556b2f",
  darkorange: "#ff8c00",
  darkorchid: "#9932cc",
  darkred: "#8b0000",
  darksalmon: "#e9967a",
  darkseagreen: "#8fbc8f",
  darkslateblue: "#483d8b",
  darkslategray: "#2f4f4f",
  darkturquoise: "#00ced1",
  darkviolet: "#9400d3",
  deeppink: "#ff1493",
  deepskyblue: "#00bfff",
  dimgray: "#696969",
  dodgerblue: "#1e90ff",
  firebrick: "#b22222",
  floralwhite: "#fffaf0",
  forestgreen: "#228b22",
  fuchsia: "#ff00ff",
  gainsboro: "#dcdcdc",
  ghostwhite: "#f8f8ff",
  gold: "#ffd700",
  goldenrod: "#daa520",
  gray: "#808080",
  green: "#008000",
  greenyellow: "#adff2f",
  honeydew: "#f0fff0",
  hotpink: "#ff69b4",
  indianred: "#cd5c5c",
  indigo: "#4b0082",
  ivory: "#fffff0",
  khaki: "#f0e68c",
  lavender: "#e6e6fa",
  lavenderblush: "#fff0f5",
  lawngreen: "#7cfc00",
  lemonchiffon: "#fffacd",
  lightblue: "#add8e6",
  lightcoral: "#f08080",
  lightcyan: "#e0ffff",
  lightgoldenrodyellow: "#fafad2",
  lightgray: "#d3d3d3",
  lightgreen: "#90ee90",
  lightpink: "#ffb6c1",
  lightsalmon: "#ffa07a",
  lightseagreen: "#20b2aa",
  lightskyblue: "#87cefa",
  lightslategray: "#778899",
  lightsteelblue: "#b0c4de",
  lightyellow: "#ffffe0",
  lime: "#00ff00",
  limegreen: "#32cd32",
  linen: "#faf0e6",
  magenta: "#ff00ff",
  maroon: "#800000",
  mediumaquamarine: "#66cdaa",
  mediumblue: "#0000cd",
  mediumorchid: "#ba55d3",
  mediumpurple: "#9370db",
  mediumseagreen: "#3cb371",
  mediumslateblue: "#7b68ee",
  mediumspringgreen: "#00fa9a",
  mediumturquoise: "#48d1cc",
  mediumvioletred: "#c71585",
  midnightblue: "#191970",
  mintcream: "#f5fffa",
  mistyrose: "#ffe4e1",
  moccasin: "#ffe4b5",
  navajowhite: "#ffdead",
  navy: "#000080",
  oldlace: "#fdf5e6",
  olive: "#808000",
  olivedrab: "#6b8e23",
  orange: "#ffa500",
  orangered: "#ff4500",
  orchid: "#da70d6",
  palegoldenrod: "#eee8aa",
  palegreen: "#98fb98",
  paleturquoise: "#afeeee",
  palevioletred: "#db7093",
  papayawhip: "#ffefd5",
  peachpuff: "#ffdab9",
  peru: "#cd853f",
  pink: "#ffc0cb",
  plum: "#dda0dd",
  powderblue: "#b0e0e6",
  purple: "#800080",
  red: "#ff0000",
  rosybrown: "#bc8f8f",
  royalblue: "#4169e1",
  saddlebrown: "#8b4513",
  salmon: "#fa8072",
  sandybrown: "#f4a460",
  seagreen: "#2e8b57",
  seashell: "#fff5ee",
  sienna: "#a0522d",
  silver: "#c0c0c0",
  skyblue: "#87ceeb",
  slateblue: "#6a5acd",
  slategray: "#708090",
  snow: "#fffafa",
  springgreen: "#00ff7f",
  steelblue: "#4682b4",
  tan: "#d2b48c",
  teal: "#008080",
  thistle: "#d8bfd8",
  tomato: "#ff6347",
  turquoise: "#40e0d0",
  violet: "#ee82ee",
  wheat: "#f5deb3",
  white: "#ffffff",
  whitesmoke: "#f5f5f5",
  yellow: "#ffff00",
  yellowgreen: "#9acd32",
};
function _hslToRgb(hsl) {
  if (typeof hsl == "string") {
    hsl = hsl.match(/(\d+(\.\d+)?)/g);
  }
  var sub,
    h = hsl[0] / 360,
    s = hsl[1] / 100,
    l = hsl[2] / 100,
    a = hsl[3] === undefined ? 1 : hsl[3],
    t1,
    t2,
    t3,
    rgb,
    val;
  if (s == 0) {
    val = Math.round(l * 255);
    rgb = [val, val, val, a];
  } else {
    if (l < 0.5) t2 = l * (1 + s);
    else t2 = l + s - l * s;
    t1 = 2 * l - t2;
    rgb = [0, 0, 0];
    for (var i = 0; i < 3; i++) {
      t3 = h + (1 / 3) * -(i - 1);
      t3 < 0 && t3++;
      t3 > 1 && t3--;
      if (6 * t3 < 1) val = t1 + (t2 - t1) * 6 * t3;
      else if (2 * t3 < 1) val = t2;
      else if (3 * t3 < 2) val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
      else val = t1;
      rgb[i] = Math.round(val * 255);
    }
  }
  rgb.push(parseFloat(a));
  return rgb;
}
const utils = {
  /**
   * 在obj中设置一个set，在赋值时执行func, 然后恢复默认情况
   * @param {Object} obj
   * @param {string} prop
   * @param {function} func
   */
  noticeWhenSetValue(obj, prop, func) {
    if (typeof func !== "function") return console.log("func需为function类型");
    Object.defineProperty(obj, prop, {
      configurable: true,
      get() {
        return "waiting";
      },
      set(v) {
        Object.defineProperty(this, prop, {
          enumerable: true,
          configurable: true,
          value: v,
          writable: true,
        });
        func(v, prop);
        return v;
      },
    });
    return obj;
  },
  /**
   * 实现的一个filter， 直接改变源数组，(怕filter生成新数组影响原数组回收,或带来回收成本)
   * 也不知道到底有没有什么好处，先这样= =
   * @param {array} arr
   * @param {function} func
   */
  filter(arr, func) {
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
    return arr;
  },
  /**
   * deep assign data 到 obj
   * @param {object} obj
   * @param {object} data
   */
  deepAssign(obj, data) {
    for (const n in data) {
      if (obj[n] !== data[n]) {
        if (typeof data[n] === "object" && typeof obj[n] === "object")
          this.deepAssign(obj[n], data[n]);
        else obj[n] = data[n];
      }
    }
  },
  /**
   * deep assign data 到 obj，但是 obj有不等于undefined的值 就不 assign
   * @param {object} obj
   * @param {object} data
   */
  tryAssignData(obj, data) {
    for (const n in data) {
      if (typeof data[n] === "object" && typeof obj[n] === "object")
        this.tryAssignData(obj[n], data[n]);
      else if (obj[n] === undefined) {
        obj[n] = data[n];
      }
    }
  },
  clamp(x, a, b) {
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    return Math.min(Math.max(x || 0, min), max);
  },
  clone(obj) {
    if (typeof obj !== "object") return obj;
    const newObj = obj instanceof Array ? [] : {};
    for (const key in obj) {
      const val = obj[key];
      newObj[key] = typeof val === "object" ? this.clone(val) : val;
    }
    return newObj;
  },
  isInterger(num) {
    return typeof num === "number" && (num | 1) === 0;
  },
  /**
   * 获取颜色，pixi中的颜色是数字类型的
   * @param {string|number} str
   */
  getColor(str) {
    if (str === undefined || str === null) return 0x0;
    if (Number.isInteger(str)) return str;
    const [r, g, b] = this.parseColor(str);
    return (r << 16) + (g << 8) + b;
  },
  parseColor(str) {
    const { length } = arguments;
    if (length >= 3) {
      return [
        arguments[0],
        arguments[1],
        arguments[2],
        length === 3 ? 1 : arguments[3],
      ];
    }
    if (typeof str !== "string") return 0x0;
    str = str.toLowerCase();
    if (str.startsWith("rgb")) {
      const rgb = str.split(",");
      const len = rgb.length;
      const r = parseInt(rgb[0].split("(")[1], 10);
      const g = parseInt(rgb[1], 10);
      const b =
        len === 3 ? parseInt(rgb[2].split(")")[0], 10) : parseInt(rgb[2], 10);
      const a = len === 3 ? 1 : parseFloat(rgb[3].split(")")[0]);
      return [r, g, b, a];
    }
    if (str.startsWith("#")) {
      if (str.length === 4) {
        return [
          parseInt(str.charAt(1), 16) * 0x11,
          parseInt(str.charAt(2), 16) * 0x11,
          parseInt(str.charAt(3), 16) * 0x11,
          1,
        ];
      }
      const r = parseInt(str.slice(1, 3), 16);
      const g = parseInt(str.slice(3, 5), 16);
      const b = parseInt(str.slice(5, 7), 16);
      const a = str.length === 9 ? parseInt(str.slice(7, 9), 16) / 255 : 1;
      return [r, g, b, a];
    }
    if (str.startsWith("hsl")) {
      return _hslToRgb(str);
    }
    const color = colorsByName[str];
    if (color) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return [r, g, b, 1];
    }
    throw new Error(`无法解析颜色‘${str}’，请查看输入是否正确`);
  },
  parseName(name) {
    const index = name.lastIndexOf(".");
    if (index >= 0) {
      return [name.slice(0, index), name.slice(index + 1)];
    }
    return [name];
  },
};
export default utils;
