<template>
  <v-row align="center" justify="space-between" no-gutters>
    <v-col v-if="icon" cols="auto">
      <v-icon large class="mr-2" style="font-size: 20px">
        {{ icon }}
      </v-icon>
    </v-col>
    <v-col>
      <div class="d-flex align-center">
        <div
          class="headline font-weight-medium mb-0"
          style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
        >
          {{ title }}
        </div>
        <div v-if="value" class="ml-2 mb-0" style="font-size: 28px">
          {{ value }}
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: 'ui-title',
    props: {
      icon: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      value: {
        type: [String, Number],
        default: ''
      }
    }
  }
</script>
