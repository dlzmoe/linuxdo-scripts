<script setup>
  import DefaultTheme from 'vitepress/theme'
  import footerDoc from '../components/footerDoc.vue'
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-after>
      <footerDoc />
    </template>
  </DefaultTheme.Layout>
</template>