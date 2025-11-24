<template>
  <div class="mx-auto">
    <v-row class="flex-wrap">
      <v-col class="mb-9" v-for="(item, i) in totalEscaladosAbs" :key="i">
        <card-ocupacao :arrayData="item" :produtoParams="produtoParams"></card-ocupacao>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import config from '../../../../../core/config'
  import cardOcupacao from '../../../../../shared/components/cards/cardDadosOcupacao.vue'
  export default {
    components: { cardOcupacao },
    props: {
      produtoParams: {
        type: String,
        default: 'NET'
      },
      grupo: {
        type: String,
        default: 'N1'
      }
    },
    data: () => ({
      totalEscaladosAbs: []
    }),
    computed: {},
    methods: {
      loadBaseTotal() {
        this.totalEscaladosAbs = ''
        let urlData = `${config.baseUrl}api/shared/ocupacao/result_cards_abs`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produtoParams,
              grupo: this.grupo
            }
          })
          .then(res => {
            this.totalEscaladosAbs = res.data
            this.$emit('update:loading', false)
          })
      },
      calcularPercentualAbs(value1, value2) {
        return ((value1 / value2) * 100).toFixed(2).concat('%')
      }
    },
    created() {
      this.loadBaseTotal()
    },
    mounted() {
      // this.loadBaseTotal();
    },
    watch: {
      produtoParams: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.loadBaseTotal()
        }
      },
      grupo: function (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.loadBaseTotal()
        }
      }
    }
  }
</script>

<style></style>
