<template>
  <span :style="{ color: color }">{{ text }}</span>
</template>

<script>
  export default {
    name: 'ButtonWithText',
    props: {
      text: {
        type: String,
        required: true
      },
      color: {
        type: String,
        required: false,
        default: 'black'
      }
    }
  }
</script>
