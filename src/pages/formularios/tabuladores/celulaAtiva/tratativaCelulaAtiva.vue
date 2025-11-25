<template>
  <v-container class="mt-4">
    <v-card elevation="1" class="rounded-xl">
      <v-card-title class="text-h5 mb-2" style="position: relative">
        <div style="display: flex; flex-direction: column; width: 100%">
          <div
            class="mt-2"
            style="display: flex; flex-direction: row; justify-content: space-between"
          >
            Tratativa Célula Ativa
            <v-btn icon to="/pyxis/utilitarios?id=75">
              <v-icon>fas fa-close</v-icon>
            </v-btn>
          </div>
        </div>
        <div class="box-tempo-tratativa">
          <span class="box-span" style="font-size: 13px">Tempo de tratativa</span>

          <p class="box-time">
            <i class="fa-solid fa-rotate" id="icon-rotate"></i>
            {{
              tempoTratativa == 'NaN:NaN:NaN' || tempoTratativa == null || tempoTratativa.length > 8
                ? '00:00:00'
                : tempoTratativa
            }}
          </p>
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <div class="pa-2">
        <fieldset>
          <legend class="mb-2">Informações do cliente</legend>
          <v-row>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="Nª Caso"
                label="Nª Caso"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.NUM_CASO"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="Instalação"
                label="Instalação"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.INSTALACAO"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="E-Billing"
                label="E-Billing"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.E_BILLING"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="Tel. Fixo "
                label="Tel. Fixo "
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.TEL_FIXO"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="Celular"
                label="Celular"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.CELULAR"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="E-mail"
                label="E-mail"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.E_MAIL"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="Endereço"
                label="Endereço"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.ENDERECO"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="Data Faturamento"
                label="Data Faturamento"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.DATA"
              ></v-text-field>
            </v-col>
          </v-row>
        </fieldset>
        <fieldset>
          <legend class="mb-2">Informações da leitura</legend>
          <v-row>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="Leitura do Mês Faturado"
                label="Leitura do Mês Faturado"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.LEITURA_MES_FATURADO"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="Meses Estimados"
                label="Meses Estimados"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.MESES_ESTIMADOS"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="Parcela"
                label="Parcela"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.PARCELA"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="Consumo Real kWh"
                label="Consumo Real kWh"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.CONSUMO_REAL_KWH"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="Valor Mês Atual"
                label="Valor Mês Atual"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.VALOR_MES_ATUAL"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="Quantidade kWh"
                label="Quantidade kWh"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.QTDE_KWH"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="Qtde. 323 kWh"
                label="Qtde. 323 kWh"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.QTDE_323_KWH"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="Mnt Parc."
                label="Mnt Parc."
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.MNT_PARC"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="Valor Parcela"
                label="Valor Parcela"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.VALOR_PARCELA"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="kWh Faturado no Período"
                label="kWh Faturado no Período"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.KWH_FATURADO_PERIODO"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="Diferença kWh"
                label="Diferença kWh"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.DIFERENCA_KWH"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="Deixamos de Faturar kWh"
                label="Deixamos de Faturar kWh"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.DEIXAMOS_FATURAR_KWH"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="Desconto kWh"
                label="Desconto kWh"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.DESCONTO_KWH"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <v-text-field
                placeholder="Dias da Emissão"
                label="Dias da Emissão"
                dense
                outlined
                readonly
                filled
                :value="resultDadosTratativa.DIAS_EMISSAO"
              ></v-text-field>
            </v-col>
          </v-row>
        </fieldset>
        <fieldset>
          <legend class="mb-2">Tratativa</legend>

          <v-row>
            <v-col>
              <validation-observer v-slot="{ invalid, validate }" ref="observer">
                <form @submit.prevent="validate().then(submit)">
                  <v-row>
                    <v-col cols="12">
                      <v-alert
                        border="bottom"
                        colored-border
                        type="warning"
                        elevation="1"
                        v-if="resultDadosTratativa.STATUS_TRATAMENTO == 'AGENDADO PENDENTE'"
                      >
                        {{
                          resultDadosTratativa.STATUS_TRATAMENTO == 'AGENDADO PENDENTE'
                            ? 'Esse caso foi agendado anteriormente. Necessário que a tratativa ocorra agora!'
                            : ''
                        }}
                      </v-alert>
                    </v-col>
                    <v-col cols="3" class="my-0 py-0">
                      <validation-provider
                        v-slot="{ errors }"
                        name="Tentativa de contato"
                        rules="required"
                      >
                        <v-select
                          dense
                          outlined
                          required
                          placeholder="Tentativa de Contato"
                          label="Tentativa de Contato"
                          :items="['COM SUCESSO', 'SEM SUCESSO', 'CNPJ SEM SOCIO CADASTRADO']"
                          :error-messages="errors"
                          v-model="formTratativa.conclusao"
                        ></v-select>
                      </validation-provider>
                    </v-col>
                    <v-col
                      cols="3"
                      class="my-0 py-0"
                      v-if="formTratativa.conclusao == 'COM SUCESSO'"
                    >
                      <validation-provider v-slot="{ errors }" name="titular" rules="required">
                        <v-select
                          dense
                          outlined
                          required
                          placeholder="Titular"
                          label="Titular"
                          :items="['SIM', 'NÃO']"
                          :error-messages="errors"
                          v-model="formTratativa.titular"
                        ></v-select>
                      </validation-provider>
                    </v-col>
                    <v-col
                      cols="3"
                      class="my-0 py-0"
                      v-if="formTratativa.conclusao == 'COM SUCESSO'"
                    >
                      <validation-provider v-slot="{ errors }" name="concordou" rules="required">
                        <v-select
                          dense
                          outlined
                          required
                          placeholder="Concordou?"
                          label="Concordou?"
                          :items="['SIM', 'NÃO']"
                          :error-messages="errors"
                          v-model="formTratativa.concordou"
                        ></v-select>
                      </validation-provider>
                    </v-col>
                    <v-col
                      cols="3"
                      class="my-0 py-0"
                      v-if="
                        formTratativa.conclusao == 'COM SUCESSO' && formTratativa.concordou == 'NÃO'
                      "
                    >
                      <validation-provider
                        v-slot="{ errors }"
                        name="porque não concordou"
                        rules="required"
                      >
                        <v-select
                          dense
                          outlined
                          required
                          placeholder="Porque não concordou?"
                          label="Porque não concordou?"
                          :items="motivosNaoConcordou"
                          item-text="MOTIVO"
                          :error-messages="errors"
                          v-model="formTratativa.porqueNaoConcordou"
                        ></v-select>
                      </validation-provider>
                    </v-col>
                    <v-col
                      cols="3"
                      class="my-0 py-0"
                      v-if="formTratativa.conclusao == 'COM SUCESSO'"
                    >
                      <validation-provider
                        v-slot="{ errors }"
                        name="nª da nota registro"
                        rules="required"
                      >
                        <v-text-field
                          dense
                          outlined
                          required
                          placeholder="Nª da nota registro"
                          label="Nª da nota registro"
                          :error-messages="errors"
                          v-model="formTratativa.numeroRegistro"
                        ></v-text-field>
                      </validation-provider>
                    </v-col>
                    <v-col
                      cols="12"
                      class="my-0 py-0"
                      v-if="formTratativa.conclusao == 'COM SUCESSO'"
                    >
                      <validation-provider v-slot="{ errors }" name="observação" rules="required">
                        <v-textarea
                          dense
                          outlined
                          required
                          label="Observação"
                          placeholder="Observação"
                          :error-messages="errors"
                          v-model="formTratativa.observacao"
                        ></v-textarea>
                      </validation-provider>
                    </v-col>
                  </v-row>
                  <div style="display: flex; justify-content: space-between; align-items: center">
                    <div style="display: flex; gap: 10px">
                      <v-btn
                        color="info"
                        @click="loadNovoCaso()"
                        :disabled="resultDadosTratativa != ''"
                      >
                        Novo caso
                      </v-btn>
                      <v-btn color="success" type="submit" :disabled="invalid">Salvar</v-btn>
                      <v-btn color="warning" @click="abrirSheetFooterAgendar = true">Agendar</v-btn>
                      <v-btn color="error" @click="limparForm">Limpar</v-btn>
                    </div>
                    <div
                      style="
                        text-align: center;
                        background-color: #e0e0e0;
                        padding: 10px;
                        border-radius: 5px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                      "
                    >
                      <div
                        style="display: flex; align-items: center; gap: 5px; margin-bottom: 10px"
                      >
                        <i class="fa-solid fa-clock" style="color: grey"></i>
                        <span style="font-weight: 600; font-size: 16px">Tempo de chamada</span>
                      </div>
                      <div
                        id="relogio"
                        style="
                          background-color: aliceblue;
                          border-radius: 5px;
                          margin-bottom: 10px;
                          width: 100%;
                        "
                      >
                        <span>{{ time }}</span>
                      </div>
                      <div style="display: flex; gap: 5px">
                        <v-tooltip bottom>
                          <template v-slot:activator="{ attrs, on }">
                            <v-btn
                              fab
                              color="success"
                              small
                              elevation="1"
                              v-bind="attrs"
                              v-on="on"
                              :disabled="time != null"
                              @click="iniciarTempoChamada"
                            >
                              <v-icon size="19" style="transform: rotate(-45deg)">
                                fa-solid fa-phone-volume
                              </v-icon>
                            </v-btn>
                          </template>
                          <span>Iniciar tempo de chamada</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ attrs, on }">
                            <v-btn
                              v-bind="attrs"
                              v-on="on"
                              @click="pausarTempoChamada"
                              fab
                              color="orange"
                              small
                              :disabled="time == null"
                              elevation="1"
                              style="position: relative"
                            >
                              <v-icon size="19" color="white">fa-solid fa-phone</v-icon>
                              <v-icon
                                style="position: absolute; bottom: 6px; right: 0px"
                                size="11"
                                color="white"
                              >
                                fa-solid fa-circle-pause
                              </v-icon>
                            </v-btn>
                          </template>
                          <span>Pausa tempo de chamada</span>
                        </v-tooltip>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ attrs, on }">
                            <v-btn
                              fab
                              color="error"
                              @click="finalizarTempoChamada"
                              small
                              elevation="1"
                              :disabled="time == null"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon size="19">fa-solid fa-phone-slash</v-icon>
                            </v-btn>
                          </template>
                          <span>Finalizar tempo de chamada</span>
                        </v-tooltip>
                      </div>
                    </div>
                  </div>
                </form>
              </validation-observer>
            </v-col>
          </v-row>
        </fieldset>
      </div>
    </v-card>
    <agendamento-component
      :abrirSheetFooterAgendar="abrirSheetFooterAgendar"
      @updated-close="abrirSheetFooterAgendar = !abrirSheetFooterAgendar"
      @updated:salvar="agendamentoCaso"
    ></agendamento-component>
  </v-container>
</template>

<script>
  import agendamentoComponent from '../../../../shared/components/bottomSheet/agendamento.component.vue'
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import alerts from '../../../../mixins/alerts.mixins'
  import config from '../../../../core/config'
  export default {
    components: { ValidationObserver, ValidationProvider, agendamentoComponent },
    data: () => ({
      motivosNaoConcordou: [],
      resultDadosTratativa: [],
      abrirSheetFooterAgendar: false,
      formTratativa: {
        conclusao: null,
        titular: null,
        concordou: null,
        porqueNaoConcordou: null,
        numeroRegistro: null,
        observacao: null,
        statusTratativa: null,
        dataAgendamento: null,
        numCaso: null
      },
      time: null,
      tempoTratativa: null,
      timeSeconds: null,
      interval: null,
      intervalTmt: null,
      pauseTime: false
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      }
    },
    mixins: [alerts],
    mounted() {
      this.intervalTmt = setInterval(() => {
        this.get_time_diff(this.resultDadosTratativa.DATA_TRATATIVA)
      }, 1000)
    },
    methods: {
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
        return (this.tempoTratativa = this.msToTime(milisec_diff))
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
      iniciarTempoChamada() {
        this.pauseTime = false
        let timeStart = [0, 0, 0]

        // segundos
        this.interval = setInterval(() => {
          if (this.pauseTime) return
          if (timeStart[1] == 59 && timeStart[2] == 59) {
            timeStart[2] = 0
            timeStart[1] = 0
            timeStart[0]++
          } else if (timeStart[2] == 59) {
            timeStart[2] = 0
            timeStart[1]++
          } else {
            timeStart[2]++
          }
          if (timeStart[0] == 59 && timeStart[1] == 59 && timeStart[2] == 59) {
            this.pauseTime = true
          }
          this.time = `${timeStart[0].toString().padStart(2, '0')}:${timeStart[1]
            .toString()
            .padStart(2, '0')}:${timeStart[2].toString().padStart(2, '0')}`
        }, 1000)
      },
      pausarTempoChamada() {
        this.pauseTime = !this.pauseTime
      },
      finalizarTempoChamada() {
        let hms = this.time.split(':')
        let seconds = +hms[0] * 60 * 60 + +hms[1] * 60 + +hms[2]
        this.timeSeconds = seconds
        //
        this.time = null
        clearInterval(this.interval)
      },
      async submit(statusTratativa = 3) {
        try {
          this.isSend = true
          this.formTratativa.statusTratativa = statusTratativa
          this.formTratativa.numCaso = this.resultDadosTratativa.NUM_CASO
          this.formTratativa.timeSeconds = this.timeSeconds
          let urlData = `${config.baseUrl}api/shared/formularios/celula_ativa/acoes`
          await this.$api.post(urlData, this.formTratativa)
          this.toast('Tratativa realizada com sucesso!', 'top-right', false, 2000, 'success')
          this.limparForm()
          this.resultDadosTratativa = ''
          this.isSend = false
        } catch (e) {
          this.toast('Não foi possível salvar no momento!', 'top-right', false, 2000, 'error')
          this.isSend = false
        }
      },
      async agendamentoCaso(dataAgendamento) {
        try {
          if (dataAgendamento) {
            this.isSend = true
            this.formTratativa.statusTratativa = 2
            this.formTratativa.dataAgendamento = dataAgendamento
            this.formTratativa.numCaso = this.resultDadosTratativa.NUM_CASO
            await this.submit(2)
            this.resultDadosTratativa = ''
            this.limparForm()
            this.toast('Agendamento realizado com sucesso!', 'top-right', false, 2000, 'success')
            this.isSend = false
          }
        } catch (e) {
          this.toast('Erro ao agendar, tente novamente!', 'top-right', false, 2000, 'error')
          this.isSend = false
        }
      },
      loadNovoCaso() {
        let urlData = `${config.baseUrl}api/shared/formularios/celula_ativa/novo_caso`
        this.$api
          .get(urlData, {
            params: {
              almope: this.usuario.almope
            }
          })
          .then(res => {
            this.resultDadosTratativa = res?.data[0]
          })
      },
      limparForm() {
        let newForm = Object.assign({}, this.formTratativa)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })

        this.formTratativa = newForm
        this.$refs.observer.reset()
      },
      loadMotivosNaoConcordou() {
        let urlData = `${config.baseUrl}api/shared/formularios/celula_ativa/motivos_nconcordou`
        this.$api.get(urlData).then(res => {
          this.motivosNaoConcordou = res.data
        })
      }
    },
    created() {
      this.loadMotivosNaoConcordou()
    },
    beforeUnmount: function () {
      clearInterval(this.interval)
    }
  }
</script>

<style scoped>
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap');

  #relogio {
    font-family: 'Orbitron', sans-serif;
    font-optical-sizing: auto;
    font-weight: 400;
    font-size: 22px;
    font-style: normal;
  }
  fieldset {
    padding: 15px;
    border: 1px solid #3333;
    margin-bottom: 15px;
  }
  legend {
    padding: 0 10px;
    font-size: 15px;
  }

  .box-tempo-tratativa {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: -19px;
    right: 80px;
    position: absolute;
  }

  #icon-rotate {
    animation-duration: 2s;
    animation-name: slidein;
    animation-iteration-count: infinite;
  }
  @keyframes slidein {
    from {
      transform: rotate(0deg);
      color: #000000;
    }

    to {
      transform: rotate(360deg);
      color: #525252;
    }
  }
</style>
