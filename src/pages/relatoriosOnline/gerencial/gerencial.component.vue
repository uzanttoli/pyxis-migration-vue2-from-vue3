<template>
  <v-sheet class="mx-5">
    <v-row class="ma-0 mt-7">
      <v-col cols="12" class="ma-0 pa-0">
        <card-titulo-pagina-com-fundo>
          <template v-slot:title>
            <v-icon color="white" class="mr-2">mdi-monitor-dashboard</v-icon>
            Gerencial
          </template>

          <template v-slot:subtitle>
            <v-icon color="orange">mdi-transit-connection-variant</v-icon>
            <v-progress-circular :size="15" :value="countInterval"></v-progress-circular>
          </template>
        </card-titulo-pagina-com-fundo>
      </v-col>
    </v-row>

    <v-row class="pa-0 ma-0 ml-0">
      <v-col cols="12">
        <v-toolbar class="elevation-0" dense>
          <v-btn-toggle
            v-model="produtoAtual"
            @change="$emit('update:produtoatual', produtoAtual), reloadData()"
            dark
            rounded
            mandatory
          >
            <v-btn v-for="(item, i) in produtos" :key="i" :value="item.PRODUTO">
              {{ item.PRODUTO }}
            </v-btn>
          </v-btn-toggle>
        </v-toolbar>
      </v-col>
    </v-row>

    <v-row>
      <v-card color="white" class="mx-auto rounded-xl" v-if="!loading" width="100%">
        <v-tabs v-model="tab" grow>
          <template v-for="(tab, i) in tabs">
            <v-tab
              :key="i"
              @click="updateRoute(tab.ROUTE)"
              v-if="
                restricaoTipoAcesso(tab.COMPONENT_TIPO_ACESSO, filtro) &&
                restricaoRegional(tab.COMPONENT_REGIONAL_EXCECAO, regional)
              "
            >
              {{ tab.LABEL }}
            </v-tab>
          </template>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <template v-for="tab in tabs">
            <v-tab-item
              :key="tab.LABEL"
              v-if="
                restricaoTipoAcesso(tab.COMPONENT_TIPO_ACESSO, filtro) &&
                restricaoRegional(tab.COMPONENT_REGIONAL_EXCECAO, regional)
              "
            >
              <component :is="tab.COMPONENT" class="mx-3 mb-10"></component>
            </v-tab-item>
          </template>
        </v-tabs-items>
      </v-card>
    </v-row>
  </v-sheet>
</template>

<script>
  const TmtComponent = () => import('../../indicadorGerencial/tmt/tmt.component.vue')
  const LayoutOnlineComponent = () =>
    import('../../indicadorGerencial/layoutOnline/layoutOnline.component.vue')
  const PausaComponent = () => import('../../indicadorGerencial/pausa/pausa.component.vue')
  const InaderenciaComponent = () =>
    import('../../indicadorGerencial/inaderencia/inaderencia.component.vue')
  const CardTituloPaginaComFundo = () =>
    import('../../../shared/components/cards/cardTituloPaginaComFundo.vue')
  const cardDadosFila = () => import('../../../shared/components/cards/cardDadosFila.vue')

  import config from '../../../core/config'
  import validacaoAcesso from '../../../mixins/validacao'
  export default {
    name: 'gerencial-page',
    mixins: [validacaoAcesso],
    components: {
      TmtComponent,
      PausaComponent,
      InaderenciaComponent,
      cardDadosFila,
      LayoutOnlineComponent,
      CardTituloPaginaComFundo
      // ControleDeslogueComponent,
      // AbsComponent,
    },
    data: () => ({
      nameSubmenu: 'gerencial',
      interval: null,
      countInterval: 0,
      loading: false,
      totalResumo: 0,
      tab: null,
      tabs: []
    }),
    computed: {
      produtoAtual: {
        get: function () {
          return this.$store.getters.produto
        },
        set: function (newValue) {
          this.$store.dispatch('setProduto', newValue)
        }
      },
      regional() {
        let tipo = this.$store.getters.usuario.regional
        return tipo.toLowerCase()
      },
      filtro() {
        let filtro = this.$store.getters.usuario.filtro
        return filtro.toLowerCase()
      },
      operacao() {
        return this.$store.getters.usuario.produto
      },
      produto() {
        return this.$store.getters.usuario.produto
      },
      produtos() {
        return this.$store.getters.produtos
      },
      dadosFila() {
        return this.$store.getters.dadosFila
      },
      dacDescricao() {
        return this.$store.getters.dacDescricao
      },
      produtoDac() {
        let produto = this.produtos.filter(el => {
          return el.PRODUTO == this.produtoAtual
        })[0]
        return produto
      },
      resumoPausas() {
        return this.$store.getters.resumoPausas ? this.$store.getters.resumoPausas : null
      },
      totalResumoPausa() {
        if (this.resumoPausas) {
          let total = 0
          total =
            this.resumoPausas.PAUSAS * 1 +
            this.resumoPausas.DISPONIVEIS * 1 +
            this.resumoPausas.ATD * 1 +
            this.resumoPausas.POS_ATD * 1
          return total
        }
        return 0
      },
      buildResumoPausas() {
        let resumoPausa = this.$store.getters.resumoPausas
        if (resumoPausa) {
          return [
            {
              title: 'Agentes',
              icon: 'mdi-account-group',
              data: [
                {
                  label: 'Disponíveis',
                  value: resumoPausa.DISPONIVEIS,
                  icon: 'mdi-account-settings'
                },
                {
                  label: 'Atendimento',
                  value: resumoPausa.ATD,
                  icon: 'mdi-phone-message'
                },
                {
                  label: 'Pós Atd.',
                  value: resumoPausa.POS_ATD,
                  icon: 'mdi-phone-log'
                },
                {
                  label: 'Total',
                  value: this.totalResumo,
                  icon: 'mdi-equal-box'
                }
              ]
            },
            {
              title: 'Atendimento',
              icon: 'mdi-phone-in-talk',
              data: [
                {
                  label: 'Almaviva',
                  value: resumoPausa.ALMAVIVA,
                  icon: 'mdi-alpha-a-circle'
                },
                {
                  label: 'Transbordo Externo',
                  value: resumoPausa.TRB_EXTERNO,
                  icon: 'mdi-alpha-e-circle'
                }
              ]
            },
            {
              title: 'Pausas',
              icon: 'mdi-alarm',
              data: [
                { label: 'Pausas', value: resumoPausa.PAUSAS, icon: 'mdi-clock' },
                {
                  label: 'Devidas',
                  value: resumoPausa.PAUSAS_DEVIDAS,
                  icon: 'mdi-clock-check-outline'
                },
                {
                  label: 'Indevidas',
                  value: resumoPausa.PAUSAS_INDEVIDAS,
                  icon: 'mdi-clock-alert-outline'
                }
              ]
            },
            {
              title: 'NR17',
              icon: 'mdi-timeline-clock',
              data: [
                {
                  label: 'Alimentação',
                  value: resumoPausa.ALIMENTACAO,
                  icon: 'mdi-pasta'
                },
                {
                  label: 'Descanso',
                  value: resumoPausa.DESCANSO,
                  icon: 'mdi-cup-water'
                },
                {
                  label: 'Particular',
                  value: resumoPausa.PARTICULAR,
                  icon: 'mdi-paper-roll'
                }
              ]
            },
            {
              title: 'Abordagem',
              icon: 'mdi-account-clock',
              data: [
                {
                  label: 'Feedback',
                  value: resumoPausa.FEEDBACK,
                  icon: 'mdi-account-group'
                },
                {
                  label: 'Laboral',
                  value: resumoPausa.LABORAL,
                  icon: 'mdi-account-group-outline'
                },
                {
                  label: 'Treinamento',
                  value: resumoPausa.TREINAMENTO,
                  icon: 'mdi-account-multiple-check'
                }
              ]
            },
            {
              title: 'Outros',
              icon: 'mdi-clock-alert',
              data: [
                {
                  label: 'Sistema',
                  value: resumoPausa.SISTEMA,
                  icon: 'mdi-monitor'
                },
                {
                  label: 'Excedidas',
                  value: resumoPausa.PAUSAS_ESTOURO,
                  icon: 'mdi-timer-off'
                },
                {
                  label: 'Indevidas',
                  value: resumoPausa.PAUSAS_INDEVIDAS,
                  icon: 'mdi-clock-alert'
                }
              ]
            }
          ]
        }
        return []
      }
    },
    methods: {
      updateRoute(route) {
        this.$router.push({ path: route }).catch(() => {})
      },
      loadPainelConfig() {
        let urlData = `${config.baseUrl}api/shared/painel/config/${this.produto}/${this.nameSubmenu}`
        this.$api.get(urlData).then(res => {
          this.tabs = res.data
        })
      },
      convertToDecimalBR(valor) {
        return (valor / 100).toLocaleString(undefined, {
          style: 'percent',
          minimumFractionDigits: 2
        })
      },
      filterIt(arr, searchKey) {
        let tempArr = arr
        return tempArr.filter(function (obj) {
          return Object.keys(obj).some(function (key) {
            return obj[key].includes(searchKey)
          })
        })
      },
      currentRouteName() {
        return this.$router.history.current.path
      },
      loadProdutos() {
        this.$store.dispatch('loadProdutos', {
          filtro: this.filtro,
          operacao: this.operacao
        })
      },
      async loadDacDescricao() {
        await this.$store.dispatch('loadDacDescricao')
      },
      loadDadosFila() {
        if (this.produtoAtual && this.dacDescricao) {
          this.$store.dispatch(
            'loadDadosFila',
            this.filterIt(this.dacDescricao, this.produtoAtual)[0].DAC_DESCRICAO
          )
        }
      },
      loadResumoPorDac() {
        if (this.produtoDac) this.$store.dispatch('loadResumoPausasDac', this.produtoDac.DAC)
      },
      reloadData() {
        this.loadDacDescricao()
        this.loadProdutos()
        this.loadDadosFila()
        this.loadResumoPorDac()
      }
    },
    created() {
      this.reloadData()
      this.loadPainelConfig()
      this.interval = setInterval(() => {
        this.countInterval += 9.66
        if (this.countInterval >= 99.6) {
          this.loadDadosFila()
          this.loadResumoPorDac()
          this.countInterval = 0
        }
      }, 5 * 6000)
    },
    beforeUnmount: function () {
      clearInterval(this.interval)
    }
  }
</script>

<style></style>
