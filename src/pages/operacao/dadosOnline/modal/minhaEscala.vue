<template>
  <!-- v-model="openDialogEscala" -->
  <v-dialog
    :model-value="openDialogEscala"
    :update:modelValue="val => $emit('update:openDialogEscala', val)"
    width="500"
    class="rounded-xl"
  >
    <v-card elevation="1" class="rounded-lg">
      <v-card-title>Minha escala</v-card-title>
      <v-divider></v-divider>
      <v-col>
        <h3>escala</h3>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      openDialogEscala: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style></style>
