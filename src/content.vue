/** text Content 打字机效果，如果style ，一个字体一个字体的增加 */
<template>
  <container ref="main"></container>
</template>
<script>
import { Text, TextMetrics } from 'pixi.js-legacy';
class Parser {
  constructor() {
    this.data = {};
    this.char = {};
  }

  register(code, char, func) {
    if (typeof char === 'function') {
      func = char;
      char = undefined;
    }
    if (code) this.data[code] = func;
    if (char) this.char[char] = code || func;
  }

  parse(charCode, data, controller) {
    if (charCode === '\\') {
      const code = data.content.charAt(data.index);
      if (this.char[code]) {
        charCode = this.char[code];
        data.index += 1;
        if (typeof charCode === 'function') {
          charCode(data, controller);
          return true;
        }
      } else return null;
    }
    if (this.data[charCode]) {
      this.data[charCode](data, controller);
      return true;
    }
    return null;
  }
}
const parser = new Parser();
parser.register('\r', 'r', (data, controller) => {
  if (data.content.charAt(data.index) !== '[') {
    data.style.fill = controller.style.fill;
  } else {
    const index2 = data.content.indexOf(']', data.index + 1);
    const color = data.content.substring(data.index + 1, index2);
    data.style.fill = color;
    data.index = index2 + 1;
  }
});

parser.register('\n', 'n', (data, controller) => {
  controller.x = 0;
  controller.y += controller.lineHeight;
});
parser.register(undefined, 'd', (data, controller) => {
  if (data.style.fontWeight !== 'bold') {
    data.style.fontWeight = 'bold';
  } else data.style.fontWeight = 'normal';
});
parser.register(undefined, 'e', (data, controller) => {
  if (data.style.fontStyle !== 'italic') {
    data.style.fontStyle = 'italic';
  } else data.style.fontStyle = 'normal';
});
function createNode(controller, data) {
  data.node = new Text(data.text, data.style);
  data.node.position.set(controller.x, controller.y);
  controller.container.addChild(data.node);
}
function parseChar(data) {
  const { content } = data;
  const char = content.charAt(data.index++);
  let isParsed = false;
  if (parser.parse(char, data, this)) {
    data.new = true;
    isParsed = true;
  }
  if (data.new) {
    data.new = false;
    data.text = '';
    if (data.node) {
      this.x += data.node.width;
    }
    createNode(this, data);
  }
  if (!isParsed) {
    data.text += char + this.interval;
    const width = TextMetrics.measureText(data.text, data.node.style, false).width;
    if (this.x + width >= this.width) {
      this.x = 0;
      this.y += this.lineHeight;
      data.text = char + this.interval;
      createNode(this, data);
    } else {
      data.node.text = data.text;
    }
  }
  if (data.index === data.content.length) return;
  if (this.time && !isParsed) {
    return setTimeout(() => this.draw(data), this.time);
  }
  return this.draw(data);
}
export default {
  name: 'content',
  mounted() {
    this.parseValue();
  },
  data() {
    return {
      style: {
        fill: 'white',
        fontSize: '20px',
      },
      options: {
        time: 0,
        width: 100,
        lineHeight: 30,
      },
    };
  },
  methods: {
    getValue() {
      const node = this.$slots.default ? this.$slots.default[0] : null;
      if (node && node.tag === undefined && node.text) return node.text;
      if (this.$attrs.text) return this.$attrs.text;
      return null;
    },
    parseValue() {
      const container = this.$refs.main;
      const text = this.getValue();
      let options = { ...this.options };
      let style = { ...this.style };
      let controller = {
        container,
        ...this.options,
        interval: '   ',
        style: this.style,
        x: 0,
        y: 0,
        draw: parseChar,
      };
      const data = {
        style,
        content: text,
        index: 0,
        new: true,
      };
      controller.draw(data);
    },
  },
};
</script>
