<template>
  <v-row v-if="base != ''">
    <v-col>
      <v-card elevation="1" class="rounded-xl">
        <title-negative-margin title="Tratamento Online" className="rounded-r-xl">
          <template v-slot:button>
            <download-excel :data="base" :name="nameTratado" :worksheet="nameTratado">
              <v-btn fab x-small class="mr-1" elevation="1">
                <v-icon class="blue--text">fa-solid fa-file-arrow-down</v-icon>
              </v-btn>
            </download-excel>
          </template>
          <v-col cols="2" class="my-0 py-0">
            <v-text-field
              dense
              outlined
              class="rounded-bl-xl rounded-r-xl"
              v-model="search"
              placeholder="Procure aqui..."
              label="Pesquisa rápida"
            ></v-text-field>
          </v-col>
        </title-negative-margin>
        <v-data-table
          :search="search"
          :headers="getheaders"
          multi-sort
          dense
          class="text-no-wrap"
          no-data-text="Não há informações"
          :items="base"
          :loading="loading"
          :footer-props="footerProps"
          :item-class="getClass"
          loading-text="Carregando..."
        >
          <template v-slot:item.Situacao_do_Agente_(Ponto)="{ item }">
            <v-chip
              id="chip-test"
              small
              :class="validateStatusLog(item['Situacao_do_Agente_(Ponto)'], 'Situacao_do_Agente')"
              label
            >
              <div style="width: 105px">
                <v-tooltip bottom>
                  <template v-slot:activator="{ attrs, on }">
                    <p
                      v-bind="attrs"
                      v-on="on"
                      class="pa-0 ma-0"
                      style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                    >
                      {{ item['Situacao_do_Agente_(Ponto)'] }}
                    </p>
                  </template>
                  <span>{{ item['Situacao_do_Agente_(Ponto)'] }}</span>
                </v-tooltip>
              </div>
            </v-chip>
          </template>
          <template v-slot:item.Status_Pyxis="{ item }">
            <v-chip small :class="validateStatusLog(item.Status_Pyxis, 'Status_do_Agente')" label>
              <div style="width: 105px">
                <v-tooltip bottom>
                  <template v-slot:activator="{ attrs, on }">
                    <p
                      class="pa-0 ma-0"
                      style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                      v-bind="attrs"
                      v-on="on"
                    >
                      {{ item.Status_Pyxis }}
                    </p>
                  </template>
                  <span>{{ item.Status_Pyxis }}</span>
                </v-tooltip>
              </div>
            </v-chip>
          </template>
          <template v-slot:item.Motivo_Pausa="{ item }">
            <v-chip small :class="validateStatusLog(item.Motivo_Pausa, 'Motivo_Pausa')" label>
              <div style="display: flex; align-items: center; width: 105px">
                <i
                  :class="item.Motivo_Pausa == 'PADRÃO' ? 'orange--text' : ''"
                  class="fa-solid fa-clock mr-2 white--text"
                  v-if="item.Motivo_Pausa != '-'"
                ></i>
                <v-tooltip bottom>
                  <template v-slot:activator="{ attrs, on }">
                    <p
                      v-bind="attrs"
                      v-on="on"
                      class="pa-0 ma-0 white--text"
                      style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                    >
                      {{ item.Motivo_Pausa }}
                    </p>
                  </template>
                  <span>{{ item.Motivo_Pausa }}</span>
                </v-tooltip>
              </div>
            </v-chip>
          </template>
          <template v-slot:item.Tempo_do_Status="{ item }">
            <v-chip small label>
              <div style="width: 105px">
                <p
                  class="pa-0 ma-0"
                  style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                >
                  <strong v-if="item.Status_Pyxis != 'OFFLINE' && item.Status_Pyxis != 'PAUSA'">
                    <TimeDiffVue :lastUpdated="normalizeData(item['Última Tratativa'])" />
                  </strong>
                  <strong v-else>-</strong>
                </p>
              </div>
            </v-chip>
          </template>
          <template v-slot:item.Tempo_Pausa="{ item }">
            <v-chip small label>
              <div style="width: 105px">
                <p
                  class="pa-0 ma-0"
                  style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                >
                  <v-tooltip bottom>
                    <template v-slot:activator="{ attrs, on }">
                      <strong v-bind="attrs" v-on="on">
                        <TimeDiffVue :lastUpdated="item.Tempo_Pausa" />
                        <!-- {{item.Tempo_Pausa}} -->
                      </strong>
                    </template>
                    <span>Pode haver um delay de até 5 min</span>
                  </v-tooltip>
                </p>
              </div>
            </v-chip>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import config from '../../../../core/config'
  import TimeDiffVue from './TimeDiff.vue'
  export default {
    components: {
      TimeDiffVue
    },
    props: {
      produto: {
        type: String,
        default: 'COMBO BKO'
      }
    },
    data() {
      return {
        search: '',
        footerProps: {
          itemsPerPageText: 'Itens por página:',
          pageText: '{0}-{1} de {2}',
          perPageText: 'Itens por página:'
        },
        base: [],
        loading: false,
        interval: null
      }
    },
    computed: {
      nameTratado() {
        this.moment.locale('pt-br')
        let data = this.moment().format('DDMMYYYY_HHmm')
        return `${this.produto}_PYXIS_TRATAMENTO_ONLINE_${data}_BKO`
      },
      getheaders() {
        let headers = this.base[0]
        if (!headers) return
        let newHeaders = Object.keys(headers).map(item => {
          return {
            text: this.normalizeString(item),
            value: item,
            align: 'center',
            class: 'grey lighten-2'
          }
        })
        return newHeaders
      }
    },
    methods: {
      normalizeData(string) {
        if (!string) return
        let data = string.split(' ')
        return `${data[0].split('/').reverse().join('-') + ' ' + data[1]}`
        // this.moment.locale("pt-br");
        // let data = this.moment(string).format("YYYY-MMMM-DD HH:mm:ss");
        // return string.split("/").reverse().join("-");
      },
      normalizeString(string) {
        if (!string) return
        return string.replaceAll('_', ' ')
      },
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
      validateStatusLog(string, tipo) {
        if (!string) return
        // let status = ["DESLOGADO"];
        if (tipo == 'Situacao_do_Agente') {
          if (string == 'DESLOGADO') {
            return 'error'
          } else if (string == 'LOGADO') {
            return 'success'
          } else {
            return 'yellow accent-2'
          }
        } else if (tipo == 'Status_do_Agente') {
          if (string == 'DISPONIVEL') {
            return 'error'
          } else if (string == 'OFFLINE' || string == 'NÃO LOGOU') {
            return 'blue-grey darken-1 white--text'
          } else if (string == 'TRATANDO') {
            return 'success'
          } else {
            return 'yellow accent-2'
          }
        } else if (tipo == 'Motivo_Pausa') {
          return 'blue-grey lighten-1 white--text'
        }
      },
      getClass(item) {
        if (item['Situacao_do_Agente_(Ponto)'] == 'LOGADO' && item.Status_Pyxis == 'DISPONIVEL') {
          return 'amber lighten-5'
        }
      },
      loadBase() {
        if (!this.produto) return
        this.loading = true
        let urlData = `${config.baseUrl}api/shared/backoffice/gerencial/tratamento_online/${this.produto}`
        this.$api.get(urlData).then(res => {
          let dados = res?.data
          dados = dados.map(this.replaceNulls.bind(this))
          this.base = dados
          // this.base.map(this.replaceNulls.bind(this));
          this.loading = false
        })
      }
    },
    watch: {
      produto: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.loadBase()
        }
      }
    },
    created() {
      this.loadBase()
      this.interval = setInterval(() => {
        this.loadBase()
      }, 60000) // em milisegundos
    },
    beforeUnmount: function () {
      clearInterval(this.interval)
    }
  }
</script>

<style scoped>
  #chip-test {
    background-color: red;
  }
</style>
