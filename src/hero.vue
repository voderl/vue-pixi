<template>
  <sprite
    @keydown="keydown"
    @keyup="keyup"
    :anchor="anchor"
    :animationSpeed="1000 / this.time / 60"
  >
    <slot></slot
  ></sprite>
</template>
<script>
import TWEEN from '@tweenjs/tween.js';

const scan = {
  up: { x: 0, y: -1 },
  left: { x: -1, y: 0 },
  down: { x: 0, y: 1 },
  right: { x: 1, y: 0 },
};
export default {
  name: 'hero',
  props: {
    step: {
      type: Number,
      default: 32,
    },
    time: {
      type: Number,
      default: 100,
    },
    anchor: {
      default: 0.5,
    },
  },
  data() {
    return {
      isMoving: false,
      holdingKey: null,
      delayedKey: null,
    };
  },
  mounted() {
    if (this.$el.stop) this.$el.stop();
  },
  watch: {
    holdingKey(value, oldValue) {
      if (value) this.move(value);
    },
  },
  methods: {
    keydown(event, key) {
      if (scan[key]) this.holdingKey = key;
    },
    keyup(event, key) {
      if (scan[key] && key === this.holdingKey) this.holdingKey = null;
    },
    move(direction, time = this.time, keep) {
      if (!this.isMoving) this.isMoving = true;
      else if (!keep) {
        this.delayedStep = direction;
        return;
      }
      const { x, y } = scan[direction];
      const { $el } = this;
      if ($el.frames) {
        if ($el.status !== direction) {
          $el.change(direction);
        }
        if (!$el.playing) $el.gotoAndPlay(1);
      }
      const { x: realX, y: realY } = $el;
      new TWEEN.Tween($el)
        .to(
          {
            x: realX + this.step * x,
            y: realY + this.step * y,
          },
          time,
        )
        .onComplete(() => {
          if (this.holdingKey) {
            this.move(this.holdingKey, undefined, true);
          } else if (this.delayedStep) {
            this.move(this.delayedStep, undefined, true);
          } else {
            this.isMoving = false;
            $el.gotoAndStop(0);
          }
          this.delayedStep = null;
        })
        .start();
    },
  },
};
</script>
