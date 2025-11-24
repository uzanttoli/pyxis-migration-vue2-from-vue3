<template>
  <v-card-title class="ml-1 pl-1">
    <v-card
      :min-width="minWidth"
      max-width="300"
      class="primary pa-1 mt-n3 white--text text-capitalize text-no-wrap text-center"
    >
      {{ title }}
      <v-icon color="white">{{ icon }}</v-icon>
    </v-card>
    <v-spacer></v-spacer>
    <slot></slot>
  </v-card-title>
</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        default: 'Título'
      },
      icon: {
        type: String,
        default: ''
      },
      minWidth: {
        type: Number,
        default: 234
      }
    }
  }
</script>
