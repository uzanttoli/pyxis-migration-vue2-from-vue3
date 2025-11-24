<template>
  <v-card class="table rounded-xl" elevation="1">
    <v-col>
      <title-negative-margin :title="title" className="rounded-r-xl ml-n7">
        <download-excel
          :data="base"
          :name="nameTratado"
          :worksheet="nameTratado"
          v-if="title == 'Operador'"
        >
          <v-btn depressed color="success" class="rounded-bl-xl rounded-r-xl">
            <v-icon small class="mr-2">fa-solid fa-file-excel</v-icon>
            Baixar Dados
          </v-btn>
        </download-excel>
      </title-negative-margin>
      <v-data-table
        dense
        multi-sort
        :fixed-header="true"
        :item-key="colunaChave"
        :items-per-page="15"
        :search="searchNome"
        :loading="loading"
        :items="base"
        :headers="getHeaders()"
        :footer-props="footerProps"
        no-data-text="Não há dados de vendas no momento!"
        loading-text="Carregando... Por favor aguarde!"
        class="text-no-wrap mx-4"
      >
        <template v-slot:top>
          <v-container fluid>
            <v-row>
              <v-col v-if="numSuperior >= 1" :cols="numSuperior == 1 ? 3 : 3">
                <v-row class="pa-6">
                  <v-select
                    label="Coordenador"
                    class="rounded-r-xl rounded-bl-xl"
                    v-model="coordenadorFilter"
                    :items="listaCoordenadores"
                    outlined
                    dense
                  ></v-select>
                </v-row>
              </v-col>
              <v-col v-if="numSuperior >= 2" :cols="numSuperior == 2 ? 3 : 3">
                <v-row class="pa-6">
                  <v-select
                    label="Supervisor"
                    class="rounded-r-xl rounded-bl-xl"
                    v-model="supervisorFilter"
                    :items="listaSupervisores"
                    outlined
                    dense
                  ></v-select>
                </v-row>
              </v-col>
              <v-col cols="4" v-if="numSuperior > 2">
                <v-row class="pa-6">
                  <v-text-field
                    v-model="searchNome"
                    class="rounded-r-xl rounded-bl-xl"
                    append-icon="mdi-magnify"
                    label="Outros"
                    outlined
                    dense
                  ></v-text-field>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </template>
      </v-data-table>
    </v-col>
  </v-card>
</template>

<script>
  import config from '@/core/config'
  export default {
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
      },
      agrupamento: {
        type: [String, Number]
      },
      produto: {
        type: [String, Number]
      }
    },
    data: () => ({
      loading: false,
      searchNome: '',
      countInterval: 0,
      colunaChave: 'ALMOPE+COORDENADOR',
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
      nameTratado() {
        let data = this.moment().format('DDMMYYYY')
        return `PYXIS_${data}_VENDAS_S2S`
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
        this.loading = true
        let urlData = `${config.baseUrl}${this.actionUrl}`
        const res = await this.$api.get(urlData, {
          params: {
            agrupamento: this.agrupamento,
            produto: this.produto
          }
        })
        this.base = res.data
        this.$emit('update:loading', false)
        this.loading = false
      },
      getHeaders() {
        let arrheaders = []

        if (this.base.length > 0) {
          const demaisCabecalhos =
            this.base &&
            Object.keys(this.base[0]).map(item => {
              const header = {
                text: item,
                align: 'center',
                value: item,
                class: 'light-blue darken-1 white--text'
              }

              if (item === 'COORDENADOR') {
                header.filter = value => {
                  if (!this.coordenadorFilter) {
                    return true
                  }
                  return value === this.coordenadorFilter
                }
              } else if (item === 'SUPERVISOR') {
                header.filter = value => {
                  if (!this.supervisorFilter) {
                    return true
                  }
                  return value === this.supervisorFilter
                }
              }

              return header
            })

          arrheaders.push(...demaisCabecalhos)
        }

        return arrheaders
      }
    },
    created() {
      this.loadBase()
    },
    watch: {
      produto() {
        this.loadBase()
      },
      agrupamento() {
        this.loadBase()
      }
    }
  }
</script>

<style scoped>
  .table {
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    transition: all 0.2s ease-in-out;
  }
  .table:hover {
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
    transform: translateY(-4px);
  }
</style>
