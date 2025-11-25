<template>
  <fieldset class="custom-fieldset" :class="classCustom">
    <legend class="mb-2" style="display: flex; align-items: center">
      <i class="fa-solid fa-circle-nodes mr-1 red--text"></i>
      {{ title }}
    </legend>
    <slot></slot>
  </fieldset>
</template>

<script>
  export default {
    name: 'ui-fieldset',
    props: {
      title: {
        type: [String, Number],
        required: false
      },
      classCustom: {
        type: String,
        default: 'my-8 pa-4'
      }
    }
  }
</script>

<style></style>
