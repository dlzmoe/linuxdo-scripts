<template>
  <div class="item">
    <div class="tit">是否开启用户标签功能（关闭后，不会删除已添加的用户标签数据）</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue"],
  emits: ["update:modelValue"],
  methods: {
    init() {
      $('body').append(`<style>
.category-heading{display:flex;align-items:center;}
.category-logo.aspect-image{width:50px;margin-right:10px;}
.category-heading p{font-size:20px;}
.category-boxes .description{display:none;}
.category-boxes h3{font-size:18px;font-weight:400;display:flex;align-items:center;justify-content:center;}
.category-boxes h3 .ember-view{margin-right:10px;}
      </style>`)
    },
  },
  created() {
    if (this.modelValue) {
      this.init();
    }
  },
};
</script>
