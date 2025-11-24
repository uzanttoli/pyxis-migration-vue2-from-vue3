<template>
  <v-col>
    <v-card>
      <title-negative-margin
        :title="title"
        :icon="titleIcon"
        :progressVisible="true"
        :countIntervalProgress="countInterval"
      ></title-negative-margin>
      <v-data-table
        dense
        :fixed-header="true"
        :items-per-page="10"
        :loading="loading"
        :item-key="colunaChave"
        :headers="getHeaders(numSuperior)"
        :items="base"
        class="text-no-wrap"
        no-data-text="Não há dados no momento!"
        loading-text="Carregando... Por favor aguarde!"
      >
        <template v-slot:top>
          <v-container fluid>
            <v-row v-if="numSuperior == 2">
              <v-col cols="3">
                <v-row class="pa-6">
                  <v-select
                    label="Coordenador"
                    :items="listarCoordenadores"
                    v-model="coordenadorFilter"
                  ></v-select>
                </v-row>
              </v-col>

              <v-col cols="3">
                <v-row class="pa-6">
                  <v-select
                    label="Supervisor"
                    :items="listarSupervisores"
                    v-model="supervisorFilter"
                  ></v-select>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </template>
        <template v-slot:item.PERC_CASOS_NATIVOS="{ item }">
          {{ item.PERC_CASOS_NATIVOS | percentValue }}
        </template>
        <template v-slot:item.PERC_CASOS_TRATADOS="{ item }">
          {{ item.PERC_CASOS_TRATADOS | percentValue }}
        </template>
        <template v-slot:item.PERC_PENDENTE_TRATATIVA="{ item }">
          {{ item.PERC_PENDENTE_TRATATIVA | percentValue }}
        </template>
        <template v-slot:item.PERC_CASOS_ATIVOS="{ item }">
          {{ item.PERC_CASOS_ATIVOS | percentValue }}
        </template>
      </v-data-table>
    </v-card>
  </v-col>
</template>

<script>
  import config from '@/core/config.js'

  export default {
    props: {
      title: {
        type: String,
        default: 'Sem titulo'
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
      }
    },
    data: () => ({
      countInterval: 0,
      loading: false,
      msgError: '',
      base: [],
      colunaChave: 'SUPERVISOR',
      supervisorFilter: '',
      coordenadorFilter: ''
    }),
    computed: {
      listarSupervisores() {
        let result = this.base
          .filter(item => {
            if (item.COORDENADOR == this.coordenadorFilter) {
              return item.COORDENADOR
            } else if (item.COORDENADOR == '') {
              return item.COORDENADOR
            }
          })
          .map(item => item.SUPERVISOR)
          .filter(this.onlyUnique)
        result.push('')
        return result
      },
      listarCoordenadores() {
        let result = this.base
          .map(item => {
            return item.COORDENADOR
          })
          .filter(this.onlyUnique)
        result.push('')
        return result
      }
    },
    filters: {
      percentValue(value) {
        return (value * 100).toFixed(2).concat('%')
      }
    },
    methods: {
      onlyUnique(value, index, self) {
        return self.indexOf(value) === index
      },
      getHeaders(pNumSuperior = 1) {
        let headerCoordenador = {
          text: 'Coordenador',
          align: 'center',
          value: 'COORDENADOR',
          filter: value => {
            if (!this.coordenadorFilter) {
              return true
            }
            return value == this.coordenadorFilter
          }
        }

        let headerSupervisor = {
          text: 'Nome',
          class: 'primay',
          align: 'center',
          value: 'NOME'
        }

        let arrheaders = [
          {
            text: 'Total Vendas Brutas',
            class: 'primay',
            align: 'center',
            value: 'QTD_VENDAS_BRUTAS'
          },
          {
            text: 'Tratados BKO',
            class: 'primay',
            align: 'center',
            value: 'QTD_CASOS_TRATADOS'
          },
          {
            text: 'Pendente Tratativa',
            class: 'primay',
            align: 'center',
            value: 'QTD_PENDENTE_TRATATIVA'
          },
          {
            text: '(%) Tratados BKO',
            class: 'primay',
            align: 'center',
            value: 'PERC_CASOS_TRATADOS'
          },
          {
            text: '(%) Pendente',
            class: 'primay',
            align: 'center',
            value: 'PERC_PENDENTE_TRATATIVA'
          },
          {
            text: 'Ativos',
            class: 'primay',
            align: 'center',
            value: 'QTD_CASOS_ATIVOS'
          },
          {
            text: 'Não Ativo',
            class: 'primay',
            align: 'center',
            value: 'QTD_CASOS_NATIVOS'
          },
          {
            text: '(%) Ativos',
            class: 'primay',
            align: 'center',
            value: 'PERC_CASOS_ATIVOS'
          },

          {
            text: '(%) Não Ativo',
            class: 'primay',
            align: 'center',
            value: 'PERC_CASOS_NATIVOS'
          }
        ]

        if (pNumSuperior == 2) {
          this.colunaChave = 'SUPERVISOR'
          arrheaders.unshift(headerSupervisor)
          arrheaders.push(headerCoordenador)
        } else if (pNumSuperior == 1) {
          this.colunaChave = 'COORDENADOR'
          arrheaders.unshift(headerCoordenador)
        } else if (pNumSuperior == 0) {
          this.colunaChave = 'QTD_VENDAS_BRUTAS'
          arrheaders
        }
        return arrheaders
      },
      async loadBase() {
        try {
          this.loading = true
          let urlData = `${config.baseUrl}${this.actionUrl}`
          let res = await this.$api.get(urlData)
          // let dados = res.data?.filter((item) => {
          //   return item.COORDENADOR != null;
          // });
          this.base = res.data
          this.loading = false
        } catch (error) {
          console.error(error)
        }
      }
    },
    created() {
      this.loadBase()
    }
  }
</script>

<style scoped>
  .demo-alert-box {
    align-content: center;
    border-radius: 10px;
    background: rgba(177, 23, 3, 0.829);
    width: 250px;
    padding: 10px;
  }
</style>
