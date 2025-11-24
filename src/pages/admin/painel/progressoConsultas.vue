<template>
  <v-card class="pa-4">
    <v-progress-circular :rotate="-90" :size="100" :width="15" :value="value" color="red">
      {{ value }}
    </v-progress-circular>
  </v-card>
</template>

<script>
  export default {
    data: () => ({
      value: 10
    })
  }
</script>

<style></style>
