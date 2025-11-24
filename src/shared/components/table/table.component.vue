<template>
  <v-col>
    <v-card class="mx-auto pa-5 pb-2 rounded-xl" elevation="1">
      <div style="display: flex; flex-direction: row; justify-content: space-between">
        <div>
          <p class="text-caption text-lg-h6 font-weight-medium">
            {{ title }}
            <template>
              <v-progress-circular
                color="green"
                :size="20"
                :value="countInterval"
              ></v-progress-circular>
            </template>
          </p>
        </div>
        <div>
          <v-card-title class="pa-0 ma-0">
            <v-text-field
              outlined
              dense
              label="Pesquisar"
              v-model="search"
              class="rounded-bl-xl rounded-r-xl"
            ></v-text-field>
          </v-card-title>
        </div>
      </div>

      <v-data-table
        :loading="loading"
        no-data-text="Não há dados no momento"
        class="text-no-wrap"
        dense
        :headers="getHeaders()"
        :items="bases"
        hide-default-footer
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        no-results-text="Nada encontrado..."
        :search="search"
        loading-text="Carregando...Por favor aguarde!"
        loader-height="2"
      >
        <template v-slot:[`item.${ALERTA}`]="{ item }">
          <!--Retirar Inicio-->
          <v-chip class="ma-1" :color="item.ALERTA == 1 ? 'orange' : 'green'" label outlined dense>
            {{ item.ALERTA == 1 ? 'Atenção' : 'Pendente' }}
          </v-chip>
        </template>
        <!--Retirar Fim-->
        <template v-slot:footer v-if="isFooter">
          <v-row class="mt-2 mb-2" align="center" justify="center">
            <span class="mr-4 grey--text">Pág. {{ page }} de {{ numberOfPages }}</span>
            <v-btn fab color="primary" class="mr-1" small @click="formerPage" :disabled="page == 1">
              <v-icon small>fa-solid fa-arrow-left</v-icon>
            </v-btn>
            <v-btn
              fab
              color="primary"
              class="ml-1"
              small
              @click="nextPage"
              :disabled="numberOfPages == 0 || page == numberOfPages"
            >
              <v-icon small>fa-solid fa-arrow-right</v-icon>
            </v-btn>
          </v-row>
        </template>
      </v-data-table>
    </v-card>
  </v-col>
</template>

<script>
  import config from '../../../core/config'
  export default {
    name: 'tabela-dinamica',
    props: {
      title: {
        type: String,
        default: 'Insira um tituto'
      },
      dadosHeaders: {
        type: [Array],
        require: true
      },
      headersCustom: {
        type: Boolean,
        default: false
        //**Para casos com header personalizados é necessario que o objeto seja {textCustom: NomePersonalizado, column: "nomeColuna" } */
      },
      isFooter: {
        type: Boolean,
        default: false
      },
      apiUrl: {
        type: String,
        require: true
      },
      sortable: {
        type: Boolean,
        default: false
      },
      teste: {
        type: String,
        default: 'ALERTA'
      }
    },
    data: () => ({
      countInterval: 0,
      interval: null,
      page: 1,
      itemsPerPage: 10,
      bases: [],
      search: null,
      loading: false
    }),
    computed: {
      numberOfPages() {
        return Math.ceil(this.bases?.length / this.itemsPerPage)
      }
    },
    methods: {
      loadBases() {
        this.loading = true
        let urlBase = `${config.baseUrl}${this.apiUrl}`
        this.$api.get(urlBase).then(res => {
          let base = res.data
          this.bases = base
          this.loading = false
        })
      },
      getHeaders() {
        if (typeof this.dadosHeaders != undefined) {
          let dados = this.dadosHeaders
          let arrHeaders = []
          if (this.headersCustom) {
            for (let i = 0; i < dados.length; i++) {
              arrHeaders.push({
                text: this.formatNameCaptalize(dados[i].textCustom),
                value: dados[i].column,
                align: 'center',
                sortable: this.sortable
              })
            }
            return arrHeaders
          } else {
            for (let i = 0; i < dados.length; i++) {
              let keys = Object.keys(dados[i])
              if (Object.values(dados[i]).length == 1 /* Array de Object */) {
                arrHeaders.push({
                  text: this.formatNameCaptalize(dados[i][keys]),
                  value: dados[i][keys],
                  align: 'center',
                  sortable: this.sortable
                })
              } else if (Object.values(dados[i]).length > 1 /* Array */) {
                arrHeaders.push({
                  text: this.formatNameCaptalize(dados[i]),
                  value: dados[i],
                  align: 'center',
                  sortable: this.sortable
                })
              }
            }
            return arrHeaders
          }
        }
      },
      formatNameCaptalize(text) {
        if (!text) return
        let textSeparator = text.split('_')
        if (textSeparator.length > 1) {
          return textSeparator
            .map(palavra => {
              let allMinus = palavra.toLowerCase()
              return allMinus[0].toUpperCase() + allMinus.substring(1)
            })
            .join(' ')
        } else {
          let allMinus = text.toLowerCase()
          return allMinus[0].toUpperCase() + allMinus.substring(1)
        }
      },
      arrDados() {
        return this.bases
      },
      nextPage() {
        if (this.page + 1 <= this.numberOfPages) this.page += 1
      },
      formerPage() {
        if (this.page - 1 >= 1) this.page -= 1
      }
    },
    created() {
      this.loadBases()
      this.interval = setInterval(() => {
        this.countInterval += 9.66
        if (this.countInterval >= 99.6) {
          this.loadBases()
          this.countInterval = 0
        }
      }, 6000)
    },
    beforeUnmount: function () {
      clearInterval(this.interval)
    }
  }
</script>

<style scoped></style>
