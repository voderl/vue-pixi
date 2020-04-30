<template>
  <tiling :x="0" :width="416" :height="416" @pointerdown="sayHello" src="./ground.png">
    <graphics></graphics>
    <zone
      :x="100"
      :style="{
        width: 100,
        height: 100,
        fillAlpha: 0.3,
      }"
    >
      <text
        :x="0"
        :y="0"
        :anchor="0.5"
        style="fill: green"
        :fit="[100, 100]"
        @pointerdown.once="cool"
        >{{ data + '' }}</text
      >
      <text>{{ data + 'cool' }}</text>
      <sprite
        :x="50"
        :y="50"
        :scale="0.5"
        :time="1000"
        src="./logo.png"
        @pointerdown="sayHello"
      ></sprite>
    </zone>
    <hero :x="50" :y="50" ref="hero">hero</hero>
  </tiling>
</template>
<script>
import hero from './hero.vue';
export default {
  name: 'test',
  components: {
    hero,
  },
  data() {
    return {
      data: 'awesome',
      hello() {
        console.log('hello');
      },
    };
  },

  destroyed() {
    console.log(arguments, this);
  },
  methods: {
    sayHello(e) {
      console.log('hello');
    },
    setHero(e) {
      console.log(e);
      const { x, y } = e.data.global;
      this.$refs.hero.$el.position.set(x, y);
    },
    sayEvent(e) {
      console.log(e);
    },
    cool() {
      console.log('cool');
    },
    cool2() {
      console.log('cool2');
    },
  },
  created() {
    window.test = this;
  },
};
</script>
