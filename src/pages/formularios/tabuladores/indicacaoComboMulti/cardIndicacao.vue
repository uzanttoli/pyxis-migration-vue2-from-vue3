<template>
  <div>
    <v-card
      elevation="2"
      min-height="80"
      class="d-flex justify-center flex-column align-center pa-1 rounded-xl"
    >
      <v-card
        class="rounded-xl mt-n0 d-flex align-center justify-center red white--text pa-1 w-100 mb-2"
      >
        <p class="caption text-capitalize pa-0 ma-0">
          {{ title.toLowerCase().split('_').join(' ') }}
        </p>
      </v-card>
      <p class="pa-0 ma-0 title font-weight-bold">{{ valor }}</p>
    </v-card>
  </div>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      valor: {
        type: [String, Number],
        default: 0
      }
    }
  }
</script>

<style scoped>
  .card-container {
  }
</style>
