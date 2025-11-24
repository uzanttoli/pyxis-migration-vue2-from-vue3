<template>
  <v-card elevation="1" class="rounded-br-xl ml-n2 rounded-tl-xl card" tile width="100%">
    <v-card-title>
      <slot name="title"></slot>
      <slot></slot>
    </v-card-title>
  </v-card>
</template>

<script>
  export default {}
</script>

<style scoped>
  .card {
    background-image: linear-gradient(220deg, rgb(0, 236, 255), rgb(143, 14, 143));
  }
</style>
