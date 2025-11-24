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
        <img src="../../../assets/img/geral/index-bf.png" />
      </template>
    </card-app-bar>
    <div class="mt-7">
      <v-row>
        <v-col cols="12">
          <v-card class="cor-padrao rounded-lg">
            <v-col>
              <p class="white--text text-class-h2">Dados Online</p>
              <div
                style="
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: center;
                  flex-wrap: wrap;
                "
              >
                <template v-if="resultadoOnline != ''">
                  <div v-for="(item, i) in resultadoOnline" :key="i" class="pa-5">
                    <card-dash
                      :title="item.COLUNA"
                      :valor="item.VALOR"
                      :iconFa="item.FA_ICON"
                      style="width: 200px"
                    ></card-dash>
                  </div>
                </template>
                <template v-else>
                  <h1 class="white--text">Não foram encontrados dados no momento!</h1>
                </template>
              </div>
            </v-col>
          </v-card>

          <v-card class="cor-padrao rounded-lg mt-7" v-if="resultadoHistoricoResidencial != ''">
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
            class="cor-padrao rounded-lg mt-7"
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
  </v-container>
</template>

<script>
  import cardAppBar from '../../../shared/components/cards/modern/cardAppBar.vue'

  import config from '../../../core/config'
  import CardDash from '../../../shared/components/cards/modern/cardDash.vue'
  import loadhastag from '../../../shared/components/load/loadHastag.vue'
  export default {
    components: { cardAppBar, CardDash, loadhastag },
    data: () => ({
      resultadoOnline: [],
      resultadoHistoricoResidencial: [],
      resultadoHistoricoMovel: [],
      items: [],
      selectedView: 'Online',
      isItems: false,
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
        let urlData = `${config.baseUrl}api/shared/brownfield/supervisor/resultado_online/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          this.resultadoOnline = res.data
          this.loadResultadoHistorico()
        })
      },
      loadResultadoHistorico() {
        let urlData = `${config.baseUrl}api/shared/brownfield/supervisor/resultado_historico_residencial/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          this.resultadoHistoricoResidencial = res.data
          // this.loadingData = false;
          this.loadResultadoHistoricoMovel()
        })
      },
      loadResultadoHistoricoMovel() {
        let urlData = `${config.baseUrl}api/shared/brownfield/supervisor/resultado_historico_movel/${this.usuarioAlmope}`
        this.$api.get(urlData).then(res => {
          this.resultadoHistoricoMovel = res.data
          this.loadingData = false
        })
      }
    },
    created() {
      this.loadResultadoOnline()
      // this.loadResultadoHistorico();
      // this.testeLoading();
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

  img {
    position: absolute;
    height: 200px;
    bottom: 3px;
    right: 15px;
  }

  .text-class-h2 {
    border-left: 3px solid rgb(240, 240, 240);
    padding-left: 10px; /* opcional para espaçar o texto da linha */
    font-size: 20px;
  }

  .cor-padrao {
    background-image: linear-gradient(260deg, rgb(0, 236, 255), #8f0e8f);
  }
</style>
