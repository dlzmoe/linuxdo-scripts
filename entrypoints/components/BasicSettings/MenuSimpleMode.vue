<template>
  <div class="item">
    <div class="tit">{{ sort }}. 开启论坛简洁模式 (beta 中，如有不适请关闭！)</div>
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
 section.post-menu-area {
  position: absolute !important;
  bottom: -30px;
  right: 0;
  transition: all 0.1s linear;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
}

.topic-post .avatar {
  width: 30px !important;
  height: 30px !important;
}

.topic-avatar .avatar-flair.rounded {
  display: none;
}

.topic-post:hover section.post-menu-area {
  opacity: 1;
  visibility: inherit;
  transform: translateY(0);
}

.topic-avatar {
  width: auto !important;
}

.names>span a {
  font-weight: 400;
}

.names .user-title {
  display: none;
}

.topic-meta-data .user-status-message-wrap {
  display: none;
}

#topic-title h1 a {
  font-weight: 500;
  font-size: 22px;
}

.more-topics__container,
.sidebar-footer-wrapper {
  display: none;
}

.loading-container,
body:not(.archetype-private_message) .topic-map,
.global-notice,
#topic-footer-buttons .topic-footer-main-buttons__actions,
.topic-notifications-button,
.topic-list .topic-list-data.posters,
.topic-list .views,
.search-banner {
  display: none !important;
}

.list-controls {
  margin-top: 30px;
}

.names>span a {
  font-size: 14px;
  color: #c0c0c0 !important;
}

.topic-body .reply-to-tab {
  display: none;
}

.d-header-wrap {
  opacity: 0.2;
  transition: all 0.15s linear;
}

.d-header-wrap:hover {
  opacity: 1;
}
      </style>`)
    }
  },
};
</script>
