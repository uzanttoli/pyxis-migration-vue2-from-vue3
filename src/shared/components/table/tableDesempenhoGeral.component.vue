<template>
  <v-card outlined class="rounded-xl">
    <v-col cols="12">
      <div class="pa-2">
        <strong>
          <v-icon color="red">mdi-gauge</v-icon>
          {{ arrayConfigComponents.TITULO.toUpperCase() }}
        </strong>
      </div>
      <div class="filtro" style="margin: 8px 0">
        <div style="display: flex; align-items: center">
          <v-btn-toggle
            class="rounded-lg"
            mandatory
            v-model="agrupamentoSelecionado"
            dense
            active-class="blue darken-3"
            @change="loadBaseDados()"
          >
            <v-btn
              class="text-capitalize"
              v-for="(item, i) in agrupamentos"
              small
              :key="i"
              :value="item.value"
              :class="item.value == agrupamentoSelecionado ? 'white--text' : ''"
            >
              <i
                v-if="item.value == agrupamentoSelecionado"
                class="fa-solid fa-circle-check"
                style="color: greenyellow; margin-right: 5px"
              ></i>
              {{ item.text }}
            </v-btn>
          </v-btn-toggle>
        </div>
      </div>
      <v-data-table
        loading-text="Carregando..."
        no-data-text="Dados não carregados..."
        dense
        multi-sort
        class="text-no-wrap mt-5"
        :footer-props="footerProps"
        :headers="getHeaders"
        :items="base"
        :loading="loading"
      ></v-data-table>
    </v-col>
  </v-card>
</template>

<script>
  import config from '../../../core/config'
  export default {
    props: {
      arrayConfigComponents: {
        type: Object
      },
      title: {
        type: String,
        default: 'Titulo'
      },
      apiUrl: {
        type: String,
        default: 'Titulo'
      },

      interval: {
        type: Number,
        default: 0
      }
    },
    data: () => ({
      agrupamentoSelecionado: 'MASSIVO CE E RJ',
      agrupamentos: [
        { text: 'MASSIVO CE E RJ', value: 'MASSIVO CE E RJ' },
        { text: 'MASSIVO SP', value: 'MASSIVO SP' }
      ],
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      },
      base: [],
      loading: false
    }),
    computed: {
      getHeaders() {
        let dados = this.base[0]
        //   let arrDados = { ACOES: null, ...dados };
        if (!dados) return
        let headers = Object.keys(dados).map(item => {
          return {
            text: item,
            value: item,
            align: 'center',
            sortable: true,
            icon: 'mdi-arrow-up',
            class: 'light-blue darken-1 white--text'
          }
        })
        return headers
      }
    },
    methods: {
      replaceNulls(obj) {
        for (let key in obj) {
          if (obj[key] === null) {
            obj[key] = '-'
          }
        }
      },
      loadBaseDados() {
        this.loading = true
        let urlData = `${config.baseUrl}${this.apiUrl}`
        this.$api
          .get(urlData, {
            params: {
              agrupamento: this.agrupamentoSelecionado
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
      this.loadBaseDados()
    },
    watch: {
      interval() {
        if (this.interval == 0) {
          this.loadBaseDados()
        }
      }
    }
  }
</script>

<style></style>
