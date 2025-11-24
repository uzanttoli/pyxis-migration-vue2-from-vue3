<template>
  <v-card elevation="1">
    <v-col>
      <title-negative-margin :title="title" :icon="titleIcon"></title-negative-margin>
      <!-- <pre>{{ getHeaders }}</pre> -->
      <v-data-table
        dense
        class="text-no-wrap"
        :coluna="colunaChave"
        :items="base"
        :headers="getHeaders"
        :item-class="getClass"
        :loading="loading"
        multi-sort
        no-data-text="Filtre para carregamento dos dados..."
        loading-text="Carregando..."
      >
        <template v-slot:top>
          <v-container fluid>
            <v-row>
              <v-col cols="2">
                <v-row class="pa-6">
                  <v-select
                    v-model="produtoFilter"
                    :items="itemsProduto"
                    label="Produto"
                    no-data-text="Não há produtos!"
                    dense
                    outlined
                    class="rounded-r-xl rounded-bl-xl"
                    @change="numSuperior == 1 ? listarAgrupamento() : ''"
                  ></v-select>
                </v-row>
              </v-col>
              <v-col cols="2" v-if="numSuperior == 1">
                <v-row class="pa-6">
                  <v-select
                    v-model="agrupamentoSelecionado"
                    :items="agrupamentos"
                    label="Agrupamento"
                    no-data-text="Não há produtos!"
                    dense
                    outlined
                    class="rounded-r-xl rounded-bl-xl"
                    item-text="AGRUPAMENTO"
                    @change="loadBaseAgrupamentoMesAnterior()"
                  ></v-select>
                </v-row>
              </v-col>
              <v-col cols="2" v-if="numSuperior != 1">
                <v-row class="pa-6">
                  <v-select
                    v-model="coordenadorFilter"
                    label="Coordenador"
                    :items="itemsCoordenadores"
                    item-text="COORDENADOR"
                    :messages="
                      numSuperior == 2
                        ? 'Selecione um coord. para carregar os dados!'
                        : 'Selecione um coord. e Sup. para carregar os dados!'
                    "
                    :error-messages="error"
                    item-value="COORDENADOR"
                    no-data-text="Não há Coordenadores!"
                    @change="numSuperior == 2 ? loadBase() : listarSupervisores()"
                    dense
                    outlined
                    class="rounded-r-xl rounded-bl-xl"
                  ></v-select>
                </v-row>
              </v-col>
              <v-col cols="2" v-if="numSuperior == 3 || numSuperior == 4">
                <v-row class="pa-6">
                  <v-select
                    v-model="supervisorFilter"
                    :items="itemsSupervisores"
                    no-data-text="Não há Supervisores!"
                    item-text="SUPERVISOR"
                    item-value="SUPERVISOR"
                    @change="numSuperior == 3 ? loadBaseSupervisor() : listarOperadores()"
                    label="Supervisor"
                    dense
                    outlined
                    class="rounded-r-xl rounded-bl-xl"
                  ></v-select>
                </v-row>
              </v-col>
              <v-col cols="2" v-if="numSuperior == 4">
                <v-row class="pa-6">
                  <v-select
                    v-model="operadorFilter"
                    no-data-text="Não há operadores!"
                    label="Operador"
                    :items="itemsOperadores"
                    item-text="OPERADOR"
                    dense
                    outlined
                    class="rounded-r-xl rounded-bl-xl"
                    @change="loadOperadorConsolidadoMesAnterior()"
                  ></v-select>
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
  import config from '../../../../../core/config'

  export default {
    components: {},
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
      actionUrl1: {
        type: String,
        require: true
      },
      actionUrl2: {
        type: String,
        require: true
      },
      actionUrl3: {
        type: String,
        require: true
      },
      numSuperior: {
        type: [String, Number],
        default: 1
      },
      indicador: {
        type: String,
        default: 'AC_GERAL'
      },
      produtoAtual: {
        type: String
      }
    },
    data: () => ({
      itemsProduto: [],
      base: [],
      baseMesAnterior: [],
      baseConsolidadoMes: [],
      baseDiaMesAtual: [],
      itemsCoordenadores: [],
      itemsSupervisores: [],
      itemsOperadores: [],
      agrupamentos: [],
      error: '',
      loading: false,
      colunaChave: 'Data',
      produtoFilter: 'NET COMBO',
      coordenadorFilter: '',
      supervisorFilter: '',
      operadorFilter: '',
      produtoAgrupamento: '',
      agrupamentoSelecionado: ''
    }),
    computed: {
      getHeaders() {
        let dados = this.base[0]
        if (!dados) return []
        let headers = Object.keys(dados)
          .map(item => {
            return {
              text: item,
              align: 'center',
              class: 'indigo lighten-1 white--text',
              value: item,
              sortable: true
            }
          })
          .filter(item2 => {
            return (
              item2.text != 'AGRUPAMENTO' &&
              item2.text != 'COLUNA1' &&
              item2.text != 'TIPO' &&
              item2.text != 'COORDENADOR' &&
              item2.text != 'SUPERVISOR'
            )
          })

        return headers
      },
      produtoUsuario() {
        return this.$store.getters.usuario.produto
      }
    },
    methods: {
      replaceItems(obj) {
        for (let key in obj) {
          if (key === 'DATA') {
            obj['DATA'] = this.convertData(obj[key])
          }
        }
      },
      replaceNulls(obj) {
        for (let key in obj) {
          if (obj[key] === null) {
            obj[key] = '-'
          }
        }
      },
      calculatePercent(obj) {
        let stringValid = '(%) '
        for (let key in obj) {
          if (key.includes(stringValid)) {
            obj[key] =
              this.convertDecimal(obj[key]) == 'NaN%' ? obj[key] : this.convertDecimal(obj[key])
          }
        }
      },
      // LISTAR HIERARQUIAS
      listarCoordenadores() {
        let urlData = `${config.baseUrl}api/shared/workflow/coordenadores`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produtoFilter
            }
          })
          .then(res => {
            this.itemsCoordenadores = res.data
          })
      },
      listarSupervisores() {
        let urlData = `${config.baseUrl}api/shared/workflow/supervisores/`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produtoFilter,
              coordenador: this.coordenadorFilter
            }
          })
          .then(res => {
            this.itemsSupervisores = res.data
          })
      },
      listarOperadores() {
        let urlData = `${config.baseUrl}api/shared/workflow/operadores/`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produtoFilter,
              coordenador: this.coordenadorFilter,
              supervisor: this.supervisorFilter
            }
          })
          .then(res => {
            this.itemsOperadores = res.data
          })
      },
      listarAgrupamento() {
        let urlData = `${config.baseUrl}api/shared/workflow/lista_agrupamento`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produtoFilter
            }
          })
          .then(res => {
            this.agrupamentos = res.data
          })
      },

      // FIM HIERARQUIAS

      convertDecimal(value) {
        return (value * 100).toFixed(2).concat('%')
      },
      convertData(value) {
        let dateConsideration = value.split('-').reverse().join('-').slice(3, 5)
        let monthConsideration = value.split('-')

        const monthName = [
          'Jan',
          'Fev',
          'Mar',
          'Abril',
          'Maio',
          'Jun',
          'Ju',
          'Ago',
          'Set',
          'Out',
          'Nov',
          'Dez'
        ]

        let data = new Date(dateConsideration)

        return `${monthName[data.getMonth()]}/${monthConsideration[0]}`
      },
      getClass(item) {
        if (!item) return
        if (item.COLUNA1 == 'MES') {
          return 'text-center light-blue lighten-5 font-weight-bold'
        } else {
          return 'text-center grey lighten-4'
        }
      },
      /**AGRUPAMENTO */
      loadBaseAgrupamentoMesAnterior() {
        this.loading = true
        let urlData = `${config.baseUrl}${this.actionUrl}`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produtoFilter,
              agrupamento: this.agrupamentoSelecionado
            }
          })
          .then(res => {
            this.base = res.data
            this.base.forEach(this.calculatePercent)
            this.base.forEach(item => (item.COLUNA1 = 'MES'))
            this.base.forEach(this.replaceItems)
            this.base.forEach(this.replaceNulls)
            this.loadBaseAgrupamentoConsolidadoMes()
          })
      },
      loadBaseAgrupamentoConsolidadoMes() {
        this.loading = true
        let urlData = `${config.baseUrl}${this.actionUrl2}`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produtoFilter,
              agrupamento: this.agrupamentoSelecionado
            }
          })
          .then(res => {
            // this.baseConsolidadoMes = res.data;
            let dados = res.data
            dados.forEach(this.replaceItems)
            this.base.push(...dados)
            this.base.forEach(item => (item.COLUNA1 = 'MES'))
            this.base.forEach(this.calculatePercent)
            this.base.forEach(this.replaceNulls)
            this.loadBaseAgrupamentoDiaDiaMesAtual()
          })
      },
      loadBaseAgrupamentoDiaDiaMesAtual() {
        this.loading = true
        let urlData = `${config.baseUrl}${this.actionUrl3}`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produtoFilter,
              agrupamento: this.agrupamentoSelecionado
            }
          })
          .then(res => {
            // this.baseDiaMesAtual = res.data;
            this.base.push(...res.data)
            this.base.forEach(this.calculatePercent)
            this.base.forEach(this.replaceNulls)
            this.loading = false
          })
      },
      /**FIM AGRUPAMENTO */

      // COORDENADOR
      loadBase() {
        try {
          this.loading = true
          let urlData = `${config.baseUrl}${this.actionUrl}`
          this.$api
            .get(urlData, {
              params: {
                produto: this.produtoFilter,
                coordenador: this.coordenadorFilter
              }
            })
            .then(res => {
              this.base = res.data
              this.base.forEach(item => (item.COLUNA1 = 'MES'))
              this.base.forEach(this.replaceItems)
              this.base.forEach(this.calculatePercent)
              this.base.forEach(this.replaceNulls)
              this.loadBaseConsolidadoMes()
            })
        } catch (e) {
          this.error = e
        }
      },
      loadBaseConsolidadoMes() {
        let urlData = `${config.baseUrl}${this.actionUrl2}`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produtoFilter,
              coordenador: this.coordenadorFilter
            }
          })
          .then(res => {
            // this.baseConsolidadoMes = res.data;
            let dados = res.data
            dados.forEach(this.replaceItems)
            this.base.push(...dados)
            this.base.forEach(item => (item.COLUNA1 = 'MES'))
            this.base.forEach(this.calculatePercent)
            this.base.forEach(this.replaceNulls)
            this.loadBaseDiaMesAtual()
          })
      },
      loadBaseDiaMesAtual() {
        let urlData = `${config.baseUrl}${this.actionUrl3}`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produtoFilter,
              coordenador: this.coordenadorFilter
            }
          })
          .then(res => {
            // this.baseDiaMesAtual = res.data;
            this.base.push(...res.data)
            this.base.forEach(this.calculatePercent)
            this.base.forEach(this.replaceNulls)
            this.loading = false
          })
      },
      // FIM COORDENADOR

      // SUPERVISOR
      loadBaseSupervisor() {
        try {
          this.loading = true
          let urlData = `${config.baseUrl}${this.actionUrl}`
          this.$api
            .get(urlData, {
              params: {
                produto: this.produtoFilter,
                coordenador: this.coordenadorFilter,
                supervisor: this.supervisorFilter
              }
            })
            .then(res => {
              this.base = res.data

              this.base.forEach(item => (item.COLUNA1 = 'MES'))
              this.base.forEach(this.replaceItems)
              this.base.forEach(this.calculatePercent)
              this.base.forEach(this.replaceNulls)
              this.loadBaseConsolidadoMesSupervisor()
            })
        } catch (e) {
          this.error = e
        }
      },
      loadBaseConsolidadoMesSupervisor() {
        let urlData = `${config.baseUrl}${this.actionUrl2}`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produtoFilter,
              coordenador: this.coordenadorFilter,
              supervisor: this.supervisorFilter
            }
          })
          .then(res => {
            // this.baseConsolidadoMes = res.data;
            let dados = res.data
            dados.forEach(this.replaceItems)
            this.base.push(...dados)
            this.base.forEach(item => (item.COLUNA1 = 'MES'))
            this.base.forEach(this.calculatePercent)
            this.base.forEach(this.replaceNulls)
            this.loadBaseDiaMesAtualSupervisor()
          })
      },
      loadBaseDiaMesAtualSupervisor() {
        let urlData = `${config.baseUrl}${this.actionUrl3}`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produtoFilter,
              coordenador: this.coordenadorFilter,
              supervisor: this.supervisorFilter
            }
          })
          .then(res => {
            // this.baseDiaMesAtual = res.data;
            this.base.push(...res.data)
            this.base.forEach(this.calculatePercent)
            this.base.forEach(this.replaceNulls)
            this.loading = false
          })
      },
      /***FIM SUPERVISOR */

      /**OPERADOR */
      loadOperadorConsolidadoMesAnterior() {
        this.loading = true
        let urlData = `${config.baseUrl}${this.actionUrl}`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produtoFilter,
              coordenador: this.coordenadorFilter,
              supervisor: this.supervisorFilter,
              operador: this.operadorFilter
            }
          })
          .then(res => {
            this.base = res.data
            this.base.forEach(item => (item.COLUNA1 = 'MES'))
            this.base.forEach(this.replaceItems)
            this.base.forEach(this.calculatePercent)
            this.base.forEach(this.replaceNulls)
            this.loadOperadorConsolidadoMesAtual()
          })
      },
      loadOperadorConsolidadoMesAtual() {
        let urlData = `${config.baseUrl}${this.actionUrl2}`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produtoFilter,
              coordenador: this.coordenadorFilter,
              supervisor: this.supervisorFilter,
              operador: this.operadorFilter
            }
          })
          .then(res => {
            // this.baseConsolidadoMes = res.data;
            let dados = res.data
            dados.forEach(this.replaceItems)
            this.base.push(...dados)
            this.base.forEach(item => (item.COLUNA1 = 'MES'))
            this.base.forEach(this.calculatePercent)
            this.base.forEach(this.replaceNulls)
            // this.base.push(res.data)
            this.loadBaseOperadorDiaDiaMesAtual()
          })
      },
      loadBaseOperadorDiaDiaMesAtual() {
        let urlData = `${config.baseUrl}${this.actionUrl3}`
        this.$api
          .get(urlData, {
            params: {
              produto: this.produtoFilter,
              coordenador: this.coordenadorFilter,
              supervisor: this.supervisorFilter,
              operador: this.operadorFilter
            }
          })
          .then(res => {
            // this.baseDiaMesAtual = res.data;
            this.base.push(...res.data)
            this.base.forEach(this.calculatePercent)
            this.base.forEach(this.replaceNulls)
            this.loading = false
          })
      }
      /**FIM OPERADOR */
    },
    watch: {
      produtoFilter() {
        this.listarCoordenadores()
      },
      coordenadorFilter() {
        if (this.numSuperior == 2) {
          this.itemsSupervisores = []
        }
      }
    },
    created() {
      if (this.$store.getters.usuario.filtro != 'ADMINISTRADOR') {
        if (this.produtoUsuario == 'NET') {
          this.itemsProduto = ['NET COMBO', 'NET E2E']
        } else if (this.produtoUsuario == 'ENEL') {
          this.itemsProduto = ['ENEL']
          this.produtoFilter = 'ENEL'
        }
      } else {
        this.itemsProduto = ['NET COMBO', 'NET E2E', 'ENEL']
      }

      this.listarCoordenadores()
      this.listarAgrupamento()
    }
  }
</script>

<style></style>
