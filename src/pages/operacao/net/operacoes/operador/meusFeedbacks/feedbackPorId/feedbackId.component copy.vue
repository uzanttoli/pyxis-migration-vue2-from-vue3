<template>
  <v-container class="mx-auto">
    <v-card class="mb-5 mx-auto">
      <title-negative-margin title="Visualizar Feedbacks" :min-width="150">
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              icon
              color="red"
              to="/pyxis/operacoes/operador/meus-feedbacks/"
            >
              <v-icon>mdi-backburger</v-icon>
            </v-btn>
          </template>
          <span>Voltar</span>
        </v-tooltip>
      </title-negative-margin>
      <h1 class="ml-3">Supervisor: {{ feedbackId.NOME_CADASTRO }}</h1>
      <h3 class="ml-3">ID: {{ feedbackId.ID }}</h3>
      <v-spacer></v-spacer>
      <v-divider></v-divider>
      <title-negative-margin title="Retorno Feedback" :min-width="150"></title-negative-margin>
      <div v-if="feedbackId == ''" style="align: center">Carregando...</div>
      <div v-else style="align: center; width: 500px">
        <audio
          controls
          controlsList="nodownload"
          v-if="feedbackId.STATUS_FEEDBACK == 'PENDENTE ACEITE OPERADOR'"
        >
          <source :src="link" type="audio/wav" />
        </audio>
      </div>
      <v-col cols="12">
        <v-textarea
          v-if="feedbackId.STATUS_FEEDBACK != 'PENDENTE ACEITE OPERADOR'"
          label="Retorno de Feedback"
          auto-grow
          disabled
          filled
          :value="feedbackId.OBSERVACAO_OPERADOR"
          rows="2"
          row-height="37"
        ></v-textarea>
        <v-textarea
          v-if="feedbackId.STATUS_FEEDBACK == 'PENDENTE ACEITE OPERADOR'"
          :disabled="feedbackId.STATUS_FEEDBACK != 'PENDENTE ACEITE OPERADOR'"
          filled
          v-model="observacaoOperador"
          auto-grow
          label="Observação"
          rows="2"
          row-height="20"
        ></v-textarea>
        <template v-if="feedbackId.STATUS_FEEDBACK == 'PENDENTE ACEITE OPERADOR'">
          <v-btn
            elevation="2"
            class="mr-2"
            color="green darken-2 white--text"
            @click="updateDataFormFeedback(2)"
            :disabled="this.observacaoOperador == ''"
          >
            Concordo
          </v-btn>
          <v-btn
            elevation="2"
            color="error"
            @click="updateDataFormFeedback(3)"
            :disabled="this.observacaoOperador == ''"
          >
            Discordo
          </v-btn>
        </template>
      </v-col>
      <v-divider></v-divider>
      <title-negative-margin title="Dados Feedback" :min-width="150"></title-negative-margin>
      <v-simple-table fixed-header dense>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Dados</th>
              <th class="text-left text-no-wrap">Tabulação</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filtro" :key="item.name">
              <td class="text-no-wrap">{{ item.name }}</td>
              <td>{{ item.value }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-container>
</template>

<script>
  import config from '@/core/config'
  export default {
    name: 'meus-feedbacks-id',
    data: () => ({
      gravacao: '',
      search: '',
      feedbackId: [],
      enviandoDados: false,
      observacaoOperador: '',
      formEditarFeedback: {
        ID: '',
        DATA_CADASTRO: '',
        DATA_ATUALIZACAO: '',
        DATA_CIENCIA_OPERADOR: '',
        ALMOPE_CADASTRO: '',
        NOME_CADASTRO: '',
        CARGO: '',
        IP_CADASTRO: '',
        STATUS_FEEDBACK: '',
        OBSERVACAO_OPERADOR: '',
        ALMOPE: '',
        NUM_CASO: '',
        SEGMENTO_CLIENTE: '',
        TMT: '',
        DATA_LIGACAO: '',
        HORA_LIGACAO: '',
        MOTIVO_CONTATO: '',
        SUBMOTIVO_CONTATO: '',
        DATA_LIGACAO2: '',
        HORA_LIGACAO2: '',
        MOTIVO_CONTATO2: '',
        SUBMOTIVO_CONTATO2: '',
        INFRATOR_RECHAMADA: '',
        MOTIVO_RECHAMADA: '',
        SUBMOTIVO_RECHAMADA: '',
        QUALIDADE_CHAMADA: '',
        INFORMOU_CANAIS: '',
        CANAIS_ATENDIMENTO: '',
        COMPORTAMENTO_NEGATIVO: '',
        CLIENTE_INICIO_CHAMADA: '',
        CLIENTE_FIM_CHAMADA: '',
        SANCAO: '',
        ALERTA: '',
        OBSERVACAO: '',
        NOME_ARQUIVO_GRAVACAO: '',
        DIRETORIO_ARQUIVO_GRAVACAO: '',
        NOME_ARQUIVO_SANCAO: '',
        DIRETORIO_ARQUIVO_SANCAO: ''
      }
    }),
    computed: {
      link() {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/gravacoes/${this.feedbackId.NOME_ARQUIVO_GRAVACAO}`
      },
      filtro() {
        return [
          {
            name: 'Data 1ª Contato: ',
            value: this.feedbackId.DATA_LIGACAO
          },
          {
            name: 'Motivo 1º Contato: ',
            value: this.feedbackId.MOTIVO_CONTATO
          },
          {
            name: 'SubMotivo 1º Contato: ',
            value: this.feedbackId.SUBMOTIVO_CONTATO
          },
          {
            name: 'Data 2º Contato: ',
            value: this.feedbackId.DATA_LIGACAO2
          },
          {
            name: 'Motivo 2º Contato: ',
            value: this.feedbackId.MOTIVO_CONTATO2
          },
          {
            name: 'SubMotivo 2º Contato: ',
            value: this.feedbackId.SUBMOTIVO_CONTATO2
          },
          {
            name: 'Infrator: ',
            value: this.feedbackId.INFRATOR_RECHAMADA
          },
          {
            name: 'Motivo Rechamada: ',
            value: this.feedbackId.MOTIVO_RECHAMADA
          },
          {
            name: 'SubMotivo Rechamada: ',
            value: this.feedbackId.SUBMOTIVO_RECHAMADA
          },
          {
            name: 'Cliente Iniciou Chamada: ',
            value: this.feedbackId.CLIENTE_INICIO_CHAMADA
          },
          {
            name: 'Cliente Finalizou Chamada: ',
            value: this.feedbackId.CLIENTE_FIM_CHAMADA
          },
          {
            name: 'Comportamento Negativo: ',
            value: this.feedbackId.COMPORTAMENTO_NEGATIVO
          },
          {
            name: 'Observação: ',
            value: this.feedbackId.OBSERVACAO
          }
        ]
      }
    },
    mounted() {
      this.loadBase()
    },
    methods: {
      loadBase() {
        let urlData = `${config.baseUrl}api/shared/indicadores/feedback/feedback_id/${this.$route.query.feedback}`
        this.$api.get(urlData).then(res => {
          this.feedbackId = res.data[0]
        })
      },
      horaAtualizada() {
        let date = new Date()
        let day = date.getDate().toString()
        let dayF = day.length == 1 ? '0' + day : day
        let mes = (date.getMonth() + 1).toString()
        let mesF = mes.length == 1 ? '0' + mes : mes
        let ano = date.getFullYear()

        let hora = date.getHours().toString()
        let horaF = hora.length == 1 ? '0' + hora : hora

        let minutos = date.getMinutes().toString()
        let minutosF = minutos.length == 1 ? '0' + minutos : minutos

        return dayF + '/' + mesF + '/' + ano + ' ' + horaF + ':' + minutosF
      },
      clearForm() {
        Object.assign(this.formEditarFeedback, this.formEditarFeedbackDefault)
      },
      updateDataFormFeedback(value) {
        if (value) {
          this.formEditarFeedback.ID = this.feedbackId.ID
          this.formEditarFeedback.STATUS_FEEDBACK = value
          this.formEditarFeedback.OBSERVACAO_OPERADOR = this.observacaoOperador
          this.formEditarFeedback.DATA_CIENCIA_OPERADOR = this.horaAtualizada()
          this.$store.dispatch('updateDataFormFeedback', this.formEditarFeedback).then(() => {
            this.$router.push('/pyxis/operacoes/operador/meus-feedbacks/')
            this.enviandoDados = true
            setTimeout(() => {
              this.$emit('updated:refetch')
              this.clearForm()
              this.observacaoOperador = ''
              this.enviandoDados = false
            }, 3500)
          })
        }
      }
    },
    watch: {},
    created() {}
  }
</script>

<style></style>
