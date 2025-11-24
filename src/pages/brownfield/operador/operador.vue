<template>
  <v-container fluid>
    <card-app-bar
      customClass="rounded-xl"
      :minHeight="135"
      style="margin-top: 75px"
      styleCustom="display: flex; flex-direction: column; height: 135px; padding: 25px; color: #fafafa;"
    >
      <template v-slot:title>
        <div style="display: flex; flex-direction: column">
          <h2>Olá, {{ usuario }}!</h2>
        </div>
      </template>
      <template v-slot:subtitle>
        <p style="font-size: 12px">Acompanhe suas vendas online e histórica aqui.</p>
      </template>
      <template v-slot:imagem>
        <img class="img-card" src="@/assets/img/geral/index-bf.png" />
      </template>
    </card-app-bar>
    <div class="mt-7">
      <v-row class="mb-7">
        <v-col sm="12" lg="9" md="8" xl="10">
          <v-card class="cor-padrao rounded-lg" v-if="resultadoOnline != ''">
            <v-col>
              <p class="white--text text-class-h2" style="display: flex">Dados Online</p>
              <div
                style="
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: center;
                  flex-wrap: wrap;
                "
              >
                <template>
                  <div v-for="(item, i) in resultadoOnline" :key="i" class="pa-5">
                    <card-dash
                      :title="item.COLUNA"
                      :valor="item.VALOR"
                      :iconFa="item.FA_ICON"
                      style="width: 200px"
                    ></card-dash>
                  </div>
                </template>
              </div>
            </v-col>
          </v-card>

          <!-- Card -->
        </v-col>
        <v-col
          :sm="resultadoOnline != '' ? '12' : '12'"
          :lg="resultadoOnline != '' ? '3' : '12'"
          :md="resultadoOnline != '' ? '4' : '12'"
          :xl="resultadoOnline != '' ? '2' : '12'"
        >
          <card-chat-bot
            :items="items"
            :loadingData="isItems"
            :isArrayObject="true"
            messageImportante="Extrato detalhado de vendas"
            statusMessages="STATUS VENDA"
            equalStatusMessages="ABERTO"
          >
            <template v-slot:button>
              <v-btn
                rounded
                depressed
                width="150"
                class="mb-2"
                :class="selectedView == 'ONLINE' ? 'primary' : 'orange lighten-5'"
                @click="selectedView = 'ONLINE'"
              >
                Online
              </v-btn>
              <v-btn
                rounded
                depressed
                width="150"
                @click="selectedView = 'HISTORICO'"
                :class="selectedView == 'HISTORICO' ? 'primary' : 'orange lighten-5'"
              >
                Histórico
              </v-btn>
            </template>
          </card-chat-bot>
        </v-col>
      </v-row>
      <v-row class="mt-n6">
        <v-col>
          <v-card class="cor-padrao rounded-lg mb-7" v-if="resultadoHistoricoResidencial != ''">
            <v-col>
              <p class="white--text text-class-h2">Dados Histórico - Residencial</p>
              <div
                style="
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: center;
                  flex-wrap: wrap;
                "
              >
                <template>
                  <div v-for="(item, i) in resultadoHistoricoResidencial" :key="i" class="pa-5">
                    <card-dash
                      :title="item.COLUNA"
                      :valor="item.VALOR"
                      :iconFa="item.FA_ICON"
                      style="width: 200px"
                    ></card-dash>
                  </div>
                </template>
              </div>
            </v-col>
          </v-card>
          <v-card
            class="cor-padrao rounded-lg"
            v-if="resultadoHistoricoMovel != '' && resultadoHistoricoMovel[0].COLUNA != null"
          >
            <v-col>
              <p class="white--text text-class-h2">Dados Histórico - Móvel</p>
              <div
                style="
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: center;
                  flex-wrap: wrap;
                "
              >
                <template>
                  <div v-for="(item, i) in resultadoHistoricoMovel" :key="i" class="pa-5">
                    <card-dash
                      :title="item.COLUNA"
                      :valor="item.VALOR"
                      :iconFa="item.FA_ICON"
                      style="width: 200px"
                    ></card-dash>
                  </div>
                </template>
              </div>
            </v-col>
          </v-card>
        </v-col>
      </v-row>
    </div>
    <loadhastag
      :envioDados="loadingData"
      :activeMsg="true"
      msg="Carregando dados, por favor aguarde!"
    ></loadhastag>
    <!-- <comunicado-importante
      styleImg="width:35vw; max-height: 210vh; padding: 10px 0px"
      maxWidth="45vw"
      title="TOP 3 | BROWNFIELD - EQUIPE ERIC"
      :srcImg="require('../../../assets/img/divulgacoes/bf-eric.png')"
    >
    </comunicado-importante> -->
  </v-container>
</template>

<script>
  import cardAppBar from '../../../shared/components/cards/modern/cardAppBar.vue'

  import config from '../../../core/config'
  import CardDash from '../../../shared/components/cards/modern/cardDash.vue'
  import CardChatBot from '../../../shared/components/cards/modern/chat/cardChatBot.vue'
  import loadhastag from '../../../shared/components/load/loadHastag.vue'
  // import comunicadoImportante from "../../../shared/components/comunication/comunicado.vue";
  export default {
    components: {
      cardAppBar,
      CardDash,
      CardChatBot,
      loadhastag
      // comunicadoImportante,
    },
    data: () => ({
      resultadoOnline: [],
      resultadoHistoricoResidencial: [],
      resultadoHistoricoMovel: [],
      messageImportante: 'Aqui está o extrato de todas as suas vendas!',
      selectedView: 'ONLINE',
      items: [],
      isItems: false,
      dialogChat: false,
      loadingData: false
    }),
    computed: {
      usuario() {
        let usuario = this.$store.getters.usuario.usuario
        let oneUsuario = usuario.split(' ')
        let nameExhibition = oneUsuario[0]
        let name = nameExhibition[0].toUpperCase() + nameExhibition.toLowerCase().slice(1)
        return name
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      loadResultadoOnline() {
        this.loadingData = true
        let urlData = `${config.baseUrl}api/shared/brownfield/operador/resultado_online/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          this.resultadoOnline = res.data
          this.loadResultadoHistoricoResidencial()
          this.loadResultadoHistoricoMovel()
        })
      },
      loadResultadoHistoricoResidencial() {
        let urlData = `${config.baseUrl}api/shared/brownfield/operador/resultado_historico_residencial/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          this.resultadoHistoricoResidencial = res.data
          // this.loadingData = false;
        })
      },
      loadResultadoHistoricoMovel() {
        let urlData = `${config.baseUrl}api/shared/brownfield/operador/resultado_historico_movel/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          this.resultadoHistoricoMovel = res.data
          this.loadingData = false
        })
      },
      loadDadosExtratoVendas() {
        this.isItems = true
        this.items = [{ message: '' }]
        let urlData = `${config.baseUrl}api/shared/brownfield/operador/extrato_vendas/${this.selectedView}/${this.usuarioAlmope}`
        this.$api.get(urlData).then(result => {
          let dados = result.data
          setTimeout(() => {
            this.items = dados
            this.isItems = false
          }, 4000)
        })
      }
    },
    created() {
      this.loadResultadoOnline()
      // this.loadResultadoHistoricoResidencial();
      this.loadDadosExtratoVendas()
    },
    watch: {
      selectedView() {
        this.loadDadosExtratoVendas()
      }
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap"); */

  h2 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 35px;
    color: white;
  }

  .img-card {
    position: absolute;
    height: 200px;
    bottom: 3px;
    right: 15px;
  }

  .text-class-h2 {
    border-left: 3px solid rgb(240, 240, 240);
    padding: 8px; /* opcional para espaçar o texto da linha */
    font-size: 20px;
  }

  .cor-padrao {
    background-image: linear-gradient(260deg, rgb(0, 236, 255), #8f0e8f);
  }
</style>
