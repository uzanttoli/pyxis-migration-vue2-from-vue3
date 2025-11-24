<template>
  <v-data-table dense class="text-no-wrap" hide-default-footer :items="data">
    <template v-slot:header>
      <thead>
        <tr>
          <th colspan="6" class="text-center primary rounded-t-xl white--text">
            Agentes Produtivos NET
          </th>
        </tr>
        <tr>
          <th class="text-center">Realizado</th>
          <th class="text-center">% Desvio</th>
          <th class="text-center">Farol</th>
        </tr>
      </thead>
      <tbody class="text-center">
        <tr v-for="(item, i) in dadosFarol" :key="i">
          <td>
            {{
              calcularRealizado(
                item.falado,
                item.disponivel,
                item.pos_atendimento,
                item.hold,
                item.tempo_chamada_externa,
                item.tempo_chamada_direta
              )
            }}
          </td>
          <td>
            {{
              item.recursos
                ? desvioAgentes(
                    item.falado,
                    item.disponivel,
                    item.pos_atendimento,
                    item.hold,
                    item.tempo_chamada_externa,
                    item.tempo_chamada_direta,
                    item.recursos
                  )
                : '-'
            }}
          </td>
          <td>
            <v-icon
              :color="
                farolAgentes(
                  item.falado,
                  item.disponivel,
                  item.pos_atendimento,
                  item.hold,
                  item.tempo_chamada_externa,
                  item.tempo_chamada_direta,
                  item.recursos
                )
              "
            >
              mdi-circle
            </v-icon>
          </td>
        </tr>
        <tr
          class="text-center primary rounded-t-xl white--text"
          v-for="(item, i) in resultadoPainel"
          :key="'A' + i"
        >
          <td>
            {{
              calcularTotalRealizado(
                item.falado,
                item.disponivel,
                item.pos_atendimento,
                item.hold,
                item.tempo_chamada_externa,
                item.tempo_chamada_direta
              )
            }}
          </td>
          <td>
            {{
              item.nec
                ? calcularTotalDesvio(
                    item.falado,
                    item.disponivel,
                    item.pos_atendimento,
                    item.hold,
                    item.tempo_chamada_externa,
                    item.tempo_chamada_direta,
                    item.nec
                  )
                : '-'
            }}
          </td>
          <td>
            <v-icon
              :color="
                farolTotalAgentesProdutivos(
                  item.falado,
                  item.disponivel,
                  item.pos_atendimento,
                  item.hold,
                  item.tempo_chamada_externa,
                  item.tempo_chamada_direta,
                  item.nec
                )
              "
            >
              mdi-circle
            </v-icon>
          </td>
        </tr>
      </tbody>
    </template>
  </v-data-table>
</template>

<script>
  export default {
    name: 'agentes-produtivos-net',
    props: {
      props: {
        produto: {
          type: String
        },
        regional: {
          type: String
        },
        tipo: {
          type: String
        }
      }
    },
    data: () => ({
      data: [{}],
      intervalo: null
    }),
    computed: {
      dadosFarol() {
        let dados = this.$store.getters.dadosFarol
        return dados ? dados : []
      },
      resultadoPainel() {
        let resultado = this.$store.getters.resultadoPainel
        return resultado ? resultado : []
      }
    },
    methods: {
      farolTotalAgentesProdutivos(value1, value2, value3, value4, value5, value6, value7) {
        let jornada = 22800
        let forecast = value7 / jornada
        let realizado = (value1 + value2 + value3 + value4 + value5 - value6) / jornada

        let desvio = realizado / forecast - 1

        if (desvio > 0.05) {
          return 'green'
        } else if (desvio > 0) {
          return 'orange'
        } else {
          return 'red'
        }
      },
      calcularTotalDesvio(value1, value2, value3, value4, value5, value6, value7) {
        let jornada = 22800
        let forecast = value7 / jornada
        let realizado = (value1 + value2 + value3 + value4 + value5 - value6) / jornada

        return ((realizado / forecast - 1) * 100).toFixed(2).concat('%')
      },
      calcularTotalRealizado(value1, value2, value3, value4, value5, value6) {
        let jornada = 22800

        return Math.round((value1 + value2 + value3 + value4 + value5 - value6) / jornada)
      },
      farolAgentes(value1, value2, value3, value4, value5, value6, value7) {
        let tritaMin = 0.0208333333333333
        let sec24 = 86400
        let forecast = value7
        let realizado = (value1 + value2 + value3 + value4 + value5 - value6) / (tritaMin * sec24)

        let desvio = realizado / forecast - 1

        if (desvio > 0.05) {
          return 'green'
        } else if (desvio > 0) {
          return 'orange'
        } else {
          return 'red'
        }
      },
      desvioAgentes(value1, value2, value3, value4, value5, value6, value7) {
        let tritaMin = 0.0208333333333333
        let sec24 = 86400
        let forecast = value7
        let realizado = (value1 + value2 + value3 + value4 + value5 - value6) / (tritaMin * sec24)
        return ((realizado / forecast - 1) * 100).toFixed(2).concat('%')
      },
      calcularRealizado(value1, value2, value3, value4, value5, value6) {
        let tritaMin = 0.0208333333333333
        let sec24 = 86400
        return Math.round(
          (value1 + value2 + value3 + value4 + value5 - value6) / (tritaMin * sec24)
        )
      },
      loadDadosFarol() {
        this.$store.dispatch('loadDadosFarol', {
          produto: this.produto,
          regional: this.regional,
          tipo: this.tipo
        })
      },
      loadResultadoPainel() {
        this.$store.dispatch('loadResultadoPainel', {
          produto: this.produto,
          regional: this.regional,
          tipo: this.tipo
        })
      }
    },
    watch: {
      regional() {
        this.loadDadosFarol()
        this.loadResultadoPainel()
      },
      tipo() {
        this.loadDadosFarol()
        this.loadResultadoPainel()
      }
    },
    created() {
      this.loadDadosFarol()
      this.loadResultadoPainel()
      this.intervalo = setInterval(() => {
        this.loadDadosFarol()
        this.loadResultadoPainel()
      }, 15 * 60 * 1000)
    },
    beforeUnmount: function () {
      clearInterval(this.intervalo)
    }
  }
</script>

<style></style>
