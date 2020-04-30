# vue-pixi

更改 vue 源码中的 platform 来实现渲染到 pixi canvas。  
文件目录 platform 中即为对应 vue/src/platform 里的更改。

其余更改为
`vue/src/core/vdom/vnode.js`
第 43 行。

> (更改原因是当没有 data 存在时，不进入 diff 流程，而像`<text>value</text>`这样的话，没有 data，但是有 value，value 应当进入 diff 流程更新，因此需要有 data)

```diff
- this.data = data
+ this.data = data || {};
```

更改了`vue/src/core/vdom/patch.js` 见 `./core/vdom/patch.js` 搜索 `//change`

> 增加了一个 controller，用于控制 diff 过程中节点的生成。因为节点的生成和最初的一次渲染极其耗时，每一帧如果耗时过长则过渡到下一帧生成。
>
> - 好处 : 更加缓和,即使节点过多也不会忽然卡一下子而是逐渐显示。将执行时间放到最短的示例如下。
>   <p align="center">
>     <img src='./_docs/delay.gif' />
>   </p>
> - 坏处 ： 如果有大量节点变动可能会造成闪动(或许可以考虑删除时也控制一下，但是删除不会卡顿(×

构建的 vue 文件路径为 vue.runtime.min.js
该文件需要`pixi.js-legacy`依赖，或者暴露`PIXI`全局变量。

## DEMO

[点击前往](http://voderl.cn/try)

## platforms/web/路径

- pixi
  - config
    - handleConfig - 处理 userConfig
    - methods - userConfig 中用到的一些方法
    - pixiConfig - pixi 的拓展和一些配置
    - userConfig - 定义各种 tag 基础标签和对应的基本 diff 函数，便于自定义
    - utils - config 中使用到的一些方法
  - event
    - keyEvent - 按键事件的处理
    - listener - 监听事件的处理，由于事件传递的为相应的包装函数，因此不能进入 diff 中，需要单独处理
  - modules - 只有 data.js 和 index.js 被使用
    - data - diff And Patch 部分的主体
  - pixi-nodes - 主体节点的基本函数，如生成删除。
- util
  > vue 内部判断工具，比如判断是否为 tagName，是否为 svg 啥的，以及一些工具函数
- entry-runtime.js 入口文件

## pixi 拓展

`Texture`

- Loading - 加载过程中图片 Loading 字样 100\*100
- Error - 加载错误图片 Error 字样 100\*100
- splitTexture

```js
@row 为数组时返回分割为数组对应的对象，为数字时为分割的份数
@col 同上
function splitTexture(texture, row, col)

Texture.splitTexture(texture, ['down', 'left', 'right', 'up'], 4);
将把texture分割为4*4份, 返回 {
  down: [4]texture,
  left: [4]texture,
  right: [4]texture,
  up: [4]texture
}
```

- split

```js
function split(texture, dx, dy, dw, dh)

返回被切割部分的texture
```

`Vue.pixiConfig`: {

- `animationTime`：`AnimatedSprite`的默认每帧时长，默认为 500ms
- `textures`: `<sprite>value</sprite>`填写 value 或 src 时所寻找的命名空间，如果未找到则按照`src`来加载。
- `keyEvent`: 为了完成 keydown、keyup 事件的实现。在 window 上监听了 keydown 和 keyup。使用 keyEvent.disable 来删除监听的事件。  
  }

## 基本类型

- container 容器 => Container
- text
- sprite - 传递 src，在`pixiConfig.textures`里面寻找
  - Sprite 当`texture` 为 `Texture`类型时
  - AnimatedSprite 当`texture`为 `[]Texture`时，或者当`texture` 为如下格式时：(自动播放)
    ```js
    {
      down: []Texture,
      up: []Texture,
      left: []Texture,
      right: []Texture
    }
    ```
    此种情况下，以`Object.values[0]`来生成 AnimatedSprite，可以使用`change`方法来更换`status`，或者直接传入`status`参数
- zone
- tiling - 和 sprite 类似，但是传入 width 和 height 将重复图片来覆盖。
- graphics - Graphics ,具体使用见 pixi API
- particle - ParticleContainer ,一般不使用，可能需要使用粒子效果的组件需要

## 问题

- 目前 class 无效。
- pixi.js - Graphics 是一种创建时高消耗，不变时高性能的图形。使用 Graphics 能满足自定义一些简单的选项，但耗时过高，比如 zone 类型。
- 没有引入补间动画库，也没弄一些简单的动画效果，如 show，hide 选项，传递数值或函数表明渐入和渐出效果。
- 可能有许多已知或未知的 bug

## 更改中

- interactiveChildren 的设置，默认 pixi 节点的 interactiveChildren 为 true。
  > 当有事件触发时，沿着 interactiveChildren 为 true 的路线遍历 pixi 节点树来寻找 interactive 为 true 的节点触发事件，因此将子代没有 interactive 的节点的 interactiveChildren 置为 false 可以提高性能。 但是涉及到 interactive 节点的消失和增加，在此先行搁置。
- Graphics 的处理，一些操作可以放到下一帧进行，避免一帧执行太多，造成卡顿
- AnimatedSprite 默认直接播放，可以考虑增加个参数让其默认停止
- [x] 一些属性在删除时没有设置默认值，以值为 undefined 来更新，造成一些错误
- [x] diffandpatch 设定一个任务序列，处理超时自动下一帧处理.(diffAndPatch 本身就占用较少，82 个节点最多 3、4ms 的样子，直接处理了生成函数，效果显著)；

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
