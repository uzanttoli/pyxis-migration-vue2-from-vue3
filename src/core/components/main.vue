<template>
  <v-main id="main" class="h-full">
    <v-container fluid class="h-full">
      <!-- <router-view class="mx-8" /> -->
      <router-view />
    </v-container>
  </v-main>
</template>
<script>
  export default {
    components: {},
    data: () => ({
      message: 'Você carregou esta página em ' + new Date().toLocaleString()
    })
  }
</script>
<style></style>
