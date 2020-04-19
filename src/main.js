// import Vue from '../../dist/vue.runtime.min.js';
import Vue from './vue.runtime.min.js';
import ui from './ui.vue';
import * as $ from 'pixi.js-legacy';

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
stage.tagName = 'container';
const main = {};
window.main = main;

window.vue = new Vue({
  render: (h) => h(ui),
}).$mount();
stage.addChild(window.vue.$el);

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
button.addEventListener('mousedown', function() {
  showBook();
});
document.body.appendChild(button);
main.drawBook();
