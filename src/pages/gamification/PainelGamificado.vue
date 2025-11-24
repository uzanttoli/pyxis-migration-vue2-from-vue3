<template>
  <section>
    <v-card class="mx-auto rounded-xl mt-5 mb-5" width="100%" v-if="isFinish">
      <v-tabs v-model="tab" grow background-color="#1a2068" color="white">
        <template v-if="tabs && tabs.length">
          <v-tabs-slider color="yellow"></v-tabs-slider>
          <template v-for="(item, i) in tabs">
            <v-tab
              :key="i"
              @click="updateRoute(item.ROUTE)"
              v-if="restricaoRegional(item.COMPONENT_TIPO_ACESSO, filtro)"
            >
              <v-progress-circular
                indeterminate
                color="white"
                class="mr-5"
                v-if="tabs[tab] ? tabs[tab]['LABEL'] == item.LABEL && loadData : false"
              ></v-progress-circular>
              <v-icon class="mr-2" color="white" size="16">{{ item.ICONE }}</v-icon>
              <span style="color: white">{{ item.LABEL }}</span>
            </v-tab>
          </template>
        </template>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <template v-for="tab in tabs">
          <v-tab-item :key="tab.LABEL" v-if="restricaoRegional(tab.COMPONENT_TIPO_ACESSO, filtro)">
            <component :is="tab.COMPONENT" class="mx-3 mb-10" @updated-load="isLoad"></component>
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
  import validacaoAcesso from '../../mixins/validacao.js'
  import spotPlayerComponent from './spotPlayer/SpotPlayer.vue'
  import regrasComponent from './detalhes/Detalhe.vue'
  import ComunicadoFimSeason from './components/ComunicadoFimSeason.vue'
  import apresentacaoCarouselComponent from '../../shared/components/carousel/apresentacaoResultadoCarousel.component.vue'

  import config from '../../core/config'

  export default {
    components: {
      spotPlayerComponent,
      regrasComponent,
      ComunicadoFimSeason,
      apresentacaoCarouselComponent
    },
    mixins: [validacaoAcesso],
    data: () => ({
      tab: null,
      tabs: [],
      arrayImg: [],
      nameSubmenu: 'spot-player',
      periodoFim: '',
      isFinish: true,
      resultTemporada: null,
      loadData: false
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
      dateNow() {
        this.moment.locale('pt-br')
        return this.moment().format('YYYY-MM-DD')
      }
    },
    methods: {
      isLoad(e) {
        this.loadData = e
      },
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
      seasonIsValid() {
        let fimPeriodo = this.moment(this.periodoFim)
        let hoje = this.moment(this.dateNow)
        let diferenca = hoje.diff(fimPeriodo, 'day')

        if (diferenca < 0) {
          return (this.isFinish = true)
        } else {
          return (this.isFinish = false)
        }
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
            let periodoFim = res.data[0]?.DATA_FIM
            this.resultTemporada = res.data[0]?.RESULTADO_DISP

            let fimPeriodo = this.moment(periodoFim)
            let hoje = this.moment(this.dateNow)
            let diferenca = hoje.diff(fimPeriodo, 'day')

            if (diferenca < 0) {
              return (this.isFinish = true)
            } else {
              return (this.isFinish = false)
            }
          })
      }
    },
    created() {
      this.fimTemporada()
      this.loadImgWinner()
      this.loadPainelConfig()
    }
  }
</script>

<style scoped></style>
