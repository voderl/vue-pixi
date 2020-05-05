// import Vue from '../../dist/vue.runtime.js';
import * as $ from 'pixi.js-legacy';
import TWEEN from '@tweenjs/tween.js';
import Vue from './vue.js';
import ui from './ui.vue';

window.TWEEN = TWEEN;
window.Vue = Vue;
Vue.config.productionTip = false;
window.$ = $;
const app = new $.Application({
  width: 416,
  height: 416,
  antialias: true,
  transparent: true,
  resolution: 2,
});
window.app = app;
document.body.appendChild(app.view);
const width = Math.min(416, document.body.clientWidth);
app.view.style.width = `${width}px`;
app.view.style.height = `${width}px`;
const { stage } = app;
app.ticker.add((delta) => {
  TWEEN.update();
});
stage.tagName = 'container';
const main = {};
window.main = main;

const { textures } = Vue.pixiConfig;
const loader = new $.Loader();
loader.add('./hero.png', (resource) => {
  const { texture } = resource;
  if (texture) {
    textures.hero = $.Texture.splitTexture(texture, ['down', 'left', 'right', 'up'], 4);
  }
});
loader.load(() => {
  loader.destroy();
  const vue = new Vue({
    render: (h) => h(ui),
  }).$mount();
  stage.addChild(vue.$el);
});
main.closePanel = () => {
  window.ui.show(null);
};
main.drawBook = () => {
  window.ui.show('book', {
    enemys: [
      {
        name: '史莱姆',
        icon: './img/logo.png',
        hp: 35,
        atk: 10,
        def: 10,
        damage: 1,
        money: 0,
        experience: 0,
        point: 0,
        special: 0,
        critical: 1,
        criticalDamage: '?',
        defDamage: '?',
      },
      {
        name: '小白兔',
        icon: './img/logo.png',
        hp: 35,
        atk: 10,
        def: 10,
        damage: 1,
        money: 0,
        experience: 0,
        point: 0,
        special: 0,
        critical: 1,
        criticalDamage: '?',
        defDamage: '?',
      },
      {
        name: '小白',
        icon: './img/logo.png',
        hp: 35,
        atk: 10,
        def: 10,
        damage: 1,
        money: 0,
        experience: 0,
        point: 0,
        special: 0,
        critical: 1,
        criticalDamage: '?',
        defDamage: '?',
      },
      {
        name: '小兔',
        icon: './img/logo.png',
        hp: 35,
        atk: 10,
        def: 10,
        damage: 1,
        money: 0,
        experience: 0,
        point: 0,
        special: 0,
        critical: 1,
        criticalDamage: '?',
        defDamage: '?',
      },
      {
        name: '白兔',
        icon: './img/logo.png',
        hp: 35,
        atk: 10,
        def: 10,
        damage: 1,
        money: 0,
        experience: 0,
        point: 0,
        special: 0,
        critical: 1,
        criticalDamage: '?',
        defDamage: '?',
      },
      {
        name: '小白兔007是我是我是我是我',
        icon: './img/logo.png',
        hp: 35,
        atk: 10,
        def: 10,
        damage: 1,
        money: 0,
        experience: 0,
        point: 0,
        special: 0,
        critical: 1,
        criticalDamage: '?',
        defDamage: '?',
      },
      {
        name: '第二页',
        icon: './img/logo.png',
        hp: 35,
        atk: 10,
        def: 10,
        damage: 1,
        money: 0,
        experience: 0,
        point: 0,
        special: 0,
        critical: 1,
        criticalDamage: '?',
        defDamage: '?',
      },
      {
        name: '第二页2',
        icon: './img/logo.png',
        hp: 35,
        atk: 10,
        def: 10,
        damage: 1,
        money: 0,
        experience: 0,
        point: 0,
        special: 0,
        critical: 1,
        criticalDamage: '?',
        defDamage: '?',
      },
      {
        name: '第二页3',
        icon: './img/logo.png',
        hp: 35,
        atk: 10,
        def: 10,
        damage: 1,
        money: 0,
        experience: 0,
        point: 0,
        special: 0,
        critical: 1,
        criticalDamage: '?',
        defDamage: '?',
      },
      {
        name: '第二页4',
        icon: './img/logo.png',
        hp: 35,
        atk: 10,
        def: 10,
        damage: 1,
        money: 0,
        experience: 0,
        point: 0,
        special: 0,
        critical: 1,
        criticalDamage: '?',
        defDamage: '?',
      },
      {
        name: '第二页5',
        icon: './img/logo.png',
        hp: 35,
        atk: 10,
        def: 10,
        damage: 1,
        money: 0,
        experience: 0,
        point: 0,
        special: 0,
        critical: 1,
        criticalDamage: '?',
        defDamage: '?',
      },
      {
        name: '第二页6',
        icon: './img/logo.png',
        hp: 35,
        atk: 10,
        def: 10,
        damage: 2,
        money: 0,
        experience: 0,
        point: 0,
        special: 0,
        critical: 1,
        criticalDamage: '?',
        defDamage: '?',
      },
    ],
  });
};

function showBook() {
  if (window.ui.current !== null) {
    main.closePanel();
  } else main.drawBook();
}
const button = document.createElement('button');
button.innerText = '点击切换';
button.addEventListener('mousedown', () => {
  showBook();
});
button.style.width = '100px';
button.style.height = '100px';
document.body.appendChild(button);

// main.drawBook();
