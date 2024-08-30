<template>
  <!-- 是否显示自动阅读按钮 -->
  <div class="item">
    <div class="tit">
      {{ sort }}. 是否显示自动阅读按钮，可调节速度默认 10
      <input v-model="value2" placeholder="默认速度 10" />
    </div>
    <input
      type="checkbox"
      :checked="value1"
      @change="updateValue1($event.target.checked)"
    />
  </div>
</template>

<script>
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  computed: {
    value1: {
      get() {
        return this.modelValue.value1;
      },
      set(newValue) {
        this.$emit('update:modelValue', { ...this.modelValue, value1: newValue });
      }
    },
    value2: {
      get() {
        return this.modelValue.value2;
      },
      set(newValue) {
        this.$emit('update:modelValue', { ...this.modelValue, value2: newValue });
      }
    }
  },
  methods: {
    updateValue1(newValue) {
      this.value1 = newValue; 
    }
  }
};
</script>
