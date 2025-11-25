<template>
  <div>
    <div style="display: flex; align-items: center; justify-content: space-between" class="my-2">
      <div style="display: flex; align-items: center">
        <h2 class="mr-1">Inf. Resgates</h2>
        <download-excel
          :data="itemsFilter"
          name="DADOS_LOTERIA_PYXIS_RESGATES"
          worksheet="DADOS_LOTERIA_PYXIS_RESGATES"
        >
          <v-btn icon color="primary">
            <v-icon>fa-solid fa-download</v-icon>
          </v-btn>
        </download-excel>
      </div>
      <div style="display: flex">
        <v-text-field outlined dense placeholder="🏸Pesquisar" v-model="search"></v-text-field>
        <v-menu offset-y :close-on-content-click="closeOnContentClick">
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon class="ml-2" v-on="on" v-bind="attrs">
              <v-icon>fa-solid fa-sliders</v-icon>
            </v-btn>
          </template>
          <v-card width="350">
            <v-toolbar color="primary" dark>
              <v-toolbar-title>Filtros</v-toolbar-title>
            </v-toolbar>
            <v-list>
              <v-list-item-group v-model="selected" active-class="red--text" multiple>
                <template v-for="(list, index) in itemsFiltros" :key="list.title">
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>{{ list.title }}</v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>

                  <v-divider v-if="index < items.length - 1" :key="index"></v-divider>
                </template>
              </v-list-item-group>
            </v-list>
          </v-card>
        </v-menu>
      </div>
    </div>
    <div>
      <v-data-table
        no-data-text="Não há dados disponíveis"
        :headers="headers"
        :items="itemsFilter"
        :search="search"
      ></v-data-table>
    </div>
  </div>
</template>

<script>
  import config from '../../../../core/config'
  export default {
    data: () => ({
      closeOnContentClick: false,
      search: null,
      selected: [],
      headers: [
        { text: 'Almope', value: 'ALMOPE', align: 'center' },
        { text: 'Nome', value: 'NOME', align: 'center' },
        { text: 'Supervisor', value: 'SUPERIOR1', align: 'center' },
        { text: 'Coordenador', value: 'SUPERIOR2', align: 'center' },
        { text: 'Nª Resgatado', value: 'NUMERO_RESG', align: 'center' },
        { text: 'Bilhete Resgate', value: 'BILHETE_RESG', align: 'center' },
        { text: 'Data Resgate', value: 'DATA_RESG', align: 'center' }
      ],
      items: [],
      itemsFiltros: [
        {
          title: 'Retirar quem não comprou'
        },
        {
          title: 'Retirar quem comprou'
        }
      ]
    }),
    computed: {
      itemsFilter() {
        let dados = this.items
        if (this.selected != '') {
          return dados.filter(item => {
            if (this.selected[0] == 0) {
              return item.QUANTIDADE_COMPRA != 0
            } else {
              return item.QUANTIDADE_COMPRA == 0
            }
          })
        } else {
          return this.items
        }
      },
      queryId() {
        return this.$route.query.id ? this.$route.query.id : 1000000
      }
    },
    methods: {
      loadDadosResgatadoUsuarios() {
        let urlData = `${config.baseUrl}api/shared/loteria/configuracao/dados_resgatados/${this.queryId}`
        this.$api.get(urlData).then(res => {
          this.items = res.data
        })
      }
    },
    created() {
      this.loadDadosResgatadoUsuarios()
    },
    watch: {
      queryId: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.loadDadosResgatadoUsuarios()
        }
      }
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Syne&display=swap"); */
  h2 {
    font-family: 'Syne', sans-serif;
  }
</style>
