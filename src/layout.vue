<template>
  <container
    :x="58"
    :y="58"
    :display="{
      width: 300,
      height: 300,
      wrap: 'wrap',
      alignContent: 'center',
      direction: 'row',
      align: 'center',
      justify: 'around',
    }"
  >
    <zone
      :alpha="0.9"
      :display="{
        flex: true,
        direction: 'col',
        justify: 'around',
      }"
      :style="{
        width: 50,
        height: 100,
      }"
      ref="hello"
    >
      <text
        :style="{
          fill: 'white',
        }"
        >hello World!!</text
      >
      <text
        :style="{
          fill: 'white',
        }"
        >你好</text
      >
    </zone>
    <bg-text
      :textStyle="{
        fill: 'white',
        fontSize: 22,
        padding: 0,
      }"
      :bgStyle="{
        fillAlpha: 0.7,
      }"
      :display="{
        padding: [0, 0],
      }"
      >你不是人吗？xswllllll</bg-text
    >
    <zone
      :display="{
        flex: true,
      }"
      :alpha="0.3"
      :style="{
        width: 100,
        height: 100,
      }"
    >
      <bg-text
        :bgStyle="{
          fillAlpha: 0.3,
        }"
        :textStyle="{
          fill: 'white',
          fontSize: '22px',
        }"
        >哈哈哈哈</bg-text
      >
    </zone>
  </container>
</template>
<script>
import bgText from './bg-text.vue';

export default {
  name: 'layout',
  components: {
    bgText,
  },
};
</script>
