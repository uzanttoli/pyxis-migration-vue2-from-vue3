<template>
  <v-card>
    <title-negative-margin :title="title" :icon="titleIcon" className="rounded-r-xl">
      <template v-slot:button>
        <download-excel :data="base" :name="'GERENCIAL_PAUSA'" :worksheet="'GERENCIAL_PAUSA'">
          <v-btn fab x-small class="mr-1" elevation="1">
            <v-icon class="blue--text">fa-solid fa-file-arrow-down</v-icon>
          </v-btn>
        </download-excel>
      </template>
    </title-negative-margin>
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
      no-data-text="Não há dados..."
    >
      <template v-slot:top>
        <v-container fluid>
          <v-row>
            <v-col v-if="numSuperior > 2" cols="4">
              <v-row class="pa-6">
                <v-text-field
                  v-model="search"
                  type="text"
                  label="Nome"
                  class="rounded-xl"
                  outlined
                  dense
                ></v-text-field>
              </v-row>
            </v-col>

            <v-col v-if="numSuperior >= 1 && listaCoordenadoresEscala.length > 0" cols="4">
              <v-row class="pa-6">
                <v-select
                  :items="listaCoordenadoresEscala"
                  v-model="coordenadorFilter"
                  label="Coordenador"
                  class="rounded-xl"
                  outlined
                  dense
                ></v-select>
              </v-row>
            </v-col>

            <v-col v-if="numSuperior >= 2" cols="4">
              <v-row class="pa-6">
                <v-select
                  :items="listaSupervisores"
                  v-model="supervisorFilter"
                  label="Supervisor"
                  class="rounded-xl"
                  outlined
                  dense
                ></v-select>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <template v-slot:item.STATUS="{ item }">
        <v-icon v-if="item.STATUS == 'LOGADO'" color="green">mdi-power-settings</v-icon>
        <v-icon v-else color="red">mdi-power-settings</v-icon>
      </template>

      <template v-slot:item.TEMPO_LOGADO="{ item }">{{ item.TEMPO_LOGADO }}</template>
      <template v-slot:item.JACKIN="{ item }">{{ item.JACKIN }}</template>
      <template v-slot:item.TOTAL="{ item }">{{ item.TOTAL }}</template>
      <template v-slot:item.PARTICULAR="{ item }">{{ item.PARTICULAR }}</template>
      <template v-slot:item.ALIMENTACAO="{ item }">{{ item.ALIMENTACAO }}</template>
      <template v-slot:item.DESCANSO="{ item }">{{ item.DESCANSO }}</template>
      <template v-slot:item.PADRAO="{ item }">{{ item.PADRAO }}</template>
      <template v-slot:item.SISTEMA="{ item }">{{ item.SISTEMA }}</template>
      <template v-slot:item.FEEDBACK="{ item }">{{ item.FEEDBACK }}</template>
      <template v-slot:item.SAUDE="{ item }">{{ item.SAUDE }}</template>
      <template v-slot:item.LABORAL="{ item }">{{ item.LABORAL }}</template>
      <template v-slot:item.TREINAMENTO="{ item }">{{ item.TREINAMENTO }}</template>
    </v-data-table>
  </v-card>
</template>
<script>
  import config from '../../../../core/config.js'
  import GetNetConfigTable from './config/net.config'
  import GetNeoEnergiaConfigTable from './config/neoenergia.config'
  import GetEnelConfigTable from './config/enel.config'
  export default {
    name: 'tabela-pausas',
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
      },
      produtoSelecionado: {
        type: String,
        default: 'COMBO'
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
        coordenadorFilter: ''
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
        // this.supervisorFilter = ''

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
      pausasConfig() {
        return this.$store.getters.pausasConfig
      }
    },
    methods: {
      replaceNulls(obj) {
        if (!obj) return
        const newObj = {}
        for (let key in obj) {
          if (obj[key] == null) {
            newObj[key] = '-'
          } else {
            newObj[key] = obj[key]
          }
        }
        return newObj
      },
      generateKey(item, index) {
        const uniqueKey = `${item}-${index}`
        return uniqueKey
      },
      onlyUnique(value, index, self) {
        return self.indexOf(value) === index
      },
      async loadBase() {
        this.loading = true
        await this.$api
          .get(`${config.baseUrl}${this.actionUrl}${this.dac}/${this.skill}`)
          .then(res => {
            let dados = res?.data
            dados = dados.map(this.replaceNulls.bind(this))
            this.base = dados
            this.loading = false
          })
      },
      getHeaders(pNumSuperior = 1) {
        switch (pNumSuperior) {
          case 1:
            this.colunaChave = 'COORDENADOR'
            break
          case 2:
            this.colunaChave = this.generateKey('SUPERVISOR', 'COORDENADOR')
            break
          case 3:
            this.colunaChave = this.generateKey('NOME', 'PRODUTO')
            break
          default:
            this.colunaChave = 'COORDENADOR'
        }

        const configMap = {
          COMBO: GetNetConfigTable,
          MTF: GetNetConfigTable,
          NEOENERGIA: GetNeoEnergiaConfigTable,
          ENEL: GetEnelConfigTable
        }

        const configFunc = configMap[this.produtoSelecionado] || GetNetConfigTable
        return configFunc(pNumSuperior, this.coordenadorFilter, this.supervisorFilter)
      }
    },
    watch: {
      pausasConfig: function () {
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
