<template>
  <v-card>
    <title-negative-margin :title="title" :icon="titleIcon"></title-negative-margin>

    <v-data-table
      dense
      multi-sort
      :fixed-header="true"
      class="text-no-wrap"
      :item-key="colunaChave"
      :loading="loading"
      loading-text="Carregando..."
      :headers="getHeaders(numSuperior)"
      :items="base"
      :items-per-page="15"
      :search="search"
    >
      <template v-slot:top>
        <v-container fluid>
          <v-row>
            <v-col v-if="numSuperior > 2" cols="4">
              <v-row class="pa-6">
                <v-text-field v-model="search" type="text" label="Nome"></v-text-field>
              </v-row>
            </v-col>

            <v-col v-if="numSuperior >= 1 && listaCoordenadoresEscala.length > 0" cols="4">
              <v-row class="pa-6">
                <v-select
                  :items="listaCoordenadoresEscala"
                  v-model="coordenadorFilter"
                  label="Coordenador"
                ></v-select>
              </v-row>
            </v-col>

            <v-col v-if="numSuperior >= 2" cols="4">
              <v-row class="pa-6">
                <v-select
                  :items="listaSupervisores"
                  v-model="supervisorFilter"
                  label="Supervisor"
                ></v-select>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
  import config from '../../../core/config'
  export default {
    name: 'controle_deslogue',
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
        type: String
      },
      dac: {
        type: String,
        default: '2'
      },
      actionUrl: {
        type: String,
        required: true
      },
      numSuperior: {
        type: Number,
        default: 1
      }
    },
    data: function () {
      return {
        search: '',
        loading: false,
        interval: null,
        base: [],
        colunaChave: 'COORDENADOR',
        supervisorFilter: '',
        coordenadorFilter: '',
        ajaxConfig: {
          url: '/controleDeslogueAjax',
          config: {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
          }
        }
      }
    },
    computed: {
      listaCoordenadoresEscala() {
        let result = this.base
          .map(item => {
            return item.COORDENADOR
          })
          .filter(this.onlyUnique)
        result.push('')
        return result
      },
      listaSupervisores() {
        let result = this.base
          .filter(item => {
            if (item.COORDENADOR == this.coordenadorFilter) {
              return item.SUPERVISOR
            } else if (item.COORDENADOR == '') {
              return item.SUPERVISOR
            }
          })
          .map(item => item.SUPERVISOR)
          .filter(this.onlyUnique)
        result.push('')
        return result
      },
      produtoAtual() {
        return this.$store.getters.produto
      },
      agrupamento() {
        return this.$store.getters.agrupamento
      },
      controleDeslogueConfig() {
        return this.$store.getters.controleDeslogueConfig
      }
    },
    methods: {
      generateKey(item, index) {
        const uniqueKey = `${item}-${index}`
        return uniqueKey
      },
      onlyUnique(value, index, self) {
        return self.indexOf(value) === index
      },
      async loadBase() {
        this.loading = true
        await this.$api.get(`${config.baseUrl}${this.actionUrl}${this.skill}`).then(res => {
          this.base = res.data
          this.loading = false
        })
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

        let arrHeaders = [
          {
            text: 'Qtd. Deslogues',
            align: 'center',
            sortable: true,
            value: 'QTD_DESLOGUES',
            class: ''
          },
          {
            text: 'Tempo Logado',
            align: 'center',
            sortable: true,
            value: 'TEMPO_LOGADO',
            class: ''
          },
          {
            text: 'Tempo Deslogado',
            align: 'center',
            sortable: true,
            value: 'TEMPO_DESLOGADO',
            class: ''
          }
        ]

        let arrHeadersOper = [
          {
            text: 'Almope',
            align: 'center',
            sortable: true,
            value: 'ALMOPE',
            class: ''
          },
          {
            text: 'Qtd. Deslogues',
            align: 'center',
            sortable: true,
            value: 'QTD_DESLOGUES',
            class: ''
          },
          {
            text: 'Primeiro Login',
            align: 'center',
            sortable: true,
            value: 'PRIMEIRO_LOGIN',
            class: ''
          },
          {
            text: 'Último Logout',
            align: 'center',
            sortable: true,
            value: 'ULTIMO_LOGOUT',
            class: ''
          },
          {
            text: 'Operação',
            align: 'center',
            sortable: true,
            value: 'OPERACAO',
            class: ''
          }
        ]

        if (pNumSuperior == 1) {
          this.colunaChave = 'COORDENADOR'

          arrHeaders.unshift(hCoord)
        } else if (pNumSuperior == 2) {
          this.colunaChave = this.generateKey('SUPERVISOR', 'COORDENADOR')
          //this.colunaChave = 'SUPERVISOR'

          arrHeaders.unshift(hSup)
          arrHeaders.push(hCoord)
        } else if (pNumSuperior == 3) {
          this.colunaChave = this.generateKey('NOME', 'PRODUTO')
          //this.colunaChave = 'NOME'

          arrHeadersOper.unshift(hOper)
          arrHeadersOper.push(hSup)
          arrHeadersOper.push(hCoord)

          arrHeaders = arrHeadersOper
        }

        return arrHeaders
      }
    },
    watch: {
      controleDeslogueConfig: function () {
        this.loadBase()
      }
    },
    created: function () {
      this.loadBase()
      this.interval = setInterval(() => {
        this.loadBase()
      }, 15 * 60 * 1000)
    },
    beforeUnmount: function () {
      clearInterval(this.interval)
    }
  }
</script>
