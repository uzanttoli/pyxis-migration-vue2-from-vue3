<template>
  <v-card elevation="1">
    <title-negative-margin title="Informações da Ocorrência" className="rounded-r-xl">
      <v-spacer></v-spacer>
      <info-fila-tratamento-component
        :nomeFila="configFila.FILA_NOME"
        :qtdDentroPrazo="configFila.DENTRO_PRAZO"
        :qtdForaFora="configFila.FORA_PRAZO"
      ></info-fila-tratamento-component>
    </title-negative-margin>
    <v-divider></v-divider>
    <v-col>
      <v-row>
        <v-col cols="12" sm="12" md="8">
          <v-text-field
            label="Tipo da Ocorrência"
            dense
            outlined
            readonly
            :value="dadosTratado.TIPO_OCOR"
            filled
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Base"
            dense
            outlined
            readonly
            filled
            :value="dadosTratado.WORKLIST"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mt-n7">
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Nª Ocorrência"
            dense
            outlined
            readonly
            :value="dadosTratado.OCORRENCIA"
            filled
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Data da Abertura"
            dense
            outlined
            readonly
            filled
            :value="dadosTratado.DATA_ABERTURA"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Data de Vencimento"
            dense
            outlined
            readonly
            filled
            :value="dadosTratado.DATA_VENCIMENTO"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mt-n7">
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Data Atualização"
            dense
            outlined
            readonly
            filled
            :value="dadosTratado.DATA_ATUALIZACAO"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Agrupamento"
            dense
            outlined
            readonly
            filled
            :value="dadosTratado.AGRUPAMENTO"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Segmento"
            dense
            outlined
            readonly
            filled
            :value="dadosTratado.SEGMENTO"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mt-n7">
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Operadora"
            dense
            outlined
            readonly
            filled
            :value="dadosTratado.OPERADORA"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Nª Contrato"
            dense
            outlined
            filled
            readonly
            :value="dadosTratado.CONTRATO"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Prioridade"
            dense
            outlined
            filled
            readonly
            :value="dadosTratado.PRIORIDADE"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mt-n7">
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Login Abertura"
            dense
            outlined
            filled
            readonly
            :value="dadosTratado.LOGIN_ABERTURA"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Perfil Abertura"
            dense
            outlined
            filled
            readonly
            :value="dadosTratado.PERFIL_ABERTURA"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Dia Venc. Fatura"
            dense
            outlined
            filled
            readonly
            :value="dadosTratado.DIA_DE_VENCIMENTO"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mt-n7">
        <v-col>
          <v-textarea
            readonly
            filled
            rows="4"
            :value="dadosTratado.OBS_ABERTURA"
            label="Descrição da ocorrência"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row class="mt-n5 mb-n4" justify="space-around">
        <v-col cols="4" sm="4" xl="4" class="mt-n6">
          <v-btn
            class="mt-2"
            color="blue white--text"
            @click="novoTratamento()"
            :disabled="!this.novoCasoIsValid()"
            block
          >
            Novo Tratamento
          </v-btn>
        </v-col>
        <v-col cols="4" sm="4" xl="4" class="mt-n6">
          <v-btn
            class="mt-2"
            color="deep-orange darken-3 white--text"
            @click="tratamentoBacklog()"
            :disabled="!this.novoCasoIsValid()"
            block
          >
            Backlog Tratamento
          </v-btn>
        </v-col>
        <v-col
          cols="4"
          sm="4"
          xl="4"
          class="mt-n6"
          :disable="dadosTratado == '' || dadosTratado == null"
        >
          <v-btn
            color="blue-grey darken-2 white--text"
            class="mt-2"
            @click="abrirLiberarAgenamento = true"
            block
            :disabled="!(dadosTratado && dadosTratado.OCORRENCIA == '')"
          >
            Liberar Agendamentos
          </v-btn>
        </v-col>
      </v-row>
    </v-col>
    <LiberarAgendamento
      :abrirLiberarAgendamento="abrirLiberarAgenamento"
      @update:close="abrirLiberarAgenamento = !abrirLiberarAgenamento"
      @update:retornarCasoAgendado="$emit('update:retornarCasoAgendado')"
      :config="[
        configFila.ID,
        configFila.FILA_PROCEDURE,
        configFila.PARAMETRO_LIBERAR_AGEND,
        configFila.FILA_GRUPO
      ]"
    />
  </v-card>
</template>

<script>
  import InfoFilaTratamentoComponent from './InfoFilaTratamento.component.vue'
  import LiberarAgendamento from './LiberarAgendamento.component.vue'
  export default {
    components: { InfoFilaTratamentoComponent, LiberarAgendamento },
    props: {
      configFila: {
        type: [Object, Array],
        require: true
      },
      dadosCarregados: {
        type: [Object, Array],
        require: true
      },
      analiseIsSave: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      // dados: [],
      abrirLiberarAgenamento: false
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      selecionarFonteDados() {
        //Carregamento de casos para tratativa
        if (this.dadosCarregados) {
          return this.dadosCarregados[0]?.NUM_CASO != 0 || this.dadosCarregados[0]?.NUM_CASO != '0'
            ? this.dadosCarregados
            : this.executarAcao
        } else {
          return { msg: 'Erro ao carregar dados!' }
        }
      },
      dadosTratado() {
        let arrayDados = this.selecionarFonteDados
        if (arrayDados.length === 0) {
          return []
        } else {
          this.$emit('update:analise-caso', {
            NUM_OCORRENCIA: arrayDados.OCORRENCIA,
            TMT_ANT: arrayDados.TMT_ANT,
            INICIO_TRATAMENTO: arrayDados.INICIO_TRATAMENTO,
            DATA_VENCIMENTO: arrayDados.DATA_VENCIMENTO
          })
          return arrayDados
        }
      },
      executarAcao() {
        let result = this.$store.getters.executarAcao
        return result ? result : []
      },
      dadosTempo() {
        return [
          {
            INICIO_TRATAMENTO: this.dadosTratado.INICIO_TRATAMENTO,
            TMT_ANT: this.dadosTratado.TMT_ANT
          }
        ]
      }
    },
    methods: {
      novoCasoIsValid() {
        return this.dadosTratado.OCORRENCIA == null
      },
      limparFormulario() {
        let dados = this.dadosTratado
        dados.OCORRENCIA = null
        dados.OPERADORA = null
        dados.OPER_CONTRATO = null
        dados.DATA_ABERTURA = null
        dados.TIPO_OCOR = null
        dados.LOGIN_ABERTURA = null
        dados.PERFIL_ABERTURA = null
        dados.SEGMENTO = null
        dados.DIA_DE_VENCIMENTO = null
        dados.OBS_ABERTURA = null
        dados.TEL_RES = null
        dados.TEL_COM = null
        dados.TEL_CEL = null
        dados.VOIP = null
        dados.PRIORIDADE = null
        dados.AGRUPAMENTO = null
        dados.NOME = null
        dados.SUPERIOR1 = null
        dados.SUPERIOR2 = null
        dados.REGIONAL = null
        dados.DATA_VENCIMENTO = null
        dados.DATA_ATUALIZACAO = null
        dados.WORKLIST = null
        dados.NUM_CASO = null
        dados.INICIO_TRATAMENTO = null
        dados.TMT_ANT = null
        dados.CONTRATO = null
        dados.OPER_CONTRATO2 = null
      },
      async novoTratamento() {
        this.$emit('update:info-carregamento-status', true)
        let numCaso = ''
        let dataAgendamento = ''
        let tipoOcorrencia = ''

        await this.$store.dispatch('loadExecutarAcao', {
          filaProcedure: this.configFila?.FILA_PROCEDURE,
          paramVerificacao: this.configFila?.PARAMETRO_NOVO_CASO,
          numCaso: numCaso,
          almope: this.usuarioAlmope,
          dataAgendamento: dataAgendamento,
          tipoOcorrencia: tipoOcorrencia,
          filaNome: this.configFila?.FILA_NOME
        })
        setTimeout(() => {
          this.$emit('update:info-carregamento-status', false)
        }, 1500)
      },
      async tratamentoBacklog() {
        this.$emit('update:info-carregamento-status', true)
        let numCaso = ''
        let dataAgendamento = ''
        let tipoOcorrencia = ''

        await this.$store.dispatch('loadExecutarAcao', {
          filaProcedure: this.configFila?.FILA_PROCEDURE,
          paramVerificacao: this.configFila?.PARAMETRO_BACKLOG,
          numCaso: numCaso,
          almope: this.usuarioAlmope,
          dataAgendamento: dataAgendamento,
          tipoOcorrencia: tipoOcorrencia,
          filaNome: this.configFila?.FILA_NOME
        })
        setTimeout(() => {
          this.$emit('update:info-carregamento-status', false)
        }, 1500)
      }
    },
    watch: {
      analiseIsSave() {
        if (this.analiseIsSave == true) {
          this.limparFormulario()
        }
      }
    }
  }
</script>

<style></style>
