<template>
  <v-card elevation="1">
    <!-- <pre>{{ numOcorrenciaNomeOrigem }}</pre> -->
    <title-negative-margin title="Análise do Caso" className="rounded-r-xl">
      <div class="box-tempo-tratativa">
        <span class="box-span" style="font-size: 13px">Tempo de tratativa</span>
        <p class="box-time">
          <i id="rotate" class="fa-sharp fa-solid fa-arrow-rotate-right"></i>
          {{ tempo == 'NaN:NaN:NaN' || tempo == null || tempo.length > 8 ? '00:00:00' : tempo }}
        </p>
      </div>
      <v-divider vertical class="px-2 mr-2"></v-divider>
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <v-btn
            icon
            class="cor-padrao-btn"
            to="/pyxis/backoffice/operador"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon color="white">fa-solid fa-arrow-left</v-icon>
          </v-btn>
        </template>
        <span>Voltar</span>
      </v-tooltip>
    </title-negative-margin>
    <v-divider></v-divider>
    <v-col>
      <v-row justify="center">
        <v-col>
          <validation-observer v-slot="{ invalid, validate }" ref="observer">
            <form @submit.prevent="validate().then(submit)">
              <v-expansion-panels v-model="panel" flat multiple readonly>
                <v-expansion-panel>
                  <v-expansion-panel-header disable-icon-rotate>
                    <h3 style="color: grey">1. Análise PU</h3>
                    <template v-slot:actions>
                      <v-icon>fa-solid fa-align-right</v-icon>
                    </template>
                  </v-expansion-panel-header>
                  <!-- <pre>{{ formAnaliseCasoWl }}</pre> -->
                  <v-expansion-panel-content>
                    <v-row class="mt-n2">
                      <v-col cols="4">
                        <validation-provider v-slot="{ errors }" name="abertura" rules="required">
                          <v-autocomplete
                            required
                            :error-messages="errors"
                            label="Status do PU*"
                            dense
                            outlined
                            filled
                            v-model="formAnaliseCasoWl.statusPU"
                            :items="opcoesWl('STATUS_PU')"
                            item-text="OPTION_FIELD"
                            item-value="VALUE_FIELD"
                          ></v-autocomplete>
                        </validation-provider>
                      </v-col>
                      <v-col cols="4">
                        <validation-provider v-slot="{ errors }" name="situação" rules="required">
                          <v-autocomplete
                            :error-messages="errors"
                            required
                            label="Situação pendente"
                            dense
                            outlined
                            filled
                            v-model="formAnaliseCasoWl.situacaoPendente"
                            :items="opcoesWl('SITUACAO_PENDENTE')"
                            item-text="OPTION_FIELD"
                            item-value="VALUE_FIELD"
                          ></v-autocomplete>
                        </validation-provider>
                      </v-col>
                      <v-col cols="4">
                        <validation-provider
                          v-slot="{ errors }"
                          name="status encaminhamento"
                          rules="required"
                        >
                          <v-autocomplete
                            :error-messages="errors"
                            required
                            label="Status do encaminhamento"
                            dense
                            outlined
                            filled
                            v-model="formAnaliseCasoWl.statusEncaminhamento"
                            :items="opcoesWl('STATUS_ENCAMINHAMENTO')"
                            item-text="OPTION_FIELD"
                            item-value="VALUE_FIELD"
                          ></v-autocomplete>
                        </validation-provider>
                      </v-col>
                      <v-col cols="4" class="mt-n7">
                        <v-text-field
                          readonly
                          label="Origem direcionamento?"
                          dense
                          outlined
                          filled
                          v-model="numOcorrenciaNomeOrigem.origem"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="4" class="mt-n7">
                        <validation-provider
                          v-slot="{ errors }"
                          name="destino direcionamento"
                          rules="required"
                        >
                          <v-autocomplete
                            :error-messages="errors"
                            required
                            label="Destino direcionamento?"
                            dense
                            outlined
                            filled
                            v-model="formAnaliseCasoWl.destinoDirecionamento"
                            :items="opcoesWl('DIRECIONAMENTOS')"
                            item-text="OPTION_FIELD"
                            item-value="VALUE_FIELD"
                            placeholder="Basta digitar (autocompleta)"
                            no-data-text="Item não encontrado!"
                          ></v-autocomplete>
                        </validation-provider>
                      </v-col>
                      <v-col cols="4" class="mt-n7">
                        <validation-provider
                          v-slot="{ errors }"
                          name="motivo indevido"
                          rules="required"
                        >
                          <v-autocomplete
                            :error-messages="errors"
                            required
                            label="Motivo Indevido"
                            dense
                            outlined
                            filled
                            v-model="formAnaliseCasoWl.motivoIndevido"
                            :items="opcoesWl('MOTIVO_INDEVIDO')"
                            item-text="OPTION_FIELD"
                            item-value="VALUE_FIELD"
                          ></v-autocomplete>
                        </validation-provider>
                      </v-col>
                      <v-col cols="4" class="mt-n7">
                        <validation-provider
                          v-slot="{ errors }"
                          name="submotivo indevido"
                          rules="required"
                        >
                          <v-autocomplete
                            :error-messages="errors"
                            required
                            label="SubMotivo Indevido"
                            dense
                            outlined
                            filled
                            v-model="formAnaliseCasoWl.submotivoIndevido"
                            :items="opcoesWl('SUB MOTIVO_INDEVIDO')"
                            item-text="OPTION_FIELD"
                            item-value="VALUE_FIELD"
                          ></v-autocomplete>
                        </validation-provider>
                      </v-col>

                      <!--  -->
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel class="mt-n2" v-if="configFila.FILA_GRUPO != 'CLARO BKO'">
                  <v-expansion-panel-header disable-icon-rotate>
                    <h3 style="color: grey">2. Atividade e Ajuste</h3>
                    <template v-slot:actions>
                      <v-icon>fa-solid fa-align-right</v-icon>
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row class="mt-n2">
                      <v-col cols="4">
                        <validation-provider v-slot="{ errors }" name="status atividade">
                          <v-autocomplete
                            :error-messages="errors"
                            required
                            label="Status Atividade"
                            dense
                            outlined
                            filled
                            v-model="formAnaliseCasoWl.statusAtividade"
                            :items="opcoesWl('STATUS_ATIVIDADE')"
                            item-text="OPTION_FIELD"
                            item-value="VALUE_FIELD"
                          ></v-autocomplete>
                        </validation-provider>
                      </v-col>
                      <v-col cols="4">
                        <validation-provider
                          v-slot="{ errors }"
                          name="necessário realizar ajuste"
                          rules="required"
                        >
                          <v-autocomplete
                            :error-messages="errors"
                            required
                            label="Necessário realizar ajuste?"
                            dense
                            outlined
                            filled
                            v-model="formAnaliseCasoWl.necessarioRealizarAjuste"
                            :items="simNao"
                            item-text="OPTION_FIELD"
                            item-value="VALUE_FIELD"
                          ></v-autocomplete>
                        </validation-provider>
                      </v-col>
                      <v-col cols="4">
                        <validation-provider
                          v-slot="{ errors }"
                          name="acima da alçada"
                          rules="required"
                        >
                          <v-autocomplete
                            :error-messages="errors"
                            required
                            label="Acima da alçada?"
                            dense
                            outlined
                            filled
                            v-model="formAnaliseCasoWl.acimaAlcada"
                            :items="simNao"
                            item-text="OPTION_FIELD"
                            item-value="VALUE_FIELD"
                          ></v-autocomplete>
                        </validation-provider>
                      </v-col>
                      <v-col cols="4" class="mt-n7">
                        <validation-provider
                          v-slot="{ errors }"
                          name="abriu disputa"
                          rules="required"
                        >
                          <v-autocomplete
                            :error-messages="errors"
                            required
                            label="Abriu disputa?"
                            dense
                            outlined
                            filled
                            v-model="formAnaliseCasoWl.abriuDisputa"
                            :items="simNao"
                            item-text="OPTION_FIELD"
                            item-value="VALUE_FIELD"
                          ></v-autocomplete>
                        </validation-provider>
                      </v-col>
                      <v-col cols="4" class="mt-n7">
                        <validation-provider
                          v-slot="{ errors }"
                          name="retorno cliente"
                          rules="required"
                        >
                          <v-autocomplete
                            :error-messages="errors"
                            required
                            label="Retorno ao cliente"
                            dense
                            outlined
                            filled
                            v-model="formAnaliseCasoWl.retornoCliente"
                            :items="opcoesWl('RETORNO_CLIENTE')"
                            item-text="OPTION_FIELD"
                            item-value="VALUE_FIELD"
                          ></v-autocomplete>
                        </validation-provider>
                      </v-col>
                      <v-col cols="4" class="mt-n7">
                        <validation-provider
                          v-slot="{ errors }"
                          name="area ofensora"
                          rules="required"
                        >
                          <v-autocomplete
                            :error-messages="errors"
                            required
                            label="Área Ofensora"
                            dense
                            outlined
                            filled
                            v-model="formAnaliseCasoWl.areaOfensora"
                            :items="opcoesWl('AREA_OFENSORA')"
                            item-text="OPTION_FIELD"
                            item-value="VALUE_FIELD"
                            placeholder="Basta digitar (autocompleta)"
                            no-data-text="Item não encontrado!"
                          ></v-autocomplete>
                        </validation-provider>
                      </v-col>
                      <!--  -->
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="mt-n2" v-if="configFila.FILA_GRUPO != 'CLARO BKO'">
                  <v-expansion-panel-header disable-icon-rotate>
                    <h3 style="color: grey">3. Finalização</h3>
                    <template v-slot:actions>
                      <v-icon>fa-solid fa-align-right</v-icon>
                    </template>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row class="mt-n2 mb-n7">
                      <v-col cols="12">
                        <validation-provider v-slot="{ errors }" name="observação" rules="required">
                          <v-textarea
                            :error-messages="errors"
                            required
                            label="Observações:"
                            placeholder="Breve resumo..."
                            filled
                            rows="4"
                            v-model="formAnaliseCasoWl.observacao"
                          ></v-textarea>
                        </validation-provider>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-row align="center" class="mt-6">
                <v-col cols="3" class="mt-n6">
                  <v-btn
                    color="blue white--text"
                    class="mr-2 mt-2"
                    id="copy"
                    @click="copyValue()"
                    block
                  >
                    Copiar
                  </v-btn>
                </v-col>
                <v-col cols="3" class="mt-n6" v-if="formAnaliseCasoWl.situacaoPendente != 1">
                  <v-btn class="mr-2 mt-2" color="success" type="submit" :disabled="invalid" block>
                    Salvar
                  </v-btn>
                  <!-- @click="salvarAnaliseWl()" -->
                  <!-- :disabled="!this.formIsValid()" -->
                </v-col>
                <v-col cols="3" class="mt-n6" v-if="formAnaliseCasoWl.situacaoPendente == 1">
                  <v-btn color="orange white--text" class="mr-2 mt-2" @click="agendaIsValid" block>
                    Agendar
                  </v-btn>
                  <!-- :disabled="!this.formIsValidAgend()" -->
                </v-col>
                <v-col cols="3" class="mt-n6">
                  <v-btn color="error" class="mt-2" @click="clearForm" block>Limpar</v-btn>
                  <!-- :disabled="!this.clearFormIsValid()" -->
                </v-col>
              </v-row>
            </form>
          </validation-observer>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <resumo-texto-component
            id="text"
            :generateTextDefault="generateTextDefaultWl"
            :rowsDefault="3"
          ></resumo-texto-component>
        </v-col>
      </v-row>
    </v-col>
    <agendar-caso-component
      :abrirSheetFooterAgendar="abrirSheetFooterAgendar"
      @updated-close="abrirSheetFooterAgendar = !abrirSheetFooterAgendar"
      :numCaso="numOcorrenciaNomeOrigem.numero"
      :acaoParametro="configFila.PARAMETRO_AGENDAMENTO"
      :filaProcedure="configFila.FILA_PROCEDURE"
      :filaGrupo="configFila.FILA_GRUPO"
      :observacao="formAnaliseCasoWl.observacao"
      @update:info-carregamento="attCarregamento"
      @update:fechar-dialog="abrirSheetFooterAgendar = !abrirSheetFooterAgendar"
      @update:agendamento-salvo="retornoInfoAgendamento"
      :dataVencimento="numOcorrenciaNomeOrigem.dataVencimento"
    ></agendar-caso-component>
  </v-card>
</template>

<script>
  import ResumoTextoComponent from './ResumoTexto.component.vue'
  import AgendarCasoComponent from './AgendarCaso.component.vue'

  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import config from '../../../core/config.js'
  export default {
    components: {
      ResumoTextoComponent,
      AgendarCasoComponent,
      ValidationObserver,
      ValidationProvider
    },
    props: {
      configFila: {
        type: [Object, Array],
        require: true
      },
      numeroOcorrencia: {
        type: String,
        default: '0'
      },
      numOcorrenciaNomeOrigem: {
        type: [Array, Object],
        require: true
      },
      dataVencimento: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      panel: [0, 1, 2],
      listaOpcoesWl: [],
      simNao: [
        { TABULATION_FIELD: 'STATUS_FIELD', OPTION_FIELD: 'SIM', VALUE_FIELD: 1 },
        { TABULATION_FIELD: 'STATUS_FIELD', OPTION_FIELD: 'NÃO', VALUE_FIELD: 2 },
        { TABULATION_FIELD: 'STATUS_FIELD', OPTION_FIELD: 'N/A', VALUE_FIELD: 3 }
      ],
      // panel: [2, 2, 2],
      abrirSheetFooterAgendar: false,
      infoFields: false,
      tempo: null,
      formAnaliseCasoWl: {
        statusPU: '',
        situacaoPendente: '',
        statusEncaminhamento: '',
        origemDirecionamento: '',
        destinoDirecionamento: '',
        motivoIndevido: '',
        submotivoIndevido: '',
        statusAtividade: '',
        necessarioRealizarAjuste: '',
        acimaAlcada: '',
        abriuDisputa: '',
        retornoCliente: '',
        areaOfensora: '',
        observacao: ''
      }
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      generateTextDefaultWl() {
        let textDefault = ''
        textDefault += '>>>>>>>>>>>>>>>>>> BACKOFFICE CLARO <<<<<<<<<<<<<<<'
        textDefault += `\n#Status PU: ${
          this.convertIdInText(this.formAnaliseCasoWl.statusPU, 'STATUS_PU') ?? 'N/A'
        }`
        textDefault += `\n#Detalhe Pendente: ${
          this.convertIdInText(this.formAnaliseCasoWl.situacaoPendente, 'SITUACAO_PENDENTE') ??
          'N/A'
        }`
        textDefault += `\n#Detalhe Reatribuido: ${
          this.convertIdInText(this.formAnaliseCasoWl.destinoDirecionamento, 'DIRECIONAMENTOS') ??
          'N/A'
        }`
        textDefault += `\n#Status Encaminhamento: ${
          this.convertIdInText(
            this.formAnaliseCasoWl.statusEncaminhamento,
            'STATUS_ENCAMINHAMENTO'
          ) ?? 'N/A'
        }`
        textDefault += `\n#Status Indevido 1: ${
          this.convertIdInText(this.formAnaliseCasoWl.motivoIndevido, 'MOTIVO_INDEVIDO') ?? 'N/A'
        }`
        textDefault += `\n#Status Indevido 2: ${
          this.convertIdInText(this.formAnaliseCasoWl.submotivoIndevido, 'SUB MOTIVO_INDEVIDO') ??
          'N/A'
        }`
        textDefault += `\n#Status Atividade: ${
          this.convertIdInText(this.formAnaliseCasoWl.statusAtividade, 'STATUS_ATIVIDADE') ?? 'N/A'
        }`
        textDefault += `\n#Retorno ao Cliente: ${
          this.convertIdInText(this.formAnaliseCasoWl.retornoCliente, 'RETORNO_CLIENTE') ?? 'N/A'
        }`
        textDefault += `\n#Necessário Ajuste: ${
          this.convertIdInTextYesNo(
            this.formAnaliseCasoWl.necessarioRealizarAjuste,
            'STATUS_FIELD'
          ) ?? 'N/A'
        }`
        textDefault += `\n#Acima da Alçada: ${
          this.convertIdInTextYesNo(this.formAnaliseCasoWl.acimaAlcada, 'STATUS_FIELD') ?? 'N/A'
        }`
        textDefault += `\n#Abriu Disputa: ${
          this.convertIdInTextYesNo(this.formAnaliseCasoWl.abriuDisputa, 'STATUS_FIELD') ?? 'N/A'
        }`
        textDefault += `\n#Área Ofensora: ${
          this.convertIdInText(this.formAnaliseCasoWl.areaOfensora, 'AREA_OFENSORA') ?? 'N/A'
        }`
        textDefault += `\n#Observações: ${
          this.formAnaliseCasoWl.observacao ? this.formAnaliseCasoWl.observacao : 'N/A'
        }`
        return textDefault
      },
      observacaoTratada() {
        // __subs__: é enviado no endpoint para quando chegar no backend a funcao que irá executar, substituirá por §**§, pois no formulario do bko é necessario para que A PROCEDURE seja executado com sucesso.
        // Nao é possivel enviar desta forma api/shared/..paramtros/§**§1§**§2, pois o urldecode() irá substituir o § por %20
        //   return `${this.formAnaliseCasoWl.statusPU} _subs_ ${this.formAnaliseCasoWl.situacaoPendente} _subs_ ${this.formAnaliseCasoWl.statusEncaminhamento} _subs_ ${this.formAnaliseCasoWl.motivoIndevido} _subs_ ${this.formAnaliseCasoWl.submotivoIndevido} _subs_ ${this.formAnaliseCasoWl.destinoDirecionamento} _subs_ ${this.formAnaliseCasoWl.statusAtividade} _subs_ ${this.formAnaliseCasoWl.retornoCliente} _subs_ ${this.formAnaliseCasoWl.necessarioRealizarAjuste} _subs_ ${this.formAnaliseCasoWl.acimaAlcada} _subs_ ${this.formAnaliseCasoWl.abriuDisputa} _subs_ ${this.formAnaliseCasoWl.areaOfensora} _subs_ ${this.formAnaliseCasoWl.observacao}`;
        let observacaoCompleta = ''
        observacaoCompleta = `${this.formAnaliseCasoWl.statusPU} _subs_`
        observacaoCompleta =
          observacaoCompleta += ` ${this.formAnaliseCasoWl.situacaoPendente} _subs_`
        observacaoCompleta =
          observacaoCompleta += ` ${this.formAnaliseCasoWl.statusEncaminhamento} _subs_`
        observacaoCompleta =
          observacaoCompleta += ` ${this.formAnaliseCasoWl.motivoIndevido} _subs_`
        observacaoCompleta =
          observacaoCompleta += ` ${this.formAnaliseCasoWl.submotivoIndevido} _subs_`
        observacaoCompleta =
          observacaoCompleta += ` ${this.formAnaliseCasoWl.destinoDirecionamento} _subs_`
        observacaoCompleta =
          observacaoCompleta += ` ${this.formAnaliseCasoWl.statusAtividade} _subs_`
        observacaoCompleta =
          observacaoCompleta += ` ${this.formAnaliseCasoWl.retornoCliente} _subs_`
        observacaoCompleta =
          observacaoCompleta += ` ${this.formAnaliseCasoWl.necessarioRealizarAjuste} _subs_`
        observacaoCompleta = observacaoCompleta += ` ${this.formAnaliseCasoWl.acimaAlcada} _subs_`
        observacaoCompleta = observacaoCompleta += ` ${this.formAnaliseCasoWl.abriuDisputa} _subs_`
        observacaoCompleta = observacaoCompleta += ` ${this.formAnaliseCasoWl.areaOfensora} _subs_`
        observacaoCompleta = observacaoCompleta += ` ${
          this.removeCaracteresInvalid(this.formAnaliseCasoWl.observacao) ?? ''
        }`

        // let dadosTratativa = {
        //   statusPU: this.formAnaliseCasoWl.statusPU,
        //   situacaoPendente: this.formAnaliseCasoWl.situacaoPendente,
        //   statusEncaminhamento: this.formAnaliseCasoWl.statusEncaminhamento,
        //   motivoIndevido: this.formAnaliseCasoWl.motivoIndevido,
        //   submotivoIndevido: this.formAnaliseCasoWl.submotivoIndevido,
        //   destinoDirecionamento: this.formAnaliseCasoWl.destinoDirecionamento,
        //   statusAtividade: this.formAnaliseCasoWl.statusAtividade,
        //   retornoCliente: this.formAnaliseCasoWl.retornoCliente,
        //   necessarioRealizarAjuste: this.formAnaliseCasoWl.necessarioRealizarAjuste,
        //   acimaAlcada: this.formAnaliseCasoWl.acimaAlcada,
        //   abriuDisputa: this.formAnaliseCasoWl.abriuDisputa,
        //   areaOfensora: this.formAnaliseCasoWl.areaOfensora,
        //   observacao: this.removeCaracteresInvalid(this.formAnaliseCasoWl.observacao)
        // };

        return observacaoCompleta
      }
    },
    mounted() {
      this.interval = setInterval(() => {
        this.get_time_diff(
          this.numOcorrenciaNomeOrigem.inicioTratamento + this.numOcorrenciaNomeOrigem.tmtAnt
        )
      }, 1000)
    },
    methods: {
      agendaIsValid() {
        if (
          this.numOcorrenciaNomeOrigem.numero == 0 ||
          this.numOcorrenciaNomeOrigem.numero == '' ||
          this.numOcorrenciaNomeOrigem.numero == null
        )
          return
        this.abrirSheetFooterAgendar = true
      },
      removeCaracteresInvalid(text) {
        if (!text) return
        const regex = /[\\/#<>\s]+/g

        const novaString = text.replace(regex, ' ')
        return novaString
      },
      get_time_diff(datetimeTratativa) {
        datetimeTratativa =
          typeof datetimeTratativa !== 'undefined'
            ? datetimeTratativa
            : '2019-01-01 00:00:00.000000'

        datetimeTratativa = new Date(datetimeTratativa).getTime()
        var now = new Date().getTime()

        if (isNaN(datetimeTratativa)) {
          return ''
        }

        var milisec_diff = ''
        if (datetimeTratativa < now) {
          milisec_diff = now - datetimeTratativa
        } else {
          milisec_diff = datetimeTratativa - now
        }
        return (this.tempo = this.msToTime(milisec_diff))
      },
      msToTime(s) {
        var ms = s % 1000
        s = (s - ms) / 1000
        var secs = s % 60
        s = (s - secs) / 60
        var mins = s % 60
        var hrs = (s - mins) / 60

        var txHora = hrs
        if (hrs <= 9) {
          txHora = '0' + txHora
        }
        var txMin = mins
        if (mins <= 9) {
          txMin = '0' + txMin
        }
        var txSec = secs
        if (secs <= 9) {
          txSec = '0' + txSec
        }
        return txHora + ':' + txMin + ':' + txSec
      },
      alert() {
        this.infoFields = true
      },
      copyValue() {
        const textInput = document.getElementById('text')
        const copyButton = document.getElementById('copy')

        copyButton.addEventListener('click', () => {
          textInput.select()
          document.execCommand('copy')
        })
      },
      clearForm() {
        let newForm = Object.assign({}, this.formAnaliseCasoWl)
        Object.keys(newForm).forEach(item => {
          newForm[item] = ''
        })

        this.formAnaliseCasoWl = newForm
        this.$refs.observer.reset()
      },
      convertIdInText(id, textField) {
        let lista = this.listaOpcoesWl
        if (!id) return null
        return lista
          .map(item => {
            if (item.VALUE_FIELD == id && item.TABULATION_FIELD == textField) {
              return item.OPTION_FIELD
            }
          })
          .filter(value => {
            return value
          })
      },
      convertIdInTextYesNo(id, textField) {
        let lista = this.simNao
        if (!id) return null
        return lista
          .map(item => {
            if (item.VALUE_FIELD == id && item.TABULATION_FIELD == textField) {
              return item.OPTION_FIELD
            }
          })
          .filter(value => {
            return value
          })
      },
      retornoInfoAgendamento() {
        this.$emit('update:analise-salva')
        return this.clearForm()
      },
      opcoesWl(value) {
        if (!value) return
        let opcoes = this.listaOpcoesWl
        let result = opcoes.filter(item => {
          return item.TABULATION_FIELD == value
        })
        return result
      },
      loadOpcoesWl() {
        let urlData = `${config.baseUrl}api/shared/backoffice/acoes/opcoes/COMBO WL`
        this.$api.get(urlData).then(res => {
          this.listaOpcoesWl = res.data
        })
      },
      attCarregamento(e) {
        return this.$emit('update:info-carregamento-status', e)
      },
      async submit() {
        try {
          if (
            this.numOcorrenciaNomeOrigem.numero == 0 ||
            this.numOcorrenciaNomeOrigem.numero == '' ||
            this.numOcorrenciaNomeOrigem.numero == null
          )
            return
          this.$emit('update:info-carregamento-status', true)
          let dataAgendamento = ''
          let tipoOcorrencia = ''
          let consulta = `EXEC ${this.configFila?.FILA_PROCEDURE} `
          consulta = consulta += `'${this.configFila?.PARAMETRO_RESOLVER}'`
          consulta = consulta += `,'${this.numOcorrenciaNomeOrigem.numero}'`
          consulta = consulta += `,'${this.usuarioAlmope}'`
          consulta = consulta += `,'${dataAgendamento}'`
          consulta = consulta += `,'${tipoOcorrencia}',`

          await this.$store
            .dispatch('salvarAnaliseAction', {
              consulta: consulta,
              dadosTratativa: this.observacaoTratada
            })
            .then(() => {
              setTimeout(() => {
                this.$emit('update:analise-salva')
                this.clearForm()
                this.$emit('update:info-carregamento-status', false)
                const Toast = this.$swal.mixin({
                  toast: true,
                  position: 'bottom-end',
                  showConfirmButton: false,
                  timer: 3000,
                  timerProgressBar: true,
                  didOpen: toast => {
                    toast.addEventListener('mouseenter', this.$swal.stopTimer)
                    toast.addEventListener('mouseleave', this.$swal.resumeTimer)
                  }
                })
                Toast.fire({
                  icon: 'success',
                  title: 'Análise salva com sucesso!'
                })
              }, 1500)
            })
        } catch (error) {
          alert(error)
        }
      }
    },
    watch: {
      'formAnaliseCasoWl.statusPU': function (newVal) {
        if (newVal == 1 || newVal == 2) {
          this.formAnaliseCasoWl.destinoDirecionamento = 227
          this.formAnaliseCasoWl.situacaoPendente = 2
        } else {
          this.formAnaliseCasoWl.destinoDirecionamento = null
          this.formAnaliseCasoWl.situacaoPendente = null
        }
      }
    },
    created() {
      this.loadOpcoesWl()
    },
    beforeUnmount: function () {
      clearInterval(this.interval)
    }
  }
</script>

<style scoped>
  .box-span {
    font-size: 10px;
    text-align: center;
  }

  .box-time {
    margin-top: -10px;
  }

  .box-tempo-tratativa {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: -19px;
    /* margin-right:1em; */
  }

  #rotate {
    animation-duration: 2s;
    animation-name: slidein;
    animation-iteration-count: infinite;
  }
  @keyframes slidein {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .cor-padrao {
    background-image: linear-gradient(220deg, rgb(120, 14, 143), rgb(50, 236, 255));
  }

  .cor-padrao-btn {
    background-image: linear-gradient(220deg, rgb(0, 236, 255), rgb(143, 14, 143));
  }
</style>
