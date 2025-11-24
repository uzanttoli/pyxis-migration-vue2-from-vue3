<template>
  <section>
    <v-card elevation="1" class="rounded-xl" outlined>
      <!-- <pre>{{ novoCasoAtivacao }}</pre> -->
      <title-negative-margin
        title="Portabilidade Ativação - BKO S2S"
        :min-width="380"
        className="rounded-l-0 rounded-r-xl"
      >
        <div class="box-tempo-tratativa mr-4">
          <span class="box-span">
            Tempo
            {{ novoCasoAtivacao.NUM_CONTRATO ? 'de tratativa' : 'disponivel' }}
          </span>
          <p class="box-time">
            {{ tempo == 'NaN:NaN:NaN' ? '00:00:00' : tempo }}
          </p>
        </div>
        <v-divider vertical></v-divider>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              icon
              class="ml-4"
              v-bind="attrs"
              v-on="on"
              color="blue"
              @click="$emit('update:return-tabulador', 'tabulador-ativacao')"
            >
              <v-icon>fa-regular fa-circle-left</v-icon>
            </v-btn>
          </template>
          <span>Tabulador de Tratativa</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon class="ml-4" color="red" v-bind="attrs" v-on="on" @click="closeForm">
              <v-icon>fa-solid fa-xmark</v-icon>
            </v-btn>
          </template>
          <span>Fechar</span>
        </v-tooltip>
      </title-negative-margin>
      <v-col class="pa-4">
        <v-row>
          <v-col class="pa-0" cols="4">
            <TextareaButton label="COD" :text="novoCasoAtivacao.COD_CIDADE" />
          </v-col>
          <v-col class="pa-0" cols="4">
            <TextareaButton label="Contrato" :text="novoCasoAtivacao.NUM_CONTRATO" />
          </v-col>
          <v-col class="pa-0" cols="4">
            <TextareaButton label="Cidade" :text="novoCasoAtivacao.DSC_MUNICIPIO_BI" />
          </v-col>
          <v-col class="pa-0" cols="4">
            <TextareaButton label="Almope Vendedor" :text="novoCasoAtivacao.ALMOPE_VENDEDOR" />
          </v-col>
          <v-col class="pa-0" cols="4">
            <TextareaButton label="Vendedor" :text="novoCasoAtivacao.VENDEDOR" />
          </v-col>
          <v-col class="pa-0" cols="4">
            <TextareaButton label="Supervisor" :text="novoCasoAtivacao.SUPERVISOR" />
          </v-col>
          <v-col class="pa-0" cols="4">
            <TextareaButton label="Regional" :text="novoCasoAtivacao.REGIONAL" />
          </v-col>
          <v-col class="pa-0" cols="4">
            <TextareaButton
              label="Data Venda"
              :text="novoCasoAtivacao.DATA_VENDA_BRUTA | formatedDate"
            />
          </v-col>
        </v-row>
        <v-row
          class="mt-n7"
          v-if="
            novoCasoAtivacao != '' &&
            novoCasoAtivacao != 'não ha casos para tratativa' &&
            novoCasoAtivacao.ID_MAILING != null
          "
        >
          <div style="width: 100%; padding: 10px">
            <v-alert outlined :type="vendaCheckout.type" prominent border="left" dense>
              <h3>{{ vendaCheckout.title }}</h3>
              <h5>Tipo Venda: {{ vendaCheckout.info[0].tipoVenda }}</h5>
              <ul v-if="vendaCheckout.info[0].planoUra != 'N/A'">
                <li v-html="textPadrao"></li>
              </ul>
            </v-alert>
          </div>
        </v-row>
      </v-col>
      <v-divider class="mt-n5"></v-divider>
      <v-card-title class="text-h6">
        <h3 style="color: grey">Tratativa</h3>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-col>
        <validation-observer v-slot="{ invalid, validate }" ref="observer">
          <form @submit.prevent="validate().then(submit)">
            <v-row>
              <v-col>
                <validation-provider rules="required" name="meio de contato" v-slot="{ errors }">
                  <v-select
                    outlined
                    dense
                    required
                    :error-messages="errors"
                    label="Meio de contato"
                    no-data-text="Nada encontrado!"
                    :items="listarMeioContato"
                    item-text="text"
                    item-value="text"
                    v-model="statusMeioContato"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col>
                <validation-provider
                  rules="required"
                  name="status portabilidade"
                  v-slot="{ errors }"
                >
                  <v-autocomplete
                    outlined
                    dense
                    required
                    :error-messages="errors"
                    :items="itemsStatusPortabilidade"
                    item-text="STATUS"
                    item-value="ID_STATUS"
                    label="Status portabilidade"
                    no-data-text="Nada encontrado!"
                    v-model="statusPortabilidade"
                    @change="loadMotivoPortabilidade"
                  ></v-autocomplete>
                </validation-provider>
              </v-col>
              <v-col>
                <validation-provider name="motivo" rules="required" v-slot="{ errors }">
                  <v-autocomplete
                    outlined
                    dense
                    required
                    :error-messages="errors"
                    :items="itemsMotivoPortabilidade"
                    item-text="MOTIVO"
                    item-value="ID_MOTIVO"
                    label="Motivo"
                    no-data-text="Nada encontrado!"
                    v-model="motivoPortabilidade"
                  ></v-autocomplete>
                </validation-provider>
              </v-col>
              <v-col cols="12">
                <validation-provider v-slot="{ errors }" name="observacao" rules="required|max:200">
                  <v-textarea
                    dense
                    placeholder="Observação"
                    label="Observação"
                    outlined
                    :error-messages="errors"
                    v-model="observacao"
                  ></v-textarea>
                </validation-provider>
              </v-col>
            </v-row>
            <div style="display: flex; gap: 10px">
              <v-btn
                width="190"
                color="orange"
                class="white--text"
                :disabled="
                  motivoPortabilidade != 4 && motivoPortabilidade != 5 && motivoPortabilidade != 8
                "
                @click="agendar = true"
              >
                Agendar
              </v-btn>
              <v-btn
                width="190"
                color="green"
                class="white--text"
                :disabled="
                  motivoPortabilidade == 4 || motivoPortabilidade == 5 || motivoPortabilidade == 8
                    ? true
                    : invalid
                "
                type="submit"
              >
                Finalizar
              </v-btn>
              <v-btn width="190" color="red" class="white--text" @click="clearForm">Limpar</v-btn>
            </div>
          </form>
        </validation-observer>
      </v-col>
    </v-card>
    <agendar-caso-component
      :abrirSheetFooterAgendar="agendar"
      :dadosAgenda="dadosAgendamento"
      @updated-close="agendar = !agendar"
      @updated:agendado="resetForm"
    ></agendar-caso-component>
  </section>
</template>

<script>
  import TextareaButton from '../../../../../shared/components/textareaButton/textfieldButton.component.vue'
  import config from '../../../../../core/config'
  import AgendarCasoComponent from './AgendarCaso.component.vue'
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import alerts from '../../../../../mixins/alerts.mixins'
  export default {
    components: {
      TextareaButton,
      ValidationObserver,
      ValidationProvider,
      AgendarCasoComponent
    },
    props: {
      novoCasoAtivacao: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      tempo: null,
      interval: null,
      text: 'Atualizando',
      intervalText: null,
      statusPortabilidade: null,
      motivoPortabilidade: null,
      statusMeioContato: null,
      observacao: null,
      agendar: false,
      listarMeioContato: [{ text: 'WHATSAPP' }, { text: 'ATIVO (CALLBACK)' }],
      itemsStatusPortabilidade: [],
      itemsMotivoPortabilidade: []
    }),
    mixins: [alerts],
    filters: {
      formatedDate(value) {
        if (!value) {
          return ''
        }
        return value.split('-').reverse().join('/')
      }
    },
    computed: {
      vendaCheckout() {
        let data = this.novoCasoAtivacao
        if (!data) return
        let dadosCheck = {
          title:
            data.VENDA_VALIDADA_URA_CHECKOUT == 'SIM'
              ? 'Esta venda foi validado na Ura!'
              : data.VENDA_VALIDADA_URA_CHECKOUT == 'NÃO'
              ? 'Cliente não aceitou está oferta!'
              : 'Não houve validação desta venda na Ura!',
          isCheck:
            data.VENDA_VALIDADA_URA_CHECKOUT == 'SIM'
              ? 1
              : data.VENDA_VALIDADA_URA_CHECKOUT == 'NÃO'
              ? 0
              : 2,
          type:
            data.VENDA_VALIDADA_URA_CHECKOUT == 'SIM'
              ? 'success'
              : data.VENDA_VALIDADA_URA_CHECKOUT == 'NÃO'
              ? 'error'
              : 'warning',
          info: [
            {
              formaPagamento: data.FORMA_PAGAMENTO_URA_CHECKOUT,
              planoUra: data.PLANO_URA_CHECKOUT,
              valorFinal: data.VALOR_PLANO_F_URA_CHECKOUT,
              valorPlano: data.VALOR_PLANO_URA_CHECKOUT,
              tipoVenda: data.TIPO_VENDA_URA_CHECKOUT
            }
          ]
        }
        return dadosCheck
      },
      textPadrao() {
        if (this.vendaCheckout.isCheck == 1) {
          return `O cliente recebeu à oferta
                  ${this.vendaCheckout.info[0].planoUra}, no valor de R$
                  ${this.vendaCheckout.info[0].valorPlano} com a forma
                  ${this.vendaCheckout.info[0].formaPagamento} o valor final ficou
                  em R$ ${this.vendaCheckout.info[0].valorFinal} e <strong>aceitou!</strong>`
        } else if (this.vendaCheckout.isCheck == 0) {
          return `O cliente recebeu à oferta
                  ${this.vendaCheckout.info[0].planoUra}, no valor de R$
                  ${this.vendaCheckout.info[0].valorPlano} com a forma
                  ${this.vendaCheckout.info[0].formaPagamento} o valor final ficou
                  em R$ ${this.vendaCheckout.info[0].valorFinal} e <strong>não aceitou!</strong>`
        } else {
          return `O cliente recebeu à oferta
                  ${this.vendaCheckout.info[0].planoUra}, no valor de R$
                  ${this.vendaCheckout.info[0].valorPlano} com a forma
                  ${this.vendaCheckout.info[0].formaPagamento} o valor final ficou
                  em R$ ${this.vendaCheckout.info[0].valorFinal} e <strong>não validou a oferta na URA!</strong>`
        }
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      dadosAgendamento() {
        let dados = this.novoCasoAtivacao
        let dadosCompleto = {
          typeForm: 'portabilidade',
          idMailing: dados.ID_MAILING,
          itemCasoAtivo: null,
          itemCausaMacro: null,
          itemCausaMicro: null,
          almopeTratamentoFechamento: this.usuarioAlmope,
          dataFimTratamento: this.moment().format('YYYY-MM-DD HH:MM:SS'),
          tempoTratamento: this.diferencaTempo(),
          statusTratamentoBko: 2,
          statusContato: null,
          observacao: this.observacao,
          statusPortabilidade: this.statusPortabilidade,
          motivoPortabilidade: this.motivoPortabilidade,
          numCaso: dados.NUM_CASO
        }
        return dadosCompleto
      }
    },
    mounted() {
      this.interval = setInterval(() => {
        this.tempo = this.diferencaTempo()
      }, 1000)
      this.intervalText = setInterval(() => {
        if (this.novoCasoAtivacao.ID_MAILING) {
          return
        } else {
          if (this.text.length == 14) {
            this.text = 'Atualizando'
          } else {
            this.text += '.'
          }
        }
      }, 1000)
    },
    methods: {
      clearForm() {
        this.statusPortabilidade = null
        this.motivoPortabilidade = null
        this.observacao = null
      },
      resetForm(e) {
        this.statusPortabilidade = null
        this.motivoPortabilidade = null
        this.observacao = null
        this.$emit('update:return-tabulador', 'tabulador-ativacao')
        if (e.completed) {
          this.toast('Agendamento realizado com sucesso!', 'top-right', false, 2000, 'success')
        }
      },
      loadMotivoPortabilidade() {
        let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/motivo_portabilidade`
        this.$api
          .get(urlData, {
            params: {
              idStatus: this.statusPortabilidade
            }
          })
          .then(res => {
            this.itemsMotivoPortabilidade = res.data
          })
      },
      loadStatusPortabilidade() {
        let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/status_portabilidade`
        this.$api.get(urlData).then(res => {
          this.itemsStatusPortabilidade = res.data
        })
      },
      closeForm() {
        this.$router.push('/pyxis/service-to-sales/backoffice/')
      },
      diferencaTempo() {
        let inicio = new Date(this.novoCasoAtivacao.DATA_INICIO_TRATAMENTO)
        let fim = new Date()
        let diferenca = new Date(fim - inicio)

        let hours = diferenca.getUTCHours().toString()
        let hoursF = hours.length == 1 ? '0' + hours : hours
        let minutes = diferenca.getUTCMinutes().toString()
        let minutesF = minutes.length == 1 ? '0' + minutes : minutes
        let seconds = diferenca.getUTCSeconds().toString()
        let secondsF = seconds.length == 1 ? '0' + seconds : seconds

        var resultado = hoursF + ':'
        resultado += minutesF + ':'
        resultado += secondsF
        return resultado
      },
      tempoTratativa() {
        return setInterval(() => {
          this.diferencaTempo
        }, 1000)
      },
      async submit() {
        let qtdeDiasAgendamento = this.itemsMotivoPortabilidade
          .map(e => {
            return e
          })
          .filter(item => {
            return item.ID_MOTIVO == this.motivoPortabilidade
          })
        let dataAgendPortabilidade = this.moment()
          .add(qtdeDiasAgendamento[0].SLA, 'days')
          .format('YYYY-MM-DD')

        let data = {
          procedimento: 3,
          statusTratamento: this.statusPortabilidade == 1 ? 3 : 2, // 2: Agendamento, 3: Finalizado
          almope: this.usuarioAlmope,

          numCaso: this.novoCasoAtivacao.NUM_CASO,
          idMailing: null,
          statusContato: null,
          casoAtivo: null,
          motivoMacro: null,
          motivoMicro: null,

          observacao: this.observacao,
          dataAgendamento: dataAgendPortabilidade,
          dataAgendPortabilidade: dataAgendPortabilidade,
          statusPortabilidade: this.statusPortabilidade,
          motivoPortabilidade: this.motivoPortabilidade,
          statusMeioContato: this.statusMeioContato
        }
        // await this.$store.dispatch("atualizarCasoActions", data);
        let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/operacao_ativacao/`
        await this.$api.post(urlData, data)
        this.toast('Tratativa salva com sucesso!', 'top-right', false, 2000, 'success')

        this.resetForm()
        this.$emit('update:return-tabulador', 'tabulador-ativacao')
      }
    },
    created() {
      this.loadStatusPortabilidade()
    },
    beforeUnmount: function () {
      clearInterval(this.interval)
      clearInterval(this.intervalText)
    }
  }
</script>

<style scoped>
  .demo {
    font-family: sans-serif;
    border: 1px solid #eee;
    border-radius: 2px;
    padding: 20px 30px;
    margin-top: 1em;
    margin-bottom: 40px;
    user-select: none;
    overflow-x: auto;
    padding: 10px 20px;
    background: #f3beb8;
    border: 1px solid #f09898;
  }

  .box {
    width: 150px;
    height: 280px;
    position: fixed;
    z-index: 1000;
    right: 1rem;
    top: 10rem;
    text-align: center;
    border-radius: 10px;
    color: #ffffff;
    background-color: #591b3d;
  }

  .box-span {
    font-size: 10px;
    text-align: center;
  }

  .box-time {
    margin-top: -10px;
  }
  .box-consolidado-dia {
    margin-top: -20px;
  }
  .box-dia {
    font-size: 10px;
    text-align: center;
  }

  .box-quantidade-dia {
    margin-top: -10px;
  }

  .box-consolidado-mes {
    margin-top: -20px;
  }
  .box-mes {
    font-size: 10px;
    text-align: center;
  }

  .box-quantidade-mes {
    margin-top: -10px;
  }

  .box-quantidade-ativados {
    margin-top: -20px;
  }
  .box-ativados {
    font-size: 10px;
    text-align: center;
  }

  .box-quantidade-ativo-mes {
    margin-top: -10px;
  }
  .cor-padrao {
    background-image: linear-gradient(220deg, rgb(0, 236, 255), rgb(143, 14, 143));
  }

  label {
    font-size: 12px;
  }
  .btn-toggle {
    display: flex;
    flex-direction: column;
  }

  li {
    font-size: 13px;
    color: black;
  }
</style>
