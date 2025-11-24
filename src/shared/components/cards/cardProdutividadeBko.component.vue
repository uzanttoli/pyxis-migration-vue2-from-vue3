<template>
  <v-col cols="2">
    <v-card class="card" :min-width="minWidthCard" :min-height="minHeightCard" elevation="1">
      <v-card-title>
        <v-card
          :min-width="minWidth"
          class="cor-padrao pa-1 mt-n5 white--text text-capitalize text-no-wrap text-center rounded-t-xl rounded-b-xl"
        >
          {{ title }}
        </v-card>
        <v-spacer></v-spacer>
        <slot></slot>
      </v-card-title>
      <div style="display: flex; align: center; justify-content: center">
        <h1 style="color: grey">{{ valor }}</h1>
      </div>
    </v-card>
  </v-col>
</template>

<script>
  export default {
    props: {
      minHeightCard: {
        type: [Number, String],
        default: '0'
      },
      minWidthCard: {
        type: [Number, String],
        default: '380'
      },
      title: {
        type: String,
        default: 'Title'
      },
      valor: {
        type: [Number, String],
        default: 0
      },

      minWidth: {
        type: [Number, String],
        default: '100%'
      }
    }
  }
</script>

<style scoped>
  .card {
    border-radius: 30px;
    background: #ffffff;
    box-shadow: 15px 15px 30px #111010;
  }

  .cor-padrao {
    background-image: linear-gradient(220deg, rgb(0, 236, 255), rgb(143, 14, 143));
  }
</style>
