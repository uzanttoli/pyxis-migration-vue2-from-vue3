<template>
  <v-data-table dense hide-default-footer :items="data">
    <template v-slot:header>
      <thead>
        <tr>
          <th colspan="4" class="text-center primary rounded-t-xl white--text">Desempenho TMT</th>
        </tr>
        <tr>
          <th class="text-center">Previsto</th>
          <th class="text-center">Realizado</th>
          <th class="text-center">% Desvio</th>
          <th class="text-center">Farol</th>
        </tr>
      </thead>
      <tbody>
        <tr class="text-center" v-for="(item, i) in dadosFarol" :key="i">
          <td>
            {{ item.forecast ? previstoTMA(item.tma, item.forecast) : '-' }}
          </td>
          <td>
            {{
              item.atendidas
                ? realizadoTMA(
                    item.falado,
                    item.pos_atendimento,
                    item.hold,
                    item.tempo_chamada_externa,
                    item.tempo_chamada_direta,
                    item.atendidas
                  )
                : '-'
            }}
          </td>
          <td>
            {{
              item.forecast && item.atendidas
                ? calculoDesvio(
                    (item.falado +
                      item.pos_atendimento +
                      item.hold +
                      item.tempo_chamada_externa -
                      item.tempo_chamada_direta) /
                      item.atendidas,
                    item.tma / item.forecast
                  )
                : '-'
            }}
          </td>
          <td>
            <v-icon
              :color="
                calcularFarol(
                  (item.falado +
                    item.pos_atendimento +
                    item.hold +
                    item.tempo_chamada_externa -
                    item.tempo_chamada_direta) /
                    item.atendidas,
                  item.tma / item.forecast
                )
              "
            >
              mdi-circle
            </v-icon>
          </td>
        </tr>
        <tr
          class="text-center primary rounded-xl white--text"
          v-for="(item, i) in resultadoPainel"
          :key="'A' + i"
        >
          <td>{{ previstoTMA(item.tma, item.forecast) }}</td>
          <td>
            {{
              realizadoTMA(
                item.falado,
                item.pos_atendimento,
                item.hold,
                item.tempo_chamada_externa,
                item.tempo_chamada_direta,
                item.atendidas
              )
            }}
          </td>
          <td>
            {{
              item.forecast
                ? calculoDesvio(
                    (item.falado +
                      item.pos_atendimento +
                      item.hold +
                      item.tempo_chamada_externa -
                      item.tempo_chamada_direta) /
                      item.atendidas,
                    item.tma / item.forecast
                  )
                : '-'
            }}
          </td>
          <td>
            <v-icon
              :color="
                calcularFarol(
                  (item.falado +
                    item.pos_atendimento +
                    item.hold +
                    item.tempo_chamada_externa -
                    item.tempo_chamada_direta) /
                    item.atendidas,
                  item.tma / item.forecast
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
    name: 'desempenho-tmt',
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
      previstoTMA(value1, value2) {
        return Math.round(value1 / value2)
      },
      realizadoTMA(value1, value2, value3, value4, value5, value6) {
        return Math.round((value1 + value2 + value3 + value4 - value5) / value6)
      },
      calculoDesvio(value1, value2) {
        return ((value1 / value2 - 1) * 100).toFixed(2).concat('%')
      },
      calcularFarol(value1, value2) {
        let desvio = (value1 / value2 - 1) * 100
        if (desvio > 0) {
          return 'red'
        } else {
          return 'green'
        }
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
