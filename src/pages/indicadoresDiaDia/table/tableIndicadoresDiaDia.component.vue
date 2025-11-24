<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="1" class="rounded-xl">
        <title-negative-margin
          :title="title"
          icon="fa-solid fa-chart-simple"
          className="rounded-r-xl"
        >
          <div style="max-width: max-content">
            <v-text-field
              v-model="search"
              placeholder="Pesquisar"
              label="Pesquisar"
              outlined
              dense
            ></v-text-field>
          </div>
        </title-negative-margin>
        <v-data-table
          outlined
          :headers="headers"
          :items="processedItem"
          :loading="loading"
          :search="search"
          loading-text="Carregando informações, por favor aguarde!"
          multi-sort
          class="text-no-wrap"
          dense
          :item-class="getClass"
          no-data-text="Não há informações no momento!"
        ></v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import config from '../../../core/config'
  export default {
    name: 'indicadores-dia-dia',
    props: {
      title: {
        type: String,
        default: 'Indicadores Dia Dia'
      },
      parameters: {
        type: [String, Number],
        require: true
      },
      order: {
        type: Number,
        default: 1
      },
      isUserQuery: {
        type: [String, Number],
        default: null
      },
      headers: {
        type: [Array, Object],
        required: true
      }
    },
    data: () => ({
      base: [],
      loading: false,
      search: null
    }),
    computed: {
      processedItem() {
        return this.base.map(item => {
          let processedItem = { ...item }
          for (const key in processedItem) {
            if (processedItem[key] == null) {
              processedItem[key] = '-'
            }
            if (processedItem[key] == 0.0) {
              processedItem[key] = 0
            }
          }
          return processedItem
        })
      },
      validacaoTipoUser() {
        let tipo = this.$store.getters.usuario.filtro
        if (tipo == 'OPERADOR') {
          return '1'
        } else if (tipo == 'SUPERVISOR') {
          return '2'
        } else {
          return '3'
        }
      }
    },
    filter: {},
    methods: {
      formatarValor(value) {
        return value.toLocaleString('pt-BR')
      },
      formatedPercent(value) {
        if (!value) return '0,00%'
        return (value * 100).toFixed(2).concat('%')
      },
      loadBase() {
        this.loading = true
        let validacaoTipo = this.parameters.length == 7 ? '1' : this.validacaoTipoUser
        // let urlData = `${config.pyxisReceptivoUrl}receptivo/dados-online/indicadores-dia-dia/operador?almope=${this.parameters}&coluna=${validacaoTipo}&ordem=${this.order}`
        let urlData = `${config.pyxisReceptivoUrl}receptivo/dados-online/indicadores-dia-dia/operador`
        this.$api
          .get(urlData, {
            params: {
              parametro: this.parameters,
              coluna: validacaoTipo,
              ordem: this.order
            }
          })
          .then(res => {
            this.base = res.data
            this.loading = false
          })
      },
      getClass(item) {
        if (item.data === 'CONSOLIDADO') return 'teal lighten-5 font-weight-bold'
      }
    },
    watch: {
      parameters() {
        this.loadBase()
      }
    },
    created() {
      this.loadBase()
    }
  }
</script>

<style scoped></style>
