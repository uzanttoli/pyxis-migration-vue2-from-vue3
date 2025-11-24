<template>
  <v-card class="" elevation="0">
    <v-col>
      <card-app-bar
        customClass="rounded-xl"
        :minHeight="100"
        style="margin-top: 10px; margin-bottom: 22px"
        styleCustom="display: flex; height: 100px; padding: 25px; align-items: center; color: #fafafa;"
      >
        <template v-slot:title>
          <div style="display: flex; align-items: center; gap: 10px">
            <h3>
              <v-icon color="white" x-large class="mr-3" v-if="isLoadingCompleted">
                fa-solid fa-chart-pie
              </v-icon>

              <v-progress-circular v-else indeterminate value="20"></v-progress-circular>
              AC Performance Online
            </h3>
          </div>
        </template>

        <template v-slot:imagem>
          <img
            src="@/assets/img/geral/03-index-bf-sem-fundo.png"
            style="position: absolute; height: 125px; bottom: -20px; right: 20px"
          />
        </template>
      </card-app-bar>

      <div class="my-3" style="display: flex; justify-content: center; gap: 5px; flex-wrap: wrap">
        <fieldset style="padding: 7px; border: 0.5px solid #3333; border-radius: 5px">
          <legend
            style="
              font-size: 13px;
              margin: 0 5px;
              color: #343;
              padding: 0;
              margin-bottom: -5px;
              padding: 0 4px;
            "
          >
            Operação
          </legend>

          <v-btn-toggle
            mandatory
            v-model="regionalSkill"
            class="rounded-lg"
            dense
            active-class="blue darken-3"
            @change="loadDadosCards()"
          >
            <v-btn
              width="90"
              class="text-capitalize"
              v-for="(item, i) in operacoes"
              :key="i"
              :value="item.valor"
              :class="item.valor == regionalSkill ? 'white--text' : ''"
            >
              <i
                v-if="item.valor == regionalSkill"
                class="fa-solid fa-circle-check"
                style="color: greenyellow; margin-right: 5px"
              ></i>
              {{ item.text }}
            </v-btn>
          </v-btn-toggle>
        </fieldset>

        <fieldset style="padding: 7px; border: 0.5px solid #3333; border-radius: 5px">
          <legend
            style="
              font-size: 13px;
              margin: 0 5px;
              color: #343;
              padding: 0;
              margin-bottom: -5px;
              padding: 0 4px;
            "
          >
            Relatórios
          </legend>

          <v-btn-toggle
            mandatory
            v-model="relatorioAtual"
            class="rounded-lg"
            dense
            active-class="blue darken-3"
          >
            <v-btn
              class="text-capitalize"
              v-for="(item, i) in botoes"
              :key="i"
              :value="item.valor"
              :class="item.valor == relatorioAtual ? 'white--text' : ''"
            >
              <i
                v-if="item.valor == relatorioAtual"
                class="fa-solid fa-circle-check"
                style="color: greenyellow; margin-right: 5px"
              ></i>
              {{ item.text }}
            </v-btn>
          </v-btn-toggle>
        </fieldset>
      </div>

      <v-col>
        <div
          class="scroll-cards"
          style="
            display: flex;
            flex-wrap: wrap;
            justify-content: space-evenly;
            flex-direction: row;
            background-color: #fff;
            border-radius: 30px;
            padding: 10px;
            box-shadow: inset 0 0 3px rgba(0, 0, 0, 0.25);
            max-height: 400px;
            overflow: auto;
          "
        >
          <v-skeleton-loader
            class="rounded-xl"
            v-if="loadingCards"
            type="card"
            width="100%"
          ></v-skeleton-loader>

          <template v-for="(item, i) in dadosCard" :key="i">
            <v-col>
              <card-dash :valor="item.VALOR" :title="item.COLUNA"></card-dash>
            </v-col>
          </template>
        </div>
      </v-col>

      <div class="my-3 mt-n3">
        <!-- <pre>{{ configuracaoComponents }}</pre> -->

        <v-col v-for="(item, i) in configuracaoComponents" :key="i">
          <table-performance-online
            :report="relatorioAtual"
            :numSuperior="item.NUM_SUPERIOR"
            :title="item.TITULO"
            :intervalos="intervalos"
            :actionUrl="item.ENDPOINT"
            :regional="regionalSkill"
          ></table-performance-online>
        </v-col>
      </div>
    </v-col>
  </v-card>
</template>

<script>
  import cardAppBar from '@/shared/components/cards/modern/cardAppBar.vue'
  import TablePerformanceOnline from './tablePerformanceOnline.vue'
  import CardDash from '../../../../../shared/components/cards/modern/cardDash.vue'

  import config from '../../../../../core/config'
  export default {
    components: {
      cardAppBar,
      TablePerformanceOnline,
      CardDash
    },
    data: () => ({
      isLoadingCompleted: false,
      loadingCards: false,
      relatorioAtual: null,
      regionalSkill: null,
      configuracaoComponents: [],
      dadosCard: [],
      operacoes: [
        {
          text: 'COMBO',
          valor: 'NET COMBO - RETENCAO'
        },
        {
          text: 'MTF',
          valor: 'NET - RETENCAO_SUL 2_SP 3'
        }
      ],
      botoes: [
        {
          text: '(%) Performance OS',
          valor: 'performance os'
        },
        {
          text: '(%) Desconexão por Chamada',
          valor: 'desconexao chamada'
        }
      ],
      intervalos: []
    }),
    methods: {
      loadConfiguracaoComponents() {
        let urlData = `${config.baseUrl}api/shared/config/config_components/NET/PERFORMANCE ONLINE`
        this.$api.get(urlData).then(res => {
          this.configuracaoComponents = res.data
        })
      },
      loadIntervalos() {
        let urlData = `${config.baseUrl}api/shared/retencao/performance/intervalos`
        this.$api.get(urlData).then(res => {
          this.intervalos = res.data
        })
      },
      loadDadosCards() {
        this.loadingCards = true
        this.isLoadingCompleted = false
        let urlData = `${config.baseUrl}api/shared/retencao/performance/dados_cards`
        this.$api.get(urlData, { params: { regional: this.regionalSkill } }).then(res => {
          this.dadosCard = res.data
          if (res.data != '') {
            this.loadingCards = false
            this.isLoadingCompleted = true
          }
        })
      },
      colorButton() {
        return '#3a91d1'
      }
    },
    created() {
      this.loadConfiguracaoComponents()
      this.loadIntervalos()
      this.loadDadosCards()
    }
  }
</script>

<style scoped>
  .color-button {
    color: #3a91d1;
  }
</style>
