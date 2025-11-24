<template>
  <v-sheet>
    <v-card elevation="3" outlined min-height="150">
      <title-negative-margin
        :title="title.toLowerCase().replace('_', ' ')"
        :min-width="300"
      ></title-negative-margin>
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="headline text-h5">
            <slot name="card-value"></slot>
          </v-list-item-title>
          <v-list-item-subtitle class="headline mb-2">
            <slot name="subtitle1"></slot>
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-icon>
          <v-icon color="red darken-2">{{ mdiIcon }}</v-icon>
        </v-list-item-icon>
      </v-list-item>
    </v-card>
  </v-sheet>
</template>
<script>
  import titleNegativeMargin from '../titles/titleNegativeMargin.component.vue'
  export default {
    name: 'card-resultado-subtitles',
    props: {
      title: {
        type: String,
        default: ''
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
