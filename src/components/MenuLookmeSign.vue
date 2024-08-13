<template>
  <!-- 只看自己签名尾巴 -->
  <div class="item">
    <div class="tit">{{ sort }}. 只看自己签名尾巴</div>
    <template>
      <el-checkbox v-model="localChecked" @change="handleChange"></el-checkbox>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    sort: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localChecked: this.value,
    };
  },
  watch: {
    value(newValue) {
      this.localChecked = newValue;
    },
  },
  methods: {
    handleChange() {
      this.$emit("input", this.localChecked);
    },
  },
  created() {
    if (this.localChecked) {
      $("head").append(`<style>
        .topic-post .cooked+hr,
        .topic-post .signature-img,
        .topic-post .signature-p{display:none}

        .topic-post.current-user-post .cooked+hr,
        .topic-post.current-user-post .signature-img,
        .topic-post.current-user-post .signature-p{display:block}
      </style>`);
    }
  },
};
</script>
<style scoped>
.item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
