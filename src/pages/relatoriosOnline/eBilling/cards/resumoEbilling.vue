<template>
  <v-card elevation="0">
    <v-col>
      <title-background>
        <template v-slot:title>
          <v-icon color="white" class="mr-2">mdi-receipt-text-check</v-icon>
          Fatura Digital
        </template>
      </title-background>

      <v-row class="mt-n16" align="center" justify="center">
        <template v-for="(item, i) in tabulacoes" :key="i.COLUNA">
          <v-col cols="2">
            <card-resultado-inline :title="item.COLUNA" :valor="item.VALOR"></card-resultado-inline>
          </v-col>

          <v-divider vertical inset class=""></v-divider>
        </template>
      </v-row>
    </v-col>
  </v-card>
</template>

<script>
  import cardResultadoInline from '../../../../shared/components/cards/cardResultadoInline.vue'
  import titleBackground from '../../../../shared/components/cards/cardTituloPaginaComFundo'
  import config from '../../../../core/config.js'
  export default {
    components: { titleBackground, cardResultadoInline },
    props: {
      agrupamento: {
        type: String,
        default: 'MASSIVO GO'
      },
      tipoSolicitacao: {
        type: String,
        default: 'FATURA DIGITAL'
      }
    },
    data: () => ({
      tabulacoes: []
    }),
    methods: {
      loadDadosTabulacao() {
        let urlData = `${config.baseUrl}api/shared/ebilling/dados_cards_gerencial/${this.agrupamento}/${this.tipoSolicitacao}`
        this.$api.get(urlData).then(res => {
          this.tabulacoes = res.data
        })
      }
    },
    watch: {
      agrupamento() {
        this.loadDadosTabulacao()
      },
      tipoSolicitacao() {
        this.loadDadosTabulacao()
      }
    },
    created() {
      this.loadDadosTabulacao()
    }
  }
</script>

<style></style>
