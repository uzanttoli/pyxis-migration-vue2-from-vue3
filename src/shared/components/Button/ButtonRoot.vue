<template>
  <v-btn
    @click="$emit('click')"
    :depressed="depressed"
    :color="color"
    :disabled="disabled || loading"
    :outlined="outlined"
    :class="customClass"
  >
    <slot></slot>
  </v-btn>
</template>

<script>
  export default {
    name: 'ButtonRoot',
    props: {
      customClass: {
        type: String
      },
      color: {
        type: String,
        default: 'white'
      },
      depressed: {
        type: Boolean,
        default: false
      },
      loading: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      outlined: {
        type: Boolean,
        default: false
      }
    }
  }
</script>
