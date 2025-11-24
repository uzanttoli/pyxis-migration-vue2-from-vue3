<template>
  <v-card class="rounded-lg pa-3" elevation="1">
    <v-img
      height="200"
      class="align-end"
      style="position: relative"
      src="../../../assets/img/geral/banner-project.jpg"
    >
      <div
        style="
          background-color: #fefefe;
          width: 320px;
          border-top-right-radius: 10px;
          opacity: 0.83;
        "
      >
        <v-card-title class="font-weight-bold ma-0">Seja bem vindo, {{ nome }}!</v-card-title>
        <v-card-subtitle>Acompanhe suas solicitações aqui.</v-card-subtitle>
      </div>
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            class="mt-2"
            style="position: absolute; top: 2px; right: 10px"
            to="/pyxis/project-manager/area-do-solicitante/"
          >
            <v-icon color="black">fa-solid fa-right-from-bracket</v-icon>
          </v-btn>
        </template>
        <span>Voltar</span>
      </v-tooltip>
      <span v-if="listInfo.STATUS_SOLICITACAO == 'CANCELADOS'">
        <v-alert type="error" tile>
          Está solicitação foi cancelada, entenda o motivo em mensagens!
        </v-alert>
      </span>
      <span v-if="listInfo.STATUS_SOLICITACAO == 'FINALIZADOS'">
        <v-alert type="success" tile>Está solicitação foi finalizada!</v-alert>
      </span>
    </v-img>
    <div class="info-solicitacao">
      <v-card-title style="display: flex; justify-content: space-between; align-items: center">
        <div>
          <i
            class="fa-solid fa-receipt"
            style="margin-left: -10px; margin-right: 10px; color: #262626ba"
          ></i>
          Demanda nª. {{ $route.params.id }}
          <v-chip class="ma-2" color="info" label outlined small>
            {{ listInfo.STATUS_SOLICITACAO }}
          </v-chip>
        </div>
        <!-- <pre>{{ listInfo }}</pre> -->
        <v-btn
          v-if="listInfo.STATUS_SOLICITACAO == 'PENDENTE VALIDAÇÃO'"
          depressed
          color="success"
          class="mr-n4"
          @click="validarDemanda"
        >
          <i class="fa-solid fa-circle-check mr-2"></i>
          Validar demanda
        </v-btn>
        <v-btn
          v-else
          depressed
          color="error"
          class="mr-n4"
          small
          :disabled="
            listInfo == '' ||
            listInfo.NOME_USUARIO_DESIGNADO != null ||
            listInfo.STATUS_SOLICITACAO == 'CANCELADOS'
          "
          @click="cancelarDemanda"
        >
          <i class="fa-solid fa-arrow-right mr-1"></i>
          Cancelar
        </v-btn>
        <v-alert
          v-if="listInfo.STATUS_SOLICITACAO == 'PENDENTE VALIDAÇÃO'"
          border="bottom"
          colored-border
          type="success"
          elevation="0"
          width="100%"
        >
          <span style="font-size: 12px">
            Seu projeto está pendente de sua validação. Caso você não queira realizar a validação,
            pode ficar a vontade para enviar uma mensagem informando quais oportunidades o projeto
            tem.
            <br />
            É importante que ocorra esse retorno, pois o projeto pode ser finalizado não havendo a
            validação.
          </span>
        </v-alert>
      </v-card-title>
      <v-row>
        <v-col cols="12">
          <v-text-field
            placeholder="Título da solicitação"
            label="Título da solicitação"
            outlined
            dense
            readonly
            filled
            :value="listInfo.TITULO_SOLICITACAO"
          ></v-text-field>
        </v-col>
        <v-col class="mt-n6" cols="3">
          <v-text-field
            outlined
            dense
            readonly
            filled
            placeholder="Tipo da demanda"
            label="Tipo da demanda"
            :value="listInfo.SOLICITACAO"
          ></v-text-field>
        </v-col>
        <v-col class="mt-n6" cols="3">
          <v-text-field
            outlined
            dense
            readonly
            filled
            placeholder="Escalonado?"
            label="Escalonado?"
            value="NÃO"
          ></v-text-field>
        </v-col>
        <v-col class="mt-n6" cols="3">
          <v-text-field
            outlined
            dense
            readonly
            filled
            placeholder="Data solicitação"
            label="Data solicitação"
            :value="listInfo.DATA_SOLICITACAO | dateFormated"
          ></v-text-field>
        </v-col>
        <v-col class="mt-n6" cols="3">
          <v-text-field
            outlined
            dense
            readonly
            filled
            placeholder="Data Conclusão"
            label="Data Conclusão"
            :value="listInfo.DATA_ULT_ATUALIZACAO | dateFormated"
          ></v-text-field>
        </v-col>
        <v-col class="mt-n6" cols="12">
          <v-textarea
            outlined
            dense
            filled
            readonly
            placeholder="Descrição da Solicitação"
            label="Descrição da Solicitação"
            :value="listInfo.DETALHE_SOLICITACAO"
          ></v-textarea>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
  import config from '../../../core/config'
  import acoes from '../../../mixins/projectManager/acoes'
  export default {
    props: {
      listInfo: [Array, Object]
    },
    mixins: [acoes],
    computed: {
      nome() {
        let nome = this.$store.getters.usuario.nome
        let nomeSplit = nome.split(' ')[0]
        return nomeSplit[0] + nomeSplit.slice(1, nomeSplit.length).toLowerCase()
      }
    },
    filters: {
      dateFormated: function (value) {
        if (!value) return
        return value.split(' ')[0].split('-').reverse().join('/')
      }
    },
    methods: {
      async validarDemanda() {
        try {
          let data = {
            VALIDACAO_SOLICITACAO: 1,
            STATUS_SOLICITACAO: 7,
            NUM_SOLICITACAO: this.$route.params.id
          }
          let urlData = `${config.baseUrl}api/shared/project_manager/solicitacao/validar_projeto`
          await this.$api.post(urlData, data)
          this.$emit('update-demanda-validada')
          let dataSolicHash = {
            NUM_SOLIC_HASH: this.listInfo.NUM_SOLIC_HASH,
            TIPO_NOTIFICACAO: 7
          }
          let isNotification = this.$route.query.notificationUser
          await this.cadastrarNotificacao(dataSolicHash, isNotification)
          await this.atualizarUltimasInformacoes(dataSolicHash)
        } catch (error) {
          console.error(error)
        }
      },
      async executarAcoes() {
        //cancelar solicitacao
        let data = {
          NUM_SOLIC_HASH: this.listInfo.NUM_SOLIC_HASH,
          TIPO_NOTIFICACAO: 5
        }

        let isNotification = this.$route.query.notificationUser
        await this.cadastrarNotificacao(data, isNotification)
        await this.atualizarUltimasInformacoes(data)
      },
      async cancelarDemanda() {
        let data = {
          NUM_SOLICITACAO: this.$route.params.id,
          STATUS_SOLICITACAO: 5
        }
        let urlData = `${config.baseUrl}api/shared/project_manager/demanda/alter_status`
        await this.$api.post(urlData, data)
        this.executarAcoes()
        this.$emit('update-demanda-cancelada')
      }
    }
  }
</script>

<style></style>
