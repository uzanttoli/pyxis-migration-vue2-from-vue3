<template>
  <v-card>
    <title-negative-margin
      :title="title"
      :icon="titleIcon"
      className="rounded-r-xl"
    ></title-negative-margin>

    <v-data-table
      dense
      multi-sort
      :fixed-header="true"
      class="text-no-wrap"
      :item-key="colunaChave"
      :loading="loading"
      loading-text="Carregando..."
      :headers="getHeaders(numSuperior)"
      :items="base"
      :items-per-page="15"
      :search="search"
    >
      <template v-slot:item.PERCENT_FEEDBACK="{ item }">
        {{ item.PERCENT_FEEDBACK | percentage }}
      </template>
      <template v-slot:item.PERCENT_ATD="{ item }">
        {{ item.PERCENT_ATD | percentage }}
      </template>
      <template v-slot:item.PERCENT_PAUSAS="{ item }">
        {{ item.PERCENT_PAUSAS | percentage }}
      </template>
      <template v-slot:item.PERCENT_DISP="{ item }">
        {{ item.PERCENT_DISP | percentage }}
      </template>
      <template v-slot:item.TX_OCUPACAO="{ item }">
        {{ item.TX_OCUPACAO | percentage }}
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
  import config from '../../../../core/config.js'
  export default {
    name: 'tabela-pausas-resumo',
    props: {
      skill: {
        type: String,
        default: 'NET E2E'
      },
      title: {
        type: String,
        default: 'Mês'
      },
      titleIcon: {
        type: String,
        default: ''
      },
      dac: {
        type: String,
        default: '2'
      },
      actionUrl: {
        type: String,
        required: true
      },
      numSuperior: {
        type: Number,
        default: 1
      }
    },
    data: function () {
      return {
        search: '',
        loading: false,
        interval: null,
        base: [],
        colunaChave: 'COORDENADOR',
        supervisorFilter: '',
        coordenadorFilter: ''
      }
    },
    computed: {
      listaCoordenadoresEscala() {
        let result = this.base
          .map(item => {
            return item.COORDENADOR
          })
          .filter(this.onlyUnique)
        result.push('')
        return result
      },
      listaSupervisores() {
        // this.supervisorFilter = ''

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
      produtoAtual() {
        return this.$store.getters.produto
      },
      agrupamento() {
        return this.$store.getters.agrupamento
      },
      pausasConfig() {
        return this.$store.getters.pausasConfig
      }
    },
    methods: {
      generateKey(item, index) {
        const uniqueKey = `${item}-${index}`
        return uniqueKey
      },
      onlyUnique(value, index, self) {
        return self.indexOf(value) === index
      },
      async loadBase() {
        this.loading = true
        await this.$api.get(`${config.baseUrl}${this.actionUrl}${this.skill}`).then(res => {
          this.base = res.data
          this.loading = false
        })
      },
      getHeaders() {
        let arrHeadersResumo = [
          {
            text: 'Coordenador',
            align: 'center',
            sortable: true,
            value: 'COORDENADOR'
          },
          {
            text: 'Campanha',
            align: 'center',
            sortable: true,
            value: 'CAMPANHA'
          },
          {
            text: 'Total',
            align: 'center',
            sortable: true,
            value: 'TOTAL'
          },
          {
            text: 'Tx. Ocupação',
            align: 'center',
            sortable: true,
            value: 'TX_OCUPACAO'
          },
          {
            text: 'Disponíveis',
            align: 'center',
            sortable: true,
            value: 'DISPONIVEIS'
          },
          {
            text: '(%)Disp',
            align: 'center',
            sortable: true,
            value: 'PERCENT_DISP'
          },
          {
            text: 'Atd',
            align: 'center',
            sortable: true,
            value: 'ATD'
          },
          {
            text: '(%)Atd',
            align: 'center',
            sortable: true,
            value: 'PERCENT_ATD'
          },
          {
            text: 'Pausas',
            align: 'center',
            sortable: true,
            value: 'PAUSAS'
          },
          {
            text: '(%)Pausas',
            align: 'center',
            sortable: true,
            value: 'PERCENT_PAUSAS'
          },
          {
            text: 'Descanso',
            align: 'center',
            sortable: true,
            value: 'DESCANSO'
          },
          {
            text: 'Alimentação',
            align: 'center',
            sortable: true,
            value: 'ALIMENTACAO'
          },
          {
            text: 'Particular',
            align: 'center',
            sortable: true,
            value: 'PARTICULAR'
          },
          {
            text: 'Feedback',
            align: 'center',
            sortable: true,
            value: 'FEEDBACK'
          },
          {
            text: '(%)Feedback',
            align: 'center',
            sortable: true,
            value: 'PERCENT_FEEDBACK'
          },
          {
            text: 'Sistema',
            align: 'center',
            sortable: true,
            value: 'SISTEMA'
          },
          {
            text: 'Laboral',
            align: 'center',
            sortable: true,
            value: 'LABORAL'
          },
          {
            text: 'Sistema',
            align: 'center',
            sortable: true,
            value: 'SISTEMA'
          }
        ]

        return arrHeadersResumo
      }
    },
    watch: {
      pausasConfig: function () {
        this.loadBase()
      }
    },
    created: function () {
      this.loadBase()
      this.interval = setInterval(() => {
        this.loadBase()
      }, 15 * 60 * 1000)
    },
    beforeUnmount: function () {
      clearInterval(this.interval)
    }
  }
</script>
