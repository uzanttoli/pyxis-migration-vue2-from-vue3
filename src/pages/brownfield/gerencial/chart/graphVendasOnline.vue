<template>
  <v-col>
    <v-card elevation="1" class="pa-4">
      <apexchart
        :type="type"
        :height="height"
        :options="loadOptions"
        :series="loadSeries"
      ></apexchart>
    </v-card>
  </v-col>
</template>

<script>
  export default {
    props: {
      height: {
        type: Number,
        default: 350
      },
      type: {
        type: String,
        default: 'line'
      },
      loadOptions: {
        type: [Array, Object],
        require: true
      },
      loadSeries: {
        type: [Array, Object],
        require: true
      }
    }
  }
</script>

<style></style>
