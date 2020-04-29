<template>
    <container>
      <sprite>./logo.png</sprite>
      <component :is='current' :data='data'></component>
    </container>
</template>
<script>
import book from './book.vue';
import test from './test.vue';
export default {
  name: 'ui',
  data() {
    return {
      current: 'test'
    };
  },
  components: {
    book,
    test,
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
  }
};
</script>
