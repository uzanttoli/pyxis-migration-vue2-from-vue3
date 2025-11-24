<template>
  <v-data-table
    dense
    class="text-no-wrap"
    hide-default-footer
    no-data-text="Não há dados no momento"
    :items="dados"
  >
    <template v-slot:header>
      <thead>
        <tr>
          <th></th>
          <th colspan="10" class="text-center primary rounded-t-xl white--text">
            Desempenho Geral
          </th>
        </tr>
        <tr>
          <th class="text-center">Intervalo</th>
          <th>Forecast</th>
          <th>Oferecidas</th>
          <th>Atendidas</th>
          <th>Abandono</th>
          <th>% NS 10s</th>
          <th>Farol NS</th>
          <th>Desvio</th>
          <th>PCA</th>
          <th>PCA Forecast</th>
          <th>Farol</th>
        </tr>
      </thead>
      <tbody class="text-center">
        <tr v-for="(item, i) in dadosFarol" :key="i">
          <td class="intervalo">{{ item.intervalo }}</td>
          <td>{{ item.forecast ? parseInt(item.forecast) : '-' }}</td>
          <td>{{ item.oferecidas }}</td>
          <td>{{ item.atendidas }}</td>
          <td>{{ item.abandono }}</td>
          <td>
            {{ item.oferecidas ? calcularPercentual(item.atendidas10, item.oferecidas) : '-' }}
          </td>
          <td>
            <v-icon :color="farolNS(item.atendidas10 / item.oferecidas)">mdi-circle</v-icon>
          </td>
          <td>
            {{ item.forecast ? calculoDesvio(item.oferecidas, item.forecast) : '-' }}
          </td>
          <td>
            {{ item.oferecidas ? calcularPercentual(item.atendidas, item.oferecidas) : '-' }}
          </td>
          <td>
            {{ item.forecast ? calcularPercentual(item.atendidas, item.forecast) : '-' }}
          </td>
          <td>
            <v-icon
              :color="farolPCA(item.atendidas / item.oferecidas, item.atendidas / item.forecast)"
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
          <td>Total</td>
          <td>{{ item.forecast ? parseInt(item.forecast) : '-' }}</td>
          <td>{{ item.oferecidas }}</td>
          <td>{{ item.atendidas }}</td>
          <td>{{ item.abandono }}</td>
          <td>{{ calcularPercentual(item.atendidas10, item.oferecidas) }}</td>
          <td>
            <v-icon :color="farolNS(item.atendidas10 / item.oferecidas)">mdi-circle</v-icon>
          </td>
          <td>
            {{ item.forecast ? calculoDesvio(item.oferecidas, item.forecast) : '-' }}
          </td>
          <td>{{ calcularPercentual(item.atendidas, item.oferecidas) }}</td>
          <td>
            {{ item.forecast ? calcularPercentual(item.atendidas, item.forecast) : '-' }}
          </td>
          <td>
            <v-icon
              :color="farolPCA(item.atendidas / item.oferecidas, item.atendidas / item.forecast)"
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
    name: 'desempenho-geral',
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
      calcularPercentual(valor1, valor2) {
        return ((valor1 / valor2) * 100).toFixed(2).concat('%')
      },
      dayNS() {
        let date = new Date()
        let day = date.getDay()
        if (day == 6 || day == 7) {
          return 0.7
        } else {
          return 0.8
        }
      },
      farolNS(value1) {
        let day = this.dayNS()
        if (value1 >= day + 0.05) {
          return 'green'
        } else if (value1 > day) {
          return 'orange'
        } else {
          return 'red'
        }
      },
      farolPCA(value1, value2) {
        if (value1 >= 1) {
          return 'green'
        } else if (value2 >= 0.95) {
          return 'orange'
        } else {
          return 'red'
        }
      },
      calculoDesvio(value1, value2) {
        return ((value1 / value2 - 1) * 100).toFixed(2).concat('%')
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
