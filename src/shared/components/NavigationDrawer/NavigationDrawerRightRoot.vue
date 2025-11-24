<template>
  <!-- v-model="abrirModal" -->

  <v-navigation-drawer
    app
    right
    width="320"
    :model-value="abrirModal"
    @update:modelValue="val => $emit('update:abrirModal', val)"
  >
    <v-col>
      <slot></slot>
    </v-col>
  </v-navigation-drawer>
</template>

<script>
  export default {
    components: {},
    props: {
      abrirModal: {
        type: Boolean,
        default: false
      },
      search: {
        type: String,
        default: ''
      },
      loadingMinhasTratativas: {
        type: Boolean,
        default: false
      }
    }
  }
</script>

<style></style>
