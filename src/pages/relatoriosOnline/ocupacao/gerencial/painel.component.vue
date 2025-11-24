<template>
  <v-sheet class="mt-2">
    <!-- <card-dados-fila></card-dados-fila> -->
    <div class="my-3 mb-6" style="display: flex; justify-content: center; gap: 5px">
      <ItemsSelector
        :items="produtos"
        colorBorderField="#3333"
        colorTitleField="#343"
        title="Produto"
        v-model="produtoAtual"
        @change="handleChangeProduto"
        :loading="loadingComponent"
      />
      <ItemsSelector
        :items="gruposPorProduto"
        colorBorderField="#3333"
        colorTitleField="#343"
        title="Grupo"
        v-model="grupoAtual"
        @change="handleChangeGrupo"
        :loading="loadingComponentGrupo"
      />
    </div>

    <v-row v-for="(item, i) in listComponents" :key="i">
      <v-col>
        <component
          :is="item.COMPONENT"
          :arrayDados="configuracaoComponents"
          :apiUrl="item.ENDPOINT"
          :interval="countInterval"
          :produtoParams="produtoAtual"
          :grupo="grupoAtual"
          :arrayConfigComponents="item"
          :listComponent="listComponents"
          @update:loading="isLoading"
        ></component>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script>
  import config from '../../../../core/config'

  import cardAgentes from './components/cardAgente.vue'
  import cardOcupacao from './components/cardOcupacao.vue'
  import cardsOcupacaoClaro from './components/cardsOcupacaoClaro.vue'
  import cardOcupacaoPausas from './components/cardOcupacaoPausas.vue'
  import cardDadosFila from '../../../../shared/components/cards/cardDadosFilaOcupacao.vue'
  import cardSummary from '@/pages/relatoriosOnline/ocupacao/gerencial/components/cardsOcupacaoClaro.vue'

  import graficoPausa from './components/graficoPausa.vue'
  import graficoAbs from './components/graficoAbs.vue'

  import tableDesempenhoGeral from '../../../../shared/components/table/tableDesempenhoGeral.component.vue'

  import { OcupacaoService } from '@/data/services/relatorioOnline'

  import ItemsSelector from '@/shared/components/ItemsSelector.vue'
  export default {
    components: {
      cardAgentes,
      cardOcupacao,
      cardOcupacaoPausas,
      graficoAbs,
      graficoPausa,
      cardDadosFila,
      tableDesempenhoGeral,
      cardsOcupacaoClaro,
      cardSummary,
      ItemsSelector
    },
    props: {
      produtos: {
        type: Array,
        default: () => []
      }
    },
    data: ctx => ({
      loading: false,
      loadingComponent: false,
      loadingComponentGrupo: false,
      componentsLoad: [],
      configuracaoComponents: [],
      listComponents: [],
      gruposPorProduto: [],
      produtoAtual: ctx.produto,
      grupoAtual: 'N1',
      countInterval: 0,

      loadingProduto: false,
      loadingGrupo: false
    }),
    computed: {
      produto() {
        return this.$store.getters.usuario.produto
      },
      perfil() {
        return this.$store.getters.usuario.filtro
      }
    },
    mounted() {},
    methods: {
      async handleChangeProduto(produto) {
        this.loadingComponent = true
        this.loadingComponentGrupo = true
        await this.loadListComponents(produto)
        await this.loadConfiguracaoComponents(produto, this.grupoAtual)
        await this.loadDataService(produto)
        this.loadingComponent = false
        this.handleChangeGrupo(this.grupoAtual)
      },
      async handleChangeGrupo(grupo) {
        this.loadingComponentGrupo = true
        await this.loadConfiguracaoComponents(this.produtoAtual, grupo)
        this.loadingComponentGrupo = false
      },
      async loadDataService(produto) {
        const result = await OcupacaoService.getGroupProduct(produto)
        this.gruposPorProduto = result.map(item => {
          return {
            text: item.text,
            value: item.text
          }
        })
      },
      isLoading(e) {
        const numComponent = { NET: 2, ENEL: 2, NEOENERGIA: 2, CLARO: 2 }
        this.componentsLoad.push(e)
        if (numComponent[this.produtoAtual] == this.componentsLoad.length) {
          this.loadingComponent = false
          this.loadingComponentGrupo = false
          this.componentsLoad = []
        }
      },
      async loadListComponents(produto) {
        if (this.produtos.length == 0) {
          this.produtos.push({
            text: this.produto,
            value: this.produto
          })
        }
        this.loadingComponent = true
        let urlData = `${config.baseUrl}api/shared/config/list_components/${produto}/OCUPACAO`
        var res = await this.$api.get(urlData)
        this.listComponents = res.data
      },
      async loadConfiguracaoComponents(produto, grupoAtual) {
        this.configuracaoComponents = []
        // this.loadingComponentGrupo = true;
        let urlData = `${config.baseUrl}api/shared/config/config_components/${produto}/OCUPACAO/${grupoAtual}`
        var res = await this.$api.get(urlData)
        this.configuracaoComponents = res.data
      },
      reloadBase() {}
    },
    async created() {
      // this.produtoAtual = this.produto;
      await this.loadListComponents(this.produto)
      await this.loadConfiguracaoComponents(this.produto, this.grupoAtual)
      await this.loadDataService(this.produto)

      // this.interval = setInterval(() => {
      //   this.countInterval += 9.66;
      //   if (this.countInterval >= 99.6) {
      //     this.countInterval = 0;
      //   }
      // }, 5000);
    }
    // beforeDestroy: function() {
    //   clearInterval(this.interval);
    // },
  }
</script>

<style scoped></style>
