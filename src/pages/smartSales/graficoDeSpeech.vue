<template>
  <!-- v-model="abrirGraficoSpeech" -->

  <v-dialog
    width="1300"
    persistent
    :model-value="abrirGraficoSpeech"
    @update:modelValue="val => $emit('update:abrirGraficoSpeech', val)"
  >
    <v-card class="overflow-hidden">
      <div style="display: flex; justify-content: end">
        <v-btn icon @click="$emit('update:abrir-sugestoes')">
          <v-icon>fa fa-close</v-icon>
        </v-btn>
      </div>

      <div class="img-graf" ref="chartdiv">
        <img src="../../assets/img/popup/smartSales/word.png" alt="" />
      </div>

      <div style="display: flex; padding: 10px; background-color: #fcebd6">
        <a
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            color: #333;
            width: 100%;
          "
          href="http://se0001et0612:4300/chat-codigniter/index.php/api/arquivos/modelo/VERBATINS_S2S_MASSIVO.pdf"
        >
          Baixe aqui as VOC's de ofertas
          <i style="font-size: 30px; margin-left: 5px" class="fa-solid fa-file-pdf"></i>
        </a>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'graficoSpeech',
    props: {
      abrirGraficoSpeech: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      graficoCarregado: false
    }),
    mounted() {},

    methods: {},
    watch: {}
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

<style scoped>
  .hello {
    width: 100%;
    height: 600px;
  }

  img {
    background-size: cover;
    background-position: center;
  }
</style>
