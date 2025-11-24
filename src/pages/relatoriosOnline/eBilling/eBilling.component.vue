<template>
  <v-sheet elevation="0" class="mt-5">
    <resumo-ebilling :agrupamento="dxAtual" :tipoSolicitacao="tipoSelecionado"></resumo-ebilling>
    <v-col cols="12">
      <v-toolbar class="elevation-0" dense>
        <v-btn-toggle v-model="dxAtual" dark rounded mandatory>
          <v-btn v-for="(item, i) in agrupamentosEbilling" :key="i" :value="item.AGRUPAMENTO">
            {{ item.AGRUPAMENTO }}
          </v-btn>
        </v-btn-toggle>
      </v-toolbar>
    </v-col>
    <v-card elevation="0">
      <v-col>
        <v-toolbar class="elevation-0" dense>
          <v-btn-toggle
            color="primary"
            class="rounded-tl-xl rounded-br-xl"
            tile
            mandatory
            v-model="tipoSelecionado"
          >
            <v-btn v-for="(item, i) in tipoSolicitacao" :key="i" :value="item.TIPO_SOLICITACAO">
              {{ item.TIPO_SOLICITACAO }}
            </v-btn>
          </v-btn-toggle>
        </v-toolbar>
      </v-col>
      <v-card class="ma-3 mt-6 mb-6" elevation="1">
        <v-row>
          <v-col cols="8">
            <ebilling-diario
              :agrupamento="dxAtual"
              :tipoSolicitacao="tipoSelecionado"
            ></ebilling-diario>
          </v-col>
          <v-col cols="4">
            <ebilling-semanal
              :agrupamento="dxAtual"
              :tipoSolicitacao="tipoSelecionado"
            ></ebilling-semanal>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="8">
            <zerados-ebilling-diario :agrupamento="dxAtual"></zerados-ebilling-diario>
          </v-col>
          <v-col cols="4">
            <zerados-ebilling-semanal :agrupamento="dxAtual"></zerados-ebilling-semanal>
          </v-col>
        </v-row>
      </v-card>
      <v-row class="pa-0 ma-0 ml-0">
        <v-col cols="12" v-for="(item, i) in configEbilling" :key="i">
          <component
            :is="item.COMPONENT"
            :title="item.TITULO"
            :titleIcon="item.ICONE_TITULO"
            :numSuperior="item.NUM_SUPERIOR"
            :actionUrl="item.ENDPOINT"
            :agrupamento="dxAtual"
            :tipoSolicitacao="tipoSelecionado"
          ></component>
        </v-col>
      </v-row>
    </v-card>
  </v-sheet>
</template>

<script>
  import tabelaEbillingComponent from './table/gerencialEbilling.vue'
  import config from '../../../core/config.js'
  import ResumoEbilling from './cards/resumoEbilling.vue'
  import EbillingDiario from './charts/ebillingDiario.vue'
  import EbillingSemanal from './charts/ebillingSemanal.vue'
  import ZeradosEbillingDiario from './charts/zeradosEbillingDiario.vue'
  import ZeradosEbillingSemanal from './charts/zeradosSemanal.vue'
  export default {
    components: {
      tabelaEbillingComponent,
      ResumoEbilling,
      EbillingDiario,
      EbillingSemanal,
      ZeradosEbillingDiario,
      ZeradosEbillingSemanal
    },
    data: () => ({
      configEbilling: [],
      agrupamentosEbilling: [],
      dxAtual: 'MASSIVO RJ',
      tipoSelecionado: 'FATURA DIGITAL',
      tipoSolicitacao: []
    }),
    computed: {},
    methods: {
      loadConfigEbilling() {
        let urlData = `${config.baseUrl}api/shared/ebilling/config/${this.dxAtual}`
        this.$api.get(urlData).then(res => {
          this.configEbilling = res.data
        })
      },
      loadAgrupamento() {
        let urlData = `${config.baseUrl}api/shared/ebilling/agrupamentos`
        this.$api.get(urlData).then(res => {
          this.agrupamentosEbilling = res.data
        })
      },
      loadTipoSolicitacao() {
        let urlData = `${config.baseUrl}api/shared/ebilling/tipo_solicitacao`
        this.$api.get(urlData).then(res => {
          this.tipoSolicitacao = res.data
        })
      }
    },
    watch: {
      dxAtual() {
        this.loadConfigEbilling()
      }
    },
    created() {
      this.loadConfigEbilling()
      this.loadAgrupamento()
      this.loadTipoSolicitacao()
    }
  }
</script>

<style>
  color {
    color: #591b3db4;
  }
</style>
