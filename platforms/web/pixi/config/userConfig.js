/**
 * 便于自定义 新增标签的地方
 */
import methods from "./methods";
import {
  Sprite,
  Container,
  Text,
  Graphics,
  utils as pixiUtils,
  Loader,
  Texture,
  AnimatedSprite,
  TilingSprite,
} from "pixi.js-legacy";
import utils from "./utils";
import pixiConfig from "./pixiConfig";

/**
 * TODO: 允许re-render 还有 show hide 时间，show hide感觉较为麻烦
 *
 * 在update时判断 是否re-render
 *
 * 做一个类， 方法 re-render 从一个vnode，渲染出来，然后替换掉之前的el
 *
 * on 支持 stop once 等方法，替换掉原有的on
 * 重写一个tween.js
 */
/**
 * 默认diff更新逻辑, 事件更新使用vue内部方法。
 */
const defaultUpdate = {
  /** 一般属性在这里 */
  class(el, value, oldValue, options) {
    return;
    /* throw new Error("暂不支持class");
    if (typeof value !== "string")
      throw new Error("暂时只支持字符串class，请用空格隔开");
    const classArray = value.split(" ");
    const classData = options.vm.$options.class;
    if (!classData) throw new Error("请在实例中写上class对象，类似data");
    classArray.forEach((className) => {
      if (!classData[className])
        throw new Error(`未发现${className}名字的class`);
      options.update(el, { class: classData });
    }); */
  },
  attrs: {
    // 使用$x是因为fit的原因，fit可以只填宽高，需要记住原来的位置
    x(el, value = 0) {
      el.x = value;
      el.$x = value;
    },
    y(el, value = 0) {
      el.y = value;
      el.$y = value;
    },
    zIndex(el, value, oldValue) {
      if (value !== 0) {
        if (el.parent === null) {
          el.once("added", () => (el.parent.sortableChildren = true));
        } else {
          el.parent.sortableChildren = true;
        }
      }
    },
    width(el, value) {
      el.width = value;
    },
    height(el, value) {
      el.height = value;
    },
    tint(el, value) {
      el.tint = utils.getColor(value);
      console.log(el.tint);
    },
    data(el, value) {
      utils.deepAssign(el, value);
    },
    anchor: {
      x(el, value) {
        el.anchor.x = value;
      },
      y(el, value) {
        el.anchor.y = value;
      },
      $update(el, value) {
        if (typeof value === "object") {
          el.anchor.set(value.x, value.y);
        } else el.anchor.set(value, value);
      },
    },
    scale: {
      x(el, value) {
        el.scale.x = value;
      },
      y(el, value) {
        el.scale.y = value;
      },
      $update(el, value) {
        if (typeof value === "object") {
          el.scale.set(value.x, value.y);
        } else el.scale.set(value, value);
      },
    },
  },
  $dirty(el, data, oldData) {
    if (data.attrs && data.attrs.fit) {
      methods.fitNode(el, data.attrs.fit);
    }
  },
};
const waitToset = {};
// 成功获取
const notice = (key, value) => {
  if (waitToset[key]) {
    waitToset[key].forEach((data) => {
      data.options.update(data.el, { value: key }, {});
    });
  }
  delete waitToset[key];
};
const getTexture = (value, el, options) => {
  if (!value) return Texture.Error;
  const textures = pixiConfig.textures;
  const data = textures[value];
  if (data === "waiting") {
    if (options) {
      waitToset[value].push({
        el,
        options,
      });
    }
    return Texture.Loading;
  }
  if (data) return textures[value];
  if (options) {
    waitToset[value] = [
      {
        el,
        options,
      },
    ];
    const loader = new Loader();
    textures[value] = "waiting";
    loader.add(value, (resource) => {
      const { texture } = resource;
      /** vue调试中输入错误路径能成功获取，但获取到的是根目录网页内容，在此判别 */
      if (!(texture instanceof Texture)) {
        console.error(
          `路径'${value}'成功加载资源，但资源不是图片，可能是vue调试中错误路径重定向到主页面`,
          resource.data
        );
        textures[value] = Texture.Error;
      } else textures[value] = texture;
    });
    loader.onError.add((err) => {
      textures[value] = Texture.Error;
      console.error("加载错误", err);
    });
    loader.load(() => {
      notice(value);
      loader.destroy();
    });
  }
  return Texture.Loading;
};
const list = {
  container: {
    render() {
      return new Container();
    },
  },
  sprite: {
    render(value) {
      const texture = getTexture(value);
      if (texture instanceof Texture) return new Sprite(texture);
      if (texture instanceof Array) {
        const node = new AnimatedSprite(texture);
        node.animationSpeed = 1000 / 60 / pixiConfig.animationTime;
        return node;
      }
      const data = Object.values(texture);
      const node = new AnimatedSprite(data[0]);
      node.frames = data;
      node.animationSpeed = 1000 / 60 / pixiConfig.animationTime;
      return node;
    },
    update: {
      value(el, newValue, oldValue, options) {
        const texture = getTexture(newValue, el, options);
        if (texture instanceof Texture) {
          if (!el.textures) return (el.texture = texture);
        } else if (texture instanceof Array) {
          if (el.textures) {
            el.textures = texture;
            el.play();
            return;
          }
        } else if (el.frames) {
          el.frames = texture;
          el.textures = Object.values(texture)[0];
          el.play();
          return;
        }
        // console.log(el, newValue, texture);
        options.reRender = true;
      },
      attrs: {
        src(el, newValue, oldValue, options) {
          options.diffObj.value.$update(el, newValue, oldValue, options);
        },
        status(el, newValue, oldValue) {
          if (!el.frames) throw new Error("不存在frames不应该指定status");
          el.change(newValue);
        },
        time(el, value, oldValue) {
          el.animationSpeed = 1000 / 60 / parseInt(value);
        },
        animationSpeed(el, value) {
          el.animationSpeed = value;
        },
      },
    },
  },
  tiling: {
    render(value) {
      const texture = getTexture(value);
      if (texture instanceof Array)
        throw new Error(`[${value}]tilingSprite的texture不能为数组`);
      return new TilingSprite(texture);
    },
    update: {
      value(el, value, oldValue, options) {
        const texture = getTexture(value, el, options);
        if (texture instanceof Array)
          throw new Error(`[${value}]tilingSprite的texture不能为数组`);
        el.texture = texture;
      },
      attrs: {
        src(el, newValue, oldValue, options) {
          options.diffObj.value.$update(el, newValue, oldValue, options);
        },
      },
    },
  },
  text: {
    render(value) {
      return new Text(value);
    },
    update: {
      value(el, value, oldValue, options) {
        el.text = value;
      },
      attrs: {
        text(el, value) {
          el.text = value;
        },
      },
      style: {
        $proxy(el, key, value) {
          el.style[key] = value;
        },
      },
    },
  },
  zone: {
    render() {
      return new Graphics();
    },
    update: {
      style: {
        $dirty(el, value) {
          if (el.hasDraw) el.clear();
          let {
            width = 100,
            height = 100,
            radius = 0.2,
            fillColor = 0x0,
            fillAlpha = 1,
            lineWidth = 0,
            lineColor = 0xff0000,
            lineAlpha = 1,
            alignment = 1,
          } = value;
          fillColor = utils.getColor(fillColor);
          lineColor = utils.getColor(lineColor);
          if (typeof radius !== "number") radius = parseFloat(radius);
          if (typeof width !== "number") width = parseInt(width);
          if (typeof height !== "number") height = parseInt(width);
          el.beginFill(fillColor, fillAlpha);
          el.lineStyle(lineWidth, lineColor, lineAlpha, alignment);
          if (radius) {
            if (!Number.isInteger(radius)) radius *= Math.min(width, height);
            el.drawRoundedRect(0, 0, width, height, radius);
          } else el.drawRect(0, 0, width, height);
          el.endFill();
          el.hasDraw = true;
        },
      },
    },
  },
};

export { utils, list, defaultUpdate };
