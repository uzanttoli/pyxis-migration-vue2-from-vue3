<template>
  <v-card elevation="0">
    <div class="box-tempo-tratativa">
      <div class="rel">
        <div
          style="display: flex; flex-direction: row; justify-content: center; align-items: center"
        >
          <v-icon size="25" color="white" class="mr-3">fa-solid fa-stopwatch</v-icon>
          <div style="display: flex; flex-direction: column; align-items: center">
            Tempo tratativa
            <p class="box-time">
              {{ tempo == 'NaN:NaN:NaN' || tempo == null || tempo.length > 8 ? '00:00:00' : tempo }}
            </p>
          </div>
        </div>
        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
            margin-top: 10px;
            position: relative;
          "
        >
          <v-icon size="23" color="white" class="mr-3">fa-solid fa-business-time</v-icon>
          <div style="display: flex; flex-direction: column; align-items: center">
            Qtd. Pendentes
            <p class="box-time">
              {{ qtdPendentes }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <v-card-title>
      <div style="width: 100%">
        <div>
          <fieldset
            class="ma-0 pa-2 mb-4 ml-n2"
            style="width: 250px; border: 1px solid #3333; border-radius: 10px"
          >
            <legend style="font-size: 15px; font-weight: 600; margin: 0 5px; color: grey">
              <i class="fa-solid fa-gear mr-2" style="color: grey"></i>
              Config. Tratativas
            </legend>
            <div style="display: flex; align-items: center">
              <div>
                <div style="display: flex; justify-content: start">
                  <v-btn-toggle
                    class="rounded-lg"
                    mandatory
                    v-model="mesAtual"
                    dense
                    active-class="blue darken-3"
                  >
                    <v-btn
                      class="text-capitalize"
                      v-for="(item, i) in mesRef"
                      :key="i"
                      width="150"
                      :value="item.VALOR"
                      :class="item.VALOR == mesAtual ? 'white--text' : ''"
                    >
                      <i
                        v-if="item.VALOR == mesAtual"
                        class="fa-solid fa-circle-check"
                        style="color: greenyellow; margin-right: 5px"
                      ></i>
                      {{ item.TEXT }}
                    </v-btn>
                  </v-btn-toggle>
                </div>
                <div
                  style="
                    display: flex;
                    justify-content: start;
                    width: 100%;
                    margin-top: 10px;
                    margin-bottom: -10px;
                  "
                >
                  <v-autocomplete
                    dense
                    outlined
                    placeholder="Selecione uma fila"
                    label="Selecione uma fila"
                    class="rounded-lg"
                    :items="itemsSolicitacaoPendente"
                    item-text="DETALHE_TIPO_SOLICITACAO"
                    v-model="detalheSolicitacao"
                    no-data-text="Fila não carregada"
                    @change="reloadData()"
                  ></v-autocomplete>
                </div>
              </div>
              <div style="margin: 0 20px; margin-top: 0px">
                <v-tooltip bottom>
                  <template v-slot:activator="{ attrs, on }">
                    <v-btn icon v-bind="attrs" v-on="on" @click="abrirMenuDownload = true">
                      <v-icon size="35" color="#00C853">fa-solid fa-file-excel</v-icon>
                    </v-btn>
                  </template>
                  <span>Baixar base (Com base no mês selecionado)</span>
                </v-tooltip>
              </div>
            </div>
          </fieldset>

          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px">
            <v-tooltip right>
              <template v-slot:activator="{ on, attrs }">
                <!-- :color="prioridade(this.dadosTratativa.PRIORIDADE)" -->
                <v-icon v-bind="attrs" v-on="on" class="icon-prioridade" id="icon-prioridade">
                  fa-solid fa-fire
                </v-icon>
              </template>
              <span>
                Prioridades:
                <p>
                  <v-icon color="red" class="mr-2">fa-solid fa-fire</v-icon>
                  Alto
                </p>
                <p>
                  <v-icon color="orange" class="mr-2">fa-solid fa-fire</v-icon>
                  Médio
                </p>
                <p>
                  <v-icon color="green" class="mr-2">fa-solid fa-fire</v-icon>
                  Baixo
                </p>
              </span>
            </v-tooltip>
            <h3 style="color: grey; padding: 0; margin: 0">
              <span v-if="dadosTratativa != ''" style="font-style: italic; color: #3338">
                {{ dadosTratativa.PRIORIDADE }}ª na ordem de prioridade -
              </span>
              Dados demanda
            </h3>
          </div>
        </div>
      </div>
    </v-card-title>
    <v-col class="mt-2">
      <v-row>
        <v-col class="pa-0" cols="4">
          <TextareaButton label="Núm. Caso" :text="dadosTratativa.NUM_CASO" />
        </v-col>
        <v-col class="pa-0" cols="4">
          <TextareaButton label="Fila" :text="dadosTratativa.UNIDADE_NEGOCIO" />
        </v-col>
        <v-col class="pa-0" cols="4">
          <TextareaButton label="Data Abertura" :text="dadosTratativa.DATA" />
        </v-col>
        <v-col class="pa-0" cols="4">
          <TextareaButton label="Telefone" :text="dadosTratativa.MSISDN_TELEFONE" />
        </v-col>
        <v-col class="pa-0" cols="4">
          <TextareaButton label="Telefone Contato" :text="dadosTratativa.TELEFONES_CONTATO" />
        </v-col>
        <v-col class="pa-0" cols="4">
          <TextareaButton label="Contrato" :text="dadosTratativa.COD_CONTRATO" />
        </v-col>
        <v-col class="pa-0" cols="4">
          <TextareaButton label="Solicitação" :text="dadosTratativa.TIPO_SOLICITACAO" />
        </v-col>
        <v-col class="pa-0" cols="4">
          <TextareaButton label="Critico?" :text="dadosTratativa.MENCIONOU_CANAIS_CRITICOS" />
        </v-col>
        <v-col class="pa-0" cols="4">
          <TextareaButton label="Detalhe" :text="dadosTratativa.DETALHE_TIPO_SOLICITACAO" />
        </v-col>

        <v-col class="pa-0" cols="12">
          <v-textarea
            class="ma-2 mt-n5"
            outlined
            dense
            :value="dadosTratativa.OBSERVACOES"
            rows="3"
            readonly
            label="Observação"
            placeholder="Observação"
          ></v-textarea>
        </v-col>
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
            <v-col cols="4">
              <validation-provider rules="required" name="retorno supervisor" v-slot="{ errors }">
                <v-autocomplete
                  dense
                  outlined
                  :error-messages="errors"
                  placeholder="Retorno Supervisor"
                  label="Retorno Supervisor"
                  v-model="form.retornoSupervisor"
                  :items="itemsRetornoSupervisor"
                  item-text="DESCRICAO"
                  no-data-text="Items não carregados..."
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="4">
              <validation-provider v-slot="{ errors }" rules="required" name="contato cliente">
                <v-select
                  outlined
                  dense
                  placeholder="Contato Cliente"
                  label="Contato Cliente"
                  :error-messages="errors"
                  :items="['SIM', 'NÃO']"
                  v-model="form.contatoCliente"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="4">
              <validation-provider v-slot="{ errors }" rules="required" name="operador reorientado">
                <v-select
                  outlined
                  dense
                  placeholder="Operador Reorientado?"
                  label="Operador Reorientado?"
                  :error-messages="errors"
                  :items="['SIM', 'NÃO']"
                  v-model="form.operadorReorientado"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="12" class="mt-n5">
              <validation-provider rules="required" name="observação" v-slot="{ errors }">
                <v-textarea
                  :error-messages="errors"
                  dense
                  rows="3"
                  placeholder="Observação"
                  label="Observação"
                  outlined
                  v-model="form.observacao"
                ></v-textarea>
              </validation-provider>
            </v-col>
          </v-row>
          <div style="display: flex; gap: 10px">
            <v-btn
              color="info"
              @click="novoCaso()"
              :disabled="dadosTratativa != ''"
              :loading="loading"
            >
              Novo Tratamento
            </v-btn>
            <v-btn :disabled="invalid" color="success" type="submit">Finalizar</v-btn>
            <v-btn color="warning" @click="abrirSheetFooterAgendar = true">Agendar</v-btn>
            <v-btn color="error" @click="limparForm">Limpar</v-btn>
          </div>
        </form>
      </validation-observer>
    </v-col>
    <agendamento-component-vue
      :abrirSheetFooterAgendar="abrirSheetFooterAgendar"
      @updated:salvar="salvarAgendamento"
      @updated-close="abrirSheetFooterAgendar = !abrirSheetFooterAgendar"
    ></agendamento-component-vue>
    <v-dialog v-model="abrirMenuDownload" width="318">
      <v-card style="display: flex; flex-direction: column; gap: 10px; padding: 15px">
        <div style="display: flex">
          <download-excel
            :data="dadosDownloadBase"
            name="MINHAS_TRATATIVAS_DEMANDAS_SUP_PYXIS"
            worksheet="MINHAS_TRATATIVAS_DEMANDAS_SUP_PYXIS"
          >
            <v-btn width="248" color="success">Base tratativa</v-btn>
          </download-excel>
          <v-tooltip bottom>
            <template v-slot:activator="{ attrs, on }">
              <v-btn icon class="ml-1" @click="gerarBase('baseTratativa')" v-bind="attrs" v-on="on">
                <v-icon :class="classLoading">fa-solid fa-repeat</v-icon>
              </v-btn>
            </template>
            <span>Gerar base</span>
          </v-tooltip>
        </div>
        <div style="display: flex">
          <download-excel
            :data="dadosBasePrioridade"
            name="PRIORIDADE_DEMANDAS_SUP_PYXIS"
            worksheet="PRIORIDADE_DEMANDAS_SUP_PYXIS"
          >
            <v-btn width="248" color="warning">Base Prioridade</v-btn>
          </download-excel>
          <v-btn icon class="ml-1" @click="gerarBase('prioridade')">
            <v-icon :class="classLoadingPrioridade">fa-solid fa-repeat</v-icon>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import TextareaButton from '../../../../../../shared/components/textareaButton/textfieldButton.component.vue'
  import config from '../../../../../../core/config'
  import alerts from '../../../../../../mixins/alerts.mixins'
  import agendamentoComponentVue from '../../../../../../shared/components/bottomSheet/agendamento.component.vue'
  export default {
    components: {
      ValidationObserver,
      ValidationProvider,
      TextareaButton,
      agendamentoComponentVue
    },
    data: () => ({
      form: {
        retornoSupervisor: null,
        contatoCliente: null,
        operadorReorientado: null,
        observacao: null
      },
      dadosTratativa: [],
      itemsRetornoSupervisor: [],
      itemsSolicitacaoPendente: [],
      dadosDownloadBase: [],
      dadosBasePrioridade: [],
      abrirSheetFooterAgendar: false,
      loadingBasePrioridade: false,
      abrirMenuDownload: false,
      classLoading: '',
      classLoadingPrioridade: '',
      loading: false,
      tempo: null,
      interval: null,
      mesAtual: null,
      detalheSolicitacao: null,
      qtdPendentes: 0
    }),
    mixins: [alerts],
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },

      mesRef() {
        let arrMesRef = [
          {
            VALOR: this.mesDate(1),
            TEXT: 'Mês atual'
          },
          {
            VALOR: this.mesDate(),
            TEXT: 'Mês anterior'
          }
        ]
        return arrMesRef
      }
    },
    mounted() {
      this.interval = setInterval(() => {
        this.get_time_diff(this.dadosTratativa.DATA_INICIO_TRATATIVA)
      }, 1000)
    },
    methods: {
      async gerarBase(item) {
        if (item == 'baseTratativa') {
          this.classLoading = 'icon-repeat-loading'
          await this.loadDownloadBase()
          this.classLoading = ''
          this.toast('Base disponivel para download!', 'top-right', false, 2000, 'success')
        } else if (item == 'prioridade') {
          this.classLoadingPrioridade = 'icon-repeat-loading'
          await this.loadBasePrioridade()
          this.classLoadingPrioridade = ''
          this.toast('Base disponivel para download!', 'top-right', false, 2000, 'success')
        }
      },
      async loadBasePrioridade() {
        if (this.dadosBasePrioridade.length > 0) return
        let urlData = `${config.baseUrl}api/shared/demandas_supervisor/download_base_prioridade`
        let res = await this.$api.get(urlData)
        this.dadosBasePrioridade = res.data
      },
      async loadDownloadBase() {
        try {
          let urlData = `${config.baseUrl}api/shared/demandas_supervisor/download_base_tratativa`
          let res = await this.$api.get(urlData, {
            params: {
              dataRef: this.mesAtual,
              nome: this.usuario.nome
            }
          })
          this.dadosDownloadBase = res.data
        } catch (e) {
          console.error(e)
        }
      },
      async salvarAgendamento(e) {
        await this.submit(e)
      },
      loadItemsSolicitacaoPendente() {
        let urlData = `${config.baseUrl}api/shared/demandas_supervisor/solicitacao_pendente`
        this.$api
          .get(urlData, {
            params: {
              dataRef: this.mesAtual,
              nome: this.usuario.nome
            }
          })
          .then(res => {
            this.itemsSolicitacaoPendente = res.data
            this.itemsSolicitacaoPendente.unshift({
              DETALHE_TIPO_SOLICITACAO: ''
            })
          })
      },
      loadQuantidadePendentes() {
        let urlData = `${config.baseUrl}api/shared/demandas_supervisor/quantidade_casos_pendentes`
        this.$api
          .get(urlData, {
            params: {
              dataRef: this.mesAtual,
              nome: this.usuario.nome,
              detalheSolicitacao: this.detalheSolicitacao
            }
          })
          .then(res => {
            this.qtdPendentes = res.data[0].QTD_PENDENTE
          })
      },
      prioridade(item) {
        if (!item) return
        if (item >= 1 || item <= 4) {
          return 'red'
        } else if (item >= 5 || item <= 6) {
          return 'orange'
        } else {
          return 'green'
        }
      },
      mesDate(mesRef = 0) {
        let date = new Date()

        let month = (date.getMonth() + mesRef).toString()
        let monthLength = month.length == 1 ? '0' + month : month
        let year = date.getFullYear().toString()
        let mesAtual = `${year}-${monthLength}-01`
        return mesAtual
      },
      get_time_diff(datetimeTratativa) {
        datetimeTratativa =
          typeof datetimeTratativa !== undefined ? datetimeTratativa : '2019-01-01 00:00:00.000000'

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
      limparForm() {
        let newForm = Object.assign({}, this.form)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.form = newForm
        this.$refs.observer.reset()
      },
      async submit(dataAgendamento = null) {
        if (this.dadosTratativa == '' || this.dadosTratativa == []) return
        try {
          this.form.numCaso = this.dadosTratativa.NUM_CASO
          this.form.almopeTratativa = this.usuario.almope
          this.form.dataAgendamento = dataAgendamento
          this.form.statusTratativa = dataAgendamento != null ? 2 : 3 // 2: AGENDAMENTO -- 3: FINALIZADO
          let urlData = `${config.baseUrl}api/shared/demandas_supervisor/finalizar_caso`
          await this.$api.post(urlData, this.form)
          this.toast(
            dataAgendamento != null
              ? 'Agendamento realizado com sucesso!'
              : 'Dados foram salvos com sucesso!',
            'top-right',
            false,
            2000,
            'success'
          )
          this.limparForm()
          this.dadosTratativa = ''
          this.tempo = null
          this.interval = null
          this.reloadData()
        } catch (e) {
          this.toast('Erro ao tentar salvar! Tente novamente.', 'top-right', false, 2000, 'error')
        }
      },
      novoCaso() {
        if (!this.mesAtual) return
        this.loading = true
        let urlData = `${config.baseUrl}api/shared/demandas_supervisor/novo_caso`
        this.$api
          .get(urlData, {
            params: {
              nome: this.usuario.nome,
              dataRef: this.mesAtual,
              tipoSolicitacao: this.detalheSolicitacao
            }
          })
          .then(res => {
            if (res.data.length > 0) {
              this.dadosTratativa = res?.data[0]
              this.toast('Novo caso em tratamento!', 'top-right', false, 2000, 'success')

              let icon = document.getElementById('icon-prioridade')
              icon.style.color = `${this.prioridade(res?.data[0].PRIORIDADE)}`
            } else {
              this.toast('Não há casos para tratativa', 'top-right', false, 2000, 'warning')
            }
            this.loading = false
          })
          .catch(function () {
            this.loading = false
            this.toast('Caso não atribuido! Tente novamente.', 'top-right', false, 2000, 'error')
          })
      },
      loadItemsRetornoSupervisor() {
        let urlData = `${config.baseUrl}api/shared/demandas_supervisor/retorno_supervisor/`
        this.$api.get(urlData).then(res => {
          this.itemsRetornoSupervisor = res.data
        })
      },
      reloadData() {
        this.loadQuantidadePendentes()
        this.loadItemsSolicitacaoPendente()
      }
    },
    watch: {
      mesAtual(newValue) {
        if (newValue !== null) {
          this.reloadData()
        }
      }
    },
    created() {
      this.loadItemsRetornoSupervisor()
      if (this.mesAtual !== null) {
        this.reloadData()
      }
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
    font-size: 18px;
    padding: 0;
    margin: 0;
  }

  .box-tempo-tratativa {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .rel {
    background-color: #202020a2;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 5px 12px;
    border-radius: 10px;
    position: fixed;
    right: 30px;
    top: 7rem;
    opacity: 0.6;
  }

  .rel:hover {
    color: #525252;
    background-color: #020202d8;
    color: #fff;
    display: flex;
    align-items: center;
    padding: 5px 12px;
    border-radius: 10px;
    position: fixed;
    right: 30px;
    top: 7rem;
    opacity: 0.6;
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

  .icon-repeat-loading {
    animation-duration: 2s;
    animation-name: sliderepeat;
    animation-iteration-count: infinite;
  }

  @keyframes sliderepeat {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  /* .icon-prioridade {
  animation-duration: 2s;
  animation-name: slideicon;
  animation-iteration-count: infinite;
  
}
@keyframes slideicon {
  0% {
    font-size: 18px;
  }
  50% {
    font-size: 25px;
  }
  100% {
    font-size: 18px;
  }
} */
</style>
