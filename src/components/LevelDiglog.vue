<template>
  <div class="leveldiglog">
    <!-- <div id="linuxDoLevelPopupContent" style="display: block">
      <strong>信任等级：</strong>成员<br /><strong>升级进度：</strong><br />访问天数:
      <span style="color: red">30 / 50</span><br />给出的赞:
      <span style="color: green">134 / 30</span><br />收到的赞:
      <span style="color: green">468 / 20</span><br />帖子数量:
      <span style="color: green">480 / 10</span><br />进入的主题数:
      <span style="color: green">1393 / 500</span><br />阅读的帖子数:
      <span style="color: red">16321 / 20000</span><br />
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    init() {
      if ($(".leveldiglogsearch").length < 1) {
        $(".user-card .first-row .usercard-controls").append(`
      <li class="compose-pm leveldiglogsearch">
        <button class="btn btn-icon-text btn-primary" type="button">查询等级</button>
      </li>`);
      }

      $(".leveldiglogsearch").click(function () {
        var username = $(this).parents("#user-card").find(".names .username").html();

        fetch(`https://linux.do/u/${username}/summary.json`)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          });

        $(".leveldiglog").show();
      });
    },
  },
  created() {
    // if ($(".leveldiglogsearch").length < 1) {
    //   setInterval(() => {
    //     this.init();
    //   }, 1000);
    // }
   
  },
};
</script>

<style>
.leveldiglog {
  /* position: fixed;
  bottom: 20px;
  right: 100px;
  width: 250px;
  height: auto;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 10px;
  padding: 15px;
  z-index: 10000;
  font-size: 14px;
  border-radius: 5px; */
}
</style>
