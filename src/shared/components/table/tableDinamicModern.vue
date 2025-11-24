<template>
  <v-card class="rounded-xl">
    <title-rounded-tl-rb class="mb-4 ml-3">
      <template v-slot:title>
        <div style="display: flex; justify-content: center; align-items: center">
          <v-icon color="white" class="mr-2">fa-solid fa-bookmark</v-icon>
          <h2 class="white--text">{{ title }}</h2>
        </div>
      </template>
      <v-row justify="end" align="end" class="mr-2">
        <v-col class="pa-0 ma-0" cols="2">
          <v-select
            label="Selecione"
            single-line
            hide-details
            outlined
            rounded
            solo
            color="white"
            dense
            v-model="periodoSelecionado"
            :items="periodo"
            item-text="nome"
            item-value="value"
          ></v-select>
        </v-col>
        <v-col class="pa-0 ma-0 ml-2" cols="2">
          <v-text-field
            label="Pesquisar"
            single-line
            hide-details
            solo
            prepend-inner-icon="mdi-magnify"
            outlined
            rounded
            color="white"
            v-model="search"
            dense
          ></v-text-field>
        </v-col>
      </v-row>
    </title-rounded-tl-rb>
    <v-data-table
      dense
      :search="search"
      loading-text="Carregando...por favor aguarde!"
      no-data-text="Não conseguimos encontrar oque você slicitou."
      :items="baseDados"
      :headers="getHeaders"
      :items-per-page="itemsPerPage"
      class="text-no-wrap"
      :loading="loading"
      :footer-props="footerProps"
      no-results-text="Não há dados disponiveis"
    >
      <template v-slot:body="{ items }">
        <tr v-for="(item, i) in items" :key="i" :class="i % 2 ? 'grey lighten-3' : ''">
          <td v-for="(item2, j) in getHeaders" :key="j">
            {{ item[item2.value] ? item[item2.value] : '-' }}
            <!-- <i :class="getIcon(item2.value)"></i> -->
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import config from '../../../core/config'
  export default {
    props: {
      title: {
        type: String,
        default: 'Titulo'
      },
      itemsPerPage: {
        type: Number,
        default: 5
      },
      paramsApi: {
        type: Object,
        default: () => {}
      },
      apiUrl: {
        type: String,
        required: true
      },
      periodo: {
        type: Array,
        default: () => []
      }
    },
    data: () => ({
      baseDados: [],
      periodoSelecionado: null,
      loading: false,
      search: null,
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      }
    }),
    computed: {
      getHeaders() {
        let data = this.baseDados[0]
        if (!data) return []
        let header = Object.keys(data)
          .map(item => {
            return {
              text: item,
              value: item,
              class: '',
              align: 'center'
            }
          })
          .filter(item2 => {
            return data[item2.text] != null
          })
        return header
      }
    },
    methods: {
      loadDadosApi() {
        let urlData = `${config.baseUrl}${this.apiUrl}`
        this.$api
          .get(urlData, {
            params: { ...this.paramsApi, periodo: this.periodoSelecionado || 30 }
          })
          .then(res => {
            this.baseDados = res.data
          })
      }
    },
    created() {
      this.loadDadosApi()
    },
    watch: {
      periodoSelecionado: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.loadDadosApi()
        }
      }
    }
  }
</script>

<style scoped>
  span {
    display: flex;
    justify-content: center;
  }

  tr {
    font-size: 14px;
  }

  td {
    text-align: center;
    border: 1px solid #f5f5f58d;
    padding: 5px 10px;
  }
</style>
