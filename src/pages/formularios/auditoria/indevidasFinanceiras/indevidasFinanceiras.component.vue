<template>
  <v-dialog max-width="1300" v-model="dialogIndevidasFinanceiras" persistent>
    <v-form ref="form" lazy-validation v-model="valid">
      <v-col cols="12">
        <v-card ref="form">
          <title-negative-margin title="Tabulador Indevidas Financeiras">
            <v-spacer></v-spacer>
            <div class="text-center">
              <span>Casos pendentes:</span>
              <v-chip class="ma-2" :color="corParaCasosPendentes" text-color="white">
                CA3R - DV1
                <v-avatar right :class="corAvatarCasosPendentes">
                  {{ quantidadeCasosPendentes.CA3R_DV1 }}
                </v-avatar>
              </v-chip>
              <v-chip class="ma-2" :color="corParaCasosPendentes" text-color="white">
                CO1-RE
                <v-avatar right :class="corAvatarCasosPendentes">
                  {{ quantidadeCasosPendentes.CO1_RE }}
                </v-avatar>
              </v-chip>
              <v-chip class="ma-2" :color="corParaCasosPendentes" text-color="white">
                FI2-VAL
                <v-avatar right :class="corAvatarCasosPendentes">
                  {{ quantidadeCasosPendentes.FI2_VAL }}
                </v-avatar>
              </v-chip>
              <v-chip class="ma-2" :color="corParaCasosPendentes" text-color="white">
                FI2-CA1
                <v-avatar right :class="corAvatarCasosPendentes">
                  {{ quantidadeCasosPendentes.FI2_CA1 }}
                </v-avatar>
              </v-chip>
            </div>
            <v-spacer></v-spacer>
            <div text-center d-flex align-center justify-space-around>
              <v-tooltip bottom color="light-blue darken-4">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    icon
                    @click.stop="dialogConsultaDeAlmopes = !dialogConsultaDeAlmopes"
                  >
                    <v-icon color="light-blue darken-4">mdi-account-search-outline</v-icon>
                  </v-btn>
                </template>
                <span>Consulte Almope!</span>
              </v-tooltip>
            </div>
            <div text-center d-flex align-center justify-space-around>
              <v-tooltip bottom color="green darken-3">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    icon
                    @click="dialogRegistrosDeReports = !dialogRegistrosDeReports"
                  >
                    <v-icon color="green darken-3">mdi-note-search-outline</v-icon>
                  </v-btn>
                </template>
                <span>Consulte os reports cadastrados!</span>
              </v-tooltip>
            </div>
            <div text-center d-flex align-center justify-space-around>
              <v-tooltip bottom color="warning">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    @click.stop="dialogDiarioDeBordo = !dialogDiarioDeBordo"
                  >
                    <v-icon color="warning">mdi-alert</v-icon>
                  </v-btn>
                </template>
                <span>Informe um erro aqui!</span>
              </v-tooltip>
            </div>
            <v-btn icon>
              <v-icon color="red" @click.stop="$emit('closeIndevidasFinanceiras')">
                mdi-close
              </v-icon>
            </v-btn>
          </title-negative-margin>
          <v-subheader class="black--text" style="font-size: 25px">
            Dados da Ocorrência
            <v-spacer></v-spacer>
            <span class="mr-1" style="font-size: 15px">
              Minhas Tratativas Mês:
              <span class="font-weight-black">{{ minhasTratativasMes.TOTAL_AUDITADO }}</span>
            </span>
            <span style="font-size: 15px">|</span>
            <span class="ml-1" style="font-size: 15px">
              Minhas Tratativas Dia:
              <span class="font-weight-black">{{ minhasTratativasDia.TOTAL_AUDITADO }}</span>
            </span>
          </v-subheader>
          <registros-de-reports
            @closeDialogRegistrosDeReport="dialogRegistrosDeReports = !dialogRegistrosDeReports"
            :dialogRegistrosDeReports="dialogRegistrosDeReports"
          ></registros-de-reports>
          <consulta-de-almope
            :dialogConsultaDeAlmopes="dialogConsultaDeAlmopes"
            @closeDialogConsultaDeAlmopes="dialogConsultaDeAlmopes = !dialogConsultaDeAlmopes"
          ></consulta-de-almope>
          <log-book
            :dialogDiarioDeBordo="dialogDiarioDeBordo"
            @closeDialogDiarioDeBordo="dialogDiarioDeBordo = !dialogDiarioDeBordo"
          ></log-book>
          <treatment-history
            @closeDialogHistoricoTratativa="dialogHistoricoTratativa = !dialogHistoricoTratativa"
            :dialogHistoricoTratativa="dialogHistoricoTratativa"
          ></treatment-history>
          <v-divider></v-divider>
          <v-row class="pa-2" style="height: 70px">
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                label="Ocorrência"
                filled
                readonly
                v-model="indevidasParaAuditar.OCORRENCIA"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                label="Contrato"
                filled
                readonly
                v-model="indevidasParaAuditar.CONTRATO"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                label="Data da Abertura"
                filled
                readonly
                :value="
                  indevidasParaAuditar.DATA_ABERTURA
                    ? indevidasParaAuditar.DATA_ABERTURA.substring(0, 10)
                        .split('-')
                        .reverse()
                        .join('/')
                    : []
                "
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                label="Data Resolução"
                filled
                readonly
                :value="
                  indevidasParaAuditar.DATA_RESOLUCAO
                    ? indevidasParaAuditar.DATA_RESOLUCAO.substring(0, 10)
                        .split('-')
                        .reverse()
                        .join('/')
                    : []
                "
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="pa-2">
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                label="Login de Abertura"
                filled
                readonly
                v-model="indevidasParaAuditar.LOGIN_ABERTURA"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                label="Tipo OC"
                filled
                readonly
                v-model="indevidasParaAuditar.TIPO_OCORRENCIA"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                label="Segmento"
                filled
                readonly
                v-model="indevidasParaAuditar.SEGMENTO"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-text-field
                label="Motivo"
                filled
                readonly
                v-model="indevidasParaAuditar.MOTIVO"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-subheader class="black--text" style="font-size: 25px">Análise abertura N1</v-subheader>
          <v-divider></v-divider>
          <v-row class="pa-2" style="height: 90px">
            <v-col cols="4">
              <v-select
                filled
                :items="cenarioReclamadoCliente"
                item-text="CENARIO_RECLAMADO_CLIENTE"
                item-value="ID_RECLAMADO_CLIENTE"
                v-model="formTabuladorIndevidasFinanceiras.FK_CENARIO_RECLAMADO_PELO_CLIENTE"
                label="Cenário reclamado pelo Cliente"
                no-data-text="Primeiro puxe um caso! "
                @change="loadClassificacaoN1()"
              ></v-select>
            </v-col>
            <v-col>
              <v-select
                filled
                :items="classificacaoN1"
                item-value="ID_CLASSIFICACAO"
                item-text="CLASSIFICACAO"
                label="Classificação N1"
                v-model="formTabuladorIndevidasFinanceiras.FK_CLASSIFICACAO_N1"
                @change="loadCausaMacroN1()"
                no-data-text="Necessário preencher cenário reclamado"
              ></v-select>
            </v-col>
            <template v-if="formTabuladorIndevidasFinanceiras.FK_CLASSIFICACAO_N1 == 2">
              <v-col>
                <v-select
                  filled
                  :items="causaMacroN1"
                  item-value="ID_CAUSA_MACRO_N1"
                  item-text="CLASSIFICACAO_MACRO_N1"
                  label="Causa macro N1"
                  v-model="formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1"
                  no-data-text="Necessário preencher classificação do N1"
                ></v-select>
              </v-col>
              <template
                v-if="
                  formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 == 2 ||
                  formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 == 10 ||
                  formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 == 12 ||
                  formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 == 15 ||
                  formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 == 8
                "
              >
                <v-col cols="3">
                  <v-select
                    filled
                    :items="causaMicroN1"
                    item-value="ID_CAUSA_MICRO_N1"
                    item-text="CLASSIFICACAO_MICRO_N1"
                    label="Causa micro N1"
                    v-model="formTabuladorIndevidasFinanceiras.FK_CAUSA_MICRO_N1"
                    no-data-text="Necessário preencher ...."
                  ></v-select>
                </v-col>
              </template>
            </template>
          </v-row>
          <v-row class="pa-2 mt-0">
            <v-col cols="12">
              <v-textarea
                label="Descrição análise N1"
                outlined
                :counter="quantidadeCaracteres"
                v-model="formTabuladorIndevidasFinanceiras.OBSERVACAO_N1"
                auto-grow
                rows="3"
                shaped
              ></v-textarea>
            </v-col>
          </v-row>
          <v-subheader class="black--text" style="font-size: 25px">
            Análise Fechamento BKO
          </v-subheader>
          <v-divider></v-divider>
          <v-row class="pa-2" style="height: 90px">
            <v-col cols="12" sm="6" md="6">
              <v-select
                filled
                label="Classificação BKO"
                :items="fechamentoClassificacaoBKO"
                item-value="ID_CLASSIFICACAO_BKO"
                v-model="formTabuladorIndevidasFinanceiras.FK_CLASSIFICACAO_BKO"
                item-text="CLASSIFICACAO_BKO"
                @change="loadFechamentoCausaMacroBKO()"
                no-data-text="Primeiro puxe um caso!"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="6">
              <v-select
                filled
                label="Causa Macro BKO"
                :items="fechamentoCausaMacroBKO"
                v-model="formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_BKO"
                item-text="CAUSA_MACRO_BKO"
                item-value="ID_CAUSA_MACRO_BKO"
                no-data-text="Primeiro informe a classificação BKO"
              ></v-select>
            </v-col>
          </v-row>
          <v-row class="pa-2 mt-0">
            <v-col cols="12">
              <v-textarea
                label="Descrição análise BKO"
                outlined
                :counter="quantidadeCaracteres"
                v-model="formTabuladorIndevidasFinanceiras.OBSERVACAO_BKO"
                auto-grow
                rows="3"
                shaped
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row align="center" justify="space-around" class="pa-2" style="margin-top: -30px">
            <v-btn
              color="green"
              class="white--text"
              width="20%"
              :disabled="!this.puxarCasoEValido"
              @click.prevent="loadBases()"
            >
              Puxar caso
            </v-btn>
            <v-btn
              color="primary"
              class="white--text"
              width="20%"
              @click="enviarDadosTratado()"
              :disabled="!this.enviarEValido()"
            >
              Enviar
            </v-btn>
            <v-btn
              color="red"
              class="white--text"
              width="20%"
              @click="limparFormulario()"
              :disabled="!this.limparEValido()"
            >
              Limpar
            </v-btn>
            <v-btn
              class="black--text"
              width="20%"
              @click="dialogHistoricoTratativa = !dialogHistoricoTratativa"
            >
              Histórico de Tratativa
              <v-icon color="orange darken-4" right>mdi-open-in-new</v-icon>
            </v-btn>
          </v-row>
          <v-overlay :value="carregarDados">
            <v-progress-circular color="primary" indeterminate z-index="7" size="120">
              <span class="white--text">Aguarde...</span>
            </v-progress-circular>
          </v-overlay>
          <v-overlay :value="enviarDados">
            <v-progress-circular color="primary" indeterminate z-index="7" size="120">
              <span class="white--text">Enviando...</span>
            </v-progress-circular>
          </v-overlay>
          <v-snackbar
            v-if="updateDadosAposTratativa"
            :timeout="-1"
            :value="true"
            color="green darken-4"
            elevation="24"
          >
            Dados enviados com
            <strong>sucesso!</strong>
            <template v-slot:action="{ attrs }">
              <v-icon color="white" text v-bind="attrs">
                mdi-checkbox-marked-circle-plus-outline
              </v-icon>
            </template>
          </v-snackbar>
        </v-card>
        <div class="text-center ma-2">
          <v-snackbar v-model="snackbar">
            {{ textAlerta }}
            <template v-slot:action="{ attrs }">
              <v-icon color="red" text v-bind="attrs">mdi-progress-alert</v-icon>
            </template>
          </v-snackbar>
        </div>
        <div class="text-center ma-2">
          <v-snackbar
            v-model="casosEstaoConcluidos"
            :timeout="-1"
            absolute
            bottom
            color="warning"
            outlined
            right
          >
            Não há mais casos
            <strong>para tratar.</strong>
            Aguarde que logo será adicionado!
            <template v-slot:action="{ attrs }">
              <v-icon v-bind="attrs" color="warning">mdi-bell-alert-outline</v-icon>
            </template>
          </v-snackbar>
        </div>
      </v-col>
    </v-form>
  </v-dialog>
</template>

<script>
  import registrosDeReports from './dialogs/registrosDeReports.vue'
  import consultaDeAlmope from './dialogs/consultaDeAlmope.vue'
  import logBook from './dialogs/diarioDeBordo.vue'
  import treatmentHistory from './table/historico.vue'
  export default {
    name: 'IndevidasFinanceiras',
    props: {
      dialogIndevidasFinanceiras: {
        type: Boolean,
        default: false
      }
    },
    components: {
      treatmentHistory,
      registrosDeReports,
      consultaDeAlmope,
      logBook
    },
    data: () => ({
      valid: true,
      interval: null,
      inicioDaTratativa: 0,
      fimDaTratativa: 0,
      dialogDiarioDeBordo: false,
      dialogConsultaDeAlmopes: false,
      casosEstaoConcluidos: false,
      dialogRegistrosDeReports: false,
      dialogHistoricoTratativa: false,
      // tempoInicioAuditoria: "",
      // tempoFimAuditoria: "",
      snackbar: false,
      textAlerta: `Você está tentando enviar uma quantidade superior a informada na descrição!`,
      quantidadeCaracteres: 500,
      carregarDados: false,
      enviarDados: false,
      formTabuladorIndevidasFinanceiras: {
        ID_ANALISE_CHURN: '',
        CONTRATO: '',
        DATA_ABERTURA: '',

        DATA_RESOLUCAO: '',
        LOGIN_ABERTURA: '',
        TIPO_OCORRENCIA: '',
        SEGMENTO: '',
        MOTIVO: '',
        FK_CENARIO_RECLAMADO_PELO_CLIENTE: '',
        FK_CLASSIFICACAO_N1: '',
        FK_CAUSA_MACRO_N1: '',
        FK_CAUSA_MICRO_N1: '',
        OBSERVACAO_N1: '',
        FK_CLASSIFICACAO_BKO: '',
        FK_CAUSA_MACRO_BKO: '',
        OBSERVACAO_BKO: '',
        ALMOPE: '',
        PRODUTIVIDADE: '',
        CANCELAMENTO: '',
        COMPUTADOR: '',
        DATA_HORA_MODIFICACAO: ''
      },
      formTabuladorIndevidasFinanceirasDefault: {
        ID_ANALISE_CHURN: '',
        CONTRATO: '',
        DATA_ABERTURA: '',
        DATA_RESOLUCAO: '',
        LOGIN_ABERTURA: '',
        TIPO_OCORRENCIA: '',
        SEGMENTO: '',
        MOTIVO: '',
        FK_CENARIO_RECLAMADO_PELO_CLIENTE: '',
        FK_CLASSIFICACAO_N1: '',
        FK_CAUSA_MACRO_N1: '',
        FK_CAUSA_MICRO_N1: '',
        OBSERVACAO_N1: '',
        FK_CLASSIFICACAO_BKO: '',
        FK_CAUSA_MACRO_BKO: '',
        OBSERVACAO_BKO: '',
        ALMOPE: '',
        PRODUTIVIDADE: '',
        CANCELAMENTO: '',
        COMPUTADOR: '',
        DATA_HORA_MODIFICACAO: ''
      }
    }),
    computed: {
      minhasTratativasMes() {
        let minhasTratativasMes = this.$store.getters.minhasTratativasMes[0]
        return minhasTratativasMes ? minhasTratativasMes : 0
      },
      minhasTratativasDia() {
        let minhasTratativasDia = this.$store.getters.minhasTratativasDia[0]
        return minhasTratativasDia ? minhasTratativasDia : 0
      },
      updateDadosAposTratativa() {
        return this.$store.getters.updateDadosAposTratativa
      },
      fechamentoCausaMacroBKO() {
        let fechamentoCausaMacroBKO = this.$store.getters.fechamentoCausaMacroBKO
        if (fechamentoCausaMacroBKO) {
          return fechamentoCausaMacroBKO
        } else {
          return []
        }
      },
      fechamentoClassificacaoBKO() {
        let fechamentoClassificacaoBKO = this.$store.getters.fechamentoClassificacaoBKO
        if (fechamentoClassificacaoBKO) {
          return fechamentoClassificacaoBKO
        } else {
          return []
        }
      },
      causaMacroN1() {
        let causaMacroN1 = this.$store.getters.causaMacroN1
        if (causaMacroN1) {
          return causaMacroN1
        } else {
          return []
        }
      },

      causaMicroN1() {
        let causaMicroN1 = this.$store.getters.causaMicroN1
        if (causaMicroN1) {
          return causaMicroN1
        } else {
          return []
        }
      },
      classificacaoN1() {
        let classificacaoN1 = this.$store.getters.classificacaoN1
        if (classificacaoN1) {
          return classificacaoN1
        } else {
          return []
        }
      },
      cenarioReclamadoCliente() {
        let cenarioReclamadoCliente = this.$store.getters.cenarioReclamadoCliente
        if (cenarioReclamadoCliente) {
          return cenarioReclamadoCliente
        } else {
          return []
        }
      },
      dataPadrao() {
        let data = new Date()

        // HH:MM:SS
        let hora = data.getHours()
        let minutos = data.getMinutes()
        let segundos = data.getSeconds()
        // DIA
        let dia = data.getDate().toString()
        let diaFormatado = dia.length == 1 ? '0' + dia : dia
        // MES
        let mes = (data.getMonth() + 1).toString()
        let mesFormatado = mes.length == 1 ? '0' + mes : mes

        // ANO
        let ano = data.getFullYear()
        return (
          diaFormatado +
          '/' +
          mesFormatado +
          '/' +
          ano +
          ' ' +
          hora +
          ':' +
          minutos +
          ':' +
          segundos
        )
      },
      // calcularProdutividade() {},
      ipMaquina() {
        return localStorage.getItem('ip')
      },
      // Validacao se ja existi caso
      dataFormatadaOcorrencia() {
        let dados = this.$store.getters.indevidasParaAuditar
        let data = dados.map(i => {
          return {
            DATA_ABERTURA: (i.DATA_ABERTURA = i.DATA_ABERTURA.substring(0, 10)
              .split('-')
              .reverse()
              .join('/')),
            DATA_FECHAMENTO: (i.DATA_RESOLUCAO = i.DATA_RESOLUCAO.substring(0, 10)
              .split('-')
              .reverse()
              .join('/'))
          }
        })
        return data
      },
      indevidasParaAuditar() {
        let indevidasParaAuditar = this.$store.getters.indevidasParaAuditar[0]
        if (indevidasParaAuditar) {
          return indevidasParaAuditar
        } else {
          return []
        }
      },
      validacaoDeCasosExistentesNaoTratados() {
        let validacaoDeCasosExistentesNaoTratados =
          this.$store.getters.validacaoDeCasosExistentesNaoTratados[0]
        if (validacaoDeCasosExistentesNaoTratados) {
          return validacaoDeCasosExistentesNaoTratados
        } else {
          return []
        }
      },
      casosConcluidos() {
        let casosConcluidos = this.$store.getters.casosConcluidos
        // return casosConcluidos;
        if (casosConcluidos) {
          if (casosConcluidos == '') {
            return true
          } else {
            return false
          }
        } else {
          return casosConcluidos
        }
      },
      quantidadeCasosPendentes() {
        let quantidadeCasosPendentes = this.$store.getters.quantidadeCasosPendentes[0]
        return quantidadeCasosPendentes ? quantidadeCasosPendentes : []
      },
      corParaCasosPendentes() {
        let corPadrao = 'teal darken-1'
        return corPadrao
      },
      corAvatarCasosPendentes() {
        let corPadrao = 'teal darken-4'
        return corPadrao
      },
      // Fim
      puxarCasoEValido() {
        let indevidas = this.$store.getters.indevidasParaAuditar[0]
        if (indevidas) {
          if (indevidas.OCORRENCIA == '') {
            return true
          } else {
            return false
          }
        } else {
          return []
        }
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },

      calcularProdutividade() {
        let indevidasParaAuditar = this.$store.getters.indevidasParaAuditar[0]
        let produtividade = indevidasParaAuditar.PRODUTIVIDADE
        let date = new Date()
        // let segundos = date.getSeconds();
        let minutos = date.getMinutes()
        let hora = date.getHours()
        // segundos = segundos * 60 * 60 * 60;
        minutos = minutos * 60
        hora = hora * 3600

        let produtividadeTime = 0
        let horaEnvio = hora + minutos

        if (produtividade > 0) {
          produtividadeTime = horaEnvio - produtividade
        } else {
          produtividadeTime = horaEnvio
        }
        // return produtividadeTime;

        // if (produtividade > 0) {
        //   produtividadeTime = horaEnvio - produtividade + produtividade;
        // } else {
        //   produtividadeTime = horaEnvio;
        // }
        return produtividadeTime
      }
    },
    methods: {
      // clienteIP() {
      //   this.$store.dispatch("clienteIP");
      // },
      enviarEValido() {
        if (this.formTabuladorIndevidasFinanceiras.FK_CLASSIFICACAO_N1 == 1) {
          return (
            this.formTabuladorIndevidasFinanceiras.FK_CENARIO_RECLAMADO_PELO_CLIENTE &&
            this.formTabuladorIndevidasFinanceiras.FK_CLASSIFICACAO_N1 &&
            this.formTabuladorIndevidasFinanceiras.OBSERVACAO_N1 &&
            this.formTabuladorIndevidasFinanceiras.FK_CLASSIFICACAO_BKO &&
            this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_BKO &&
            this.formTabuladorIndevidasFinanceiras.OBSERVACAO_BKO
          )
        } else {
          if (
            this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 == 1 ||
            this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 == 7 ||
            this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 == 11 ||
            this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 == 13 ||
            this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 == 14
          ) {
            return (
              this.formTabuladorIndevidasFinanceiras.FK_CENARIO_RECLAMADO_PELO_CLIENTE &&
              this.formTabuladorIndevidasFinanceiras.FK_CLASSIFICACAO_N1 &&
              this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 &&
              this.formTabuladorIndevidasFinanceiras.OBSERVACAO_N1 &&
              this.formTabuladorIndevidasFinanceiras.FK_CLASSIFICACAO_BKO &&
              this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_BKO &&
              this.formTabuladorIndevidasFinanceiras.OBSERVACAO_BKO
            )
          } else {
            return (
              this.formTabuladorIndevidasFinanceiras.FK_CENARIO_RECLAMADO_PELO_CLIENTE &&
              this.formTabuladorIndevidasFinanceiras.FK_CLASSIFICACAO_N1 &&
              this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 &&
              this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MICRO_N1 &&
              this.formTabuladorIndevidasFinanceiras.OBSERVACAO_N1 &&
              this.formTabuladorIndevidasFinanceiras.FK_CLASSIFICACAO_BKO &&
              this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_BKO &&
              this.formTabuladorIndevidasFinanceiras.OBSERVACAO_BKO
            )
          }
        }
      },
      validacaoDeDescricao() {
        let observaçãoN1 = this.formTabuladorIndevidasFinanceiras.OBSERVACAO_N1
        let observaçãoBko = this.formTabuladorIndevidasFinanceiras.OBSERVACAO_BKO
        if (
          observaçãoN1.length > this.quantidadeCaracteres ||
          observaçãoBko.length > this.quantidadeCaracteres
        ) {
          return true
        } else {
          return false
        }
      },
      limparEValido() {
        return (
          this.formTabuladorIndevidasFinanceiras.FK_CENARIO_RECLAMADO_PELO_CLIENTE ||
          this.formTabuladorIndevidasFinanceiras.FK_CLASSIFICACAO_N1 ||
          this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 ||
          this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MICRO_N1 ||
          this.formTabuladorIndevidasFinanceiras.OBSERVACAO_N1 ||
          this.formTabuladorIndevidasFinanceiras.FK_CLASSIFICACAO_BKO ||
          this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_BKO ||
          this.formTabuladorIndevidasFinanceiras.OBSERVACAO_BKO
        )
      },
      limparFormulario() {
        this.formTabuladorIndevidasFinanceiras.FK_CENARIO_RECLAMADO_PELO_CLIENTE = ''
        this.formTabuladorIndevidasFinanceiras.FK_CLASSIFICACAO_N1 = ''
        this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 = ''
        this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MICRO_N1 = ''
        this.formTabuladorIndevidasFinanceiras.OBSERVACAO_N1 = ''
        this.formTabuladorIndevidasFinanceiras.FK_CLASSIFICACAO_BKO = ''
        this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_BKO = ''
        this.formTabuladorIndevidasFinanceiras.OBSERVACAO_BKO = ''
      },
      limparFormularioAposEnvio() {
        this.indevidasParaAuditar.OCORRENCIA = ''
        this.indevidasParaAuditar.CONTRATO = ''
        this.indevidasParaAuditar.DATA_ABERTURA = ''
        this.indevidasParaAuditar.DATA_RESOLUCAO = ''
        this.indevidasParaAuditar.LOGIN_ABERTURA = ''
        this.indevidasParaAuditar.TIPO_OCORRENCIA = ''
        this.indevidasParaAuditar.SEGMENTO = ''
        this.indevidasParaAuditar.MOTIVO = ''
        Object.assign(
          this.formTabuladorIndevidasFinanceiras,
          this.formTabuladorIndevidasFinanceirasDefault
        )
      },
      pegarCaso() {
        if (this.casosConcluidos == true) {
          this.casosEstaoConcluidos = true
          setTimeout(() => {
            this.casosEstaoConcluidos = false
          }, 4000)
        } else {
          this.carregarDados = true
          setTimeout(() => {
            this.formTabuladorIndevidasFinanceiras.ALMOPE = this.$store.getters.usuario.almope
            this.formTabuladorIndevidasFinanceiras.COMPUTADOR = this.ipMaquina
            this.formTabuladorIndevidasFinanceiras.PRODUTIVIDADE = this.calcularProdutividade
            this.formTabuladorIndevidasFinanceiras.DATA_HORA_MODIFICACAO = this.dataPadrao
            this.formTabuladorIndevidasFinanceiras.OCORRENCIA =
              this.$store.getters.indevidasParaAuditar[0].OCORRENCIA
            this.$store.dispatch(
              'updateDataFormTabuladorIndevidas',
              this.formTabuladorIndevidasFinanceiras
            )
            this.carregarDados = false
          }, 3500)
        }
      },

      enviarDadosTratado() {
        if (this.validacaoDeDescricao() == true) {
          this.snackbar = true
          setTimeout(() => {
            this.snackbar = false
            return
          }, 3500)
        } else {
          this.loadValidacaoDeCasosExistentesNaoTratados()
          this.enviarDados = true
          setTimeout(() => {
            if (this.formTabuladorIndevidasFinanceiras.FK_CLASSIFICACAO_N1 == 1) {
              this.formTabuladorIndevidasFinanceiras.DATA_HORA_MODIFICACAO = this.dataPadrao
              this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 = 3
              this.formTabuladorIndevidasFinanceiras.PRODUTIVIDADE = this.calcularProdutividade
              this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MICRO_N1 = 14
              this.$store
                .dispatch(
                  'updateDadosAposTratativaIndevidas',
                  this.formTabuladorIndevidasFinanceiras
                )
                .then(() => {
                  this.limparFormularioAposEnvio()
                  this.enviarDados = false
                })
            } else {
              if (
                this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 == 1 ||
                this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 == 7 ||
                this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 == 11 ||
                this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 == 13 ||
                this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MACRO_N1 == 14
              ) {
                this.formTabuladorIndevidasFinanceiras.DATA_HORA_MODIFICACAO = this.dataPadrao
                this.formTabuladorIndevidasFinanceiras.FK_CAUSA_MICRO_N1 = 14
                this.formTabuladorIndevidasFinanceiras.PRODUTIVIDADE = this.calcularProdutividade
                this.formTabuladorIndevidasFinanceiras.OCORRENCIA =
                  this.$store.getters.indevidasParaAuditar[0].OCORRENCIA
                this.$store
                  .dispatch(
                    'updateDadosAposTratativaIndevidas',
                    this.formTabuladorIndevidasFinanceiras
                  )
                  .then(() => {
                    this.limparFormularioAposEnvio()
                    this.enviarDados = false
                  })
              } else {
                this.formTabuladorIndevidasFinanceiras.DATA_HORA_MODIFICACAO = this.dataPadrao
                this.formTabuladorIndevidasFinanceiras.PRODUTIVIDADE = this.calcularProdutividade
                this.formTabuladorIndevidasFinanceiras.OCORRENCIA =
                  this.$store.getters.indevidasParaAuditar[0].OCORRENCIA
                this.$store
                  .dispatch(
                    'updateDadosAposTratativaIndevidas',
                    this.formTabuladorIndevidasFinanceiras
                  )
                  .then(() => {
                    this.limparFormularioAposEnvio()
                    this.enviarDados = false
                  })
              }
            }
          }, 3000)
        }
      },
      loadQuantidadeCasosPendentes() {
        this.$store.dispatch('loadQuantidadeCasosPendentes')
      },
      loadValidacaoDeCasosExistentesNaoTratados() {
        this.$store.dispatch('loadValidacaoDeCasosExistentesNaoTratados', this.usuarioAlmope)
      },
      loadClassificacaoN1() {
        this.$store.dispatch('loadClassificacaoN1')
      },
      loadCenarioReclamadoCliente() {
        this.$store.dispatch(
          'loadCenarioReclamadoCliente',
          this.indevidasParaAuditar.TIPO_OCORRENCIA
        )
      },
      loadBases() {
        this.pegarCaso(),
          this.loadValidacaoDeCasosExistentesNaoTratados(),
          this.loadFechamentoClassificacaoBKO(),
          setTimeout(() => {
            this.loadCenarioReclamadoCliente()
            this.loadCausaMicroN1()
          }, 3000)
      },
      loadIndevidasParaAuditar() {
        this.$store.dispatch('loadIndevidasParaAuditar')
      },
      loadCausaMacroN1() {
        this.$store.dispatch('loadCausaMacroN1', this.indevidasParaAuditar.TIPO_OCORRENCIA)
      },
      loadCausaMicroN1() {
        this.$store.dispatch('loadCausaMicroN1', this.indevidasParaAuditar.TIPO_OCORRENCIA)
      },
      loadCasosConcluidos() {
        this.$store.dispatch('loadCasosConcluidos')
      },
      loadFechamentoClassificacaoBKO() {
        this.$store.dispatch('loadFechamentoClassificacaoBKO')
      },
      loadFechamentoCausaMacroBKO() {
        this.$store.dispatch('loadFechamentoCausaMacroBKO')
      },
      loadMinhasTratativasMes() {
        this.$store.dispatch('loadMinhasTratativasMes', this.usuarioAlmope)
      },
      loadMinhasTratativasDia() {
        this.$store.dispatch('loadMinhasTratativasDia', this.usuarioAlmope)
      }
    },
    watch: {
      indevidasParaAuditar() {
        this.loadQuantidadeCasosPendentes()
        this.loadCenarioReclamadoCliente()
      },
      dialogIndevidasFinanceiras() {
        this.loadMinhasTratativasMes()
        this.loadQuantidadeCasosPendentes()
        this.loadCasosConcluidos()
        this.loadMinhasTratativasDia()
      }
    },
    created() {
      // this.clienteIP();
      // this.loadCenarioReclamadoCliente();
      // this.loadQuantidadeCasosPendentes()
      // this.loadValidacaoDeCasosExistentesNaoTratados();
    }
  }
</script>

<style></style>
