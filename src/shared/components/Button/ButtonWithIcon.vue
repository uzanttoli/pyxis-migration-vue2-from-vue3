<template>
  <v-icon :color="color">{{ icon }}</v-icon>
</template>

<script>
  export default {
    name: 'ButtonWithIcon',
    props: {
      icon: {
        type: String,
        required: true
      },
      color: {
        type: String,
        default: 'black'
      }
    }
  }
</script>
