<template>
  <v-card>
    <title-negative-margin
      :title="title"
      icon="fa-solid fa-chart-simple"
      className="rounded-r-xl"
    ></title-negative-margin>

    <v-data-table
      dense
      multi-sort
      :fixed-header="true"
      class="text-no-wrap"
      :item-key="colunaChave"
      :loading="loading"
      loading-text="Carregando..."
      no-data-text="Não há dados..."
      :headers="getHeaders(numSuperior)"
      :items="base"
      :items-per-page="15"
      :search="search"
      no-results-text="Não foram encontrados dados..."
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

      <template v-slot:item.P_INADERENCIA="{ item }">
        {{ item.P_INADERENCIA | formatarPercent }}
      </template>
      <template v-slot:item.P_ANTES="{ item }">
        {{ item.P_ANTES | formatarPercent }}
      </template>
      <template v-slot:item.P_DEPOIS="{ item }">
        {{ item.P_DEPOIS | formatarPercent }}
      </template>
      <template v-slot:item.P_ABS="{ item }">
        {{ item.P_ABS | formatarPercent }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import config from '../../../../core/config'
  export default {
    name: 'tabela-inaderencia',
    props: {
      skill: {
        type: String,
        default: 'NET E2E'
      },
      title: {
        type: String,
        default: 'Mês'
      },
      actionUrl: {
        type: String,
        required: true
      },
      numSuperior: {
        type: Number,
        default: 1
      },
      dac: {
        type: String,
        default: '2'
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
          url: '/InaderenciaAjax',
          config: {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
          }
        }
      }
    },
    filters: {
      formatarPercent(value) {
        return (value * 100).toFixed(2).concat('%')
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
      inaderenciaConfig() {
        return this.$store.getters.inaderenciaConfig
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
        await this.$api
          .get(`${config.baseUrl}${this.actionUrl}${this.skill}/${this.dac}`)
          .then(res => {
            this.base = res.data
            // if(res.data == '' || res.data == null || res.data == []){
            //   this.$emit("update:notFound")
            // }
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
          value: 'OPERADOR',
          class: ''
        }

        let arrHeaders = [
          {
            text: 'Escalados',
            align: 'center',
            sortable: true,
            value: 'ESCALADOS',
            class: ''
          },
          {
            text: 'Abs',
            align: 'center',
            sortable: true,
            value: 'ABS',
            class: ''
          },
          {
            text: '(%) Abs',
            align: 'center',
            sortable: true,
            value: 'P_ABS',
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
            text: '(%)Inaderência',
            align: 'center',
            sortable: true,
            value: 'P_INADERENCIA',
            class: ''
          },
          {
            text: 'Antes',
            align: 'center',
            sortable: true,
            value: 'ANTES',
            class: ''
          },
          {
            text: '(%)Antes',
            align: 'center',
            sortable: true,
            value: 'P_ANTES',
            class: ''
          },
          {
            text: 'Depois',
            align: 'center',
            sortable: true,
            value: 'DEPOIS',
            class: ''
          },
          {
            text: '(%)Depois',
            align: 'center',
            sortable: true,
            value: 'P_DEPOIS',
            class: ''
          },
          {
            text: 'Tempo Medio de Inaderencia',
            align: 'center',
            sortable: true,
            value: 'TEMPO_INADERENCIA',
            class: ''
          }
        ]

        let arrHeadersOper = [
          {
            text: 'Escalados',
            align: 'center',
            sortable: true,
            value: 'ESCALADOS',
            class: ''
          },
          {
            text: 'Abs',
            align: 'center',
            sortable: true,
            value: 'ABS',
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
            text: 'Antes',
            align: 'center',
            sortable: true,
            value: 'INAD_ANTES',
            class: ''
          },
          {
            text: 'Depois',
            align: 'center',
            sortable: true,
            value: 'INAD_DEPOIS',
            class: ''
          },
          {
            text: 'Tempo de Inaderencia',
            align: 'center',
            sortable: true,
            value: 'TEMPO_INADERENCIA',
            class: ''
          },
          {
            text: 'Início Escala',
            align: 'center',
            sortable: true,
            value: 'INICIO_TURNO',
            class: ''
          },
          {
            text: 'Horario Login',
            align: 'center',
            sortable: true,
            value: 'LOGIN',
            class: ''
          }
          // {
          //   text: "Status",
          //   align: "center",
          //   sortable: true,
          //   value: "STATUS",
          //   class: "",
          // },
        ]

        if (pNumSuperior == 1) {
          this.colunaChave = 'COORDENADOR'
          arrHeaders.unshift(hCoord)
        } else if (pNumSuperior == 2) {
          this.colunaChave = this.generateKey('SUPERVISOR', 'COORDENADOR')
          arrHeaders.unshift(hSup)
          arrHeaders.push(hCoord)
        } else if (pNumSuperior == 3) {
          this.colunaChave = 'NOME'
          arrHeadersOper.unshift(hOper)
          arrHeadersOper.push(hSup)
          arrHeadersOper.push(hCoord)

          arrHeaders = arrHeadersOper
        }

        return arrHeaders
      }
    },

    watch: {
      inaderenciaConfig: function () {
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
