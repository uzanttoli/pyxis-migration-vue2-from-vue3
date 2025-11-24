<template>
  <v-row>
    <!-- <pre>{{base}}</pre> -->
    <v-col>
      <v-card elevation="1" class="rounded-xl">
        <title-negative-margin title="Casos Histórico Ações" className="rounded-r-xl">
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
          :headers="getheaders"
          dense
          :search="search"
          :loading="loading"
          no-results-text="Nada encontrado!"
          class="text-no-wrap"
          :footer-props="footerProps"
          :items="base"
          v-model:items-per-page="pagination.limit"
          v-model:page="pagination.page"
          :server-items-length="pagination.total"
          @update:page="fetchData"
          @update:items-per-page="fetchData"
        ></v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import CasosHistoricoAcoesService from '../../../../../data/services/bko/claro/CasosHistoricoAcoesService'
  import normalizeStringMixin from '../../../../../mixins/normalizeStringMixin'
  export default {
    name: 'CasosHistoricoAcoes',
    mixins: [normalizeStringMixin],
    props: {
      produto: {
        type: String,
        default: 'CLARO BKO'
      }
    },
    data() {
      return {
        search: '',
        footerProps: {
          itemsPerPageOptions: [15, 50, 100, { text: 'Todos', value: -1 }],
          itemsPerPageText: 'Itens por página:',
          pageText: '{0}-{1} de {2}',
          perPageText: 'Itens por página:'
        },
        loading: false,
        base: [],
        pagination: {
          limit: 15,
          page: 1,
          total: 0
        }
      }
    },
    computed: {
      nameTratado() {
        this.moment.locale('pt-br')
        let data = this.moment().format('DDMMYYYY_HHmm')
        return `${this.produto}_PYXIS_CASOS_HISTORIO_ACOES_${data}`
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
      async fetchData() {
        if (!this.produto) return
        this.loading = true
        try {
          let response = await CasosHistoricoAcoesService.getAll(
            this.pagination.page,
            this.pagination.limit
          )
          this.pagination.total = response.total
          this.base = response.data.map(this.replaceNulls.bind(this))
        } catch (e) {
          console.error('Erro ao obter dados do histórico', e)
        } finally {
          this.loading = false
        }
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
      }
    },
    async created() {
      await this.fetchData()
    },
    watch: {
      produto: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.fetchData()
        }
      }
    }
  }
</script>

<style scoped></style>
