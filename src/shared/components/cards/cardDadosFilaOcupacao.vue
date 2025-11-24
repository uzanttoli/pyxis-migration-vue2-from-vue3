<template>
  <v-row class="mb-3">
    <v-col v-for="(item, i) in dados" :key="i">
      <v-card class="mx-auto rounded-xl" elevation="0" outlined>
        <v-list-item>
          <v-list-item-content>
            <div class="mb-1">
              <strong>{{ item.AGRUPAMENTO }}</strong>
              <br />
              <small class="pa-0 ma-0">
                {{ formatarData(item.INTERVALO) }}
              </small>
            </div>
            <v-list-item-title class="headline mb-1" style="display: flex; gap: 20px">
              <div style="display: flex; align-items: center">
                Fila: {{ item.FILA }}
                <v-icon v-if="item.FILA > 0" size="17" color="red darken-2" class="ml-1">
                  fa-solid fa-circle-exclamation
                </v-icon>
              </div>
              <v-divider vertical></v-divider>
              <div style="display: flex; align-items: center">
                Disponíveis: {{ item.DISPONIVEL ? item.DISPONIVEL : 0 }}
                <v-icon size="17" color="green darken-2" class="ml-1">
                  fa-solid fa-circle-check
                </v-icon>
              </div>
            </v-list-item-title>
            <div style="display: flex; flex-direction: column; gap: 4px">
              <v-list-item-subtitle
                class="font-weight-bold gray--text text-capitalize"
                :class="item2.text == 'pole1' || item2.text == 'pole2' ? 'ml-6 ' : ''"
                v-for="(item2, j) in demaisInforFila(item)"
                :key="j"
              >
                <v-icon
                  :size="item2.text == 'pole1' || item2.text == 'pole2' ? 15 : 19"
                  :color="item2.text == 'pole1' || item2.text == 'pole2' ? 'grey' : 'orange'"
                >
                  {{ item2.icons }}
                </v-icon>
                {{ item2.text }}: {{ item2.value ? item2.value : 0 }}
                <span v-if="validPercFila(item2.perc)">| ({{ validPercFila(item2.perc) }})</span>
              </v-list-item-subtitle>
              <v-list-item-subtitle class="font-weight-bold gray--text text-capitalize">
                <v-icon size="18" color="red">fa-solid fa-triangle-exclamation</v-icon>
                Operadores Virados:
                {{ calcularTotalOpVirados(item.AGRUPAMENTO) }}
              </v-list-item-subtitle>
              <v-list-item-subtitle
                class="gray--text text-capitalize ml-6"
                v-for="item3 in filterOpVirados(item.AGRUPAMENTO)"
                :key="item3.id"
              >
                <v-icon size="15" color="grey">fa-solid fa-person-circle-exclamation</v-icon>
                {{ item3.text }}: {{ item3.value ? item3.value : 0 }}
              </v-list-item-subtitle>
            </div>
          </v-list-item-content>

          <v-list-item-icon>
            <v-icon color="iconPrimary">{{ icon }}</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
  import config from '../../../core/config'
  export default {
    props: {
      title: {
        type: String,
        default: 'Titulo'
      },
      subTitle: {
        type: String,
        default: 'SubTitulo'
      },
      fila: {
        type: Number,
        default: 0
      },
      disponiveis: {
        type: Number,
        default: 0
      },
      falando: {
        type: Number,
        default: 0
      },
      pausa: {
        type: Number,
        default: 0
      },
      percentPausa: {
        type: String,
        default: '0%'
      },
      icon: {
        type: String,
        default: 'mdi-view-dashboard-variant'
      },
      apiUrl: {
        type: String,
        required: true
      },
      interval: {
        type: Number,
        default: 0
      }
    },
    data: () => ({
      dados: [],
      operadoresVirados: [],
      icons: {
        LOGADOS: 'mdi-account-badge',
        POLE1: 'mdi-account-badge',
        POLE2: 'mdi-account-badge',
        'EM ATENDIMENTO': 'mdi-phone-check',
        'PÓS ATENDIMENTO (CALLBACK)': 'mdi-phone-incoming-outgoing',
        'EM PAUSA': 'mdi-clock-time-four-outline'
      }
    }),
    computed: {},
    methods: {
      calcularTotalOpVirados(agrupamento) {
        let data = this.operadoresVirados
        if (!data) return []

        let dataFilter = data.filter(item => item.AGRUPAMENTO === agrupamento)

        if (dataFilter.length === 0) return []

        let itemFiltrado = dataFilter[0]
        let total = Object.keys(itemFiltrado)
          .filter(key => key !== 'AGRUPAMENTO')
          .map(key => ({ total: itemFiltrado[key] || 0 }))
          .reduce((acc, current) => {
            return acc + current.total
          }, 0)

        return total ?? 0
      },
      filterOpVirados(agrupamento) {
        let data = this.operadoresVirados
        if (!data) return []

        let dataFilter = data.filter(item => item.AGRUPAMENTO === agrupamento)

        if (dataFilter.length === 0) return []

        let itemFiltrado = dataFilter[0]

        let dataVirados = Object.keys(itemFiltrado)
          .filter(key => key !== 'AGRUPAMENTO')
          .map(key => ({
            id: `${agrupamento}-${key}`,
            text: key.toLowerCase(),
            value: itemFiltrado[key] || 0
          }))

        return dataVirados
      },
      demaisInforFila(item) {
        let dados = item
        let header = Object.keys(dados)
        let naoIncluir = [
          'INTERVALO',
          'PRODUTO',
          'AGRUPAMENTO',
          'FILA',
          'DISPONIVEL',
          '(%) EM ATENDIMENTO',
          '(%) PÓS ATENDIMENTO (CALLBACK)',
          '(%) EM PAUSA',
          '(%) POLE1',
          '(%) POLE2'
        ]
        let newData = header
          .map(item => {
            if (naoIncluir.includes(item)) return
            return {
              text: item.toLowerCase(),
              value: dados[item],
              perc: (dados['(%) ' + item] * 100).toFixed(2) + '%',
              icons: this.icons[item]
            }
          })
          .filter(item2 => item2 != null)
        return newData
      },
      validPercFila(string) {
        if (!string || string == 'NaN%') return false
        return string
      },
      convertToDecimalBR(valor) {
        return (valor / 100).toLocaleString(undefined, {
          style: 'percent',
          minimumFractionDigits: 2
        })
      },
      async loadDadosFila() {
        let urlData = `${config.baseUrl}${this.apiUrl}`
        var res = await this.$api.get(urlData)
        this.dados = res.data
        await this.loadFilaOperadoresVirados()
      },
      async loadFilaOperadoresVirados() {
        let urlData = `${config.baseUrl}api/shared/ocupacao/dados_operadores_virados`
        var res = await this.$api.get(urlData)
        this.operadoresVirados = res.data
        this.$emit('update:loading', false)
      },
      formatarData(string) {
        if (!string) return
        let data = string.split(' ')[0].split('-').reverse().join('/')
        let hora = string.split(' ')[1].substring(0, 5)
        return `${data} ${hora}`
      }
    },
    created() {
      this.loadDadosFila()
    },
    watch: {
      interval() {
        if (this.interval == 0) {
          this.loadDadosFila()
        }
      }
    }
  }
</script>
