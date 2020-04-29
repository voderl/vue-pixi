# vue-pixi

## [示例](http://voderl.cn/testtest)

更改 vue 源码中的 platform 来实现渲染到 pixi canvas。  
文件目录 platform 中即为对应 vue/src/platform 里的更改。

其余更改为
`vue/src/core/vdom/vnode.js`
第 43 行。
(更改原因是当没有 data 存在时，不进入 diff 流程，而像`<text>value</text>`这样的话，没有 data，但是有 value，value 应当进入 diff 流程更新，因此需要有 data)

```diff
- this.data = data
+ this.data = data || {};
```

构建的 vue 文件路径为 vue.runtime.min.js
该文件需要`pixi.js-legacy`依赖，或者暴露`PIXI`全局变量。

## DEMO

[点击前往](http://voderl.cn/try)

## 问题

- 目前只引入了 style，events，attrs。未引入 class。
- pixi.js - Graphics 是一种创建时高消耗，不变时高性能的图形。使用 Graphics 能满足自定义一些简单的选项，但耗时过高。
- 没有引入补间动画库，也没弄一些简单的动画效果，如 show，hide 选项，传递数值或函数表明渐入和渐出效果。
- 可能有许多已知或未知的 bug

## 更改中

- interactiveChildren 的设置，默认 pixi 节点的 interactiveChildren 为 true。
  > 当有事件触发时，沿着 interactiveChildren 为 true 的路线遍历 pixi 节点树来寻找 interactive 为 true 的节点触发事件，因此将子代没有 interactive 的节点的 interactiveChildren 置为 false 可以提高性能。 但是涉及到 interactive 节点的消失和增加，在此先行搁置。

## TODO

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
