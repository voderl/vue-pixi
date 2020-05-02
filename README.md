# vue-pixi

- [vue-pixi](#vue-pixi)
  - [pixi 拓展](#pixi-%e6%8b%93%e5%b1%95)
  - [基本类型](#%e5%9f%ba%e6%9c%ac%e7%b1%bb%e5%9e%8b)
    - [基础属性](#%e5%9f%ba%e7%a1%80%e5%b1%9e%e6%80%a7)
    - [container](#container)
    - [sprite](#sprite)
    - [tiling](#tiling)
    - [text](#text)
    - [zone](#zone)
    - [graphics](#graphics)
    - [particleContainer](#particlecontainer)
  - [事件](#%e4%ba%8b%e4%bb%b6)
    - [键盘事件](#%e9%94%ae%e7%9b%98%e4%ba%8b%e4%bb%b6)
    - [鼠标事件](#%e9%bc%a0%e6%a0%87%e4%ba%8b%e4%bb%b6)
  - [vue 源码更改](#vue-%e6%ba%90%e7%a0%81%e6%9b%b4%e6%94%b9)
  - [DEMO](#demo)
  - [platforms/web/路径](#platformsweb%e8%b7%af%e5%be%84)
  - [问题](#%e9%97%ae%e9%a2%98)
  - [更改](#%e6%9b%b4%e6%94%b9)
  - [TODO](#todo)
  - [Project setup](#project-setup)
    - [Compiles and hot-reloads for development](#compiles-and-hot-reloads-for-development)
    - [Compiles and minifies for production](#compiles-and-minifies-for-production)
    - [Lints and fixes files](#lints-and-fixes-files)
    - [Customize configuration](#customize-configuration)
    -

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
- `textures`: `<sprite>value</sprite>`填写 value 或 src 时所寻找的命名空间。如果根据 value 未找到图片则直接返回`Texture.Loading`，并在`textures`里面设置 setter 和 getter，getter 返回`'waiting'`, setter 当设置时自动更新目前为 Loading 的图案。
- `autoload`: 默认为`true`, 未找到 value 时是否以 value 为 src 加载
- `keyEvent`: 为了完成 keydown、keyup 事件的实现。在 window 上监听了 keydown 和 keyup。使用 `keyEvent.disable()` 来删除监听的事件。  
  }

## 基本类型

- container 容器 => Container
- text
- sprite - 传递 src，在`pixiConfig.textures`命名空间里面寻找
- zone
- tiling - 和 sprite 类似，但是传入 width 和 height 将重复图片来覆盖。
- graphics - Graphics ,具体使用见 pixi API
- particle - ParticleContainer ,一般不使用，可能需要使用粒子效果的组件需要

### 基础属性

- `x` x 坐标位置
- `y` y 坐标位置
- `zIndex` 优先级, 默认按照先低后高的优先级绘制，请尽量不要使用此属性
- `width` 将宽度拉伸到 width
- `height` 将高度拉伸到 height
- `data` 传入一个对象，将此对象 deepAssign 到 pixi 节点本身( 相当于直接改 pixi 节点的属性)
- `tint` 传入一个颜色，将改变色相，不支持透明度，首要考虑请考虑 0xffffff 16 进制数字类型，其他类型也支持。
- `anchor` 传入一个`{ x: 0-1, y: 0-1 }`的对象，如果传入一个数字 则将 x，y 都设置为此数字。
- `scale` 拉伸，写法同上。不过设置 width 和 height 影响 scale，更改 scale 也会影响 width、height
- `fit` 使该节点自适应大小。
  ```jsx
    <text :fit='{zone: [x, y, width, height], ratio: [minRatio, maxRatio], type: "center" }'></text>
    type 为 center, left, top, right, bottom 中的一个，默认为center，
    minRatio 和 maxRatio 是自适应大小放缩的最小比例和最大比例，如果ratio传入数字则锁定放缩比例
    <text :x="100" :y="100" :fit='[width, height]'> 为简略写法，
  ```

### container

基本容器，性能消耗较小

### sprite

```jsx
<sprite :src='value2'>value1</sprite>
```

value1 的优先级大于 value2，当没有 value1 时按照 value2 处理。
以 value 为 key 在`Vue.pixiConfig.textures`命名空间中查找

- 如果找到了
  - 找到的是 Texture，生成 Sprite
  - 找到的是[]Texture, 生成 AnimatedSprite， 默认每帧播放时间为 `Vue.pixiConfig.animationTime`(默认直接播放)；
  - 找到的是一个对象, 如下
  ```javascript
  {
      down: []Texture,
      up: []Texture,
      left: []Texture,
      right: []Texture
  }
  ```
  则以`Object.values[0]`来生成 AnimatedSprite，可以使用`change`方法来更换`status`，或者直接传入`status`参数
- 如果没找到
  - 当`Vue.pixiConfig.autoload`为 true 时(默认为 true)，以 src 加载该资源
  - 在`Vue.pixiConfig.textures`中以该 value 设置一个 get、set，get 返回`'waiting'`，当 set 时，自动更新当前使用这个尚未存在的 texture 的节点。
- 默认情况下未找到返回`Texture.Loading`

### tiling

同 sprite 基本一致，不过只支持`Sprite`类型
其 width 和 height 设置 将以该 sprite 重复覆盖至 width 和 height

### text

支持 style 属性，style 属性列表请看 http://pixijs.download/release/docs/PIXI.TextStyle.html

### zone

```jsx
<zone
    :width=100
    :height=100
    :radius=0.2   [0~0.5]的一个值
    :fillColor='red'
    :fillAlpha=1  [0~1]
    :lineWidth=3	strokeLine的宽度
    :lineColor='blue'
    :lineAlpha=1  [0~1]
    :alignment=1	strokeLine相对zone的位置，如果为0.5线宽一半在里面，一半在外面
    				为1表明全部在外面
    >
</zone>
```

zone 创建时消耗资源较大，合理使用

### graphics

创建画笔什么的绘制图案。
使用 ref 来获取到该元素对应的 pixi 节点，然后使用 pixi 节点的方法绘制。
http://pixijs.download/release/docs/PIXI.Graphics.html

### particleContainer

pixijs 的另一种高性能的 Container，不过一个 Container 只支持一种 Texture，一些高级属性什么的也不支持
主要用于粒子特效，当然，在这里它还没什么用

## 事件

### 键盘事件

`Vue.pixiConfig.keyEvent`

```js
function keydownListener(e) {
  e.stopPropagation();
  keyEvent.do('keydown', e);
}
function keyupListener(e) {
  e.stopPropagation();
  keyEvent.do('keyup', e);
}
```

事件监听类似如上，如果取消默认的 window 监听的事件，则调用 `keyEvent.disable();`
目前仅支持 keydown 和 keypress

```js
function(event, code) {

}
```

传入的第二个参数为 code，具体见https://developer.mozilla.org/zh-CN/docs/Web/API/KeyboardEvent/code
同时请尽量采用第二个参数 code，而不是第一个参数 event.code，因为`keyEvent`里面有一个 mapping

### 鼠标事件

http://pixijs.download/release/docs/PIXI.Sprite.html#event:click
左侧 events 栏

pointer 是兼容 mouse 和 touch 的

- ​ pointerdown 按下

- ​ pointerup 松起

- pointermove 移动

- pointertap 点击

- pointerout 移出该元素

## vue 源码更改

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

更改了`vue/src/core/vdom/patch.js` 见 `./core/vdom/patch.js` 搜索 `// change`

> 增加了一个 controller，用于控制 diff 过程中节点的生成。因为节点的生成和最初的一次渲染极其耗时，每一帧如果耗时过长则过渡到下一帧生成。
>
> - 好处 : 更加缓和,即使节点过多也不会忽然卡一下子而是逐渐显示。将执行时间放到最短的示例如下。
>   <p align="center">
>     <img src='./_docs/delay.gif' />
>   </p>
> - 坏处 ： 如果有大量节点变动可能会造成闪动(或许可以考虑删除时也控制一下，但是删除不会卡顿(×

构建的 vue 文件路径为 vue.js
该文件需要`pixi.js-legacy`依赖，或者暴露`PIXI`全局变量。

## DEMO

http://voderl.cn/try3

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

## 问题

- 目前 class 无效。
- pixi.js - Graphics 是一种创建时高消耗，不变时高性能的图形。使用 Graphics 能满足自定义一些简单的选项，但耗时过高，比如 zone 类型。
- 没有引入补间动画库，也没弄一些简单的动画效果，如 show，hide 选项，传递数值或函数表明渐入和渐出效果。
- 可能有许多已知或未知的 bug

## 更改

- [x] 一些属性在删除时没有设置默认值，以值为 undefined 来更新，造成一些错误
- [x] diffandpatch 设定一个任务序列，处理超时自动下一帧处理.(diffAndPatch 本身就占用较少，82 个节点最多 3、4ms 的样子，直接处理了生成函数，效果显著)；
- [x] 改 value 获取方式： 传入 getValue 函数,默认优先级`<sprite src='value2'>value</sprite>`，value 大于 value2
- [x] 更新 controller，controller 在 createChildren 时挟持掉 createElm，但是 createElm 也是创建子组件的方法，会导致子组件在创建时不能正常触发 hook(如 mounted 等方法)，因此将创建子组件和创建子元素分离开来，确保组件都是直接创造执行，子元素进入 controller。(此处可能有 bug)

## TODO

- AnimatedSprite 默认直接播放，可以考虑增加个参数让其默认停止
- interactiveChildren 的设置，默认 pixi 节点的 interactiveChildren 为 true。
  > 当有事件触发时，沿着 interactiveChildren 为 true 的路线遍历 pixi 节点树来寻找 interactive 为 true 的节点触发事件，因此将子代没有 interactive 的节点的 interactiveChildren 置为 false 可以提高性能。 但是涉及到 interactive 节点的消失和增加，在此先行搁置。
- 还有考虑将 userConfig 不打包，作为外部依赖。 或者提供增加新类型的方法，完善具体写法 api
- 增加 controller 配置到 pixiConfig，自行配置 是否使用 controller、controller 每帧最高执行时间。
- 增加一些内部 hook，比如获取 Texture 等方法
- 增加默认组件，如 hero 组件，hero 组件可指定是否 control 操作。
- 可以考虑增加单个组件，组件内容可自行创造，就像 vue 创建 canvas 元素一样，内部的操作自行实现。

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
