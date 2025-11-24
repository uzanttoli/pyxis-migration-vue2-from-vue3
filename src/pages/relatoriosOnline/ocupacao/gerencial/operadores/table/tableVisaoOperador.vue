<template>
  <v-card elevation="1" class="rounded-xl">
    <title-negative-margin
      :title="title"
      :icon="titleIcon"
      :progressVisible="false"
      :countIntervalProgress="countInterval"
      corProgress="white"
      className="rounded-r-xl"
    >
      <download-excel
        :data="base"
        :name="'BASE_OPERADOR_OCUPACAO'"
        :worksheet="'BASE_OPERADOR_OCUPACAO'"
      >
        <v-btn depressed color="success" class="rounded-bl-xl rounded-r-xl">
          <v-icon small class="mr-2">fa-solid fa-file-excel</v-icon>
          Baixar Dados
        </v-btn>
      </download-excel>
    </title-negative-margin>
    <v-data-table
      dense
      class="text-no-wrap"
      multi-sort
      :search="searchAvancado"
      :fixed-header="true"
      :item-key="colunaChave"
      :headers="getHeaders(numSuperior)"
      no-results-text="Não foi encontrado nenhuma informação com o filtro escolhido!"
      :items-per-page="15"
      :items="base"
      no-data-text="Não há dados no momento!"
      :loading="loading"
      loading-text="Carregando... Por favor aguardar!"
    >
      <template v-slot:top>
        <v-container fluid>
          <v-row>
            <v-col cols="4">
              <v-row class="pa-6">
                <v-text-field
                  v-model="searchAvancado"
                  append-icon="mdi-magnify"
                  label="Pesquisar"
                  single-line
                  hide-details
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
  import config from '../../../../../../core/config'
  export default {
    name: 'tabela-visao-operador',
    props: {
      title: {
        type: String,
        default: 'Visão Operador'
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
      indicador: {
        type: String,
        default: 'INDICADOR E ABS'
      },
      produtoAtual: {
        type: String
      }
    },
    data: () => ({
      base: [],
      itemsBase: [],
      searchAvancado: '',
      search: '',
      colunaChave: 'OPERADOR',
      countInterval: 0,
      interval: null,
      loading: false,
      operadorFilter: '',
      supervisorFilter: '',
      coordenadorFilter: ''
    }),
    computed: {
      baseTratada() {
        var base = this.base
        return base.forEach(this.replaceNulls)
      }
    },
    methods: {
      replaceNulls(obj) {
        for (let key in obj) {
          if (obj[key] === null) {
            obj[key] = '-'
          } else if (key == 'ABS CTI' || key == 'ABS Ponto') {
            if (obj[key] == 0) {
              obj[key] = 'NÃO'
            } else {
              obj[key] = 'SIM'
            }
          }
        }
      },
      downloadIsValid() {
        return this.coordenadorFilter
      },
      onlyUnique(value, index, self) {
        return self.indexOf(value) === index
      },
      getHeaders() {
        let outherColumns = this.base[0]
        if (!outherColumns) return []
        let itemIncludes = ['Almope', 'Nome', 'Supervisor', 'Coordenador']

        let headers = Object.keys(outherColumns).map(item => {
          return {
            text: item,
            class: itemIncludes.includes(item)
              ? 'cyan darken-3 white--text'
              : 'orange darken-2 white--text',
            align: 'center',
            value: item,
            sortable: true
          }
        })

        return headers
      },
      loadBase() {
        this.loading = true
        let urlData = `${config.baseUrl}${this.actionUrl}`
        urlData = this.replaceUrlMultiParamSeparator(urlData)
        this.$api
          .get(urlData, {
            params: {
              produto: this.produtoAtual
            }
          })
          .then(res => {
            this.base = res.data
            this.base.forEach(this.replaceNulls)

            this.loading = false
          })
      }
    },
    created() {
      this.loadBase()
    },
    beforeUnmount: function () {},
    watch: {
      produtoAtual: function (newValue, oldValue) {
        if (newValue != oldValue) {
          this.loadBase()
        }
      }
    }
  }
</script>

<style scoped></style>
