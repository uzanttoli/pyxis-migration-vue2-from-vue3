<template>
  <div>
    <v-skeleton-loader
      v-if="loading"
      class="mx-auto rounded-xl"
      min-width="500"
      type="table-tbody"
    ></v-skeleton-loader>
    <v-data-table
      v-else
      :headers="getHeaders"
      :items="dados"
      class="elevation-1 rounded-xl text-no-wrap"
      :footer-props="footerProps"
      :items-per-page="5"
      :search="search"
      multi-sort
    >
      <template v-slot:top>
        <v-toolbar flat class="rounded-t-xl">
          <v-spacer></v-spacer>
          <div style="width: 300px">
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Buscar"
              outlined
              dense
              single-line
              hide-details
            ></v-text-field>
          </div>
          <download-excel
            :data="dados"
            :name="`PYXIS_DESC_CHAMADAS_${indexDown[numSuperior]}`"
            :worksheet="`PYXIS_DESC_CHAMADAS_${indexDown[numSuperior]}`"
          >
            <v-tooltip bottom>
              <template v-slot:activator="{ attrs, on }">
                <v-btn icon v-bind="attrs" v-on="on">
                  <v-icon>fa-solid fa-file-arrow-down</v-icon>
                </v-btn>
              </template>
              <span>Baixar</span>
            </v-tooltip>
          </download-excel>
        </v-toolbar>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import { DesconexaoChamadas } from '../../../data/services/desconexaoChamadas/DesconexaoChamadas'
  export default {
    name: 'data-table',
    props: {
      action: {
        type: Boolean,
        default: false
      },
      api: {
        type: String,
        required: true
      },
      numSuperior: {
        type: [String, Number]
      },
      objectParams: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      indexDown: {
        1: 'COORDENADOR',
        2: 'SUPERVISOR',
        3: 'OPERADOR'
      },
      search: '',
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      },
      dados: [],
      coordenadorFilter: '',
      supervisorFilter: '',
      loading: false
    }),
    computed: {
      getHeaders() {
        let data = this.dados[0]
        if (!data) return []
        let headers = Object.keys(data).map(item => {
          return {
            text: item,
            value: item,
            class: '',
            align: 'center'
          }
        })

        return headers
      },
      listaCoordenadores() {
        let result = this.dados.map(item => {
          return item.Coordenador
        })
        result.push('')
        return result
      },
      listaSupervisores() {
        let result = this.dados
          .filter(item => {
            if (item.Coordenador == this.coordenadorFilter) {
              return item.Supervisor
            } else if (item.Coordenador == '') {
              return item.Supervisor
            }
          })
          .map(item => item.Supervisor)
        result.push('')
        return result
      }
    },
    methods: {
      async loadDataTable() {
        this.loading = true
        let res = await DesconexaoChamadas.loadDataTable(this.api, this.objectParams)
        this.dados = res
        this.loading = false
      }
    },
    async created() {
      await this.loadDataTable()
    },
    watch: {
      objectParams: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.loadDataTable()
        }
      }
    }
  }
</script>

<style></style>
