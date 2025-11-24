<template>
  <v-card elevation="1">
    <v-col>
      <title-negative-margin
        :title="title"
        :icon="titleIcon"
        :progressVisible="true"
        :countIntervalProgress="countInterval"
        corProgress="white"
      ></title-negative-margin>
      <v-data-table
        dense
        multi-sort
        :fixed-header="true"
        :item-key="colunaChave"
        :items-per-page="15"
        :items="base"
        :search="searchAvancado"
        :loading="loading"
        :headers="getHeaders(numSuperior)"
        class="text-no-wrap"
        no-data-text="Não há dados no momento!"
        loading-text="Carregando... Por favor aguarde!"
      >
        <template v-slot:top>
          <v-container fluid>
            <v-row>
              <v-col v-if="numSuperior === 3" cols="2">
                <v-row class="pa-6">
                  <v-text-field
                    v-model="searchAvancado"
                    append-icon="mdi-magnify"
                    label="Nome"
                    single-line
                    hide-details
                    dense
                    outlined
                    class="rounded-r-xl rounded-bl-xl"
                  ></v-text-field>
                </v-row>
              </v-col>
              <v-col v-if="numSuperior >= 1" cols="2">
                <v-row class="pa-6">
                  <v-select
                    :items="listaCoordenadores"
                    v-model="coordenadorFilter"
                    label="Coordenador"
                    dense
                    outlined
                    class="rounded-r-xl rounded-bl-xl"
                  ></v-select>
                </v-row>
              </v-col>
              <v-col v-if="numSuperior >= 2" cols="2">
                <v-row class="pa-6">
                  <v-select
                    :items="listaSupervisores"
                    v-model="supervisorFilter"
                    label="Supervisor"
                    dense
                    outlined
                    class="rounded-r-xl rounded-bl-xl"
                  ></v-select>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </template>
        <template v-slot:item.TRANSF_MUDA_MM2="{ item }">
          {{ calcularPercentual(item.TRANSF_MUDA_MM2, item.CHAMADAS_MM2) }}
        </template>
        <template v-slot:item.TRANSF_MUDA_MM1="{ item }">
          {{ calcularPercentual(item.TRANSF_MUDA_MM1, item.CHAMADAS_MM1) }}
        </template>
        <template v-slot:item.TRANSF_MUDA_MM0="{ item }">
          {{ calcularPercentual(item.TRANSF_MUDA_MM0, item.CHAMADAS_MM0) }}
        </template>
        <template v-slot:item.TRANSF_MUDA_MM0_DM3="{ item }">
          {{ calcularPercentual(item.TRANSF_MUDA_MM0_DM3, item.CHAMADAS_MM0_DM3) }}
        </template>
        <template v-slot:item.TRANSF_MUDA_MM0_DM2="{ item }">
          {{ calcularPercentual(item.TRANSF_MUDA_MM0_DM2, item.CHAMADAS_MM0_DM2) }}
        </template>
        <template v-slot:item.TRANSF_MUDA_MM0_DM1="{ item }">
          {{ calcularPercentual(item.TRANSF_MUDA_MM0_DM1, item.CHAMADAS_MM0_DM1) }}
        </template>
        <template v-slot:item.TRANSF_MUDA_MM0_DM0="{ item }">
          {{ calcularPercentual(item.TRANSF_MUDA_MM0_DM0, item.CHAMADAS_MM0_DM0) }}
        </template>
        <!-- rodape -->
        <template v-slot:body.append v-if="numSuperior == 1">
          <tr v-for="(item, i) in totalBase" :key="i" class="grey lighten-3 text-center">
            <td>TOTAL</td>
            <td>
              {{ calcularPercentual(item.TRANSF_MUDA_MM2, item.CHAMADAS_MM2) }}
            </td>
            <td>
              {{ calcularPercentual(item.TRANSF_MUDA_MM1, item.CHAMADAS_MM1) }}
            </td>
            <td>
              {{ calcularPercentual(item.TRANSF_MUDA_MM0, item.CHAMADAS_MM0) }}
            </td>
            <td>
              {{ calcularPercentual(item.TRANSF_MUDA_MM0_DM3, item.CHAMADAS_MM0_DM3) }}
            </td>
            <td>
              {{ calcularPercentual(item.TRANSF_MUDA_MM0_DM2, item.CHAMADAS_MM0_DM2) }}
            </td>
            <td>
              {{ calcularPercentual(item.TRANSF_MUDA_MM0_DM1, item.CHAMADAS_MM0_DM1) }}
            </td>
            <td>
              {{ calcularPercentual(item.TRANSF_MUDA_MM0_DM0, item.CHAMADAS_MM0_DM0) }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-col>
    <loadhastag
      :envioDados="loading"
      :activeMsg="true"
      msg="Carregamento de base em andamento... Aguarde um momento!"
    ></loadhastag>
  </v-card>
</template>

<script>
  import config from '../../../../../core/config'
  import loadhastag from '../../../../../shared/components/load/loadHastag.vue'
  export default {
    name: 'tabela-linha-muda',
    components: { loadhastag },
    props: {
      title: {
        type: String,
        default: 'Linha Muda'
      },
      titleIcon: {
        type: String,
        default: ''
      },
      actionUrl: {
        type: String,
        require: true
      },
      numSuperior: {
        type: Number,
        default: 1
      },
      indicador: {
        type: String,
        default: 'LINHAMUDA'
      },
      produtoAtual: {
        type: String
      }
    },
    data: () => ({
      countInterval: 0,
      interval: null,
      base: [],
      totalBase: [],
      totalPausas: [],
      searchAvancado: '',
      loading: false,
      colunaChave: 'COORDENADOR',
      supervisorFilter: '',
      coordenadorFilter: ''
    }),
    computed: {
      listaSupervisores() {
        let result = this.base
          .filter(elem => {
            if (elem.SUPERIOR2 == this.coordenadorFilter) {
              return elem.SUPERIOR1
            } else if (elem.SUPERIOR2 == '') {
              return elem.SUPERIOR1
            }
          })
          .map(elem => elem.SUPERIOR1)
          .filter(this.onlyUnique)
        result.push('')
        return result
      },
      listaCoordenadores() {
        let result = this.base
          .map(elem => {
            return elem.SUPERIOR2
          })
          .filter(this.onlyUnique)
        result.push('')
        return result
      },
      configWorkflow() {
        return this.$store.getters.configWorkflow
      }
    },
    methods: {
      calcularPercentual(value1, value2) {
        if (value1 == '') {
          return '0,00%'
        } else if (value2 == '') {
          return '0,00%'
        } else {
          return ((value1 / value2) * 100).toFixed(2).concat('%')
        }
      },
      meses(numMes) {
        const monthNames = [
          'Janeiro',
          'Feveiro',
          'Março',
          'Abril',
          'Maio',
          'Junho',
          'Julho',
          'Agosto',
          'Setembro',
          'Outubro',
          'Novembro',
          'Dezembro'
        ]
        let date = new Date()
        // let year = date.getFullYear().toString();
        // let month = (date.getMonth() + 1).toString();
        if (date.getMonth() - numMes < 0) {
          return `${monthNames[12 - numMes]}`
        } else {
          return `${monthNames[date.getMonth() - numMes]}`
        }
      },
      dias(numDay) {
        let date = new Date()
        const monthNames = [
          'Janeiro',
          'Feveiro',
          'Março',
          'Abril',
          'Maio',
          'Junho',
          'Julho',
          'Agosto',
          'Setembro',
          'Outubro',
          'Novembro',
          'Dezembro'
        ]
        let considerationDay = numDay

        function validationDate(value, subDay) {
          let hoje = new Date(value)
          hoje.setDate(hoje.getDate() - subDay)
          return hoje
        }
        let day = validationDate(date, considerationDay)
        let dayFormate = day.toLocaleString().slice(0, 3)

        let month = monthNames[day.getMonth()]
        return `${dayFormate}${month}`
      },
      onlyUnique(value, index, self) {
        return self.indexOf(value) === index
      },

      getHeaders(pNumSuperior = 1) {
        let headerCoordenador = {
          text: 'Coordenador',
          class: 'cyan darken-3 white--text',
          align: 'center',
          value: 'SUPERIOR2',
          filter: value => {
            if (!this.coordenadorFilter) {
              return true
            }
            return value == this.coordenadorFilter
          }
        }

        let headerSupervisor = {
          text: 'Supervisor',
          class: 'cyan darken-3 white--text',
          align: 'center',
          value: 'SUPERIOR1',
          filter: value => {
            if (!this.supervisorFilter) {
              return true
            }
            return value == this.supervisorFilter
          }
        }

        let headerAlmope = {
          text: 'Almope',
          class: 'cyan darken-3 white--text',
          colorName: 'white--text',
          align: 'center',
          value: 'ALMOPE'
        }

        let headerOperadores = {
          text: 'Nome',
          class: 'cyan darken-3 white--text',
          colorName: 'white--text',
          align: 'center',
          value: 'NOME'
        }

        let arrHeaders = [
          {
            text: this.meses(2),
            class: 'cyan darken-3 white--text',
            colorName: 'white--text',
            align: 'center',
            value: 'TRANSF_MUDA_MM2'
          },
          {
            text: this.meses(1),
            class: 'cyan darken-3 white--text',
            colorName: 'white--text',
            align: 'center',
            value: 'TRANSF_MUDA_MM1'
          },
          {
            text: this.meses(0),
            class: 'deep-orange darken-4 white--text',
            colorName: 'white--text',
            align: 'center',
            value: 'TRANSF_MUDA_MM0'
          },
          {
            text: this.dias(3),
            class: 'deep-orange accent-1 white--text',
            colorName: 'white--text',
            align: 'center',
            value: 'TRANSF_MUDA_MM0_DM3'
          },
          {
            text: this.dias(2),
            class: 'deep-orange accent-1 white--text',
            colorName: 'white--text',
            align: 'center',
            value: 'TRANSF_MUDA_MM0_DM2'
          },

          {
            text: this.dias(1),
            class: 'deep-orange accent-1 white--text',
            colorName: 'white--text',
            align: 'center',
            value: 'TRANSF_MUDA_MM0_DM1'
          },
          {
            text: this.dias(0),
            class: 'deep-orange accent-2 white--text',
            colorName: 'white--text',
            align: 'center',
            value: 'TRANSF_MUDA_MM0_DM0'
          }
        ]
        if (pNumSuperior == 1) {
          this.colunaChave = 'COORDENADOR'
          arrHeaders.unshift(headerCoordenador)
        } else if (pNumSuperior == 2) {
          this.colunaChave = 'SUPERVISOR'
          arrHeaders.unshift(headerCoordenador)
          arrHeaders.unshift(headerSupervisor)
        } else {
          arrHeaders.unshift(headerCoordenador)
          arrHeaders.unshift(headerSupervisor)
          arrHeaders.unshift(headerOperadores)
          arrHeaders.unshift(headerAlmope)
        }
        return arrHeaders
      },
      loadBase() {
        this.loading = true
        let urlData = `${config.baseUrl}${this.actionUrl}${this.produtoAtual}`
        this.$api.get(urlData).then(res => {
          this.base = res.data
          this.loadTotalBase()
        })
      },
      loadTotalBase() {
        let urlData = `${config.baseUrl}api/shared/workflow/linha_muda_total/${this.produtoAtual}`
        this.$api.get(urlData).then(res => {
          this.totalBase = res.data
          this.loading = false
        })
      }
    },
    created() {
      this.loadBase()
      this.interval = setInterval(() => {
        this.countInterval += 9.66
        if (this.countInterval >= 99.6) {
          this.loadBase()
          this.countInterval = 0
        }
      }, 15 * 6000)
    },
    beforeUnmount: function () {
      clearInterval(this.interval)
    },
    watch: {
      produtoAtual() {
        this.loadBase()
      }
    }
  }
</script>

<style></style>
