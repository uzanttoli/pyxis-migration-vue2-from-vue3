<template>
  <v-card elevation="1">
    <title-negative-margin title="Informação da Ocorrência" className="rounded-r-xl">
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
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Nª Caso"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.NUM_CASO)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Base"
            dense
            outlined
            readonly
            filled
            :value="dadosTratadoWl.BASE"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Segmento"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.SEGMENTO)"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mt-n7">
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Operação Responsável"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.REGIONAL_ABERTURA)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Status SLA"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.ANALISE_SLA)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="MSISDN"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.MSISDN)"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mt-n7">
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Protocolo"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.PROTOCOLO)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Data Abertura"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.ABERTURA)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Login Criação"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.LOGIN_ABERTURA)"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mt-n7">
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Data do Direcionamento"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.DATA_DIRECIONAMENTO)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Login Direcionamento"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.LOGIN_DIRECIONAMENTO)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Status PS8"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.STATUS_PS8)"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mt-n7">
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Prioridade"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.PRIORIDADE)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Ajuste permitido?"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.AJUSTE_PERMITIDO)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Método Contato"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.METODO_CONTATO)"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mt-n7">
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Disputa"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.DISPUTA)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Nª Conta Disputa"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.NUM_CONTA_DISPUTA)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Voucher Disputa"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.VOUCHER_DISPUTA)"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mt-n7">
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Valor Disputa"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.VALOR_DISPUTA)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="SLA"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.SLA)"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="4">
          <v-text-field
            label="Informações Importantes"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.INFORM_IMPORTANTES)"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mt-n7">
        <v-col cols="12">
          <v-text-field
            label="Motivos"
            dense
            outlined
            readonly
            filled
            :value="convertToUpperCase(dadosTratadoWl.MOTIVO1)"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mt-2 mb-n4" justify="space-around">
        <v-col cols="4" sm="4" xl="4" class="mt-n6">
          <v-btn
            class="mr-2 mt-2"
            color="blue white--text"
            @click="novoTratamentoWl()"
            block
            :disabled="!this.novoCasoIsValidWl()"
          >
            Novo Tratamento
          </v-btn>
        </v-col>
        <v-col cols="4" sm="4" xl="4" class="mt-n6">
          <v-btn
            class="mr-2 mt-2"
            color="deep-orange darken-3 white--text"
            @click="tratamentoBacklogWl()"
            block
            :disabled="!this.novoCasoIsValidWl()"
          >
            Backlog Tratamento
          </v-btn>
        </v-col>
        <v-col cols="4" sm="4" xl="4" class="mt-n6">
          <v-btn
            color="blue-grey darken-2 white--text"
            class="mt-2"
            @click="abrirLiberarAgenamento = true"
            title="Para liberar é necessário não está com caso em tratamento!"
            block
            :disabled="!(dadosTratadoWl && dadosTratadoWl.NUM_CASO == '')"
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
      dadosCarregadosWl: {
        type: [Object, Array],
        require: true
      },
      analiseIsSave: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      abrirLiberarAgenamento: false
    }),
    computed: {
      executarAcaoWl() {
        let result = this.$store.getters.executarAcao
        return result ? result : []
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      selecionarFonteDadosWl() {
        //Carregamento de casos para tratativa Wl
        if (this.dadosCarregadosWl) {
          return this.dadosCarregadosWl[0]?.NUM_CASO != 0 ||
            this.dadosCarregadosWl[0]?.NUM_CASO != '0'
            ? this.dadosCarregadosWl
            : this.executarAcaoWl
        } else {
          return { msg: 'Erro ao carregar dados!' }
        }
      },
      dadosTratadoWl() {
        let arrayDados = this.selecionarFonteDadosWl
        if (arrayDados.length === 0) {
          return []
        } else {
          this.$emit('update:analise-caso-wl', {
            numero: arrayDados.NUM_CASO,
            origem: arrayDados.WORKLIST,
            tmtAnt: arrayDados.TMT_ANT,
            inicioTratamento: arrayDados.INICIO_TRATAMENTO,
            dataVencimento: arrayDados.SLA
          })
          return arrayDados
        }
      }
    },
    methods: {
      novoCasoIsValidWl() {
        return this.dadosTratadoWl?.NUM_CASO == 0 || this.dadosCarregadosWl?.NUM_CASO == null
      },
      limparFormularioWl() {
        let dados = this.dadosTratadoWl
        dados.WORKLIST = null
        dados.SEGMENTO = null
        dados.ANALISE_SLA = null
        dados.MSISDN = null
        dados.PROTOCOLO = null
        dados.NUM_CASO = null
        dados.ABERTURA = null
        dados.LOGIN_ABERTURA = null
        dados.NOME_ABERTURA = null
        dados.SUPERVISOR_ABERTURA = null
        dados.COORDENADOR_ABERTURA = null
        dados.REGIONAL_ABERTURA = null
        dados.DATA_DIRECIONAMENTO = null
        dados.LOGIN_DIRECIONAMENTO = null
        dados.STATUS_PS8 = null
        dados.MOTIVO1 = null
        dados.PRIORIDADE = null
        dados.AJUSTE_PERMITIDO = null
        dados.METODO_CONTATO = null
        dados.INFORM_IMPORTANTES = null
        dados.DISPUTA = null
        dados.NUM_CONTA_DISPUTA = null
        dados.VOUCHER_DISPUTA = null
        dados.VALOR_DISPUTA = null
        dados.SLA = null
        dados.SLA_REDIRECIONAMENTO = null
        dados.DATA_ATUALIZACAO = null
        dados.BASE = null
        dados.INICIO_TRATAMENTO = null
        dados.TMT_ANT = null
      },
      convertToUpperCase(value) {
        if (!value) return
        return value.toUpperCase()
      },
      async novoTratamentoWl() {
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
      async tratamentoBacklogWl() {
        this.$emit('update:info-carregamento-status', true)
        let numCaso = ''
        let dataAgendamento = ''
        let tipoOcorrencia = ''

        // let consulta = `EXEC ${this.configFila?.FILA_PROCEDURE} `;
        // consulta = consulta += `'${this.configFila?.PARAMETRO_BACKLOG}'`;
        // consulta = consulta += `,'${numCaso}'`;
        // consulta = consulta += `,'${this.usuarioAlmope}'`;
        // consulta = consulta += `,'${dataAgendamento}'`;
        // consulta = consulta += `,'${tipoOcorrencia}'`;
        // consulta = consulta += `,'${this.configFila?.FILA_NOME}'`;

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
          this.limparFormularioWl()
        }
      }
    }
  }
</script>

<style></style>
