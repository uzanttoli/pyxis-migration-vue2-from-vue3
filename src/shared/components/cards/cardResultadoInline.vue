<template>
  <v-sheet>
    <v-card elevation="0">
      <v-subheader class="text-capitalize">
        <v-icon class="mr-2">
          {{ icon }}
        </v-icon>
        {{ title.toLowerCase().replace('_', ' ') }}
      </v-subheader>
      <v-card-text>
        <v-row class="ma-0 text-h5 font-weight-black">
          {{ valor }}
        </v-row>
        <v-row v-if="subLabel && subValue">
          <v-spacer></v-spacer>
          <span class="red--text">{{ subLabel }}:{{ subValue }}</span>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
    </v-card>
  </v-sheet>
</template>
<script>
  export default {
    name: 'card-resultado',
    props: {
      title: {
        type: String,
        default: 'Titulo'
      },
      icon: {
        type: String,
        default: 'mdi-account'
      },
      valor: {
        type: [String, Number],
        default: 0
      },
      subValue: {
        type: [Number, String],
        Default: 0
      },
      subLabel: {
        type: String,
        Default: 0
      }
    },
    components: {}
  }
</script>

<style></style>
