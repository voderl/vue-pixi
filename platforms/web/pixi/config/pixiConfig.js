/**
 * pixi的一些拓展 和 pixi的一些config ，全局访问 Vue.pixiConfig
 */
import {
  Texture,
  BaseTexture,
  resources,
  AnimatedSprite,
  Rectangle,
} from "pixi.js-legacy";
/**
 * 生成Texture加载样式
 */
function createText(
  text,
  fontSize = 22,
  fillStyle = "black",
  width = 100,
  height = 100
) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.fillStyle = fillStyle;
  context.font = `${fontSize}px sans-serif`;
  context.textBaseline = "middle";
  const w = context.measureText(text).width;
  context.fillText(text, (width - w) / 2, height / 2);
  return new Texture(new BaseTexture(new resources.CanvasResource(canvas)));
}
Texture.Loading = createText("Loading...", 22);
Texture.Error = createText("Error!", 40, "red");

function _splitTexture(len, data, func) {
  let result;
  if (data instanceof Array) {
    result = {};
    const d = len / data.length;
    data.forEach((n, i) => {
      result[n] = func(d, i);
    });
  } else {
    result = [];
    const d = len / data;
    for (let i = 0; i < data; i++) {
      result[i] = func(d, i);
    }
  }
  return result;
}
Texture.splitTexture = function (texture, row, col) {
  if (!(texture instanceof Texture)) return null;
  const {
    orig: { width: w, height: h },
  } = texture;
  return _splitTexture(h, row, (dy, y) =>
    _splitTexture(w, col, (dx, x) =>
      this.split(texture, x * dx, y * dy, dx, dy)
    )
  );
};
(Texture.split = function (texture, dx, dy, dw, dh) {
  if (texture instanceof Array) {
    const temp = [];
    texture.forEach((t) => temp.push(this.split(t, dx, dy, dw, dh)));
    return temp;
  }
  if (!(texture instanceof Texture)) return null;
  const { _frame, orig, trim, _rotate } = texture;
  if (!trim) {
    return new Texture(
      texture,
      _rotate
        ? new Rectangle(_frame.x + orig.height - dy - dh, _frame.y + dx, dh, dw)
        : new Rectangle(_frame.x + dx, _frame.y + dy, dw, dh),
      new Rectangle(0, 0, dw, dh),
      null,
      _rotate
    );
  }
  // 获得新图片的相对剪切位置
  const newtrim = new Rectangle(dx, dy, dw, dh).fit(trim);
  // 新frame 相对于原frame 的offset
  const offsetX = newtrim.x - trim.x;
  const offsetY = newtrim.y - trim.y;
  newtrim.x -= dx;
  newtrim.y -= dy;
  // 获得新frame的相对位置，旋转的变换画图可知
  const newframe = _rotate
    ? new Rectangle(
        _frame.x + (trim.height - offsetY - newtrim.height),
        _frame.y + offsetX,
        newtrim.height,
        newtrim.width
      )
    : new Rectangle(
        _frame.x + offsetX,
        _frame.y + offsetY,
        newtrim.width,
        newtrim.height
      );
  const neworig = new Rectangle(0, 0, dw, dh);
  return new Texture(texture, newframe, neworig, newtrim, _rotate);
}),
  /**
   * 扩展 AnimatedSprite
   */
  (AnimatedSprite.prototype.change = function (value) {
    if (!this.frames) throw new Error(`普通的animatedSprite没有${value}状态`);
    if (!this.frames[value])
      throw new Error(`有状态的animatedSprite没有${value}状态`);
    const data = this.frames[value];
    const currentFrame = this.currentFrame;
    if (data instanceof Array) {
      this.textures = data;
      this.status = value;
      if (currentFrame < this.textures.length) this.currentTime = currentFrame;
    }
  });

const pixiConfig = {
  animationTime: 500,
  textures: {},
  /**
   * 在textures中寻找不到时以src加载 ？
   */
  autoload: true,
};

export default pixiConfig;
