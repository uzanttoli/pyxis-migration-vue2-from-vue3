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
  import config from '../../../../core/config.js'
  export default {
    name: 'table-layoutOnline',
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
          url: '/layoutOnlineAjax',
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
      getHeaders() {
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
            text: 'Ramal',
            align: 'center',
            sortable: true,
            value: 'RAMAL',
            class: ''
          },
          {
            text: 'DAC',
            align: 'center',
            sortable: true,
            value: 'DAC',
            class: ''
          },
          {
            text: 'Motivo',
            align: 'center',
            sortable: true,
            value: 'MOTIVO',
            class: ''
          },
          {
            text: 'Skill',
            align: 'center',
            sortable: true,
            value: 'SKILL',
            class: ''
          },
          {
            text: 'Estado',
            align: 'center',
            sortable: true,
            value: 'ESTADO',
            class: ''
          },
          {
            text: 'Duração',
            align: 'center',
            sortable: true,
            value: 'DURACAO',
            class: ''
          },
          {
            text: 'Supervisor',
            align: 'center',
            sortable: true,
            value: 'SUPERVISOR',
            class: ''
          },
          {
            text: 'Coordenador',
            align: 'center',
            sortable: true,
            value: 'COORDENADOR',
            class: ''
          },
          {
            text: 'Campanha',
            align: 'center',
            sortable: true,
            value: 'CAMPANHA',
            class: ''
          },
          {
            text: 'Inaderência',
            align: 'center',
            sortable: true,
            value: 'INADERENCIA',
            class: ''
          },
          {
            text: 'Início',
            align: 'center',
            sortable: true,
            value: 'INICIO',
            class: ''
          },
          {
            text: 'Login',
            align: 'center',
            sortable: true,
            value: 'LOGIN',
            class: ''
          },
          {
            text: 'Login Net',
            align: 'center',
            sortable: true,
            value: 'LOGIN_NET',
            class: ''
          },
          {
            text: 'Piso',
            align: 'center',
            sortable: true,
            value: 'PISO',
            class: ''
          },
          {
            text: 'Estouro Pausa',
            align: 'center',
            sortable: true,
            value: 'PAUSA_ESTOURO',
            class: ''
          },
          {
            text: 'Pausas Indevidas',
            align: 'center',
            sortable: true,
            value: 'PAUSAS_INDEVIDAS',
            class: ''
          },
          {
            text: 'Pausas Devidas',
            align: 'center',
            sortable: true,
            value: 'PAUSAS_DEVIDAS',
            class: ''
          },
          {
            text: 'Tipo',
            align: 'center',
            sortable: true,
            value: 'TIPO',
            class: ''
          },
          {
            text: 'Nome Skill',
            align: 'center',
            sortable: true,
            value: 'NOME_SKILL',
            class: ''
          },
          {
            text: 'Disponibilidade',
            align: 'center',
            sortable: true,
            value: 'DISPONIBILIDADE',
            class: ''
          },
          {
            text: 'Descrição',
            align: 'center',
            sortable: true,
            value: 'DESCRICAO',
            class: ''
          }
        ]

        this.colunaChave = this.generateKey('NOME', 'PRODUTO')

        arrHeadersOper.unshift(hOper)
        arrHeadersOper.push(hSup)
        arrHeadersOper.push(hCoord)

        return arrHeadersOper
      }
    },
    watch: {
      layoutOnlineConfig: function () {
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
