<template>
  <ul class="list" v-if="this.list.length > 0">
    <li v-for="item in list" :key="item.id">
      <a :href="'https://linux.do/t/topic/' + item.id" target="_blank">
        {{ item.title }}
      </a>
    </li>
  </ul>
  <div class="nodata" v-else>暂无最热话题</div>
</template>

<script>
export default {
  props: ['list'],
  created() {
    console.log(this.list);

  }
};
</script>
