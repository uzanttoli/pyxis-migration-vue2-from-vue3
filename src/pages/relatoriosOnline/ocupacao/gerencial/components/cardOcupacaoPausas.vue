<template>
  <v-row class="mt-9">
    <v-col :cols="resumoPausas.length / 12" class="mb-9" v-for="(item, i) in resumoPausas" :key="i">
      <card-dados-ocupacao-pausas
        :data="item"
        :produtoParams="produtoParams"
        :interval="interval"
      ></card-dados-ocupacao-pausas>
    </v-col>
  </v-row>
</template>

<script>
  import cardDadosOcupacaoPausas from '../../../../../shared/components/cards/cardDadosOcupacaoPausas.vue'

  import config from '../../../../../core/config'

  export default {
    components: { cardDadosOcupacaoPausas },
    props: {
      produtoParams: {
        type: [String, Number],
        default: 'NET'
      },
      grupo: {
        type: String,
        default: 'N1'
      },
      interval: {
        type: Number,
        default: 0
      }
    },
    data: () => ({
      resumoPausas: []
    }),
    mounted() {},
    methods: {
      loadResumoPausasOcupacao() {
        this.resumoPausas = ''
        let urlData = `${config.baseUrl}api/shared/ocupacao/resumo_pausas_ocupacao/`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produtoParams,
              grupo: this.grupo
            }
          })
          .then(res => {
            this.resumoPausas = res.data
            this.$emit('update:loading', false)
          })
      },
      calcularTotalPausas(...values) {
        return values.reduce((total, num) => total + Number(num), 0)
      },
      calcularPercentualAbs(value1, value2) {
        return ((value1 / value2) * 100).toFixed(2).concat('%')
      },
      percentPausas(value1, value2) {
        return ((value1 / value2) * 100).toFixed(2).concat(' p.p.')
      }
    },
    created() {
      this.loadResumoPausasOcupacao()
    },
    watch: {
      interval() {
        if (this.interval == 0) {
          this.loadResumoPausasOcupacao()
        }
      },
      produtoParams: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.loadResumoPausasOcupacao()
        }
      },
      grupo: async function (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.loadResumoPausasOcupacao()
        }
      }
    }
  }
</script>

<style></style>
