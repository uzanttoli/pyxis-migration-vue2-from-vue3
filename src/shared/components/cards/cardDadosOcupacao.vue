<template>
  <v-card class="rounded-xl mx-auto" elevation="0" outlined style="position: relative">
    <v-list-item>
      <v-list-item-content>
        <div class="pa-1" style="display: flex; justify-content: center">
          <strong>{{ arrayData.AGRUPAMENTO }}</strong>
        </div>
        <v-divider></v-divider>
        <div style="display: flex; justify-content: space-evenly; margin-top: 10px; gap: 5px">
          <div>
            <v-list-item-title class="headline mb-1">
              <div style="display: flex; align-items: center">
                <p style="padding: 0; margin: 0; font-size: 19px">
                  (%) Abs CTI:
                  {{ calcularPercentualAbs(arrayData.OP_ABS_CTI, arrayData.OP_ESCALADOS) }}
                </p>
              </div>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-icon size="15" color="red">mdi-account-alert</v-icon>
              Abs:
              {{ arrayData.OP_ABS_CTI }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <v-icon size="15" color="green">mdi-account</v-icon>
              Escalados:
              {{ arrayData.OP_ESCALADOS }}
            </v-list-item-subtitle>
          </div>
          <v-divider vertical></v-divider>
          <div>
            <v-list-item-title class="headline mb-1">
              <div style="display: flex; align-items: center">
                <p style="padding: 0; margin: 0; font-size: 19px">
                  (%) Abs Ponto:
                  {{ calcularPercentualAbs(arrayData.OP_ABS_PONTO, arrayData.OP_ESCALADOS) }}
                </p>
              </div>
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-icon size="15" color="red">mdi-account-alert</v-icon>
              Abs:
              {{ arrayData.OP_ABS_PONTO }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <v-icon size="15" color="green">mdi-account</v-icon>
              Escalados:
              {{ arrayData.OP_ESCALADOS }}
            </v-list-item-subtitle>
          </div>
        </div>
      </v-list-item-content>
    </v-list-item>
    <div style="position: absolute; top: 10px; right: 13px">
      <v-btn @click="changeDadosModal" x-small color="info" rounded icon depressed>
        <v-icon size="18" v-if="!loadDadosOcupacao">fa-solid fa-info</v-icon>
        <v-progress-circular :value="20" indeterminate size="20" v-else></v-progress-circular>
      </v-btn>
    </div>
    <modal-ocupacao-abs
      :dialogOcupacaoAbs="dialogOcupacaoAbs"
      :title="arrayData.AGRUPAMENTO"
      :dados="dadosOcupacaoAbs"
      :produtoParams="produtoParams"
      @update:close-dialog="dialogOcupacaoAbs = false"
    ></modal-ocupacao-abs>
  </v-card>
</template>

<script>
  import modalOcupacaoAbs from '../../../pages/relatoriosOnline/ocupacao/gerencial/components/modalOcupacaoAbs.vue'
  import config from '../../../core/config'
  export default {
    components: { modalOcupacaoAbs },
    props: {
      title: {
        type: String,
        default: 'Titulo'
      },
      subTitle: {
        type: String,
        default: 'SubTitulo'
      },
      produto: {
        type: String,
        default: 'NET'
      },
      escalados: {
        type: Number,
        default: 0
      },
      abs: {
        type: Number,
        default: 0
      },
      percentAbs: {
        type: [Number, String],
        default: 0
      },
      arrayData: {
        type: [Array, Object]
      },
      produtoParams: {
        type: String
      }
    },
    data: () => ({
      dialogOcupacaoAbs: false,
      loadDadosOcupacao: false,
      dadosOcupacaoAbs: []
    }),
    methods: {
      calcularPercentualAbs(value1, value2) {
        let calc = ((value1 / value2) * 100).toFixed(2)
        return isNaN(calc) ? '0.00%' : `${calc}%`
      },
      changeDadosModal() {
        this.loadDadosOcupacaoAbs()
      },
      convertToDecimalBr(valor) {
        return (valor / 100).toLocaleString(undefined, {
          style: 'percent',
          minimumFractionDigits: 2
        })
      },
      async loadDadosOcupacaoAbs() {
        this.loadDadosOcupacao = true
        let urlData = `${config.baseUrl}api/shared/ocupacao/dados_nominal_abs`
        var res = await this.$api.get(urlData, {
          params: {
            agrupamento: this.arrayData.AGRUPAMENTO,
            produto: this.produtoParams
          }
        })
        this.dadosOcupacaoAbs = res.data
        this.loadDadosOcupacao = false
        this.dialogOcupacaoAbs = true
      }
    }
  }
</script>

<style></style>
