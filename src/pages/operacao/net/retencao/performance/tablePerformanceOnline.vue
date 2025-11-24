<template>
  <v-card elevation="1" class="rounded-xl">
    <v-col>
      <title-negative-margin :title="title" className="rounded-r-xl ml-n7"></title-negative-margin>
      <!-- <pre>{{ getHeaders(report, intervalos.length + 1, numSuperior) }}</pre> -->
      <v-data-table
        :headers="getHeaders(report, intervalos.length + 1, numSuperior)"
        class="text-no-wrap"
        dense
        multi-sort
        :items="base"
        :loading="loading"
        :search="search"
        loading-text="Carregando..."
        no-data-text="Dados não carregados..."
        :footer-props="footerProps"
      >
        <template v-slot:top v-if="withFilter">
          <v-container fluid>
            <v-row>
              <v-col class="px-1" v-if="numSuperior > 2" cols="3">
                <v-text-field
                  v-model="search"
                  type="text"
                  label="Nome"
                  class="rounded-lg"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col class="px-1" v-if="numSuperior >= 1" cols="3">
                <v-autocomplete
                  v-model="coordenadorFilter"
                  :items="listarCoordenadores"
                  type="text"
                  label="Coordenador"
                  class="rounded-lg"
                  no-data-text="Lista de coordenadores não carregada"
                  outlined
                  dense
                ></v-autocomplete>
              </v-col>
              <v-col class="px-1" v-if="numSuperior >= 2" cols="3">
                <v-autocomplete
                  v-model="supervisorFilter"
                  :items="listarSupervisores"
                  type="text"
                  label="Supervisor"
                  class="rounded-lg"
                  no-data-text="Lista de supervisores não carregada"
                  outlined
                  dense
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-container>
        </template>
        <template v-slot:header>
          <thead class="text-center">
            <tr>
              <th></th>
              <th class="text-center grey lighten-3" colspan="3">Total</th>
              <th
                colspan="3"
                v-for="(intervalo, i) in intervalos"
                :key="i"
                :class="[i % 2 ? 'text-center grey lighten-3' : 'text-center']"
              >
                {{ intervalo.INTERVALO }}
              </th>
              <th
                class="text-center grey lighten-3"
                v-if="numSuperior > 1"
                :colspan="[numSuperior == 3 ? 3 : 1]"
              >
                Gestores
              </th>
            </tr>
          </thead>
        </template>
      </v-data-table>
    </v-col>
  </v-card>
</template>

<script>
  import config from '../../../../../core/config'
  export default {
    props: {
      title: {
        type: String,
        default: 'Titulo'
      },
      report: {
        type: String,
        default: ''
      },
      numSuperior: {
        type: Number,
        default: 1
      },
      withFilter: {
        type: Boolean,
        default: true
      },
      intervalos: {
        type: Array,
        required: true
      },
      regional: {
        type: String,
        default: 'NET - RETENCAO_SUL 2_SP 3'
      },
      actionUrl: {
        type: String,
        required: true
      }
    },
    data: () => ({
      // intervalos: [
      //   { text: "11:00" },
      //   { text: "12:00" },
      //   { text: "13:00" },
      //   { text: "14:00" },
      //   { text: "15:00" },
      //   { text: "16:00" },
      //   { text: "17:00" },
      // ],
      base: [],
      search: null,
      loading: false,
      coordenadorFilter: null,
      supervisorFilter: null,
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      }
    }),
    computed: {
      listarCoordenadores() {
        let result = this.base
          .map(item => {
            return item.COORDENADOR
          })
          .filter(this.onlyUnique)
        result.push('')
        return result
      },
      listarSupervisores() {
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
      onlyUnique(value, index, self) {
        return self.indexOf(value) === index
      },
      loadBase() {
        this.loading = true
        let urlData = `${config.baseUrl}${this.actionUrl}`
        this.$api
          .get(urlData, {
            params: {
              regional: this.regional
            }
          })
          .then(res => {
            this.base = res.data
            this.loading = false
          })
      },
      getHeaders(reportType, repeat, pNumSuperior = 1) {
        let columnDefaultCoord = {
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

        let columnDefaultSuper = {
          text: 'Supervisor',
          align: 'center',
          value: 'SUPERVISOR',
          filter: value => {
            if (!this.supervisorFilter) {
              return true
            }
            return value == this.supervisorFilter
          }
        }

        let columnDefaultOper = {
          text: 'Operador',
          align: 'center',
          value: 'NOME_OPE'
        }

        let columnDefaultPerfomanceOs = [
          {
            text: 'Leads',
            align: 'center',
            type: 'LEADS_UNICOS_',
            class: null,
            value: null
          },
          {
            text: 'Desconexões',
            align: 'center',
            type: 'DESCONEXAO_',
            class: null,
            value: null
          },
          {
            text: '(%) Performance',
            align: 'center',
            type: 'PERC_PERFORMANCE_OS_',
            class: null,
            value: null
          }
        ]

        let columnDefaultDescCham = [
          {
            text: 'Chamadas',
            align: 'center',
            type: 'CHAMADAS_',
            class: null,
            value: null
          },
          {
            text: 'Desconexões',
            align: 'center',
            type: 'DESCONEXAO_',
            class: null,
            value: null
          },
          {
            text: '(%) Desc/Chamadas',
            align: 'center',
            type: 'PERC_DESC_CHAMADAS_',
            class: null,
            value: null
          }
        ]

        let arrHeaders = []

        if (reportType == 'performance os') {
          if (pNumSuperior == 1) {
            arrHeaders.unshift(columnDefaultCoord)
          } else if (pNumSuperior == 2) {
            arrHeaders.push(columnDefaultSuper)
          } else {
            arrHeaders.unshift(columnDefaultOper)
          }

          for (let i = 0; i < repeat; i++) {
            let className = i % 2 ? null : 'grey lighten-3'

            for (let j = 0; j < columnDefaultPerfomanceOs.length; j++) {
              columnDefaultPerfomanceOs[j].class = className
              if (columnDefaultPerfomanceOs[j].type) {
                columnDefaultPerfomanceOs[j].value = columnDefaultPerfomanceOs[j].type + i
              }
              arrHeaders.push({ ...columnDefaultPerfomanceOs[j] })
            }
          }
          if (pNumSuperior == 2) {
            arrHeaders.push(columnDefaultCoord)
          } else if (pNumSuperior == 3) {
            arrHeaders.push(columnDefaultSuper)
            arrHeaders.push(columnDefaultCoord)
          }
        } else if (reportType == 'desconexao chamada') {
          if (pNumSuperior == 1) {
            arrHeaders.unshift(columnDefaultCoord)
          } else if (pNumSuperior == 2) {
            arrHeaders.push(columnDefaultSuper)
          } else {
            arrHeaders.unshift(columnDefaultOper)
          }

          for (let i = 0; i < repeat; i++) {
            let className = i % 2 ? null : 'grey lighten-3'

            for (let j = 0; j < columnDefaultDescCham.length; j++) {
              columnDefaultDescCham[j].class = className
              if (columnDefaultDescCham[j].type) {
                columnDefaultDescCham[j].value = columnDefaultDescCham[j].type + i
              }
              arrHeaders.push({ ...columnDefaultDescCham[j] })
            }
          }
          if (pNumSuperior == 2) {
            arrHeaders.push(columnDefaultCoord)
          } else if (pNumSuperior == 3) {
            arrHeaders.push(columnDefaultSuper)
            arrHeaders.push(columnDefaultCoord)
          }
        }
        return arrHeaders
      }
    },
    created() {
      this.loadBase()
    },
    watch: {
      regional: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.loadBase()
        }
      }
    }
  }
</script>

<style></style>
