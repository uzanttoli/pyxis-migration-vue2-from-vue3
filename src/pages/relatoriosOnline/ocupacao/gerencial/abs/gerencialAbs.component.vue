<template>
  <v-sheet elevation="0" class="mt-2">
    <div class="my-3" style="display: flex; justify-content: center; gap: 5px; flex-wrap: wrap">
      <ItemsSelector
        :items="produtos"
        colorBorderField="#3333"
        colorTitleField="#343"
        title="Produto"
        v-model="produtoAtual"
        @change="loadDataService"
        :loading="loadingDataService"
      />
      <ItemsSelector
        :items="agrupamentos"
        colorBorderField="#3333"
        colorTitleField="#343"
        title="Agrupamento"
        v-model="agrupamentoAtual"
        @change="loadConfig"
        :loading="loadingConfig"
      />
    </div>
    <v-col cols="12" v-for="(item, i) in absConfigOcupacao" :key="i">
      <component
        v-if="absConfigOcupacao.length > 0"
        :data="item"
        :is="item.COMPONENT"
        :title="item.TITULO"
        :titleIcon="item.ICONE_TITULO"
        :actionUrl="item.ENDPOINT"
        :numSuperior="item.NUM_SUPERIOR"
        :indicador="item.INDICADOR"
        :produtoAtual="item.AGRUPAMENTO"
      ></component>
      <v-spacer></v-spacer>
    </v-col>
  </v-sheet>
</template>

<script>
  import strGetParamMixin from '../../../../../shared/mixins/stringToUrlGetParam'
  import tabelaGerencialAbs from './table/tableGerencialAbs.vue'

  import { OcupacaoService } from '@/data/services/relatorioOnline'

  import ItemsSelector from '@/shared/components/ItemsSelector.vue'
  export default {
    name: 'abs-component',
    mixins: [strGetParamMixin],
    components: {
      tabelaGerencialAbs,
      ItemsSelector
    },
    props: {
      produtos: {
        type: Array,
        default: () => []
      }
    },
    data: () => ({
      produtoAtual: 'NET',
      agrupamentoAtual: 'COMBO N1',
      agrupamentos: [],
      absConfigOcupacao: [],
      loadingDataService: false,
      loadingConfig: false
    }),
    computed: {
      perfil() {
        return this.$store.getters.usuario.filtro
      },
      produto() {
        return this.$store.getters.usuario.produto
      }
    },
    methods: {
      async loadDataService() {
        this.loadingDataService = true
        this.agrupamentos = await OcupacaoService.getGroupingProduct(this.produtoAtual, 'ABS')
        this.agrupamentoAtual = this.agrupamentos[0].text
        this.loadingDataService = false
        this.loadConfig()
      },
      async loadConfig() {
        this.loadingConfig = true
        this.absConfigOcupacao = await OcupacaoService.getConfigReportOccupation(
          this.agrupamentoAtual,
          'ABS',
          this.produtoAtual
        )
        this.loadingConfig = false
      }
    },
    created() {
      this.produtoAtual = this.produto

      this.loadDataService()
      this.loadConfig()
    }
  }
</script>

<style></style>
