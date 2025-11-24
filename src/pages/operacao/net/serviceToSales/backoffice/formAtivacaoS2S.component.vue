<template>
  <section>
    <v-card elevation="1" class="rounded-xl" outlined>
      <title-negative-margin
        title="Tratativa Ativação - BKO S2S"
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
              @click="dialogPortabilidade = true"
              color="blue"
            >
              <v-icon>fa-solid fa-mobile-screen-button</v-icon>
            </v-btn>
          </template>
          <span>Acompanhamento de portabilidade</span>
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
      <v-col class="mt-n6 mb-2" v-show="novoCasoAtivacao.ID_MAILING">
        <v-alert
          :type="novoCasoAtivacao.PILOTO_CHECAGEM_VENDAS ? 'success' : 'error'"
          outlined
          border="left"
          prominent
          dense
        >
          {{
            novoCasoAtivacao.PILOTO_CHECAGEM_VENDAS
              ? 'Venda validada pelo supervisor!'
              : 'Essa venda não foi validada. Necessário contato com o cliente.'
          }}
        </v-alert>
      </v-col>
      <!-- <pre>{{novoCasoAtivacao}}</pre> -->
      <v-col class="pa-4">
        <v-row>
          <v-col class="pa-0" cols="4">
            <TextareaButton label="ID Mailing" :text="novoCasoAtivacao.ID_MAILING" />
          </v-col>
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
          <v-col class="pa-0" cols="4">
            <TextareaButton
              label="Telefone contato (WhatsApp)"
              :text="novoCasoAtivacao.TELEFONE_MOVEL | formatedNumber"
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
        <div
          style="width: 100%; display: flex; align-items: center; position: relative; height: 50px"
        >
          <h3 style="color: grey">Tratativa</h3>
          <v-spacer></v-spacer>
          <div style="width: 350px; position: absolute; right: -3px; top: 5px">
            <v-text-field
              placeholder="Digite o ID Mailing..."
              label="Digite o ID Mailing"
              outlined
              dense
              type="number"
              prepend-inner-icon="fa-solid fa-magnifying-glass"
              color="blue lighten-2"
              v-model="searchIdMailingManual"
            ></v-text-field>
          </div>
        </div>
      </v-card-title>
      <v-col>
        <v-alert
          v-if="novoCasoAtivacao.ID_MAILING"
          text
          type="info"
          prominent
          dense
          icon="fa-solid fa-info"
        >
          Status do contato:
          {{ novoCasoAtivacao.ID_MAILING != '' ? msgContato : text }}
        </v-alert>
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
                    v-model="itemsTratados.statusMeioContato"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col>
                <validation-provider rules="required" name="tentativa contato" v-slot="{ errors }">
                  <v-select
                    outlined
                    dense
                    required
                    :error-messages="errors"
                    label="Tentativa de contato"
                    no-data-text="Nada encontrado!"
                    :items="listarStatusContato"
                    item-text="STATUS_CONTATO"
                    item-value="ID_STATUS_CONTATO"
                    v-model="statusContatoAtivo"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col
                v-if="statusContatoAtivo != 2 && statusContatoAtivo != 3 && statusContatoAtivo != 4"
              >
                <validation-provider name="caso ativo" rules="required" v-slot="{ errors }">
                  <v-select
                    outlined
                    required
                    dense
                    label="Caso ativo?"
                    :error-messages="errors"
                    no-data-text="Não há status"
                    :items="casoAtivo"
                    item-text="CASO_ATIVO"
                    item-value="ID_STATUS"
                    v-model="itemsTratados.itemCasoAtivo"
                    @change="loadCausaMacro()"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col v-if="itemsTratados.itemCasoAtivo != null">
                <validation-provider name="motivo" rules="required" v-slot="{ errors }">
                  <v-select
                    outlined
                    dense
                    required
                    :error-messages="errors"
                    label="Motivo"
                    no-data-text="Não há motivos"
                    :items="causaMacro"
                    item-text="MOTIVO_MACRO"
                    item-value="ID_MOTIVO_MACRO"
                    v-model="itemCausaMacro"
                    @change="loadCausaMicro()"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col v-if="itemCausaMacro != null">
                <validation-provider rules="required" name="submotivo" v-slot="{ errors }">
                  <v-select
                    outlined
                    required
                    dense
                    :error-messages="errors"
                    label="SubMotivo"
                    no-data-text="Não há submotivos"
                    :items="causaMicro"
                    item-text="MOTIVO_MICRO"
                    item-value="ID_MOTIVO_MICRO"
                    v-model="itemsTratados.itemCausaMicro"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col
                cols="12"
                v-if="
                  itemsTratados.itemCausaMicro != 205 &&
                  itemsTratados.itemCausaMicro != 252 &&
                  itemsTratados.itemCausaMicro != 257 &&
                  itemsTratados.itemCausaMicro != 253 &&
                  itemsTratados.itemCausaMicro != 258 &&
                  itemsTratados.itemCausaMicro != 228 &&
                  itemsTratados.itemCausaMicro != 254
                "
              >
                <validation-provider v-slot="{ errors }" rules="required|max:200" name="observação">
                  <v-textarea
                    label="Observação"
                    outlined
                    v-model="observacao"
                    required
                    :error-messages="errors"
                    placeholder="Breve resumo da sua tratativa..."
                    counter="200"
                  ></v-textarea>
                </validation-provider>
              </v-col>

              <v-col
                cols="12"
                v-if="
                  itemsTratados.itemCausaMicro == 205 ||
                  itemsTratados.itemCausaMicro == 252 ||
                  itemsTratados.itemCausaMicro == 257 ||
                  itemsTratados.itemCausaMicro == 253 ||
                  itemsTratados.itemCausaMicro == 258 ||
                  itemsTratados.itemCausaMicro == 228 ||
                  itemsTratados.itemCausaMicro == 254
                "
              >
                <validation-provider
                  rules="required|min:14|max:15"
                  name="telefone"
                  v-slot="{ errors }"
                >
                  <v-text-field
                    :error-messages="errors"
                    dense
                    required
                    v-mask="[masks.telefoneBrMovel, masks.telefoneBrFixo]"
                    outlined
                    label="Telefone"
                    v-model="observacao"
                    placeholder="(##) #####-####"
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>

            <v-col class="mt-n5">
              <v-row class="ma-0" align="center" style="gap: 15px">
                <v-btn
                  width="190"
                  color="blue"
                  class="white--text"
                  @click="loadNovoCasoAtivacao()"
                  :disabled="novoCasoAtivacao.ID_MAILING != null"
                >
                  Novo tratamento
                </v-btn>
                <v-btn
                  width="190"
                  color="orange"
                  class="white--text"
                  @click="agendar = true"
                  :disabled="!agendarValido()"
                >
                  Agendar
                </v-btn>
                <v-btn
                  width="190"
                  color="green"
                  class="white--text"
                  type="submit"
                  :disabled="
                    statusContatoAtivo == 2 || statusContatoAtivo == 3 || statusContatoAtivo == 4
                      ? true
                      : invalid
                  "
                  :loading="load"
                >
                  Finalizar
                </v-btn>

                <v-btn width="190" color="red" class="white--text" @click="clearForm">Limpar</v-btn>
              </v-row>
            </v-col>
          </form>
        </validation-observer>
      </v-col>
    </v-card>

    <!-- :idStatusContatoAtivo="statusContatoAtivo" -->
    <agendar-caso-component
      :abrirSheetFooterAgendar="agendar"
      :dadosAgenda="dadosAgendamento"
      @updated-close="agendar = !agendar"
      @updated:agendado="casoAgendado"
    ></agendar-caso-component>
    <portabilidade
      class="mx-2 mt-2"
      :dialogPortabilidade="dialogPortabilidade"
      :tratativaEmAndamento="novoCasoAtivacao == '' || novoCasoAtivacao == [] ? false : true"
      @update:close-portabilidade="dialogPortabilidade = false"
      @update:dados-portabilidade="dadosPortabilidade"
    ></portabilidade>
    <load-envio-dados :envioDados="load"></load-envio-dados>
  </section>
</template>

<script>
  import TextareaButton from '@/shared/components/textareaButton/textfieldButton.component.vue'
  import AgendarCasoComponent from './AgendarCaso.component.vue'

  import config from '@/core/config'
  import masks from '@/shared/masks/masks'
  import alerts from '@/mixins/alerts.mixins'
  import loadEnvioDados from '@/shared/components/load/loadHastag.vue'
  import portabilidade from './portabilidade.vue'
  // import UraNaoAceite from "./filas/uraNaoAceite.vue";
  // import UraNaoTransferido from "./filas/uraNaoTransferido.vue";

  import { ValidationProvider, ValidationObserver } from 'vee-validate'
  export default {
    components: {
      TextareaButton,
      AgendarCasoComponent,
      loadEnvioDados,
      ValidationProvider,
      ValidationObserver,
      portabilidade
      // UraNaoAceite,
      // UraNaoTransferido,
    },
    props: {
      tipoFila: {
        type: String,
        default: 'aceite'
      }
    },
    data: () => ({
      text: 'Atualizando',
      dialogPortabilidade: false,
      msgContato: '',
      drawer: true,
      tempo: null,
      load: false,
      mini: true,
      agendado: false,
      interval: null,
      intervalText: null,
      countInterval: 0,
      agendar: false,
      itemCausaMacro: null,
      statusContatoAtivo: null,
      observacao: null,
      searchIdMailingManual: null,
      novoCasoAtivacao: [],
      itemsTratados: {
        statusTratamentoBko: 3,
        itemCasoAtivo: null,
        itemCausaMicro: null,
        statusMeioContato: null
      },
      itemsTratadosDefault: {
        statusTratamentoBko: 3,
        itemCasoAtivo: null,
        itemCausaMicro: null,
        statusMeioContato: null
      },
      tipoFilaSelecionada: 'OFICIAL',
      demaisInfoValid: false,
      demaisInfoObject: [],
      listarMeioContato: [{ text: 'WHATSAPP' }, { text: 'ATIVO (CALLBACK)' }]
    }),
    mixins: [alerts],
    filters: {
      formatedDate(value) {
        if (!value) {
          return ''
        }
        return value.split('-').reverse().join('/')
      },
      formatedNumber(value) {
        if (!value) return
        let seqNum = [2, 7, 11]
        return `(${value.substring(0, seqNum[0])}) ${value.substring(
          seqNum[0],
          seqNum[1]
        )}-${value.substring(seqNum[1], seqNum[2])}`
      }
    },
    computed: {
      masks() {
        return masks
      },
      listarStatusContato() {
        return this.$store.getters.listarStatusContato
      },
      // novoCasoAtivacao: {
      //   get() {
      //     let novoCaso = this.$store.getters.novoCasoAtivacao;
      //     return novoCaso ? this.dadosTratativa : [];
      //   },
      //   set(newVal) {
      //     this.dadosTratativa = newVal;
      //   },
      // },
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
      casoAtivo() {
        return this.$store.getters.casoAtivo
      },
      causaMacro() {
        return this.$store.getters.causaMacro
      },
      causaMicro() {
        return this.$store.getters.causaMicro
      },
      dadosAgendamento() {
        let dados = this.novoCasoAtivacao
        let dadosCompleto = {
          typeForm: 'ativacao',
          idMailing: dados.ID_MAILING,
          itemCasoAtivo: this.itemsTratados.itemCasoAtivo,
          itemCausaMacro: this.itemCausaMacro,
          itemCausaMicro: this.itemsTratados.itemCausaMicro,
          almopeTratamentoFechamento: this.usuarioAlmope,
          dataFimTratamento: this.moment().format('YYYY-MM-DD HH:MM:SS'),
          tempoTratamento: this.diferencaTempo(),
          statusTratamentoBko: 2,
          statusContato: this.statusContatoAtivo,
          observacao: this.observacao,
          numCaso: dados.NUM_CASO
        }
        return dadosCompleto
      },
      consoliadoDia() {
        return this.$store.getters.consoliadoDia
      },
      consolidadoMes() {
        return this.$store.getters.consolidadoMes
      },
      minhasAtivacoes() {
        return this.$store.getters.minhasAtivacoes
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
      async loadNovoCasoAtivacao() {
        try {
          this.load = true
          let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/novo_caso/`
          var res = await this.$api.get(urlData, {
            params: {
              almope: this.usuarioAlmope,
              searchIdMailing: this.searchIdMailingManual,
              tipoFila: 'OFICIAL'
            }
          })
          this.novoCasoAtivacao = res.data[0]
          this.loadStatusContato()
          this.load = false
        } catch (error) {
          this.load = false
          if (error.response.status === 406) {
            await this.swalConfirmation(
              async () => {
                let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/novo_caso/`
                var res = await this.$api.get(urlData, {
                  params: {
                    almope: this.usuarioAlmope,
                    searchIdMailing: this.searchIdMailingManual,
                    tipoFila: 'OFICIAL',
                    next: true
                  }
                })
                this.novoCasoAtivacao = res.data[0]
                this.loadStatusContato()
              },
              'Atenção',
              'Esse caso está sendo tratado, deseja continuar?',
              'Sim',
              'Caso disponivel para tratamento!',
              'Foi direcionado para você tratar!'
            )
          }
          return error
        }
      },
      dadosPortabilidade(e) {
        this.$emit('update:tratar-portabilidade', e)
        // if(this.novoCasoAtivacao == ''){
        //   this.novoCasoAtivacao = e;
        //   this.dialogPortabilidade = false;
        // }else{
        //   this.toast("Você não pode tratar um caso agendado quando há um em andamento. Finalize o caso atual primeiro.", "top-right",false,2000, "warning");
        // }
      },
      demaisInfo(event) {
        this.demaisInfoValid = event.valid
        this.demaisInfoObject = event.object
      },
      loadStatusContato() {
        let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/status_contato/${this.novoCasoAtivacao.ID_MAILING}`
        this.$api.get(urlData).then(res => {
          this.msgContato = res.data[0]?.STATUS_CONTATO ?? res.data[0]
        })
      },
      casoAgendado(e) {
        this.clearForm()
        this.clearContent()
        this.reloadBase()
        if (e.completed) {
          this.toast('Agendamento realizado com sucesso!', 'top-right', false, 2000, 'success')
        }
      },
      loadListarStatusContato() {
        this.$store.dispatch('loadListarStatusContato')
      },
      closeForm() {
        this.$router.push('/pyxis/service-to-sales/backoffice/')
      },
      clearContent() {
        this.novoCasoAtivacao = []
        let dados = this.novoCasoAtivacao
        let data = Object.assign({}, dados)
        Object.keys(data).forEach(item => {
          this.novoCasoAtivacao[item] = null
        })
        this.novoCasoAtivacao.DATA_INICIO_TRATAMENTO = new Date()
      },
      loadConsolidadoMes() {
        this.$store.dispatch('loadConsolidadoMes', this.usuarioAlmope)
      },
      loadConsoliadoDia() {
        this.$store.dispatch('loadConsoliadoDia', this.usuarioAlmope)
      },
      loadMinhasAtivacoes() {
        this.$store.dispatch('loadMinhasAtivacoes', this.usuarioAlmope)
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
      clearForm() {
        this.statusContatoAtivo = null
        this.observacao = null
        Object.assign(this.itemsTratados, this.itemsTratadosDefault)
        this.searchIdMailingManual = null
        this.$refs.observer.reset()
      },
      agendarValido() {
        return (
          (this.statusContatoAtivo == 2 ||
            this.statusContatoAtivo == 3 ||
            this.statusContatoAtivo == 4 ||
            ((this.itemCausaMacro == 2 ||
              this.itemCausaMacro == 1 ||
              this.itemCausaMacro == 3 ||
              this.itemCausaMacro == 23) &&
              this.itemsTratados.itemCausaMicro != null &&
              this.itemsTratados.itemCausaMicro != '')) &&
          (this.tipoFila != 'aceite' && this.tipoFila != 'ura-nao-transferido'
            ? this.demaisInfoValid
            : true)
        )
      },
      novoCasoIsValid() {
        return this.novoCasoAtivacao.ID_MAILING
      },
      async submit() {
        try {
          this.load = true

          let dataAgendPortabilidade = this.moment().add(3, 'days').format('YYYY-MM-DD')

          let data = {
            procedimento: 1,
            statusTratamento: this.itemsTratados.itemCausaMicro == 253 ? 2 : 3, // 2: Agendamento, 3: Finalizado
            almope: this.usuarioAlmope,
            casoAtivo: this.itemsTratados.itemCasoAtivo,
            motivoMacro: this.itemCausaMacro,
            motivoMicro: this.itemsTratados.itemCausaMicro,
            dataAgendamento:
              this.itemsTratados.itemCausaMicro == 253 ? dataAgendPortabilidade : null, //solicitação de lucas
            idMailing: this.novoCasoAtivacao.ID_MAILING,
            numCaso: this.novoCasoAtivacao.NUM_CASO,
            statusContato: this.statusContatoAtivo,
            observacao: this.observacao,
            dataAgendPortabilidade:
              this.itemsTratados.itemCausaMicro == 253 ? dataAgendPortabilidade : null,
            statusPortabilidade: null,
            motivoPortabilidade: null,
            statusMeioContato: this.itemsTratados.statusMeioContato
          }
          // await this.$store.dispatch("atualizarCasoActions", data);
          let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/operacao_ativacao/`
          await this.$api.post(urlData, data)
          this.toast('Tratativa salva com sucesso!', 'top-right', false, 2000, 'success')
          // tratativa solicitada por Lucas Pereira
          let urlDataNaoAceite = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/dados_nao_aceite`
          let urlDataNaoTransUra = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/nao_trans_ura`

          this.demaisInfoObject.idMailing = this.novoCasoAtivacao.ID_MAILING
          this.demaisInfoObject.numCaso = this.novoCasoAtivacao.NUM_CASO
          this.demaisInfoObject.almopeUsuario = this.usuarioAlmope
          if (this.tipoFila == 'ura-nao-aceite') {
            await this.$api.post(urlDataNaoAceite, this.demaisInfoObject)
          } else if (this.tipoFila == 'ura-nao-transferido') {
            await this.$api.post(urlDataNaoTransUra, this.demaisInfoObject)
          }

          //
          this.clearContent()
          this.reloadBase()
          this.clearForm()
          this.load = false
        } catch (e) {
          this.toast('Dados não foram salvos. Tente novamente.', 'top-right', false, 2000, 'error')
          this.load = false
        }
      },
      loadCausaMicro() {
        this.load = true
        this.$store.dispatch('loadCausaMicro', this.itemCausaMacro).then(() => {
          this.load = false
        })
      },
      loadCausaMacro() {
        this.load = true
        this.$store.dispatch('loadCausaMacro', this.itemsTratados.itemCasoAtivo).then(() => {
          this.itemsTratados.itemCausaMicro = null
          this.load = false
        })
      },
      loadCasoAtivo() {
        this.$store.dispatch('loadCasoAtivo')
      },

      reloadBase() {
        this.loadConsoliadoDia()
        this.loadConsolidadoMes()
      }
    },
    watch: {
      statusContatoAtivo: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.itemsTratados.itemCasoAtivo = null
          this.itemsTratados.itemCausaMicro = null
          this.itemCausaMacro = null
        }
      },
      itemCausaMacro: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.itemsTratados.itemCausaMicro = null
        }
      },
      agendado() {
        if (this.agendado == true) {
          this.clearForm()
          this.agendado = false
        }
      },
      tipoFilaSelecionada() {
        this.toast(
          `Você mudou a fila para: ${this.tipoFilaSelecionada}. <br> As tratativas serão consideradas para a fila selecionada!`,
          'top-right',
          false,
          3500,
          'success'
        )
      }
    },
    created() {
      this.loadMinhasAtivacoes()
      this.loadCasoAtivo()
      this.loadConsoliadoDia()
      this.loadConsolidadoMes()
      this.loadListarStatusContato()
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
