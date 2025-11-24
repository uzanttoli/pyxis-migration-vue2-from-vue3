<template>
  <v-sheet class="mt-2">
    <v-alert dense border="left" color="yellow darken-3" class="white--text" v-if="attenttion">
      Para que as informações sejam carregadas, é necessário informar todos os campos da
      <strong>tabela pretendente.</strong>
    </v-alert>
    <v-col cols="12" v-for="(item, i) in configAcompanhamentoGeral" :key="i">
      <component
        :is="item.COMPONENT"
        :key="i"
        :title="item.TITULO"
        :titleIcon="item.ICONE_TITULO"
        :actionUrl="item.ENDPOINT"
        :numSuperior="item.NUM_SUPERIOR"
        :indicador="item.INDICADOR"
        :produtoAtual="item.AGRUPAMENTO"
        :actionUrl1="item.ENDPOINT_1"
        :actionUrl2="item.ENDPOINT_2"
        :actionUrl3="item.ENDPOINT_3"
      ></component>
    </v-col>
  </v-sheet>
</template>

<script>
  import strGetParamMixin from '../../../../shared/mixins/stringToUrlGetParam'
  import tabelaAcompanhamentoGeral from './table/tabelaAcompanhamentoGeral.component.vue'
  export default {
    name: 'acompanhamento-geral-component',
    mixins: [strGetParamMixin],
    components: {
      tabelaAcompanhamentoGeral
    },
    data: () => ({
      produtoAtual: 'NET COMBO',
      attenttion: true
    }),
    computed: {
      configAcompanhamentoGeral() {
        return this.$store.getters.configAcompanhamentoGeral
      },
      agrupamentosWorkflow: {
        get: function () {
          return this.$store.getters.agrupamentosWorkflow
        },
        set: function (newValue) {
          this.$store.dispatch('setAgrupamentosWorkflow', newValue)
        }
      }
    },
    methods: {
      loadAgrupamentosWorkflow() {
        this.$store.dispatch('loadAgrupamentosWorkflow')
      },
      loadConfigAcompanhamentoGeral() {
        this.$store.dispatch('loadConfigAcompanhamentoGeral', this.produtoAtual)
      }
    },
    created() {
      this.loadConfigAcompanhamentoGeral()
      this.loadAgrupamentosWorkflow()
      setTimeout(() => {
        this.attenttion = false
      }, 60 * 1000)
    }
  }
</script>

<style></style>
