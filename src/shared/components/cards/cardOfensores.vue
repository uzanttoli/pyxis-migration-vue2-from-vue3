<template>
  <v-sheet elevation="5">
    <v-card elevation="0">
      <v-subheader class="text-capitalize">
        <v-icon class="mr-2">{{ icon }}</v-icon>
        {{ title }}
      </v-subheader>
      <v-card-text>
        <v-row class="ma-0 text-h5 font-weight-black">{{ valor }}</v-row>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>

<script>
  export default {
    name: 'card-ofensores',
    data: () => ({}),
    props: {
      title: {
        type: String,
        default: 'Titulo'
      },
      icon: {
        type: String,
        default: 'mdi-account'
      }
    }
  }
</script>

<style scoped></style>
