<template>
  <!-- v-model="openValidacaoSales" -->
  <v-dialog
    fullscreen
    :model-value="openValidacaoSales"
    @update:modelValue="val => $emit('update:openValidacaoSales', val)"
    persistent
    style="overflow-y: hidden !important"
  >
    <v-card tile class="overflow-hidden">
      <v-card-title
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
        "
      >
        <div style="display: flex; align-items: center">
          <h2>Sugestões</h2>
          <a @click="carregarMaisOfertas">
            {{ maisOpcoes == 0 ? 'Carregar mais ofertas' : 'Principais Ofertas' }}
          </a>
        </div>
        <div style="display: flex; justify-content: end">
          <v-btn icon @click="$emit('update:closeDialog')">
            <v-icon>fa fa-close</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <div
        style="
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 10px;
          flex-wrap: wrap;
          height: 90vh;
          overflow-y: auto;
          position: relative;
        "
      >
        <pricing-tables
          v-for="(item, i) in sugestoesOfertas"
          :key="i"
          :index="i"
          class="pa-2"
          :title="item.DESC_FLAG_OFERTA"
          :description="item.CHAVE_FRANQUIA_DESC"
          :price="item.VALOR_PLANO"
          :valorTv="arrayDados.valorAssinaturaTv"
          :descriptionPlan="item.CHAVE_DESC_PLANO_FRANQUIA"
          :observacaoProduto="item.DESC_OBSERVACAO"
          :valorVirtua="arrayDados.valorAssinaturaVirtua"
          :valorFone="arrayDados.valorAssinaturaFone"
          @update:cadastrar-oferta="cadastrarOferta"
          :dadosFormulario="arrayDados"
          :ofertasConcorrentes="ofertasConcorrentes"
          :idPlan="item.ID_VEND_PRODUTO"
          :descNetSales="item.DESC_CAD_NET_SALES"
          :condicoesOfertas="item.CONDICOES_OFERTAS"
        ></pricing-tables>
        <nao-aceitou
          class="pa-2"
          :dadosFormulario="arrayDados"
          @update:dadosEnviadosNaoAceitou="dadosEnviadosNaoAceitou"
        ></nao-aceitou>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  import pricingTables from './pricingTablesOfertas.vue'
  import naoAceitou from './naoAceitou.vue'

  import config from '../../core/config'
  export default {
    components: { pricingTables, naoAceitou },
    props: {
      openValidacaoSales: {
        type: Boolean,
        default: false
      },
      arrayDados: {
        type: [Array, Object]
      }
      // sugestoesOfertas: {
      //   type: [Array, Object],
      // },
    },
    data: () => ({
      sugestoesOfertas: [],
      maisOpcoes: 0,
      ofertasConcorrentes: [],
      itemsPerfilOfertas: [],
      perfilOfertaSelecionado: null
    }),
    methods: {
      async loadPerfilOfertas() {
        let urlData = `${config.baseUrl}api/shared/smartsales/televendas/perfil_oferta/${this.arrayDados?.nomeCidade}`
        var res = await this.$api.get(urlData)
        this.itemsPerfilOfertas = res.data
        this.perfilOfertaSelecionado = res.data[0]?.PERFIL_OFERTA
        await this.loadSugestoes()
      },
      loadOfertasConcorrentes() {
        let urlData = `${config.baseUrl}api/shared/smartsales/televendas/ofertas_concorrentes`
        this.$api.get(urlData).then(res => {
          this.ofertasConcorrentes = res.data
        })
      },
      dadosEnviadosNaoAceitou() {
        this.$emit('update:closeDialog')
        this.$emit('update:limparFormNaoAceitou')
      },
      carregarMaisOfertas() {
        if (this.maisOpcoes == 0) {
          this.maisOpcoes = 1
        } else {
          this.maisOpcoes = 0
        }
      },
      async loadSugestoes() {
        let urlData = `${config.baseUrl}api/shared/smartsales/televendas/sugestao_smart/${this.arrayDados?.nomeCidade}/${this.maisOpcoes}/${this.arrayDados?.operadora}/${this.perfilOfertaSelecionado}`
        var res = await this.$api.get(urlData)
        this.sugestoesOfertas = res.data
      },
      cadastrarOferta(e) {
        this.$emit('update:closeDialog')

        // emitir evento para abrir modal televendas
        this.$emit('update:abrirModalTelevendas', e)
      }
    },
    created() {
      this.loadOfertasConcorrentes()
    },
    watch: {
      maisOpcoes() {
        this.loadSugestoes()
      },
      openValidacaoSales() {
        if (this.openValidacaoSales == true) {
          // this.loadSugestoes();
          this.loadPerfilOfertas()
          this.maisOpcoes = 0
        }
      }
    }
  }
</script>

<style scoped>
  a {
    position: relative;
    z-index: 2;
    background: #333;
    color: #fbfbfb;
    width: 210px;
    height: 40px;
    line-height: 40px;
    border-radius: 40px;
    display: block;
    margin-left: 10px;
    text-align: center;
    -webkit-border-radius: 40px;
    -moz-border-radius: 40px;
    -ms-border-radius: 40px;
    -o-border-radius: 40px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    text-decoration: none;
    font-weight: 600;
  }

  >>> .v-dialog {
    overflow-y: visible;
  }
</style>
