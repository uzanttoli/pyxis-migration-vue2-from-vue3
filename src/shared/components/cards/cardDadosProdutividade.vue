<template>
  <v-row align="center" justify="center" style="gap: 10px">
    <v-card
      v-for="(item, i) in dadosArray"
      :key="i"
      class="mt-7"
      elevation="2"
      outlined
      width="200"
      height="100"
      :style="'border-left: 5px inset' + item.COR + '; border-radius: 10px;'"
    >
      <v-list-item>
        <v-list-item-content>
          <div>
            <p
              class="text--primary"
              style="font-size: 18px; display: flex; justify-content: center"
            >
              <!-- <v-icon x-large>mdi-chart-line-variant</v-icon> -->
              {{ item.COLUNA }}
            </p>
            <div style="display: flex; justify-content: center">
              <p class="mt-n2 mb-n1 grey--text" style="font-size: 30px">
                {{ item.VALOR }}
              </p>
            </div>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </v-row>
</template>
<script>
  export default {
    props: {
      dadosArray: { type: Array }
    },
    data: () => ({}),
    methods: {
      convertToDecimalBR(valor) {
        return (valor / 100).toLocaleString(undefined, {
          style: 'percent',
          minimumFractionDigits: 2
        })
      }
    }
  }
</script>
