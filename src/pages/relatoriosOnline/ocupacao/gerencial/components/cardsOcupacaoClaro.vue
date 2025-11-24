<template>
  <div class="mx-auto">
    <v-row class="flex-wrap">
      <v-col v-for="(item, idx) in s2sOcupacaoFilaData" :key="idx">
        <cardSummary
          :title="idx"
          :data="item"
          :loading="isLoading"
          :destacar="item.map(item => item.destacar)"
          :dateAtt="item[0].atualizadoAte"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import config from '../../../../../core/config'
  import cardSummary from '@/shared/components/CardsCustom/CardSummary.vue'

  export default {
    components: {
      cardSummary
    },
    props: {
      grupo: String
    },
    data: () => ({
      isLoading: {
        type: Boolean,
        default: false
      },
      s2sOcupacaoFilaHeaders: [],
      s2sOcupacaoFilaData: null,
      customMapping: {
        'EM ATENDIMENTO': {
          icon: 'fa-solid fa-phone',
          color: 'orange',
          fontCustom: 'body-1 pa-0 mb-n1 font-weight-bold'
        },
        'POS ATENDIMENTO': {
          icon: 'fa-solid fa-phone',
          color: 'orange',
          fontCustom: 'body-1 pa-0 mb-n1 font-weight-bold'
        },
        DISPONIVEL: {
          icon: 'fa-solid fa-phone',
          color: 'green',
          fontCustom: 'body-1 pa-0 mb-n1 font-weight-bold'
        },
        'PRE REFUSED': {
          icon: 'fa-solid fa-phone',
          color: 'red',
          fontCustom: 'body-1 pa-0 mb-n1 font-weight-bold'
        },
        'ATIVO CLIENTE/CALLBACK': {
          icon: 'fa-solid fa-phone',
          color: 'orange',
          fontCustom: 'body-1 pa-0 mb-n1 font-weight-bold'
        }
      }
    }),
    methods: {
      async fetchData() {
        // if(this.grupo != 'S2S') return;
        this.isLoading = true
        let urlData = `${config.baseUrl}api/shared/ocupacao/summary_claro_ocupacao`
        const resp = await this.$api.get(urlData, {
          params: {
            grupo: this.grupo
          }
        })

        const rawData = resp.data
        // Agrupando os dados por SegmentoOcupacao
        const groupedData = rawData.reduce((acc, item) => {
          const { SegmentoOcupacao, EstadoaAtendimento, Qtd, AtualizadoAte, Destacar, Perc } = item

          if (!acc[SegmentoOcupacao]) {
            acc[SegmentoOcupacao] = { totalQtd: 0, data: [] }
          }

          // Atualizando o total de Qtd por SegmentoOcupacao
          acc[SegmentoOcupacao].totalQtd += Qtd

          // Adicionando os dados ao agrupamento
          acc[SegmentoOcupacao].data.push({
            EstadoaAtendimento,
            AtualizadoAte,
            Destacar,
            Qtd,
            Perc
          })
          return acc
        }, {})

        // Calculando os percentuais e formatando os dados
        const formattedData = Object.entries(groupedData).reduce((acc, [segmento, { data }]) => {
          acc[segmento] = data.map(({ EstadoaAtendimento, Qtd, AtualizadoAte, Destacar, Perc }) => {
            const customData = this.customMapping[EstadoaAtendimento] || {
              icon: 'fa-solid fa-phone',
              color: 'gray'
            }

            // const percentual = calcularPercentual(Qtd, totalQtd, 2, false)
            return {
              text: EstadoaAtendimento,
              value: `${Qtd.toString().length == 1 ? '0' + Qtd : Qtd} | (${(Perc * 100).toFixed(
                2
              )}%)`,
              atualizadoAte: AtualizadoAte,
              icon: customData.icon,
              iconColor: customData.color,
              destacar: Destacar,
              font: customData.fontCustom
            }
          })
          return acc
        }, {})

        // Atualizando os dados no componente
        this.s2sOcupacaoFilaData = formattedData
        this.isLoading = false
      }
    },
    async created() {
      await this.fetchData()
    },
    watch: {
      grupo: async function (newVal, oldVal) {
        if (newVal !== oldVal) {
          await this.fetchData()
        }
      }
    }
  }
</script>

<style></style>
