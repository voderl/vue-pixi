<script>
import { TextMetrics, TextStyle } from 'pixi.js-legacy';
export default {
  name: 'bg-text',
  props: ['textStyle', 'bgStyle', 'text', 'padding'],
  render(h) {
    const value = this.getValue();
    const Style = new TextStyle(this.textStyle || {});
    const { width, height } = TextMetrics.measureText(value, Style);
    const padding = this.padding || 5;
    return h(
      'zone',
      {
        style: {
          width: width + 2 * padding,
          height: height + 2 * padding,
          ...this.bgStyle,
        },
      },
      [
        h('text', {
          attrs: {
            x: padding,
            y: padding,
            text: value,
          },
          style: this.textStyle,
        }),
      ],
    );
  },
  methods: {
    getValue() {
      const slot = this.$slots.default;
      if (slot && slot.length === 1 && slot[0].tag === undefined && slot[0].text)
        return slot[0].text;
      return this.$attrs.text || null;
    },
  },
};
</script>
