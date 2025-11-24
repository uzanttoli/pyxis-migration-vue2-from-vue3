<template>
  <v-sheet elevation="0" class="mt-2">
    <div class="my-3" style="display: flex; justify-content: center; gap: 5px; flex-wrap: wrap">
      <ItemsSelector
        :items="produtos"
        colorBorderField="#3333"
        colorTitleField="#343"
        title="Produto"
        v-model="produtoAtual"
        @change="loadConfig()"
        :loading="loading"
      />
    </div>
    <v-col cols="12" v-for="(item, i) in operadoresConfig" :key="i">
      <component
        :is="item.COMPONENT"
        :key="i"
        :title="item.TITULO"
        :actionUrl="item.ENDPOINT"
        :numSuperior="item.NUM_SUPERIOR"
        :indicador="item.INDICADOR"
        :produtoAtual="item.PRODUTO"
      ></component>
    </v-col>
  </v-sheet>
</template>

<script>
  import strGetParamMixin from '../../../../../shared/mixins/stringToUrlGetParam'
  import tabelaVisaoOperador from './table/tableVisaoOperador.vue'
  import { OcupacaoService } from '@/data/services/relatorioOnline'

  import ItemsSelector from '@/shared/components/ItemsSelector.vue'
  export default {
    name: 'visao-operador-component',
    mixins: [strGetParamMixin],
    components: {
      tabelaVisaoOperador,
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
      operadoresConfig: [],
      loading: false
    }),
    computed: {
      produto() {
        return this.$store.getters.usuario.produto
      },
      perfil() {
        return this.$store.getters.usuario.filtro
      }
    },
    methods: {
      async loadConfig() {
        this.loading = true
        this.operadoresConfig = await OcupacaoService.getConfigReportOccupation(
          'N/A',
          'INDICADOR E ABS',
          this.produtoAtual
        )
        this.loading = false
      }
    },
    created() {
      this.produtoAtual = this.produto
      this.loadConfig()
    }
  }
</script>

<style></style>
