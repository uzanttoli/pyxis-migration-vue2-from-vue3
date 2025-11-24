<template>
  <v-col :cols="cols || 4" :sm="sm || 6" :md="md || 4" :lg="lg || 3">
    <slot></slot>
  </v-col>
</template>

<script>
  export default {
    name: 'Column',
    props: {
      cols: {
        type: Number,
        required: false
      },
      sm: {
        type: Number,
        required: false
      },
      md: {
        type: Number,
        required: false
      },
      lg: {
        type: Number,
        required: false
      }
    }
  }
</script>
