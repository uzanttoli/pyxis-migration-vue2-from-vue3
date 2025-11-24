<template>
  <v-card>
    <title-negative-margin :title="title" :icon="titleIcon"></title-negative-margin>
    <br />
    <v-data-table
      dense
      multi-sort
      class="text-no-wrap"
      item-key="ALMOPE"
      :loading="loading"
      loading-text="Carregando..."
      :sort-by="['VENDAS', 'TAXA_CONVERSAO']"
      :sort-desc="[true, true]"
      :headers="getHeaders(numSuperior)"
      :items="reportOperadorSales"
      :items-per-page="15"
      :search="search"
    ></v-data-table>
  </v-card>
</template>
<script>
  export default {
    name: 'televendas-gerencial-mes',
    props: {
      skill: {
        type: String,
        default: 'NET E2E'
      },
      title: {
        type: String,
        default: 'Mês'
      },
      titleIcon: {
        type: String,
        default: ''
      },
      dac: {
        type: [Number, String],
        default: 2
      },
      actionUrl: {
        type: String,
        required: true
      },
      numSuperior: {
        type: [String, Number],
        default: 1
      }
    },
    data: () => ({
      search: '',
      loading: false
    }),
    computed: {
      headers() {
        return [
          {
            text: 'Almope',
            align: 'center',
            sortable: true,
            value: 'ALMOPE'
          },
          {
            text: 'Operador',
            align: 'center',
            sortable: true,
            value: 'OPERADOR'
          },

          {
            text: 'Supervisor',
            align: 'center',
            sortable: true,
            value: 'SUPERVISOR',
            filter: value => {
              if (!this.supervisorFilter) {
                return true
              }
              return value == this.supervisorFilter
            }
          },
          {
            text: 'Coordenador',
            align: 'center',
            sortable: true,
            value: 'COORDENADOR',
            filter: value => {
              if (!this.coordenadorFilter) {
                return true
              }
              return value == this.coordenadorFilter
            }
          }
        ]
      },

      reportOperadorSales() {
        return this.$store.getters.reportOperadorSales
      }
    },
    methods: {
      loadBase() {
        return this.$store.dispatch('loadReportOperadorSales', '')
      },
      onlyUnique(value, index, self) {
        return self.indexOf(value) === index
      },
      generateKey(item, index) {
        const uniqueKey = `${item}-${index}`
        return uniqueKey
      },
      getHeaders(pNumSuperior = 1) {
        let hCoord = {
          text: 'Coordenador',
          align: 'center',
          sortable: true,
          value: 'COORDENADOR',
          class: '',
          filter: value => {
            if (!this.coordenadorFilter) {
              return true
            }
            return value == this.coordenadorFilter
          }
        }

        let hSup = {
          text: 'Supervisor',
          align: 'center',
          sortable: true,
          value: 'SUPERVISOR',
          class: '',
          filter: value => {
            if (!this.supervisorFilter) {
              return true
            }
            return value == this.supervisorFilter
          }
        }

        let hOper = {
          text: 'Nome',
          align: 'center',
          sortable: true,
          value: 'NOME',
          class: ''
        }

        let arrHeadersOper = [
          {
            text: 'Almope',
            align: 'center',
            sortable: true,
            value: 'ALMOPE',
            class: ''
          },
          {
            text: 'Volume',
            align: 'center',
            sortable: true,
            value: 'VOLUME'
          },
          {
            text: 'Clientes Aptos',
            align: 'center',
            sortable: true,
            value: 'CLIENTES_APTOS'
          },
          {
            text: 'Vendas',
            align: 'center',
            sortable: true,
            value: 'VENDAS'
          },
          {
            text: 'Não Vendas',
            align: 'center',
            sortable: true,
            value: 'NAO_VENDA'
          },
          {
            text: 'Taxa Conversão',
            align: 'center',
            sortable: true,
            value: 'TAXA_CONVERSAO'
          },
          {
            text: '01',
            align: 'center',
            sortable: false,
            value: 'DIA_01'
          },
          {
            text: '02',
            align: 'center',
            sortable: false,
            value: 'DIA_02'
          },
          {
            text: '03',
            align: 'center',
            sortable: false,
            value: 'DIA_03'
          },
          {
            text: '04',
            align: 'center',
            sortable: false,
            value: 'DIA_04'
          },
          {
            text: '05',
            align: 'center',
            sortable: false,
            value: 'DIA_05'
          },
          {
            text: '06',
            align: 'center',
            sortable: false,
            value: 'DIA_06'
          },
          {
            text: '07',
            align: 'center',
            sortable: false,
            value: 'DIA_07'
          },
          {
            text: '08',
            align: 'center',
            sortable: false,
            value: 'DIA_08'
          },
          {
            text: '09',
            align: 'center',
            sortable: false,
            value: 'DIA_09'
          },
          {
            text: '10',
            align: 'center',
            sortable: false,
            value: 'DIA_10'
          },
          {
            text: '11',
            align: 'center',
            sortable: false,
            value: 'DIA_11'
          },
          {
            text: '12',
            align: 'center',
            sortable: false,
            value: 'DIA_12'
          },
          {
            text: '13',
            align: 'center',
            sortable: false,
            value: 'DIA_13'
          },
          {
            text: '14',
            align: 'center',
            sortable: false,
            value: 'DIA_14'
          },
          {
            text: '15',
            align: 'center',
            sortable: false,
            value: 'DIA_15'
          },
          {
            text: '16',
            align: 'center',
            sortable: false,
            value: 'DIA_16'
          },
          {
            text: '17',
            align: 'center',
            sortable: false,
            value: 'DIA_17'
          },
          {
            text: '18',
            align: 'center',
            sortable: false,
            value: 'DIA_18'
          },
          {
            text: '19',
            align: 'center',
            sortable: false,
            value: 'DIA_19'
          },
          {
            text: '20',
            align: 'center',
            sortable: false,
            value: 'DIA_20'
          },
          {
            text: '21',
            align: 'center',
            sortable: false,
            value: 'DIA_21'
          },
          {
            text: '22',
            align: 'center',
            sortable: false,
            value: 'DIA_22'
          },
          {
            text: '23',
            align: 'center',
            sortable: false,
            value: 'DIA_23'
          },
          {
            text: '24',
            align: 'center',
            sortable: false,
            value: 'DIA_24'
          },
          {
            text: '25',
            align: 'center',
            sortable: false,
            value: 'DIA_25'
          },
          {
            text: '26',
            align: 'center',
            sortable: false,
            value: 'DIA_26'
          },
          {
            text: '27',
            align: 'center',
            sortable: false,
            value: 'DIA_27'
          },
          {
            text: '28',
            align: 'center',
            sortable: false,
            value: 'DIA_28'
          },
          {
            text: '29',
            align: 'center',
            sortable: false,
            value: 'DIA_29'
          },
          {
            text: '30',
            align: 'center',
            sortable: false,
            value: 'DIA_30'
          },
          {
            text: '31',
            align: 'center',
            sortable: false,
            value: 'DIA_31'
          }
        ]
        let arrHeaders = [
          {
            text: 'Almope',
            align: 'center',
            sortable: true,
            value: 'ALMOPE',
            class: ''
          },
          {
            text: 'Volume',
            align: 'center',
            sortable: true,
            value: 'VOLUME'
          },
          {
            text: 'Clientes Aptos',
            align: 'center',
            sortable: true,
            value: 'CLIENTES_APTOS'
          },
          {
            text: 'Vendas',
            align: 'center',
            sortable: true,
            value: 'VENDAS'
          },
          {
            text: 'Não Vendas',
            align: 'center',
            sortable: true,
            value: 'NAO_VENDA'
          },
          {
            text: 'Taxa Conversão',
            align: 'center',
            sortable: true,
            value: 'TAXA_CONVERSAO'
          },
          {
            text: '01',
            align: 'center',
            sortable: false,
            value: 'DIA_01'
          },
          {
            text: '02',
            align: 'center',
            sortable: false,
            value: 'DIA_02'
          },
          {
            text: '03',
            align: 'center',
            sortable: false,
            value: 'DIA_03'
          },
          {
            text: '04',
            align: 'center',
            sortable: false,
            value: 'DIA_04'
          },
          {
            text: '05',
            align: 'center',
            sortable: false,
            value: 'DIA_05'
          },
          {
            text: '06',
            align: 'center',
            sortable: false,
            value: 'DIA_06'
          },
          {
            text: '07',
            align: 'center',
            sortable: false,
            value: 'DIA_07'
          },
          {
            text: '08',
            align: 'center',
            sortable: false,
            value: 'DIA_08'
          },
          {
            text: '09',
            align: 'center',
            sortable: false,
            value: 'DIA_09'
          },
          {
            text: '10',
            align: 'center',
            sortable: false,
            value: 'DIA_10'
          },
          {
            text: '11',
            align: 'center',
            sortable: false,
            value: 'DIA_11'
          },
          {
            text: '12',
            align: 'center',
            sortable: false,
            value: 'DIA_12'
          },
          {
            text: '13',
            align: 'center',
            sortable: false,
            value: 'DIA_13'
          },
          {
            text: '14',
            align: 'center',
            sortable: false,
            value: 'DIA_14'
          },
          {
            text: '15',
            align: 'center',
            sortable: false,
            value: 'DIA_15'
          },
          {
            text: '16',
            align: 'center',
            sortable: false,
            value: 'DIA_16'
          },
          {
            text: '17',
            align: 'center',
            sortable: false,
            value: 'DIA_17'
          },
          {
            text: '18',
            align: 'center',
            sortable: false,
            value: 'DIA_18'
          },
          {
            text: '19',
            align: 'center',
            sortable: false,
            value: 'DIA_19'
          },
          {
            text: '20',
            align: 'center',
            sortable: false,
            value: 'DIA_20'
          },
          {
            text: '21',
            align: 'center',
            sortable: false,
            value: 'DIA_21'
          },
          {
            text: '22',
            align: 'center',
            sortable: false,
            value: 'DIA_22'
          },
          {
            text: '23',
            align: 'center',
            sortable: false,
            value: 'DIA_23'
          },
          {
            text: '24',
            align: 'center',
            sortable: false,
            value: 'DIA_24'
          },
          {
            text: '25',
            align: 'center',
            sortable: false,
            value: 'DIA_25'
          },
          {
            text: '26',
            align: 'center',
            sortable: false,
            value: 'DIA_26'
          },
          {
            text: '27',
            align: 'center',
            sortable: false,
            value: 'DIA_27'
          },
          {
            text: '28',
            align: 'center',
            sortable: false,
            value: 'DIA_28'
          },
          {
            text: '29',
            align: 'center',
            sortable: false,
            value: 'DIA_29'
          },
          {
            text: '30',
            align: 'center',
            sortable: false,
            value: 'DIA_30'
          },
          {
            text: '31',
            align: 'center',
            sortable: false,
            value: 'DIA_31'
          }
        ]

        if (pNumSuperior == 1) {
          this.colunaChave = 'COORDENADOR'
          arrHeaders.unshift(hCoord)
        } else if (pNumSuperior == 2) {
          this.colunaChave = this.generateKey('SUPERVISOR', 'COORDENADOR')
          arrHeaders.unshift(hSup)
          arrHeaders.push(hCoord)
        } else if (pNumSuperior == 3) {
          this.colunaChave = this.generateKey('NOME', 'OPERACAO')
          arrHeadersOper.unshift(hOper)
          arrHeadersOper.push(hSup)
          arrHeadersOper.push(hCoord)

          arrHeaders = arrHeadersOper
        }

        return arrHeaders
      }
    },
    created: function () {
      this.loadBase()
    },
    watch: {
      televendasConfig: function () {
        this.loadBase()
      }
    }
  }
</script>
