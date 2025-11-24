<template>
  <v-card elevation="1" class="rounded-xl">
    <title-negative-margin
      :title="title"
      :icon="titleIcon"
      :progressVisible="false"
      :countIntervalProgress="countInterval"
      corProgress="white"
      className="rounded-r-xl"
    ></title-negative-margin>
    <v-data-table
      dense
      multi-sort
      :fixed-header="true"
      item-key="SUPERIOR2 + SUPERIOR1"
      :items-per-page="15"
      :loading="loading"
      :headers="headerDinamic"
      class="text-no-wrap"
      :items="base"
      no-data-text="Não há dados no momento!"
      :search="search"
      loading-text="Carregando... Por favor aguardar!"
    >
      <template v-slot:item.PERC_PAUSAS="{ item }">
        {{ calcularPercentual(item.OP_PAUSAS, item.OP_LOGADO) }}
      </template>
      <template v-slot:item.PERCENT_OP_SISTEMA_IND="{ item }">
        {{ item.OP_SISTEMA ? calcularPercentual(item.OP_SISTEMA_IND, item.OP_SISTEMA) : '-' }}
      </template>
      <template v-slot:top>
        <v-container fluid>
          <v-row>
            <v-col v-if="numSuperior >= 1" :cols="numSuperior == 1 ? 3 : 3">
              <v-row class="pa-6">
                <v-select
                  :items="listaCoordenadores"
                  v-model="coordenadorFilter"
                  label="Coordenador"
                  outlined
                  dense
                ></v-select>
              </v-row>
            </v-col>

            <v-col v-if="numSuperior >= 2" :cols="numSuperior == 2 ? 3 : 3">
              <v-row class="pa-6">
                <v-select
                  :items="listaSupervisores"
                  v-model="supervisorFilter"
                  label="Supervisor"
                  outlined
                  dense
                ></v-select>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:item.OP_SISTEMA_IND="{ item }">
        <span class="red--text" v-if="item.OP_SISTEMA_IND > 0">{{ item.OP_SISTEMA_IND }}</span>
        <span v-else>{{ item.OP_SISTEMA_IND }}</span>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import config from '@/core/config'
  export default {
    name: 'tabela-gerencial-pausa',
    props: {
      title: {
        type: String,
        default: 'Abs'
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
        default: 'PAUSA'
      },
      produtoAtual: {
        type: String
      },
      agrupamentoAtual: {
        type: String
      },
      data: {
        type: Object
      }
    },
    data: () => ({
      search: '',
      countInterval: 0,
      interval: null,
      base: [],
      totalPausas: [],
      loading: false,
      colunaChave: 'COORDENADOR',
      supervisorFilter: '',
      coordenadorFilter: ''
    }),
    computed: {
      listaSupervisores() {
        let result = this.base
          .filter(item => {
            if (item.SUPERIOR2 == this.coordenadorFilter) {
              return item.SUPERIOR1
            } else if (item.SUPERIOR2 == '') {
              return item.SUPERIOR1
            }
          })
          .map(item => item.SUPERIOR1)
          .filter(this.onlyUnique)
        result.push('')
        return result
      },
      listaCoordenadores() {
        let result = this.base
          .map(item => {
            return item.SUPERIOR2
          })
          .filter(this.onlyUnique)
        result.push('')
        return result
      },
      pausaConfigOcupacao() {
        return this.$store.getters.pausaConfigOcupacao
      },
      headerDinamic() {
        const dados = this.base[0]
        if (!dados) return []

        const COLUMN_COLORS = {
          cyan: ['SUPERIOR1', 'SUPERIOR2', 'OP_LOGADO', 'AGRUPAMENTO', 'OP_PAUSAS'],
          green: ['PERC_PAUSAS']
        }

        const getColumnColor = columnName => {
          if (COLUMN_COLORS.cyan.includes(columnName)) return 'cyan darken-3'
          if (COLUMN_COLORS.green.includes(columnName)) return 'green darken-4'
          return 'red darken-4'
        }

        const formatColumnText = parts => {
          if (parts.length < 2) return parts[0]
          return parts[0] === 'PERC' ? `(%) ${parts[1]}` : parts[1]
        }

        const getColumnFilter = columnText => {
          switch (columnText) {
            case 'SUPERIOR2':
              return value => !this.coordenadorFilter || value === this.coordenadorFilter
            case 'SUPERIOR1':
              return value => !this.supervisorFilter || value === this.supervisorFilter
            default:
              return () => true
          }
        }

        return Object.keys(dados).map(columnName => {
          const parts = columnName.split('_')
          const text = formatColumnText(parts)
          const colorClass = getColumnColor(columnName)

          return {
            text,
            value: columnName,
            class: `${colorClass} white--text`,
            align: 'center',
            filter: getColumnFilter(text)
          }
        })
      }
    },
    methods: {
      calcularTotal(array) {
        if (!Array.isArray(array)) return {}

        const keys = [
          'OP_ALIMENTACAO',
          'OP_DESCANSO',
          'OP_FEEDBACK',
          'OP_LABORAL_RECICLAGEM',
          'OP_LOGADO',
          'OP_PADRAO',
          'OP_PARTICULAR',
          'OP_PAUSAS',
          'OP_SISTEMA',
          'OP_TREINAMENTO',
          'OP_SISTEMA_IND',
          'OP_NIDENTIFICADO',
          'OP_CALLBACK',
          'OP_SAUDE',
          'OP_REFUSED'
        ]

        const initialTotals = keys.reduce((acc, key) => ({ ...acc, [key]: 0 }), {})

        return array.reduce((acc, obj) => {
          keys.forEach(key => {
            acc[key] += obj[key] || 0
          })
          return acc
        }, initialTotals)
      },

      onlyUnique(value, index, self) {
        return self.indexOf(value) === index
      },
      loadBase() {
        this.loading = true
        let urlData = `${config.baseUrl}${this.actionUrl}`
        urlData = this.replaceUrlMultiParamSeparator(urlData)
        this.$api
          .get(urlData, {
            params: {
              agrupamento: this.data.AGRUPAMENTO,
              produto: this.data.PRODUTO
            }
          })
          .then(res => {
            let dados = res?.data
            dados.forEach(this.replaceNulls)
            this.base = dados
            this.base.push({
              SUPERIOR2: 'TOTAL',
              ...this.calcularTotal(res.data)
            })
            this.loading = false
          })
      },
      replaceNulls(obj) {
        if (!obj) return
        for (let key in obj) {
          if (obj[key] === null || obj[key] === '') {
            obj[key] = '-'
          }
        }
      },
      calcularPercentual(value1, value2) {
        return ((value1 / value2) * 100).toFixed(2).concat('%')
      }
    },
    watch: {
      produtoAtual() {
        this.loadBase()
      }
    },
    created() {
      this.loadBase()
    }
  }
</script>

<style scoped></style>
