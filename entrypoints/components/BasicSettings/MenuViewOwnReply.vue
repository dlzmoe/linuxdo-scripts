<template>
  <div class="item">
    <div class="tit">{{ sort }}. 查看话题内自己回复的楼层数（抽奖贴适用）</div>
    <input type="checkbox" :checked="modelValue" @change="$emit('update:modelValue', $event.target.checked)" />
  </div>
</template>

<script>
import $ from "jquery";
export default {
  props: ["modelValue", "sort"],
  emits: ["update:modelValue"],
  methods: {
    // 提示组件
    messageToast(message) {
      const messageElement = document.createElement("div");
      messageElement.className = "messageToast-text";
      messageElement.innerText = message;
      document.getElementById("messageToast").appendChild(messageElement);
      setTimeout(() => {
        messageElement.remove();
      }, 3000);
    },
    // 开始查询楼层
    getOwnFloor() {
      let vm = this;
      vm.messageToast('正在查询中，请勿重复点击！');

      const id = $('#topic').attr('data-topic-id');
      const myusernameStr = $('.d-header-icons .icon img.avatar').attr('src');
      const username_filters = myusernameStr.replace(/^\/user_avatar\/linux\.do\//, '').split('/')[0];
      fetch(`https://linux.do/t/${id}.json?username_filters=${username_filters}`)
        .then((response) => response.json())
        .then((data) => {
          const postsWithoutFirst = data.post_stream.posts.slice(1); // 删除第一个元素
          const postNumbers = postsWithoutFirst.map(item => item.post_number);
          const postNumbersString = postNumbers.join('，');
          if (postNumbers.length == 0) {
            alert(`你在该话题中没有回复！`);
          } else {
            alert(`你在该话题共有【${postNumbers.length}】个回复\n楼层数是 ${postNumbersString}`);
          }

        })
        .catch((error) => {
          alert('数据拉取失败，请联系插件开发者进行修复！')
        });

    }
  },
  created() {
    if (this.modelValue) {
      let vm = this;
      setInterval(() => {
        if ($('.viewownreply').length < 1) {
          $('.timeline-controls').append(`
        <button class="btn no-text btn-icon icon btn-default viewownreply" type="button">
          查看回复楼层
        </button>
        `)

          $('.viewownreply').click(function () {
            vm.getOwnFloor();
          })
        }

      }, 1000);
    }
  },
};
</script>
