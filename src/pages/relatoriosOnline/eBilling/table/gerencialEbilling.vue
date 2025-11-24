<template>
  <v-card>
    <title-negative-margin :title="title" :icon="titleIcon"></title-negative-margin>
    <v-data-table
      dense
      multi-sort
      :fixed-header="true"
      :headers="getHeaders(numSuperior)"
      :items-per-page="15"
      no-data-text="Não há dados no momento!"
      :loading="loading"
      class="text-no-wrap"
      :item-key="colunaChave"
      loading-text="Carregando... Por favor Aguarde!"
      :search="search"
      :items="base"
    >
      <template v-slot:top>
        <v-container fluid>
          <v-row>
            <v-col v-if="numSuperior > 2" :cols="numSuperior > 2 ? 3 : 4">
              <v-row class="pa-6">
                <v-text-field v-model="search" type="text" label="Nome"></v-text-field>
              </v-row>
            </v-col>

            <v-col v-if="numSuperior >= 1" :cols="numSuperior >= 1 ? 3 : 4">
              <v-row class="pa-6">
                <v-select
                  :items="listaCoordenadores"
                  v-model="coordenadorFilter"
                  label="Coordenador"
                ></v-select>
              </v-row>
            </v-col>

            <v-col v-if="numSuperior >= 2" :cols="numSuperior >= 2 ? 3 : 4">
              <v-row class="pa-6">
                <v-select
                  :items="listaSupervisores"
                  v-model="supervisorFilter"
                  label="Supervisor"
                ></v-select>
              </v-row>
            </v-col>
            <v-col :cols="numSuperior > 2 ? 3 : 3">
              <v-row class="pa-6">
                <v-select
                  label="Data"
                  v-model="dataSelecionada"
                  :items="datasTabulacoes"
                  item-text="DATA"
                  item-value="DATA"
                ></v-select>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:item.PERC_E_BILLING="{ item }">
        {{ item.PERC_E_BILLING | convertPercent }}
      </template>
      <template v-slot:item.PERC_TABULACAO="{ item }">
        {{ item.PERC_TABULACAO | convertPercent }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import config from '../../../../core/config.js'
  export default {
    name: 'tabela-gerencial-ebilling',
    props: {
      title: {
        type: String,
        default: 'E-billing'
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
      agrupamento: {
        type: String,
        default: 'MASSIVO GO'
      },
      tipoSolicitacao: {
        type: String,
        default: 'FATURA DIGITAL'
      }
    },
    data: () => ({
      supervisorFilter: '',
      coordenadorFilter: '',
      base: [],
      search: '',
      loading: false,
      dataSelecionada: 'CONSOLIDADO',
      colunaChave: 'COORDENADOR',
      datasTabulacoes: []
    }),
    computed: {
      listaCoordenadores() {
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
    filters: {
      convertPercent(value) {
        return (value * 100).toFixed(2).concat('%')
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
      getHeaders(pNumSuperior = 1) {
        let headerCoordenador = {
          text: 'Coordenador',
          align: 'center',
          value: 'COORDENADOR',
          filter: value => {
            if (!this.coordenadorFilter) {
              return true
            } else {
              return value == this.coordenadorFilter
            }
          }
        }

        let headerSupervisor = {
          text: 'Supervisor',
          align: 'center',
          value: 'SUPERVISOR',
          filter: value => {
            if (!this.supervisorFilter) {
              return true
            } else {
              return value == this.supervisorFilter
            }
          }
        }

        let headerOperadorAlmope = {
          text: 'Almope',
          align: 'center',
          value: 'ALMOPE'
        }

        let headerOperadorNome = {
          text: 'Nome',
          align: 'center',
          value: 'NOME'
        }

        let arrHeaders = [
          {
            text: 'Dx de Atendimento',
            align: 'center',
            value: 'SKILL'
          },

          {
            text: 'Atendidas',
            align: 'center',
            value: 'CHAMADAS_AT'
          },
          {
            text: '(%) Tabulação',
            align: 'center',
            value: 'PERC_TABULACAO'
          },
          {
            text: 'Ebilling',
            align: 'center',
            value: 'E_BILLING'
          },
          {
            text: '(%) Ebilling',
            align: 'center',
            value: 'PERC_E_BILLING'
          },
          {
            text: 'Operador Zerados',
            align: 'center',
            value: 'OP_ZERADOS'
          }
        ]

        if (pNumSuperior == 1) {
          this.colunaChave = this.generateKey('COORDENADOR', '1')
          arrHeaders.unshift(headerCoordenador)
        } else if (pNumSuperior == 2) {
          this.colunaChave = this.generateKey('SUPERVISOR', '2')
          arrHeaders.unshift(headerSupervisor)
          arrHeaders.push(headerCoordenador)
        } else if (pNumSuperior == 3) {
          this.colunaChave = this.generateKey('NOME', '3')
          arrHeaders.unshift(headerCoordenador)
          arrHeaders.unshift(headerSupervisor)
          arrHeaders.unshift(headerOperadorNome)
          arrHeaders.unshift(headerOperadorAlmope)
        }

        return arrHeaders
      },
      async loadBaseEbilling() {
        let tipo = this.dataSelecionada
        let validacao = tipo == 'CONSOLIDADO' ? 2 : 1
        let urlData = `${config.baseUrl}${this.actionUrl}${validacao}/${tipo}/${this.agrupamento}/${this.tipoSolicitacao}`
        var res = await this.$api.get(urlData)
        this.base = res.data
      },
      loadDatas() {
        let urlData = `${config.baseUrl}api/shared/ebilling/datas_tabulacao`
        this.$api.get(urlData).then(res => {
          this.datasTabulacoes = res.data
        })
      }
    },
    watch: {
      dataSelecionada() {
        this.loadBaseEbilling()
      },
      agrupamento() {
        this.loadBaseEbilling()
        this.loadDatas()
      },
      tipoSolicitacao() {
        this.loadBaseEbilling()
        this.loadDatas()
      }
    },
    created() {
      this.loadBaseEbilling()
      this.loadDatas()
    }
  }
</script>

<style></style>
