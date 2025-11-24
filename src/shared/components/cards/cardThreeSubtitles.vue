<template>
  <v-card elevation="1" outlined shaped min-height="220" :min-width="maxLargura">
    <title-negative-margin
      :title="title.toLowerCase().replace('_', ' ')"
      :min-width="200"
    ></title-negative-margin>
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class="headline text-center mb-2 text-h4 font-weight-bold">
          <slot name="card-value"></slot>
        </v-list-item-title>
        <hr />
        <v-list-item-subtitle class="text-center text-h7">
          <slot name="subtitle1"></slot>
        </v-list-item-subtitle>

        <v-list-item-subtitle><slot name="subtitle2"></slot></v-list-item-subtitle>

        <v-list-item-subtitle><slot name="subtitle3"></slot></v-list-item-subtitle>

        <v-list-item-subtitle class="primary--text text-center p-1">
          <slot name="subtitle4"></slot>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-icon>
        <v-icon color="red darken-2">{{ mdiIcon }}</v-icon>
      </v-list-item-icon>
    </v-list-item>
  </v-card>
</template>
<script>
  import titleNegativeMargin from '../titles/titleNegativeMargin.component.vue'
  export default {
    name: 'card-three-subtitles',
    props: {
      title: {
        type: String,
        default: ''
      },
      maxLargura: {
        type: String
      },
      subTitle: {
        type: String,
        default: ''
      },
      mdiIcon: {
        type: String,
        default: ''
      }
    },
    components: {
      titleNegativeMargin
    }
  }
</script>

<style></style>
