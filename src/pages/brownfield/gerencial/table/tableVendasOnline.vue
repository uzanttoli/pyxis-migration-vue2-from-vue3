<template>
  <v-card elevation="0" class="table">
    <v-card-title class="title">
      <v-icon class="mr-2">{{ titleIcon }}</v-icon>
      {{ title }}
      <v-spacer></v-spacer>
      <!-- <download-excel
        :data="dadosDownload"
        name="BASE_VENDAS_OPERADOR_BROWN"
        worksheet="BASE_VENDAS_OPERADOR_BROWN"
        v-if="title == 'Operador'"
      >
        <v-btn depressed color="success" class="rounded-bl-xl rounded-r-xl">
          <v-icon small class="mr-2">fa-solid fa-file-excel</v-icon> Baixar
        </v-btn>
      </download-excel> -->
    </v-card-title>
    <v-data-table
      dense
      multi-sort
      :fixed-header="true"
      :item-key="colunaChave"
      :items-per-page="10"
      :search="searchNome"
      :loading="loading"
      :items="base"
      :headers="getHeaders(numSuperior)"
      :footer-props="footerProps"
      class="text-no-wrap mx-4"
      no-results-text="Nada encontrado..."
      no-data-text="Não há dados de vendas no momento!"
      loading-text="Carregando... Por favor aguarde!"
    >
      <template v-slot:top>
        <v-container fluid>
          <v-row>
            <v-col v-if="numSuperior >= 1" :cols="numSuperior == 1 ? 3 : 3">
              <v-row class="pa-6">
                <v-select
                  label="Coordenador"
                  v-model="coordenadorFilter"
                  :items="listaCoordenadores"
                  class="rounded-r-xl rounded-bl-xl"
                  outlined
                  dense
                ></v-select>
              </v-row>
            </v-col>
            <v-col v-if="numSuperior >= 2" :cols="numSuperior == 2 ? 3 : 3">
              <v-row class="pa-6">
                <v-select
                  label="Supervisor"
                  v-model="supervisorFilter"
                  :items="listaSupervisores"
                  class="rounded-r-xl rounded-bl-xl"
                  outlined
                  dense
                ></v-select>
              </v-row>
            </v-col>
            <v-col cols="4" v-if="numSuperior > 2">
              <v-row class="pa-6">
                <v-text-field
                  v-model="searchNome"
                  append-icon="mdi-magnify"
                  label="Outros"
                  single-line
                  hide-details
                  class="rounded-r-xl rounded-bl-xl"
                  outlined
                  dense
                ></v-text-field>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import config from '@/core/config'
  import alerts from '../../../../mixins/alerts.mixins'
  // import downloadExcel from 'vue-json-excel';
  export default {
    // components: { downloadExcel },
    props: {
      title: {
        type: String,
        default: ''
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
      }
    },
    mixins: [alerts],
    data: () => ({
      loading: false,
      searchNome: '',
      countInterval: 0,
      colunaChave: 'COORDENADOR',
      base: [],
      supervisorFilter: '',
      coordenadorFilter: '',
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      }
    }),
    computed: {
      dadosDownload() {
        let nome = this.$store.getters.usuario.nome
        let base = this.base
        if (this.$store.getters.usuario.filtro == 'SUPERVISOR') {
          return base.filter(item => {
            return item.SUPERVISOR == nome
          })
        } else if (this.$store.getters.usuario.filtro == 'COORDENADOR') {
          return base.filter(item => {
            return item.COORDENADOR == nome
          })
        } else {
          return base
        }
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
      listaCoordenadores() {
        let result = this.base
          .map(item => {
            return item.COORDENADOR
          })
          .filter(this.onlyUnique)
        result.push('')
        return result
      }
    },
    filters: {
      percentual: function (value) {
        if (!value) return '0,00%'

        return (value * 100).toFixed(2).concat('%')
      }
    },
    methods: {
      onlyUnique(value, index, self) {
        return self.indexOf(value) === index
      },
      async loadBase() {
        try {
          this.loading = true
          let urlData = `${config.baseUrl}${this.actionUrl}`
          urlData = this.replaceUrlMultiParamSeparator(urlData)
          var res = await this.$api.get(urlData)
          this.base = res.data
          this.loading = false
        } catch (e) {
          this.toast('Dados não foram carregados!', 'bottom-end', false, 5000, 'error')
          return (this.base = []), (this.loading = false)
        }
      },
      getHeaders(pNumSuperior = 1) {
        let headerCoordenador = {
          text: 'Coordenador',
          align: 'center',
          value: 'COORDENADOR',
          class: 'light-blue darken-1 white--text',
          filter: value => {
            if (!this.coordenadorFilter) {
              return true
            }
            return value == this.coordenadorFilter
          }
        }
        let headerSupervisor = {
          text: 'Supervisor',
          align: 'center',
          value: 'SUPERVISOR',
          class: 'light-blue darken-1 white--text',
          filter: value => {
            if (!this.supervisorFilter) {
              return true
            }
            return value == this.supervisorFilter
          }
        }
        let headerAlmope = {
          text: 'Almope',
          align: 'center',
          value: 'LOGIN_ALMOPE',
          class: 'light-blue darken-1 white--text'
        }
        let headerOperador = {
          text: 'Operador',
          align: 'center',
          value: 'NOME_OPE',
          class: 'light-blue darken-1 white--text'
        }

        let arrheaders = [
          {
            text: 'Atendidas',
            align: 'center',
            value: 'ATENDIDAS',
            class: 'light-blue darken-1 white--text'
          },
          {
            text: 'TMT',
            align: 'center',
            value: 'TMT',
            class: 'light-blue darken-1 white--text'
          },
          {
            text: 'Recham. 60min',
            align: 'center',
            value: 'PERC_RECHAM_60',
            class: 'light-blue darken-1 white--text'
          },
          {
            text: 'Recham. Dia',
            align: 'center',
            value: 'PERC_RECHAM_DIA',
            class: 'light-blue darken-1 white--text'
          },
          {
            text: 'Vendas',
            align: 'center',
            value: 'VENDAS',
            class: 'light-blue darken-1 white--text'
          },
          {
            text: '(%) Conversão',
            align: 'center',
            value: 'PERC_CONVERSAO',
            class: 'light-blue darken-1 white--text'
          }
          // {
          //   text: "Ope. Zerados",
          //   align: "center",
          //   value: "QTD. OPE. NÃO VENDA",
          // },
        ]

        if (pNumSuperior == 1) {
          ;(this.colunaChave = 'COORDENADOR'), arrheaders.unshift(headerCoordenador)
        } else if (pNumSuperior == 2) {
          ;(this.colunaChave = 'SUPERVISOR'), arrheaders.unshift(headerCoordenador)
          arrheaders.unshift(headerSupervisor)
        } else {
          this.colunaChave = 'OPERADOR'
          arrheaders.unshift(headerCoordenador)
          arrheaders.unshift(headerSupervisor)
          arrheaders.unshift(headerOperador)
          arrheaders.unshift(headerAlmope)
        }

        return arrheaders
      }
    },
    created() {
      this.loadBase()
    }
  }
</script>

<style scoped>
  .title {
    font-size: 18px;
    font-weight: bold;
    color: #3e3d3d;
  }
  .cor-padrao {
    background-image: linear-gradient(260deg, rgb(0, 236, 255), #8f0e8f);
  }

  .table {
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    transition: all 0.2s ease-in-out;
  }
  .table:hover {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
    transform: translateY(-4px);
  }
</style>
