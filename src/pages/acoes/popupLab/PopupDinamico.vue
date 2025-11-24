<template>
  <v-dialog v-model="dialog" width="550">
    <v-card width="550">
      <v-card-title>{{ titulo }}</v-card-title>
      <v-img :src="arquivo"></v-img>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      arquivo: {
        type: String,
        required: true
      },
      titulo: {
        type: String,
        default: 'Comunicado Pyxis'
      }
    },
    data: () => ({
      dialog: true
    })
  }
</script>

<style></style>
