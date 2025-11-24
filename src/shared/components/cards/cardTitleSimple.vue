<template>
  <v-card class="mx-auto rounded-t-xl" max-width="400" outlined>
    <v-card-title
      style="color: white; display: flex; justify-content: center; padding: 5px"
      class="cyan lighten-3 text-center rounded-t-xl"
    >
      {{ title }}
    </v-card-title>
    <v-card-text class="text-center pa-3">
      <h1>
        {{ valor }}
      </h1>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      valor: {
        type: [Number, String],
        default: 0
      }
    }
  }
</script>

<style scoped></style>
