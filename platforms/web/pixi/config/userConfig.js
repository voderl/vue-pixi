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
  TextStyle,
  ParticleContainer,
} from "pixi.js-legacy";
import utils from "./utils";
import pixiConfig from "./pixiConfig";
import layoutController from "../layout/layoutController";
import {
  testSizeChange,
  isAbsolute,
  isLayOutRoot,
} from "../layout/elementUtils";
/**
 * TODO: 允许re-render 还有 show hide 时间，show hide感觉较为麻烦
 *
 * 在update时判断 是否re-render
 *
 * 做一个类， 方法 re-render 从一个vnode，渲染出来，然后替换掉之前的el
 *
 */
/**
 * 默认diff更新逻辑, 事件更新使用vue内部方法。
 */
function getLayoutRoot(el) {
  // if (isAbsolute(el)) return null;
  let parent = el.parent;
  while (parent !== null) {
    if (isLayOutRoot(parent)) return parent;
    parent = parent.parent;
  }
  return null;
}
function childChange(child) {
  if (child && !isAbsolute(child)) {
    console.log("hide");
    child.renderable = false;
  }
  this.forceUpdate = true;
  layoutController.add(this);
}
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
    zIndex(el, value = 0, oldValue) {
      if (value !== 0) {
        if (el.parent === null) {
          el.once("added", () => (el.parent.sortableChildren = true));
        } else {
          el.parent.sortableChildren = true;
        }
      }
    },
    /**
     * 不支持width，height。 width、height默认变为布局设置，如需设置请更改scale和data
     */
    width(el, value = 100) {
      if (value === undefined) el.scale.x = 1;
      else el.width = value;
    },
    height(el, value = 100) {
      if (value === undefined) el.scale.y = 1;
      el.height = value;
    },
    alpha(el, value = 1) {
      el.alpha = value;
    },
    angle(el, value = 0) {
      el.angle = value;
    },
    display: {
      $dirty(el, newValue, oldValue) {
        if ((newValue.width && newValue.height) || newValue.flex) {
          el.layoutRoot = true;
          childChange.apply(el);
        } else el.layoutRoot = false;
        el.display = newValue;
      },
    },
    tint(el, value = 0x0) {
      el.tint = utils.getColor(value);
    },
    data(el, value = {}) {
      utils.deepAssign(el, value);
    },
    anchor: {
      x(el, value = 0) {
        el.anchor.x = value;
      },
      y(el, value = 0) {
        el.anchor.y = value;
      },
      $update(el, value = 0) {
        if (typeof value === "object") {
          el.anchor.set(value.x, value.y);
        } else el.anchor.set(value, value);
      },
    },
    scale: {
      x(el, value = 1) {
        el.scale.x = value;
      },
      y(el, value = 1) {
        el.scale.y = value;
      },
      $update(el, value = 1) {
        if (typeof value === "object") {
          el.scale.set(value.x, value.y);
        } else el.scale.set(value, value);
      },
    },
  },
  $dirty(el, data, oldData) {
    // if create layout root
    if (isLayOutRoot(el) && !el.parent) {
      childChange.apply(el);
      el.children.forEach((child) => (child.renderable = false));
      el.on("childAdded", childChange);
      el.on("childRemoved", childChange);
    }
    const layoutRoot = getLayoutRoot(el);
    if (layoutRoot && testSizeChange(el)) {
      if (isLayOutRoot(el)) childChange.call(el);
      if (el.parent === layoutRoot) childChange.call(layoutRoot, el);
      layoutController.add(layoutRoot);
    }
    if (data.attrs && data.attrs.fit) {
      methods.fitNode(el, data.attrs.fit);
    }
  },
};
const waitToset = {};
// 当set时
const notice = (value, key) => {
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
    utils.noticeWhenSetValue(textures, value, notice);
    if (!pixiConfig.autoload) return Texture.Loading;
    const loader = new Loader();
    loader.add(value, (resource) => {
      const { texture } = resource;
      /** vue调试中输入错误路径能成功获取，但获取到的是根目录网页内容，在此判别 */
      if (!(texture instanceof Texture)) {
        console.error(
          `路径'${value}'成功加载资源，但资源不是图片，可能是vue调试中错误路径重定向到主页面`,
          resource.data
        );
        textures[value] = Texture.Error;
      } else if (!resource.error) {
        textures[value] = texture;
      }
    });
    loader.onError.add((err) => {
      textures[value] = Texture.Error;
      console.error("加载错误", err);
    });
    loader.load(() => {
      loader.destroy();
    });
  }
  return Texture.Loading;
};
const defaultTextStyle = new TextStyle();
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
    getValue(data) {
      if (data.attrs && data.attrs.src) return data.attrs.src;
      else return null;
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
        status(el, newValue, oldValue) {
          if (!el.frames) throw new Error("不存在frames不应该指定status");
          el.change(newValue);
        },
        time(el, value = pixiConfig.animationTime, oldValue) {
          el.animationSpeed = 1000 / 60 / parseInt(value);
        },
        animationSpeed(
          el,
          value = 1000 / 60 / parseInt(pixiConfig.animationTime)
        ) {
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
    getValue(data) {
      if (data.attrs && data.attrs.src) return data.attrs.src;
      else return null;
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
    getValue(data) {
      if (data.attrs && data.attrs.text) return data.attrs.text;
      else return null;
    },
    update: {
      value(el, value, oldValue, options) {
        el.text = value;
      },
      style: {
        $proxy(el, key, value = defaultTextStyle[key]) {
          el.style[key] = value;
        },
      },
    },
  },
  particle: {
    render() {
      return new ParticleContainer(undefined, {
        scale: true,
        position: true,
        rotation: true,
        uvs: true,
        alpha: true,
      });
    },
  },
  graphics: {
    render() {
      return new Graphics();
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
