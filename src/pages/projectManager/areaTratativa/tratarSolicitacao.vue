<template>
  <v-container class="mx-auto mt-5" fluid>
    <v-card class="rounded-lg pa-3" elevation="1">
      <v-img
        src="../../../assets/img/geral/banner-project.jpg"
        class="white--text align-end"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        height="225px"
      >
        <v-card-title class="font-weight-bold text-h4 text-capitalize">
          Seja bem vindo,
          <br />
          {{ userName }}!
        </v-card-title>
        <v-card-subtitle>Você está na área para tratativa de demanda!</v-card-subtitle>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
              class="mt-2"
              style="position: absolute; top: 2px; right: 10px"
              to="/pyxis/project-manager/gestao-solicitacoes/"
            >
              <v-icon color="black">fa-solid fa-right-from-bracket</v-icon>
            </v-btn>
          </template>
          <span>Voltar</span>
        </v-tooltip>
        <span v-if="dadosTratativa.ID_STATUS == 5">
          <v-alert type="error" tile>
            Está solicitação foi cancelada, entenda o motivo em mensagens!
          </v-alert>
        </span>
      </v-img>
      <div class="container-card">
        <v-col cols="4" xl="4" md="12" sm="12">
          <dados-solicitacao-id :dadosTratativa="dadosTratativa"></dados-solicitacao-id>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="4" xl="4" md="12" sm="12">
          <fase-solicitacao-id
            :dadosTratativa="dadosTratativa"
            :status="status"
            @updated:load-demanda="reloadDemanda"
          ></fase-solicitacao-id>
          <documentos-anexados-id
            v-if="isAddFile"
            title="Anexar evidência da tratativa"
            :idHash="dadosTratativa.NUM_SOLIC_HASH"
          ></documentos-anexados-id>
        </v-col>
        <v-divider vertical></v-divider>
        <v-col cols="3" xl="3" md="12" sm="12" class="mt-n8">
          <mensagens-demanda-id
            :infoList="dadosTratativa"
            :elevation="0"
            :title="false"
            :idHash="dadosTratativa.NUM_SOLIC_HASH"
            @update-add-file="addFile"
            :userSendMessage="almopeSend"
          >
            <div
              style="
                margin-bottom: 20px;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;
              "
            >
              <p class="ma-0 pa-0 mr-2" style="font-size: 14px; font-weight: 600; color: #787878">
                Mensagens
              </p>
              <v-tooltip bottom>
                <template v-slot:activator="{ attrs, on }">
                  <v-btn icon @click="changeAlterUser = !changeAlterUser" v-bind="attrs" v-on="on">
                    <v-icon>fa-regular fa-address-card</v-icon>
                  </v-btn>
                </template>
                <span>Alterar usuário de envio</span>
              </v-tooltip>
            </div>
            <div v-if="changeAlterUser">
              <v-select
                outlined
                dense
                placeholder="De"
                label="De"
                v-model="almopeSend"
                :items="almopeSendArray"
                item-text="name"
                item-value="id"
              ></v-select>
            </div>
          </mensagens-demanda-id>
        </v-col>
        <!-- <actions-fase-solicitacao :status="status"></actions-fase-solicitacao> -->
      </div>
    </v-card>
  </v-container>
</template>

<script>
  import config from '../../../core/config'
  import colors from '../../meuPerfil/dadosCadastrais/colors.js'
  import DocumentosAnexadosId from '../areaSolicitante/documentosAnexadosId.vue'
  import MensagensDemandaId from '../areaSolicitante/mensagensDemandaId.vue'
  import DadosSolicitacaoId from './dadosSolicitacaoId.vue'
  // import ActionsFaseSolicitacao from "./actionsFaseSolicitacao.vue";
  import FaseSolicitacaoId from './faseSolicitacaoId.vue'
  export default {
    components: {
      DadosSolicitacaoId,
      // ActionsFaseSolicitacao,
      FaseSolicitacaoId,
      MensagensDemandaId,
      DocumentosAnexadosId
    },
    data: () => ({
      almopeSendArray: [{ id: 1, name: 'CENTRO DE CONTROLE OPERACIONAL' }],
      almopeSend: null,
      infoList: [],
      status: [],
      notificarUser: true,
      changeAlterUser: false,
      agrupamentos: [
        {
          text: 'mplay retenção'
        },
        {
          text: 'net combo bko'
        },
        {
          text: 'net combo n1 total'
        }
      ],
      isAddFile: false,
      dadosTratativa: []
    }),
    computed: {
      colors() {
        return colors
      },
      userName() {
        let nome = this.$store.getters.usuario.nome || ''
        let oneName = nome.split(' ')
        let nameExhibition = oneName[0]
        return nameExhibition.toLowerCase()
      },
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      addFile() {
        this.isAddFile = !this.isAddFile
      },
      async reloadDemanda() {
        await this.loadDadosTratativa()
        await this.loadListStatus()
      },
      async loadListStatus() {
        let urlData = `${config.baseUrl}api/shared/project_manager/gestao/status/`
        var res = await this.$api.get(urlData)
        this.status = res.data
      },
      async loadDadosTratativa() {
        let urlData = `${config.baseUrl}api/shared/project_manager/gestao/dados_tratativa_id/${this.$route.params.id}`
        var res = await this.$api.get(urlData)
        this.dadosTratativa = res.data[0]
      }
    },
    created() {
      this.loadListStatus()
      this.loadDadosTratativa()

      this.almopeSendArray.push({
        id: this.usuario.almope,
        name: this.usuario.nome
      })

      this.almopeSend = this.usuario.almope
    }
  }
</script>

<style scoped>
  .container-card {
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    margin-top: 25px;
  }

  .container-formulario {
    /* width: 600px; */
  }
  .title-card {
    margin-bottom: 15px;
  }
  .data-solicitacao {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 10px;
  }
  .data-solicitacao span {
    font-size: 13px;
    color: #3a3a3ac7;
  }

  .circle-ico {
    text-align: center;
    border-radius: 50%;
    background-color: #b9f6ca;
    width: 20px;
  }

  .dados-solicitacao span {
    font-size: 13px;
    color: #3a3a3ac7;
  }

  .dados-body {
    margin-top: 20px;
  }

  .dados-form {
    margin-bottom: 25px;
  }

  /* FASES */
  .container-fase {
    /* width: 600px; */
  }

  .fase-title {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }

  .fase-body {
    margin-top: 24px;
  }

  .field-body {
    margin-bottom: 40px;
  }

  .status-fase {
  }

  .status-fase-title {
    margin-bottom: 15px;
  }

  .actions {
    gap: 10px;
  }
</style>
