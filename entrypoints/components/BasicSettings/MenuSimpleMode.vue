<template>
  <div class="item">
    <div class="tit">{{ sort }}. 开启论坛简洁模式</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  created() {
    if (this.modelValue) {
      $('head').append(`<style>
 section.post-menu-area{position:absolute!important;bottom:-30px;right:0;transition:all .1s linear;opacity:0;visibility:hidden;transform:translateY(10px)}
.topic-post .avatar{width:30px!important;height:30px!important}
.topic-avatar .avatar-flair.rounded{display:none}
.topic-post:hover section.post-menu-area{opacity:1;visibility:inherit;transform:translateY(0)}
.topic-avatar{width:auto!important}
.names>span a{font-weight:400}
.names .user-title{display:none}
.topic-meta-data .user-status-message-wrap{display:none}
#topic-title h1 a{font-weight:500;font-size:22px}
.more-topics__container,.sidebar-footer-wrapper{display:none}
#topic-footer-buttons .topic-footer-main-buttons__actions,.global-notice,.loading-container,.search-banner,.topic-list .topic-list-data.posters,.topic-list .views,.topic-notifications-button,body:not(.archetype-private_message) .topic-map{display:none!important}
.names>span a{font-size:14px;color:silver!important}
.topic-body .reply-to-tab{display:none}
.d-header-wrap{opacity:.2;transition:all .15s linear}
.d-header-wrap:hover{opacity:1}
.sidebar-wrapper{opacity:.3;transition:all .15s linear}
.sidebar-wrapper:hover{opacity:1}
.category-heading{display:flex;align-items:center}
.category-logo.aspect-image{width:50px!important;margin-right:10px!important}
.category-heading p{font-size:20px!important}
.category-boxes .description{display:none!important}
.category-boxes h3{font-size:18px!important;font-weight:400;display:flex;align-items:center;justify-content:center}
.category-boxes h3 .ember-view{margin-right:10px}
      </style>`)
    }
  },
};
</script>
