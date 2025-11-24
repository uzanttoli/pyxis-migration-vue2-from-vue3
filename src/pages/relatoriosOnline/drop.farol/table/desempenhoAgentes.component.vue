<template>
  <v-data-table dense class="text-no-wrap" hide-default-footer :items="dados">
    <template v-slot:header>
      <thead>
        <tr>
          <th></th>
          <th colspan="8" class="text-center primary rounded-t-xl white--text">
            Desempenho Agentes
          </th>
        </tr>
        <tr>
          <th class="text-center">Intervalo</th>
          <th class="text-center">Forecast</th>
          <th class="text-center">Realizado</th>
          <th class="text-center">Tx Ocupação</th>
          <th class="text-center">% Pausa</th>
          <th class="text-center">% Pausa NR-17</th>
          <th class="text-center">% Pausa Demais</th>
          <th class="text-center">%</th>
          <th class="text-center">Farol</th>
        </tr>
      </thead>
      <tbody class="text-center">
        <tr v-for="(item, i) in dadosFarol" :key="i">
          <td class="intervalo">{{ item.intervalo }}</td>
          <td>{{ Math.round(item.recursos) }}</td>
          <td>{{ realizadoDesempenho(item.logado, item.pausa) }}</td>
          <td>
            {{ calcularTxOcupacao(item.falado, item.pos_atendimento, item.hold, item.disponivel) }}
          </td>
          <td>{{ calcularPercPausa(item.pausa, item.logado) }}</td>
          <td>{{ calcularPausaNR(item.pausa1, item.pausa3, item.logado) }}</td>
          <td>
            {{ calcularDemaisPausas(item.pausa, item.pausa1, item.pausa3, item.logado) }}
          </td>
          <td>
            {{ item.recursos ? calculoDesvio(item.logado, item.pausa, item.recursos) : '-' }}
          </td>
          <td>
            <v-icon :color="farolAgentes(item.logado, item.pausa, item.recursos)">
              mdi-circle
            </v-icon>
          </td>
        </tr>
        <tr
          class="text-center primary rounded-xl white--text"
          v-for="(item, i) in resultadoPainel"
          :key="'A' + i"
        >
          <td>Total</td>
          <td>{{ calcularTotalForcast(item.nec) }}</td>
          <td>{{ calcularTotalRealizado(item.logado, item.pausa) }}</td>
          <td>
            {{ calcularTxOcupacao(item.falado, item.pos_atendimento, item.hold, item.disponivel) }}
          </td>
          <td>{{ calcularPercPausa(item.pausa, item.logado) }}</td>
          <td>{{ calcularPausaNR(item.pausa1, item.pausa3, item.logado) }}</td>
          <td>
            {{ calcularDemaisPausas(item.pausa, item.pausa1, item.pausa3, item.logado) }}
          </td>
          <td>
            {{ item.nec ? calcularTotalDesvio(item.logado, item.pausa, item.nec) : '-' }}
          </td>
          <td>
            <v-icon :color="calcularFarolTotal(item.logado, item.pausa, item.nec)">
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
    name: 'desempenho-agente',
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
      reqInfor: false,
      dados: [{}],
      intervalo: null
    }),
    computed: {
      intervalosFarol() {
        let i = this.$store.getters.intervalosFarol
        return i ? i : []
      },
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
      calcularFarolTotal(value1, value2, value3) {
        let jornada = 22800
        let realizado = (value1 - value2) / jornada

        let forecast = value3 / jornada

        let desvio = (realizado / forecast - 1) * 100

        if (desvio > 0) {
          return 'green'
        } else {
          return 'red'
        }
      },
      calcularPausaNR(value1, value2, value3) {
        return (((value1 + value2) / value3) * 100).toFixed(2).concat('%')
      },
      calcularDemaisPausas(value1, value2, value3, value4) {
        return (((value1 - value2 - value3) / value4) * 100).toFixed(2).concat('%')
      },
      calcularTotalDesvio(value1, value2, value3) {
        let jornada = 22800
        let realizado = (value1 - value2) / jornada

        let forecast = value3 / jornada

        return ((realizado / forecast - 1) * 100).toFixed(2).concat('%')
      },
      calcularTotalForcast(value1) {
        let jornada = 22800
        return Math.round(value1 / jornada)
      },
      calcularTotalRealizado(value1, value2) {
        let jornada = 22800
        return Math.round((value1 - value2) / jornada)
      },

      farolAgentes(value1, value2, value3) {
        let tritaMin = 0.0208333333333333
        let realizado = (value1 - value2) / 86400 / tritaMin

        let forecast = value3

        let desvio = (realizado / forecast - 1) * 100

        return desvio > 0 ? 'green' : 'red'
      },
      calculoDesvio(value1, value2, value3) {
        let tritaMin = 0.0208333333333333
        let realizado = (value1 - value2) / 86400 / tritaMin

        let forecast = value3

        return ((realizado / forecast - 1) * 100).toFixed(2).concat('%')
      },
      calcularPercPausa(value1, value2) {
        return ((value1 / value2) * 100).toFixed(2).concat('%')
      },
      calcularTxOcupacao(value1, value2, value3, value4) {
        return (((value1 + value2 + value3) / (value1 + value2 + value3 + value4)) * 100)
          .toFixed(2)
          .concat('%')
      },
      realizadoDesempenho(value1, value2) {
        let tritaMin = 0.0208333333333333
        return Math.round((value1 - value2) / 86400 / tritaMin)
      },
      loadIntervalosFarol() {
        this.$store.dispatch('loadIntervalosFarol', this.produto)
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
        this.loadIntervalosFarol()
        this.loadResultadoPainel()
      },
      tipo() {
        this.loadDadosFarol()
        this.loadIntervalosFarol()
        this.loadResultadoPainel()
      }
    },
    created() {
      this.loadDadosFarol()
      this.loadIntervalosFarol()
      this.loadResultadoPainel()
      this.intervalo = setInterval(() => {
        this.loadDadosFarol()
        this.loadIntervalosFarol()
        this.loadResultadoPainel()
      }, 15 * 60 * 1000)
    },
    beforeUnmount: function () {
      clearInterval(this.intervalo)
    }
  }
</script>

<style scoped>
  .intervalo {
    font-style: italic;
    font-weight: bold;
  }
</style>
