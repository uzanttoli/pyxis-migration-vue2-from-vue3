<template>
  <section>
    <v-card class="mx-auto rounded-xl mt-10 mb-5" width="100%" v-if="!seasonIsValid">
      <v-tabs v-model="tab" grow>
        <template v-for="(tab, i) in tabs">
          <v-tab
            :key="i"
            class="rounded-t-xl"
            @click="updateRoute(tab.ROUTE)"
            v-if="restricaoRegional(tab.COMPONENT_TIPO_ACESSO, filtro)"
          >
            {{ tab.LABEL }}
          </v-tab>
        </template>
      </v-tabs>
      <v-tabs-items v-model="tab" class="fundo">
        <template v-for="tab in tabs">
          <v-tab-item :key="tab.LABEL" v-if="restricaoRegional(tab.COMPONENT_TIPO_ACESSO, filtro)">
            <component :is="tab.COMPONENT" class="mx-3 mb-10"></component>
          </v-tab-item>
        </template>
      </v-tabs-items>
    </v-card>
    <v-card v-else elevation="0">
      <template v-if="resultTemporada == 0">
        <comunicado-fim-season></comunicado-fim-season>
      </template>
      <template v-else>
        <apresentacao-carousel-component :items="arrayImg"></apresentacao-carousel-component>
      </template>
    </v-card>
  </section>
</template>

<script>
  import validacaoAcesso from '../../../mixins/validacao.js'
  import tabelaPendenteBencao from './solicitarBencao/TablePendentesBencao.vue'
  import tabelaValidacaoBencao from './gerenciarBencao/TableValidacaoBencao.vue'
  import tabelaGestaoPlayers from './TableGestaoPlayers.vue'
  import ComunicadoFimSeason from '../components/ComunicadoFimSeason.vue'
  import apresentacaoCarouselComponent from '../../../shared/components/carousel/apresentacaoResultadoCarousel.component.vue'

  import config from '../../../core/config'
  export default {
    name: 'GestaoDePlayers',
    components: {
      tabelaPendenteBencao,
      tabelaValidacaoBencao,
      tabelaGestaoPlayers,
      ComunicadoFimSeason,
      apresentacaoCarouselComponent
    },
    mixins: [validacaoAcesso],
    data: () => ({
      tab: null,
      tabs: [],
      nameSubmenu: 'gestao-player',
      resultTemporada: null,
      arrayImg: []
    }),
    computed: {
      filtro() {
        let filtro = this.$store.getters.usuario.filtro
        return filtro.toLowerCase()
      },
      painelConfig() {
        let painelConfig = this.$store.getters.painelConfig
        return painelConfig ? painelConfig : []
      },
      produto() {
        return this.$store.getters.usuario.produto
      },
      seasonIsValid() {
        let fimPeriodo = this.moment(this.periodoFim)
        let hoje = this.moment(this.dateNow)

        let diferenca = hoje.diff(fimPeriodo, 'day')

        if (diferenca <= 0) {
          return false
        } else {
          return true
        }
      }
    },
    methods: {
      loadImgWinner() {
        let urlData = `${config.baseUrl}api/shared/gamification/ganhadores/img`
        this.$api.get(urlData).then(res => {
          this.arrayImg = res.data
        })
      },
      updateRoute(route) {
        this.$router.push({ path: route }).catch(() => {})
      },
      loadPainelConfig() {
        let urlData = `${config.baseUrl}api/shared/painel/config/${this.produto}/${this.nameSubmenu}`
        this.$api.get(urlData).then(res => {
          this.tabs = res.data
        })
      },
      fimTemporada() {
        let urlData = `${config.baseUrl}api/shared/gamification/spot_player/finish_season`
        this.$api
          .get(urlData, {
            params: {
              tipoPerfil: this.filtro,
              produto: this.produto
            }
          })
          .then(res => {
            this.periodoFim = res.data[0]?.DATA_FIM
            this.resultTemporada = res.data[0]?.RESULTADO_DISP
          })
      }
    },
    created() {
      this.loadImgWinner()
      this.loadPainelConfig()
      this.fimTemporada()
    }
  }
</script>

<style scoped>
  img {
    width: 100%;
    height: 100%;
    position: absolute;
    border-bottom-right-radius: 26px;
    border-bottom-left-radius: 26px;
  }
</style>
