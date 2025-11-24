<template>
  <v-card
    elevation="2"
    width="350"
    height="100"
    class="rounded-xl ma-1"
    style="display: flex; align-items: center; padding: 25px; position: relative"
  >
    <div style="width: 100%; display: flex; align-items: center; gap: 15px">
      <v-progress-circular size="60">
        <v-icon color="rgba(0,212,255,1)" size="30">fa-solid fa-phone-volume</v-icon>
      </v-progress-circular>
      <div class="mt-n1" style="display: flex; flex-direction: column; align-items: flex-start">
        <p class="font-weight-bold text-h4 pa-0 ma-0">{{ value }}</p>
        <span style="color: #616161; font-size: 13px">{{ columnName }}</span>
      </div>
    </div>
    <!-- <span style="position: absolute; right: 15px; bottom: 10px;">0%</span> -->
  </v-card>
</template>

<script>
  export default {
    props: {
      columnName: {
        type: String,
        default: 'Adicionar Nome'
      },
      value: {
        type: [Number, String],
        default: 0
      }
    }
  }
</script>

<style></style>
