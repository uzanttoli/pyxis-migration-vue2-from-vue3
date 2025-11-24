<template>
  <v-col>
    <v-card class="card" :min-width="minWidthCard" :min-height="minHeightCard">
      <v-card-title>
        <v-card
          :min-width="minWidth"
          class="cor-padrao pa-1 mt-n5 white--text text-capitalize text-no-wrap text-center rounded-t-xl rounded-b-xl"
        >
          <p style="padding: 0; margin: 0">{{ minusText(title) }}</p>
          <!-- <v-icon color="white">{{ icon }}</v-icon> -->
        </v-card>
        <v-spacer></v-spacer>
        <slot></slot>
      </v-card-title>
      <!-- DADOS -->
      <v-card-title class="font-weight-regular pb-0 pt-0">
        <v-icon color="red" class="mr-1">{{ iconSubTitle }}</v-icon>
        {{ subTitle }}: {{ dadosCampo1 }}
      </v-card-title>
      <v-card-title class="font-weight-regular pt-0">
        <v-icon color="red" class="mr-1">{{ iconSubTitle2 }}</v-icon>
        {{ subTitle2 }}: {{ dadosCampo2 }}
      </v-card-title>
    </v-card>
  </v-col>
</template>

<script>
  export default {
    props: {
      dadosCampo1: {
        type: [String, Number],
        default: ''
      },
      dadosCampo2: {
        type: [String, Number],
        default: ''
      },
      minHeightCard: {
        type: [Number, String],
        default: '135'
      },
      minWidthCard: {
        type: [Number, String],
        default: '380'
      },
      title: {
        type: String,
        default: 'Coordenador'
      },
      subTitle: {
        type: String,
        default: 'Percentual'
      },
      iconSubTitle: {
        type: String,
        default: 'mdi-percent-outline'
      },
      subTitle2: {
        type: String,
        default: 'Quantidade'
      },
      iconSubTitle2: {
        type: String,
        default: 'mdi-phone-in-talk-outline'
      },
      icon: {
        type: String,
        default: ''
      },
      minWidth: {
        type: [Number, String],
        default: '100%'
      }
    },
    methods: {
      minusText(value) {
        if (!value) return
        return value.toLowerCase()
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
