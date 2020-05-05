<template>
  <container>
    <component :is="current" :data="data"></component>
  </container>
</template>
<script>
import book from './book.vue';
import test from './test.vue';
import layout from './layout.vue';

export default {
  name: 'ui',
  data() {
    return {
      current: 'layout',
    };
  },
  components: {
    book,
    test,
    layout,
  },
  created() {
    this.data = {};
    window.ui = this;
  },
  methods: {
    show(id, data) {
      this.data = data || {};
      this.current = id;
    },
  },
};
</script>
