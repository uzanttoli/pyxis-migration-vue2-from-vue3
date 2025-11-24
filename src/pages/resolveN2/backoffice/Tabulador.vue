<template>
  <v-container>
    <v-card elevation="1" class="pa-2 rounded-xl">
      <v-card-title class="d-flex justify-space-between gap-2">
        <div class="text-h5">Resolve N2</div>
        <v-divider></v-divider>
        <div>
          <span>
            <v-icon class="mr-2 mt-n1" color="green">fa-solid fa-clock</v-icon>
          </span>

          <span>{{ horas[0] }}</span>
          <span>{{ horas[1] }}</span>
          <span>:</span>
          <span>{{ minutos[0] }}</span>
          <span>{{ minutos[1] }}</span>
          <span>:</span>
          <span>{{ segundos[0] }}</span>
          <span>{{ segundos[1] }}</span>
        </div>
        <v-divider></v-divider>
        <div>
          <v-btn icon to="/pyxis/backoffice/operador">
            <v-icon>fa-solid fa-arrow-left</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-col>
        <FieldSet :title="title" classCustom="my-0 pa-4">
          <v-row>
            <v-col cols="3" class="py-0 my-0">
              <v-text-field
                label="Data de criação:"
                dense
                outlined
                readonly
                :value="dadosTratativa && dataFormatada(dadosTratativa.data_criacao)"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="py-0 my-0">
              <v-text-field
                label="Relativo a:"
                dense
                outlined
                readonly
                :value="dadosTratativa && dadosTratativa.relativo"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="py-0 my-0">
              <v-text-field
                label="Tipo de tarefa:"
                dense
                outlined
                readonly
                :value="dadosTratativa && dadosTratativa.tipo_tarefa"
              ></v-text-field>
            </v-col>
            <v-col cols="3" class="py-0 my-0">
              <v-text-field
                label="Assunto:"
                dense
                outlined
                readonly
                :value="dadosTratativa && dadosTratativa.assunto"
              ></v-text-field>
            </v-col>
          </v-row>
        </FieldSet>
      </v-col>
      <v-col>
        <FieldSet title="Tratativa" classCustom="my-0 pa-4">
          <ValidationObserver v-slot="{ invalid, validate }" ref="observer">
            <form @submit.prevent="validate().then(submit)">
              <v-row>
                <v-col cols="3" class="py-0 my-0">
                  <ValidationProvider name="contato cliente" rules="required" v-slot="{ errors }">
                    <v-autocomplete
                      label="Contato com Cliente?"
                      dense
                      outlined
                      :error-messages="errors"
                      v-model="form.contato_cliente"
                      :items="itemsContatoCliente"
                      item-text="VALOR_CAMPO"
                      @change="loadFormOptionItemTipo(form.contato_cliente)"
                    ></v-autocomplete>
                  </ValidationProvider>
                </v-col>
                <v-col cols="3" class="py-0 my-0">
                  <ValidationProvider name="canal" rules="required" v-slot="{ errors }">
                    <v-autocomplete
                      label="Canal"
                      dense
                      outlined
                      :error-messages="errors"
                      v-model="form.canal"
                      :items="itemsTipoContato"
                      item-text="VALOR_CAMPO"
                    ></v-autocomplete>
                  </ValidationProvider>
                </v-col>
                <template v-if="form.contato_cliente == 'SIM' && form.canal">
                  <v-col cols="3" class="py-0 my-0">
                    <ValidationProvider name="tratamento" rules="required" v-slot="{ errors }">
                      <v-autocomplete
                        label="Tratamento"
                        dense
                        outlined
                        :error-messages="errors"
                        v-model="form.tratamento"
                        :items="itemsTratamento"
                        item-text="VALOR_CAMPO"
                      ></v-autocomplete>
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="3" class="py-0 my-0" v-if="form.tratamento">
                    <ValidationProvider name="dx" rules="required" v-slot="{ errors }">
                      <v-autocomplete
                        label="DX"
                        dense
                        outlined
                        :error-messages="errors"
                        v-model="form.dx"
                        :items="itemsDx"
                        item-text="VALOR_CAMPO"
                        @change="loadFormOptionAreaDirecionamento(), loadFormOptionAreaDestino()"
                      ></v-autocomplete>
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="3" class="py-0 my-0" v-if="form.dx">
                    <ValidationProvider name="direcionamento" rules="required" v-slot="{ errors }">
                      <v-autocomplete
                        label="Área direcionamento"
                        dense
                        outlined
                        :error-messages="errors"
                        v-model="form.area_direcionamento"
                        :items="itemsAreaDirecionamento"
                        item-text="VALOR_CAMPO"
                        @change="loadFormOptionLocalidade(form.area_direcionamento)"
                      ></v-autocomplete>
                    </ValidationProvider>
                  </v-col>
                  <v-col
                    cols="3"
                    class="py-0 my-0"
                    v-if="form.area_direcionamento && itemsLocalidade.length > 0"
                  >
                    <ValidationProvider name="localidade" rules="required" v-slot="{ errors }">
                      <v-autocomplete
                        label="Localidade"
                        dense
                        outlined
                        :error-messages="errors"
                        v-model="form.localidade"
                        :items="itemsLocalidade"
                        item-text="VALOR_CAMPO"
                      ></v-autocomplete>
                    </ValidationProvider>
                  </v-col>
                  <v-col cols="3" class="py-0 my-0" v-if="form.area_direcionamento">
                    <ValidationProvider name="destino" rules="required" v-slot="{ errors }">
                      <v-autocomplete
                        label="Área Destino"
                        dense
                        outlined
                        :error-messages="errors"
                        v-model="form.area_destino"
                        :items="itemsAreaDestino"
                        item-text="VALOR_CAMPO"
                      ></v-autocomplete>
                    </ValidationProvider>
                  </v-col>
                </template>
              </v-row>
              <div class="mt-2">
                <v-btn class="mr-2" color="info" @click="novoTratamento" :loading="loadingCaso">
                  Novo
                </v-btn>
                <v-btn class="mr-2" color="success" type="submit" :disabled="invalid">Salvar</v-btn>
                <v-btn color="error" @click="clearForm">Limpar</v-btn>
              </div>
            </form>
          </ValidationObserver>
        </FieldSet>
      </v-col>
    </v-card>
  </v-container>
</template>

<script>
  import FieldSet from '@/shared/components/Fieldset/Fieldset.vue'
  import { loadFormOptions, loadFormOptionsParent } from '@/utils/formOptions'
  import { MailingResolveN2Service } from '@/data/services/bko/resolveN2'
  import { reverseMapAndConvertKeys } from '@/utils/mapAndConvertKeys'
  export default {
    components: { FieldSet },
    props: {
      configFila: {
        type: [Object, Array],
        require: true
      }
    },
    data: () => ({
      tabulador: 'RESOLVE N2',
      loadingCaso: false,
      dadosTratativa: {},
      form: {
        dx: null,
        canal: null,
        tratamento: null,
        localidade: null,
        area_destino: null,
        contato_cliente: null,
        area_direcionamento: null
        // tipo: null,
      },
      itemsAreaDirecionamento: [],
      itemsContatoCliente: [],
      itemsTipoContato: [],
      itemsAreaDestino: [],
      itemsLocalidade: [],
      itemsTratamento: [],
      itemsTipo: [],
      itemsDx: [],
      interval: null,
      tempoTotal: 0
    }),
    computed: {
      title() {
        if (this.dadosTratativa?.num_caso == undefined) return 'Dados tratativa'
        return `Dados tratativa | Número do caso: ${this.dadosTratativa?.num_caso}`
      },
      horas() {
        return String(Math.floor(this.tempoTotal / 60 / 60)).padStart(2, '0')
      },
      minutos() {
        let minutos = Math.floor(this.tempoTotal / 60)
        if (minutos > 60) {
          minutos = minutos % 60
        }
        return String(minutos).padStart(2, '0')
      },
      segundos() {
        return String(this.tempoTotal % 60).padStart(2, '0')
      },
      usuario() {
        return this.$store.getters.usuario
      },
      dataAgendamento() {
        if (this.form.tratamento === 'DESPACHADO') {
          if (this.configFila.FILA_NOME === 'RISCO A VIDA') {
            let dataAgendamentoCorrido = this.moment()
              .add(12, 'hour')
              .locale('pt-br')
              .format('DD/MM/YYYY HH:mm')
            return dataAgendamentoCorrido
          }
          if (this.configFila.FILA_NOME === 'BOTAO 220') {
            let qtdDiasAgendamento = { dom: 4, seg: 3, ter: 3, qua: 3, qui: 3, sex: 3, sáb: 5 } //dias
            let hoje = this.moment().locale('pt-br').format('ddd')
            let dataAgendamentoUtil = this.moment()
              .add(qtdDiasAgendamento[hoje], 'days')
              .locale('pt-br')
              .format('DD/MM/YYYY HH:mm')
            return dataAgendamentoUtil
          }
        }
        return null
      }
    },
    methods: {
      dataFormatada(value) {
        if (!value) return
        return value.split('-').reverse().join('/')
      },
      startTime() {
        if (this.interval) return
        let horasInicio = new Date(this.dadosTratativa?.inicio_tratamento).getTime()
        let agora = new Date().getTime()

        let diferenca = agora - horasInicio
        let segundosTotal = Math.floor(diferenca / 1000)
        segundosTotal * 1 > 0 ? (this.tempoTotal = segundosTotal) : (this.tempoTotal = 0)

        this.interval = setInterval(() => {
          this.tempoTotal++
        }, 1000)
      },
      //     TRATAMENTO == "DESPACHADO" && ASSUNTO == "BOTAO 220" ? 3 DIAS UTEIS
      //     TRATAMENTO == "DESPACHADO" && ASSUNTO == "RISCO A VIDA" ? 24 HORAS CORRIDAS
      async submit() {
        let despachado = this.form.tratamento
        let formularioPreenchido = {
          idForm: this.configFila.FILA_FORM_ID,
          analiseCaso: [{ ...this.dadosTratativa, ...this.form }],
          segmento: null,
          action:
            despachado == 'DESPACHADO'
              ? this.configFila.PARAMETRO_AGENDAMENTO
              : this.configFila.PARAMETRO_RESOLVER,
          numOcorrencia: this.dadosTratativa.hash_mailing,
          dataAgendamento: this.dataAgendamento,
          usuario: this.usuario.almope,
          produto: this.usuario.produto,
          procedureOperation: this.configFila.FILA_PROCEDURE,
          tmt: this.tempoTotal ?? 0
        }
        await MailingResolveN2Service.processarOperacoesTratativas(formularioPreenchido)
        this.dadosTratativa = {}
        this.interval = null
        this.tempoTotal = 0
        this.clearForm()
      },
      async novoTratamento() {
        this.loadingCaso = true
        let obj = {
          filaProcedure: this.configFila?.FILA_PROCEDURE,
          paramVerificacao: this.configFila?.PARAMETRO_NOVO_CASO,
          numCaso: '',
          almope: this.usuario.almope,
          dataAgendamento: '',
          tipoOcorrencia: '',
          filaNome: this.configFila?.FILA_NOME
        }
        const responseDados = await MailingResolveN2Service.getMailing(obj)
        const dados = responseDados.map(res =>
          reverseMapAndConvertKeys(res, MailingResolveN2Service.modelMap)
        )
        this.dadosTratativa = dados[0]
        this.interval = null
        this.tempoTotal = 0
        this.startTime()
        this.loadingCaso = false
      },
      clearForm() {
        let newForm = Object.assign({}, this.form)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.form = newForm
        this.$refs.observer.reset()
      },
      async loadFormOptions() {
        await loadFormOptions(this.tabulador, 'CONTATO COM CLIENTE?', 'itemsContatoCliente', this)
        await loadFormOptions(this.tabulador, 'TIPO CONTATO', 'itemsTipoContato', this)
        await loadFormOptions(this.tabulador, 'TRATAMENTO', 'itemsTratamento', this)
        await loadFormOptions(this.tabulador, 'DX', 'itemsDx', this)
      },
      async loadFormOptionItemTipo(value) {
        await loadFormOptionsParent(
          this.tabulador,
          'TIPO',
          'CONTATO COM CLIENTE?',
          value,
          'itemsTipo',
          this
        )
      },
      async loadFormOptionAreaDirecionamento() {
        await loadFormOptionsParent(
          this.tabulador,
          'AREA DIRECIONAMENTO',
          'TIPO',
          this.configFila.FILA_NOME,
          'itemsAreaDirecionamento',
          this
        )
      },
      async loadFormOptionLocalidade(value) {
        await loadFormOptionsParent(
          this.tabulador,
          'LOCALIDADE',
          'AREA DIRECIONAMENTO',
          value,
          'itemsLocalidade',
          this
        )
      },
      async loadFormOptionAreaDestino() {
        await loadFormOptionsParent(
          this.tabulador,
          'AREA DESTINO',
          'TIPO',
          this.configFila.FILA_NOME,
          'itemsAreaDestino',
          this
        )
      }
    },
    created() {
      this.loadFormOptions()
    },
    beforeUnmount: function () {
      clearInterval(this.interval)
    }
  }
</script>

<style></style>
