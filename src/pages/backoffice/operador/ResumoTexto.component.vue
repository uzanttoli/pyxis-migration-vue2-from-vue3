<template>
  <v-card elevation="0" class="mb-n1 mt-n3">
    <v-textarea
      label="Texto gerado"
      placeholder=""
      :value="generateTextDefault"
      filled
      :rows="rowsDefault"
      :id="id"
    ></v-textarea>
  </v-card>
</template>

<script>
  export default {
    props: {
      generateTextDefault: {
        type: String
      },
      id: {
        type: String
      },
      rowsDefault: {
        type: Number,
        default: 4
      }
    },
    computed: {},
    methods: {}
  }
</script>

<style scoped></style>
