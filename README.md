# vue-pixi

## [示例](http://voderl.cn/testtest)

更改 vue 源码中的 platform 来实现渲染到 pixi canvas。
文件目录 platform 中即为对应 vue/src/platform 里的更改。

更改后的 vue 文件路径为 vue.runtime.min.js
该文件需要两个依赖，在 cli 中引入或暴露为全局变量。

- pixi.js-legacy
- vueConfig 相当于一些方便更改的东西。具体见 vue.config.js 中的配置和 vueConfig.js 文件。

## 问题

- 目前只引入了 style，events，attrs。未引入 class。
- pixi.js - Graphics 是一种创建时高消耗，不变时高性能的图形。使用 Graphics 能满足自定义一些简单的选项，但耗时过高。
- 没有引入补间动画库，也没弄一些简单的动画效果。
- 可能有许多已知或未知的 bug

## TODO

- class
- animateSprite

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
