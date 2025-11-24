<template>
  <!-- v-model="text" -->

  <span class="d-flex">
    <v-text-field
      :label="label"
      outlined
      dense
      class="ma-2 mt-n5"
      readonly
      :model-value="text"
      @update:modelValue="val => $emit('update:text', val)"
    ></v-text-field>
  </span>
</template>

<script>
  export default {
    props: {
      label: {
        type: [String, Number],
        default: 'Label'
      },
      text: {
        type: [String, Number]
      }
    },

    methods: {}
  }
</script>

<style></style>
