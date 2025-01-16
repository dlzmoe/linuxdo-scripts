<template>
  <div class="item">
    <div class="tit">【限时功能】开启新年挂件</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  methods: {
    init() {
      $('head').append('<style>.HappyNewYear{position:fixed;left:20px;top:0;z-index:1000;width:120px}.HappyNewYear .lantern{width:60px;height:80px;background:#e62e2e;border-radius:50%/15%;position:relative;margin:20px auto;animation:swing 3s ease-in-out infinite;box-shadow:0 0 20px rgba(230,46,46,.4)}.HappyNewYear .lantern::before{content:"福";position:absolute;color:gold;font-size:24px;width:100%;text-align:center;top:50%;transform:translateY(-50%)}.HappyNewYear .lantern::after{content:"";position:absolute;width:10px;height:15px;background:#8b4513;top:-15px;left:50%;transform:translateX(-50%)}.HappyNewYear .firecracker{width:20px;height:60px;background:#c00;position:relative;margin:20px auto;animation:shake .5s ease-in-out infinite}.HappyNewYear .firecracker::before{content:"";position:absolute;width:4px;height:15px;background:#ff0;top:-15px;left:50%;transform:translateX(-50%);animation:spark 1s linear infinite}.HappyNewYear .firework{width:6px;height:6px;background:#ff0;position:absolute;top:50%;left:50%;border-radius:50%;animation:explode 2s ease-out infinite}.HappyNewYear .cloud{width:100px;height:40px;background:#ff4d4d;border-radius:20px;position:relative;margin:20px auto;animation:float 4s ease-in-out infinite}.HappyNewYear .cloud::after,.HappyNewYear .cloud::before{content:"";position:absolute;background:#ff4d4d;border-radius:50%}.HappyNewYear .cloud::before{width:50px;height:50px;top:-20px;left:15px}.HappyNewYear .cloud::after{width:30px;height:30px;top:-10px;right:15px}@keyframes swing{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-2px)}75%{transform:translateX(2px)}}@keyframes spark{0%{height:15px;opacity:1}100%{height:5px;opacity:0}}@keyframes explode{0%{transform:scale(1);opacity:1}100%{transform:scale(20);opacity:0}}@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}</style>')
      $('body').append('<div class="HappyNewYear"><div class="lantern"></div><div class="firecracker"></div><div class="cloud"><div class="firework"></div></div></div>')
      function createFirework() {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = Math.random() * 100 + 'px';
        firework.style.top = Math.random() * 100 + 'px';
        document.querySelector('.cloud').appendChild(firework);

        setTimeout(() => {
          firework.remove();
        }, 2000);
      }

      setInterval(createFirework, 1000);
    }
  },
  created() {
    if (this.modelValue) {
      this.init();
    }
  },
};
</script>

<style lang="less" scoped>
.item {
  color: #e00;
}
</style>