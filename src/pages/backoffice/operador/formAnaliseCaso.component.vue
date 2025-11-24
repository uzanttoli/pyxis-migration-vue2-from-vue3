<template>
  <v-card elevation="1">
    <title-negative-margin title="Análise do Caso" className="rounded-r-xl">
      <!-- <pre>{{ dadosTratativaCaso }}</pre> -->
      <div class="box-tempo-tratativa">
        <span class="box-span" style="font-size: 13px">Tempo de tratativa</span>

        <p class="box-time">
          <i class="fa-sharp fa-solid fa-arrow-rotate-right" id="icon-rotate"></i>
          {{ tempo == 'NaN:NaN:NaN' || tempo == null || tempo.length > 8 ? '00:00:00' : tempo }}
        </p>
      </div>
      <v-divider vertical class="px-2 mr-2"></v-divider>
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <v-btn icon class="cor-padrao" to="/pyxis/backoffice/operador" v-bind="attrs" v-on="on">
            <v-icon color="white">fa-solid fa-arrow-left</v-icon>
          </v-btn>
        </template>
        <span>Voltar</span>
      </v-tooltip>
    </title-negative-margin>
    <v-divider></v-divider>
    <v-col>
      <v-row>
        <v-col>
          <validation-observer v-slot="{ invalid, validate }" ref="observer">
            <form @submit.prevent="validate().then(submit)">
              <v-row>
                <v-col cols="3">
                  <validation-provider v-slot="{ errors }" name="abertura" rules="required">
                    <v-autocomplete
                      label="Abertura"
                      dense
                      outlined
                      filled
                      :error-messages="errors"
                      required
                      :items="opcoes('TIPO ABERTURA')"
                      item-text="OPTION_FIELD"
                      item-value="VALUE_FIELD"
                      v-model="formAnaliseCaso.tipoAbertura"
                    ></v-autocomplete>
                  </validation-provider>
                </v-col>
                <v-col cols="3">
                  <validation-provider v-slot="{ errors }" name="detalhe abertura" rules="required">
                    <v-autocomplete
                      label="Detalhe Abertura"
                      dense
                      filled
                      outlined
                      :error-messages="errors"
                      required
                      :items="opcoes('DETALHE ABERTURA')"
                      item-text="OPTION_FIELD"
                      item-value="VALUE_FIELD"
                      v-model="formAnaliseCaso.detalheAbertura"
                    ></v-autocomplete>
                  </validation-provider>
                </v-col>
                <v-col cols="3">
                  <validation-provider
                    v-slot="{ errors }"
                    name="possibilidade anatel"
                    rules="required"
                  >
                    <v-autocomplete
                      label="Possibilidade Anatel?"
                      dense
                      filled
                      outlined
                      required
                      :error-messages="errors"
                      :items="opcoes('POSSIBILIDADE ANATEL?')"
                      item-text="OPTION_FIELD"
                      item-value="VALUE_FIELD"
                      v-model="formAnaliseCaso.possibilidadeAnatel"
                    ></v-autocomplete>
                  </validation-provider>
                </v-col>
                <v-col cols="3">
                  <validation-provider v-slot="{ errors }" name="oportunidade" rules="required">
                    <v-autocomplete
                      label="Oportunidade"
                      dense
                      filled
                      outlined
                      required
                      :error-messages="errors"
                      :items="opcoes('OPORTUNIDADE')"
                      item-text="OPTION_FIELD"
                      item-value="VALUE_FIELD"
                      v-model="formAnaliseCaso.oportunidade"
                    ></v-autocomplete>
                  </validation-provider>
                </v-col>
                <v-col cols="3" class="mt-n5">
                  <validation-provider
                    v-slot="{ errors }"
                    name="descontos indevidos"
                    rules="required"
                  >
                    <v-autocomplete
                      label="Gerou descontos indevidos para o cliente?"
                      dense
                      filled
                      outlined
                      required
                      :error-messages="errors"
                      :items="opcoes('GEROU DESCONTOS INDEVIDOS PARA O CLIENTE?')"
                      item-text="OPTION_FIELD"
                      item-value="VALUE_FIELD"
                      v-model="formAnaliseCaso.descontoIndevido"
                    ></v-autocomplete>
                  </validation-provider>
                </v-col>
                <v-col cols="3" class="mt-n5">
                  <validation-provider
                    v-slot="{ errors }"
                    name="tentativa de contato"
                    rules="required"
                  >
                    <v-autocomplete
                      label="Tentativa de Contato"
                      dense
                      outlined
                      filled
                      required
                      :error-messages="errors"
                      :items="opcoes('TENTATIVA DE CONTATO')"
                      item-text="OPTION_FIELD"
                      item-value="VALUE_FIELD"
                      v-model="formAnaliseCaso.tentativaContato"
                    ></v-autocomplete>
                  </validation-provider>
                </v-col>
                <v-col cols="12" class="mt-n5">
                  <validation-provider v-slot="{ errors }" name="Observação" rules="required">
                    <v-textarea
                      label="Observações:"
                      placeholder="Breve resumo..."
                      :error-messages="errors"
                      filled
                      required
                      rows="2"
                      v-model="formAnaliseCaso.observacao"
                    ></v-textarea>
                  </validation-provider>
                </v-col>
                <v-col>
                  <v-row class="mt-n5" align="center" justify="start">
                    <v-col cols="3" class="mt-n6">
                      <v-btn
                        color="blue white--text"
                        class="mt-2"
                        id="copy"
                        block
                        @click="copyValue()"
                      >
                        Copiar
                      </v-btn>
                    </v-col>
                    <v-col cols="3" class="mt-n6" v-if="formAnaliseCaso.tentativaContato != 8">
                      <v-btn class="mt-2" color="success" type="submit" :disabled="invalid" block>
                        Salvar
                      </v-btn>
                    </v-col>
                    <v-col cols="3" class="mt-n6" v-if="formAnaliseCaso.tentativaContato == 8">
                      <v-btn color="orange white--text" class="mt-2" @click="agendaIsValid" block>
                        Agendar
                      </v-btn>
                    </v-col>
                    <v-col cols="3" class="mt-n6">
                      <v-btn color="error" class="mt-2" @click="clearForm" block>Limpar</v-btn>
                    </v-col>
                  </v-row>
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
            :generateTextDefault="generateTextDefault"
          ></resumo-texto-component>
        </v-col>
      </v-row>
    </v-col>
    <agendar-caso-component
      :abrirSheetFooterAgendar="abrirSheetFooterAgendar"
      @updated-close="abrirSheetFooterAgendar = !abrirSheetFooterAgendar"
      :numCaso="dadosTratativaCaso.NUM_OCORRENCIA"
      :acaoParametro="configFila.PARAMETRO_AGENDAMENTO"
      :filaProcedure="configFila.FILA_PROCEDURE"
      :observacao="formAnaliseCaso.observacao"
      @update:info-carregamento="attCarregamento"
      @update:fechar-dialog="abrirSheetFooterAgendar = !abrirSheetFooterAgendar"
      @update:agendamento-salvo="retornoInfoAgendamento"
      :dataVencimento="dadosTratativaCaso.DATA_VENCIMENTO"
    ></agendar-caso-component>
  </v-card>
</template>

<script>
  import AgendarCasoComponent from './AgendarCaso.component.vue'
  import ResumoTextoComponent from './ResumoTexto.component.vue'

  import { ValidationProvider, ValidationObserver } from 'vee-validate'

  import config from '../../../core/config.js'
  export default {
    components: {
      AgendarCasoComponent,
      ResumoTextoComponent,
      ValidationProvider,
      ValidationObserver
    },
    props: {
      configFila: {
        type: [Object, Array],
        require: true
      },
      dadosTratativaCaso: {
        type: [Array, Object],
        require: true
      },
      tempoTratativa: {
        type: [Array, Object],
        require: true
      }
    },
    data: () => ({
      listaOpcoes: [],
      tempo: null,
      infoFields: false,
      interval: null,
      abrirSheetFooterAgendar: false,
      textGenered: false,
      formAnaliseCaso: {
        tipoAbertura: null,
        detalheAbertura: null,
        possibilidadeAnatel: null,
        oportunidade: null,
        descontoIndevido: null,
        tentativaContato: null,
        observacao: null
        // motivoIndevida: null,
      }
    }),
    computed: {
      computedDateFormat() {
        return this.dateFormate(this.date)
      },
      observacaoTratada() {
        // __subs__: é enviado no endpoint para quando chegar no backend a funcao que irá executar, substituirá por §**§, pois no formulario do bko é necessario para que A PROCEDURE seja executado com sucesso.
        // Nao é possivel enviar desta forma api/shared/..paramtros/§**§1§**§2, pois o urldecode() irá substituir o § por %20
        // return `${this.formAnaliseCaso.tentativaContato} _subs_ ${this.formAnaliseCaso.tipoAbertura} _subs_ ${this.formAnaliseCaso.detalheAbertura} _subs_ ${this.formAnaliseCaso.possibilidadeAnatel} _subs_ ${this.formAnaliseCaso.oportunidade} _subs_ ${this.formAnaliseCaso.descontoIndevido} _subs_ ${this.formAnaliseCaso.observacao}`;
        let observacaoCompleta = ''
        observacaoCompleta = `${this.formAnaliseCaso.tentativaContato} _subs_`
        observacaoCompleta = observacaoCompleta += ` ${this.formAnaliseCaso.tipoAbertura} _subs_`
        observacaoCompleta = observacaoCompleta += ` ${this.formAnaliseCaso.detalheAbertura} _subs_`
        observacaoCompleta =
          observacaoCompleta += ` ${this.formAnaliseCaso.possibilidadeAnatel} _subs_`
        observacaoCompleta = observacaoCompleta += ` ${this.formAnaliseCaso.oportunidade} _subs_`
        observacaoCompleta =
          observacaoCompleta += ` ${this.formAnaliseCaso.descontoIndevido} _subs_`
        observacaoCompleta = observacaoCompleta += ` ${this.removeCaracteresInvalid(
          this.formAnaliseCaso.observacao
        )}`

        return observacaoCompleta
      },
      generateTextDefault() {
        let textDefault = ''
        textDefault += '>>>>>>>>>> BACKOFFICE NET <<<<<<<<<<'
        textDefault += `\n#Tentativa de Contato: ${
          this.convertIdInText(this.formAnaliseCaso.tentativaContato, 'TENTATIVA DE CONTATO') ??
          'NA'
        }`
        // textDefault += `\n##Tentativa de Contato: ${this.convertIdInText(
        //   this.formAnaliseCaso.tentativaContato,
        //   "TENTATIVA DE CONTATO"
        // ) ?? "N/A"}`;
        textDefault += `\n#Abertura: ${
          this.convertIdInText(this.formAnaliseCaso.tipoAbertura, 'TIPO ABERTURA') ?? 'NA'
        }`
        textDefault += `\n#Detalhe Abertura: ${
          this.convertIdInText(this.formAnaliseCaso.detalheAbertura, 'DETALHE ABERTURA') ?? 'NA'
        }`
        textDefault += `\n#Possibilidade Anatel: ${
          this.convertIdInText(this.formAnaliseCaso.possibilidadeAnatel, 'POSSIBILIDADE ANATEL?') ??
          'NA'
        }`
        textDefault += `\n#Oportunidade: ${
          this.convertIdInText(this.formAnaliseCaso.oportunidade, 'OPORTUNIDADE') ?? 'NA'
        }`
        textDefault += `\n#Gerou Descontos Indevidos Para o Cliente: ${
          this.convertIdInText(
            this.formAnaliseCaso.descontoIndevido,
            'GEROU DESCONTOS INDEVIDOS PARA O CLIENTE?'
          ) ?? 'NA'
        };`
        textDefault += `\n#Observações: ${this.formAnaliseCaso.observacao ?? 'NA'}`
        textDefault += `\n ${this.signatureDefault}`

        return textDefault
      },
      signatureDefault() {
        let dataStorage = JSON.parse(localStorage.getItem('usuario'))
        let { nome, supervisor, agrupamento } = dataStorage
        return `${this.apartNameOne(nome)} / ${this.apartNameSuper(
          supervisor
        )} / ${agrupamento} / ALMAVIVA NSS`
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    mounted() {
      this.interval = setInterval(() => {
        this.get_time_diff(
          this.dadosTratativaCaso.INICIO_TRATAMENTO + this.dadosTratativaCaso.TMT_ANT
        )
      }, 1000)
    },
    methods: {
      agendaIsValid() {
        if (
          this.dadosTratativaCaso.NUM_OCORRENCIA == 0 ||
          this.dadosTratativaCaso.NUM_OCORRENCIA == '' ||
          this.dadosTratativaCaso.NUM_OCORRENCIA == null
        )
          return
        this.abrirSheetFooterAgendar = true
      },
      async submit() {
        try {
          if (
            this.dadosTratativaCaso.NUM_OCORRENCIA == 0 ||
            this.dadosTratativaCaso.NUM_OCORRENCIA == '' ||
            this.dadosTratativaCaso.NUM_OCORRENCIA == null
          )
            return
          this.$emit('update:info-carregamento-status', true)
          let dataAgendamento = ''
          let tipoOcorrencia = ''
          let consulta = `EXEC ${this.configFila?.FILA_PROCEDURE} `
          consulta = consulta += `'${this.configFila?.PARAMETRO_RESOLVER}'`
          consulta = consulta += `,'${this.dadosTratativaCaso.NUM_OCORRENCIA}'`
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
      retornoInfoAgendamento() {
        if (
          this.dadosTratativaCaso.NUM_OCORRENCIA == 0 ||
          this.dadosTratativaCaso.NUM_OCORRENCIA == '' ||
          this.dadosTratativaCaso.NUM_OCORRENCIA == null
        )
          return
        this.$emit('update:analise-salva')
        return this.clearForm()
      },
      clearForm() {
        let newForm = Object.assign({}, this.formAnaliseCaso)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.formAnaliseCaso = newForm
        this.$refs.observer.reset()
        // return Object.assign(this.formAnaliseCaso, this.formAnaliseCasoDefault);
      },
      attCarregamento(e) {
        return this.$emit('update:info-carregamento-status', e)
      },
      apartNameOne(string) {
        if (!string) return

        let result = string.split(' ')
        return result[0]
      },
      apartNameSuper(string) {
        if (!string) return

        let result = string.split(' ')
        return result[0] + ' ' + result[1].substring(0, 1) + '.'
      },

      opcoes(value) {
        if (!value) return
        let opcoes = this.listaOpcoes
        let result = opcoes.filter(item => {
          return item.TABULATION_FIELD == value
        })
        return result
      },
      convertIdInText(id, textField) {
        let lista = this.listaOpcoes
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

      formIsValidAgend() {
        if (this.formAnaliseCaso.tentativaContato == 8) {
          return this.formAnaliseCaso.tentativaContato
        }
      },
      copyValue() {
        const textInput = document.getElementById('text')
        const copyButton = document.getElementById('copy')
        copyButton.addEventListener('click', () => {
          textInput.select()
          document.execCommand('copy')
        })
      },
      dateFormate(value) {
        if (!value) return
        const [year, month, day] = value.split('-')
        return `${day}/${month}/${year}`
      },
      async loadOpcoes() {
        let urlData = `${config.baseUrl}api/shared/backoffice/acoes/opcoes/COMBO BKO`
        var res = await this.$api.get(urlData)
        this.listaOpcoes = res?.data
      }
    },
    watch: {
      // interval(){
      //   this.
      // }
    },
    created() {
      this.loadOpcoes()
      // }
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
  }

  #icon-rotate {
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
    background-image: linear-gradient(220deg, rgb(0, 236, 255), rgb(143, 14, 143));
  }
</style>
