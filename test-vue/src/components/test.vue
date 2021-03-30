<!--  -->
<template>
  <h2 class="red">test......{{ msg }}</h2>
</template>

<script>
export default {
  name: "test",
  props: {
    msg: {
      type: String,
      default: "hello test vue",
    },
  },
  methods: {},
  data() {
    return {
     
    }
  }
};
</script>

<style>
.red{
    color: red;
}
</style>
