<template>
  <v-sheet>
    <v-card elevation="4" shaped>
      <title-negative-margin
        :title="title.toLowerCase().replace('_', ' ')"
        :min-width="150"
      ></title-negative-margin>
      <v-card-text>
        <v-row class="ma-0 text-h5">
          <v-icon>{{ icon }}</v-icon>
          <v-spacer></v-spacer>
          {{ valor }}
        </v-row>
        <v-row v-if="subLabel && subValue">
          <v-spacer></v-spacer>
          <span class="red--text">{{ subLabel }}:{{ subValue }}</span>
        </v-row>
      </v-card-text>
    </v-card>
  </v-sheet>
</template>
<script>
  import titleNegativeMargin from '../titles/titleNegativeMargin.component.vue'
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
    components: {
      titleNegativeMargin
    }
  }
</script>

<style></style>
