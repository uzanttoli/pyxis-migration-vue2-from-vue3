<template>
  <v-card elevation="1" class="rounded-xl">
    <v-col>
      <title-negative-margin title="Tratativa" className="rounded-r-xl" class="ml-n2">
        <v-spacer></v-spacer>
        <div class="box-tempo-tratativa">
          <span class="box-span" style="font-size: 13px">Tempo de tratativa</span>
          <p class="box-time">
            <i class="fa-sharp fa-solid fa-arrow-rotate-right" id="icon-rotate"></i>
            {{ tempo == 'NaN:NaN:NaN' || tempo == null || tempo.length > 8 ? '00:00:00' : tempo }}
          </p>
        </div>
        <v-divider vertical class="mx-2"></v-divider>

        <div
          style="margin-right: 10px; display: flex; align-items: center; justify-content: end"
          v-if="selecionarFonteDados && selecionarFonteDados.NUM_CASO"
        >
          <v-tooltip right>
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                small
                target="_blank"
                elevation="0"
                color="#E0F2F1"
                :href="
                  'https://vendas.conexaoclarobrasil.com.br/venda/acompanhamento/' +
                  selecionarFonteDados.NUM_CASO
                "
              >
                <img
                  src="../../../../../assets/img/vendas-logo-outline.svg"
                  style="width: 20px"
                  class="mr-1"
                />
                <span>Conexão/</span>
                <span style="text-decoration: underline">
                  {{ selecionarFonteDados && selecionarFonteDados.NUM_CASO }}
                </span>
              </v-btn>
            </template>
            <span>Acompanhe essa solicitação através do conexão</span>
          </v-tooltip>
        </div>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon @click="dialog = true" v-bind="attrs" v-on="on">
              <v-icon>fa-regular fa-folder-open</v-icon>
            </v-btn>
          </template>
          <span>Casos fechados</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn
              icon
              color="orange"
              class="mr-2"
              @click=";(abrirModal = !abrirModal), loadMinhasTratativas()"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon size="18">fa-solid fa-folder-tree</v-icon>
            </v-btn>
          </template>
          <span>Acompanhar solicitação</span>
        </v-tooltip>

        <v-btn icon @click="afterRoute" color="red">
          <v-icon size="18">fa-solid fa-close</v-icon>
        </v-btn>
      </title-negative-margin>
      <v-divider></v-divider>
      <v-row>
        <v-col class="mt-3">
          <validation-observer v-slot="{ validate, invalid }" ref="observer">
            <form @submit.prevent="validate().then(submit)">
              <fieldset>
                <legend class="mb-2" style="display: flex; align-items: center">
                  <i class="fa-solid fa-circle-nodes mr-1 red--text"></i>
                  Informações da Ocorrência
                </legend>
                <v-row>
                  <v-col>
                    <div
                      style="
                        border: 1px solid #3333;
                        display: flex;
                        width: 100%;
                        flex-wrap: wrap;
                        margin-bottom: 20px;
                        background: #fbfcfc;
                        border-radius: 5px;
                      "
                    >
                      <v-col cols="3">
                        <label style="color: grey; font-size: 14px">Código</label>
                        <p>
                          {{ selecionarFonteDados && selecionarFonteDados.NUM_CASO }}
                        </p>
                      </v-col>
                      <v-col cols="3">
                        <label style="color: grey; font-size: 14px">Data proposta</label>
                        <p>
                          {{ selecionarFonteDados && selecionarFonteDados.DATA_PROPOSTA }}
                        </p>
                      </v-col>
                      <v-col cols="3">
                        <label style="color: grey; font-size: 14px">Cliente</label>
                        <p>
                          {{ selecionarFonteDados && selecionarFonteDados.CLIENTE }}
                        </p>
                      </v-col>
                      <v-col cols="3">
                        <label style="color: grey; font-size: 14px">CPF/CNPJ</label>
                        <p>
                          {{ selecionarFonteDados && selecionarFonteDados.CPF_CNPJ_CLIENTE }}
                        </p>
                      </v-col>
                      <v-col cols="3" class="mt-n5">
                        <label style="color: grey; font-size: 14px">Contrato</label>
                        <p>
                          {{ selecionarFonteDados && selecionarFonteDados.NUM_CONTRATO }}
                        </p>
                      </v-col>
                      <v-col cols="3" class="mt-n5">
                        <label style="color: grey; font-size: 14px">Vencimento</label>
                        <p>
                          {{ selecionarFonteDados && selecionarFonteDados.DIA_VENCIMENTO }}
                        </p>
                      </v-col>
                    </div>
                  </v-col>
                  <v-col class="mt-n7" cols="12">
                    <v-expansion-panels
                      multiple
                      flat
                      v-model="indexOpen"
                      :disabled="selecionarFonteDados == ''"
                    >
                      <v-expansion-panel
                        v-for="(item, i) in itemsPanel"
                        :key="i"
                        style="border: 1px solid #3333"
                      >
                        <v-expansion-panel-header>
                          <div>
                            <v-icon
                              size="16"
                              class="mt-n1 mr-1"
                              :color="
                                (indexOpen ? indexOpen.includes(i) : '') && indexOpen != ''
                                  ? 'red'
                                  : '#3333'
                              "
                            >
                              {{ item.icon }}
                            </v-icon>
                            {{ item.title }}
                          </div>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>
                          <component :is="item.component" :dados="selecionarFonteDados"></component>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-col>
                </v-row>
              </fieldset>
              <!--  -->
              <fieldset>
                <legend>
                  <i class="fa-solid fa-circle-nodes mr-1 red--text"></i>
                  Tratativa do caso
                </legend>
                <v-row>
                  <v-col cols="3">
                    <validation-provider
                      v-slot="{ errors }"
                      name="'Telefone 1'"
                      rules="required|min:14|max:15"
                    >
                      <v-text-field
                        dense
                        outlined
                        placeholder="Telefone 1"
                        label="Telefone 1"
                        :error-messages="errors"
                        v-model="form.telefone1"
                        v-mask="['(##) ####-####', '(##) #####-####']"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="3">
                    <validation-provider
                      v-slot="{ errors }"
                      name="'Telefone 2'"
                      rules="required|min:14|max:15"
                    >
                      <v-text-field
                        dense
                        outlined
                        placeholder="Telefone 2"
                        label="Telefone 2"
                        :error-messages="errors"
                        v-model="form.telefone2"
                        v-mask="['(##) ####-####', '(##) #####-####']"
                      ></v-text-field>
                    </validation-provider>
                  </v-col>
                  <v-col cols="3">
                    <validation-provider v-slot="{ errors }" name="'Status'" rules="required">
                      <v-autocomplete
                        item-text="OPTION_FIELD"
                        item-value="VALUE_FIELD"
                        no-data-text="Não há itens"
                        dense
                        outlined
                        placeholder="Status"
                        label="Status"
                        :items="opcoes('STATUS')"
                        :error-messages="errors"
                        v-model="form.status"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col cols="3">
                    <validation-provider v-slot="{ errors }" name="'Tratativa'" rules="required">
                      <v-autocomplete
                        item-text="OPTION_FIELD"
                        item-value="VALUE_FIELD"
                        no-data-text="Não há itens"
                        dense
                        outlined
                        placeholder="Tratativa"
                        label="Tratativa"
                        :error-messages="errors"
                        :items="opcoes('TRATATIVA')"
                        v-model="form.tratativa"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col cols="3" class="mt-n7">
                    <validation-provider v-slot="{ errors }" name="'Cadastro'" rules="required">
                      <v-autocomplete
                        item-text="OPTION_FIELD"
                        item-value="VALUE_FIELD"
                        no-data-text="Não há itens"
                        dense
                        outlined
                        placeholder="Cadastro"
                        label="Cadastro"
                        :items="opcoes('CADASTRO')"
                        :error-messages="errors"
                        v-model="form.cadastro"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col cols="3" class="mt-n7">
                    <validation-provider v-slot="{ errors }" name="'ZAC'">
                      <v-autocomplete
                        item-text="OPTION_FIELD"
                        item-value="VALUE_FIELD"
                        no-data-text="Não há itens"
                        dense
                        outlined
                        placeholder="ZAC"
                        label="ZAC"
                        :items="opcoes('ZAC')"
                        :error-messages="errors"
                        v-model="form.zac"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col cols="3" class="mt-n7">
                    <validation-provider v-slot="{ errors }" name="'ZAC Rota'">
                      <v-autocomplete
                        item-text="OPTION_FIELD"
                        item-value="VALUE_FIELD"
                        no-data-text="Não há itens"
                        dense
                        outlined
                        placeholder="ZAC Rota"
                        label="ZAC Rota"
                        :error-messages="errors"
                        :items="opcoes('ZAC')"
                        v-model="form.zacRota"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col cols="3" class="mt-n7">
                    <v-menu
                      v-model="menu"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="dateFormated"
                          label="Data Instalação"
                          placeholder="Data Instalação"
                          readonly
                          outlined
                          dense
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        :min="moment().format('yyyy-MM-DD')"
                        locale="pt-br"
                        v-model="form.dataInstalacao"
                        @input="menu = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="3" class="mt-n7">
                    <validation-provider v-slot="{ errors }" name="'Periodo'">
                      <v-autocomplete
                        no-data-text="Não há itens"
                        dense
                        outlined
                        placeholder="Periodo agendamento"
                        label="Periodo agendamento"
                        :error-messages="errors"
                        :items="['MANHÃ', 'TARDE']"
                        v-model="form.periodo"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col cols="3" class="mt-n7">
                    <validation-provider
                      v-slot="{ errors }"
                      name="'Auditoria pré cadastro'"
                      rules="required"
                    >
                      <v-autocomplete
                        item-text="OPTION_FIELD"
                        item-value="VALUE_FIELD"
                        no-data-text="Não há itens"
                        dense
                        outlined
                        placeholder="Auditoria pré cadastro"
                        label="Auditoria pré cadastro"
                        :items="opcoes('AUDITORIA_PRE_CADASTRO')"
                        :error-messages="errors"
                        v-model="form.auditoriaPreCadastro"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col cols="3" class="mt-n7">
                    <validation-provider v-slot="{ errors }" name="'Pós venda'">
                      <v-autocomplete
                        item-text="OPTION_FIELD"
                        item-value="VALUE_FIELD"
                        no-data-text="Não há itens"
                        dense
                        outlined
                        placeholder="Pós venda"
                        :items="opcoes('POS_VENDA')"
                        label="Pós venda"
                        :error-messages="errors"
                        v-model="form.posVenda"
                      ></v-autocomplete>
                    </validation-provider>
                  </v-col>
                  <v-col cols="12" class="mt-n7">
                    <validation-provider v-slot="{ errors }" name="'Observação'" rules="required">
                      <v-textarea
                        dense
                        outlined
                        placeholder="Observação"
                        label="Observação"
                        :error-messages="errors"
                        v-model="form.observacao"
                      ></v-textarea>
                    </validation-provider>
                  </v-col>
                </v-row>
              </fieldset>
              <div style="display: flex; flex-direction: row; gap: 10px">
                <v-btn
                  color="info"
                  @click="novoTratamento()"
                  :disabled="dadosTratativa != '' && dadosTratativa != null"
                >
                  Novo Tratamento
                </v-btn>
                <v-btn
                  :disabled="invalid"
                  color="blue-grey"
                  class="white--text"
                  @click="salvarTratativa"
                >
                  Salvar
                </v-btn>
                <v-btn @click="abrirSheetFooterAgendar = true" color="warning">Agendar</v-btn>
                <v-btn color="error" @click="clearForm">Limpar</v-btn>
                <v-spacer></v-spacer>
                <v-btn :disabled="invalid" color="success" type="submit">Finalizar</v-btn>
              </div>
            </form>
          </validation-observer>
        </v-col>
      </v-row>
    </v-col>
    <AgendamentoComponent
      :abrirSheetFooterAgendar="abrirSheetFooterAgendar"
      @updated-close="abrirSheetFooterAgendar = !abrirSheetFooterAgendar"
      @updated:salvar="salvarAgendamento"
    />
    <v-navigation-drawer app right v-model="abrirModal" width="300">
      <v-col>
        <v-text-field
          outlined
          dense
          placeholder="Pesquisar"
          label="Pesquisar"
          v-model="search"
          :loading="loadingMinhasTratativas"
        ></v-text-field>
        <v-divider></v-divider>
        <v-list two-line>
          <template v-if="!search">
            <v-list-group :value="false" v-for="(item, i) in acompanharTratativas" :key="i">
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title class="text-capitalize">
                    {{ item.SITUACAO.toLowerCase().split('_').join(' ') }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <span style="font-size: 13px; color: orange">
                      Quant. pendente: {{ item.QTD }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </template>

              <v-list-item
                sub-group
                v-for="(subItem, j) in item.CASOS"
                :key="j"
                @click="selectItem(subItem.NUM_CASO)"
                two-line
              >
                <v-list-item-content>
                  <v-list-item-subtitle>Núm. caso: {{ subItem.NUM_CASO }}</v-list-item-subtitle>
                  <v-list-item-subtitle>Cidade: {{ subItem.DESC_MUNICIPIO }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </template>
          <template v-else>
            <v-list-item
              v-for="(item, i) in filterCasos"
              :key="i"
              @click="selectItem(item.NUM_CASO)"
            >
              <v-list-item-content>
                <v-list-item-subtitle>Núm. caso: {{ item.NUM_CASO }}</v-list-item-subtitle>
                <v-list-item-subtitle>Cidade: {{ item.CIDADE }}</v-list-item-subtitle>
                <v-list-item-subtitle>Situação: {{ item.SITUACAO }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-col>
    </v-navigation-drawer>
    <ModalCasosFechados v-model="dialog" />
  </v-card>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import config from '../../../../../core/config'
  import alerts from '../../../../../mixins/alerts.mixins'
  import AgendamentoComponent from '../../../../../shared/components/bottomSheet/agendamento.component.vue'
  import infoProduto from '../claroTrade/infoProduto.vue'
  import pagamento from '../claroTrade/pagamento.vue'
  import endereco from '../claroTrade/endereco.vue'
  import ModalCasosFechados from './ModalCasosFechados.vue'
  export default {
    components: {
      AgendamentoComponent,
      ModalCasosFechados,
      ValidationObserver,
      ValidationProvider,
      infoProduto,
      pagamento,
      endereco
    },
    props: {
      configFila: {
        type: [Object, Array],
        require: true
      },
      dadosCarregados: {
        type: [Object, Array],
        require: true
      }
    },
    data: () => ({
      menu: false,
      tempo: null,
      indexOpen: null,
      interval: null,
      dialog: false,
      selectedItem: null,
      listaOpcoes: [],
      itemsPanel: [
        {
          icon: 'fa-solid fa-user',
          title: 'Informações Produto',
          component: 'info-produto'
        },
        {
          icon: 'fa-solid fa-user-tag',
          title: 'Informações de Pagamento',
          component: 'pagamento'
        },
        {
          icon: 'fa-solid fa-map-location',
          title: 'Dados do endereço de Instalação',
          component: 'endereco'
        }
      ],
      search: null,
      abrirSheetFooterAgendar: false,
      abrirModal: false,
      loadingMinhasTratativas: true,
      form: {
        // produto: null,
        telefone1: null,
        telefone2: null,
        status: null,
        tratativa: null,
        cadastro: null,
        zac: null,
        zacRota: null,
        dataInstalacao: null,
        auditoriaPreCadastro: null,
        posVenda: null,
        observacao: null,
        periodo: null
      },
      time: 0,
      timeStop: false,
      acompanharTratativas: [],
      dadosTratativa: []
    }),
    computed: {
      dateFormated() {
        if (!this.form.dataInstalacao) return
        return this.form.dataInstalacao.split('-').reverse().join('/')
      },
      usuario() {
        return this.$store.getters.usuario
      },
      _dadosCarregados: {
        get() {
          return this.dadosCarregados
        },
        set(newVal) {
          return newVal
        }
      },
      selecionarFonteDados() {
        //Carregamento de casos para tratativa
        if (this._dadosCarregados?.NUM_CASO != 0 || this._dadosCarregados?.NUM_CASO != '0') {
          return this._dadosCarregados
        } else {
          return this.dadosTratativa
        }
      },
      filterCasos() {
        const dados = this.acompanharTratativas
        if (!dados) return

        // Extrair todos os casos
        const todosCasos = dados.flatMap(item =>
          item.CASOS.map(caso => ({
            NUM_CASO: caso.NUM_CASO,
            CIDADE: caso.DESC_MUNICIPIO,
            SITUACAO: item.SITUACAO
          }))
        )

        const search = this.search.split('>').map(s => s.toLowerCase())

        // Função para verificar se um item contém a busca
        const containsSearch = (item, searchTerm) =>
          item.NUM_CASO.toString().includes(searchTerm) ||
          item.CIDADE.toLowerCase().includes(searchTerm) ||
          item.SITUACAO.toLowerCase().includes(searchTerm)

        // Filtrando os dados com base na busca
        let resultados = todosCasos.filter(item => containsSearch(item, search[0]))

        for (let i = 1; i < search.length; i++) {
          if (search[i]) {
            resultados = resultados.filter(item => containsSearch(item, search[i]))
          }
        }

        return resultados
      }
    },
    mixins: [alerts],
    mounted() {
      this.interval = setInterval(() => {
        this.get_time_diff(
          this.selecionarFonteDados
            ? this.selecionarFonteDados.INICIO_TRATAMENTO + this.selecionarFonteDados.TMT_ANT
            : 0
        )
      }, 1000)
      // document.addEventListener("mousemove", this.handleEvent);
      // document.addEventListener("keydown", this.handleEvent);
      // setInterval(() => {
      //   this.show();
      // }, 1000);
    },
    beforeUnmount() {
      // document.removeEventListener("mousemove", this.handleEvent);
      // document.removeEventListener("keydown", this.handleEvent);
      clearInterval(this.interval)
    },
    methods: {
      selectItem(item) {
        this.swalConfirmation(
          () => {
            try {
              this.form.filaProcedure = this.configFila?.FILA_PROCEDURE
              this.form.parametro = this.configFila?.PARAMETRO_LIBERAR_AGEND
              this.form.numOcorrencia = item
              this.form.usuario = this.usuario.almope
              this.form.agendamento = null
              this.form.tipoOcorrencia = null

              let urlData = `${config.baseUrl}api/shared/backoffice/tratativa/salvar_tratativa`
              this.$api.post(urlData, this.form)
              this.toast(
                'O caso voltará assim que você puxar um novo caso.',
                'top-right',
                false,
                2500,
                'success'
              )
            } catch (e) {
              this.toast(
                'Não foi possivel salvar a tratativa. Tente novamente!',
                'top-right',
                false,
                2500,
                'warning'
              )
            }
          },
          'Atenção',
          'Deseja acompanhar essa caso agora?',
          'Sim',
          'O caso retornara após você finalizar a demanda atual.',
          '',
          true,
          true
        )
      },
      loadMinhasTratativas() {
        let data = {
          almope: this.usuario.almope,
          parametro: this.configFila?.PARAMETRO_RESULTADOS_OPE,
          filaProcedure: this.configFila?.FILA_PROCEDURE
        }
        let urlData = `${config.baseUrl}api/shared/BackOffice/tratativa/minhas_tratativas/`
        this.$api
          .get(urlData, {
            params: { ...data }
          })
          .then(res => {
            this.acompanharTratativas = res.data
            this.loadingMinhasTratativas = false
          })
      },
      async salvarTratativa() {
        let formIsValid = await this.$refs.observer.validate()
        if (formIsValid) {
          try {
            this.form.filaProcedure = this.configFila?.FILA_PROCEDURE
            this.form.parametro = this.configFila?.PARAMETRO_SALVAR
            this.form.numOcorrencia = this.selecionarFonteDados?.NUM_CASO
            this.form.usuario = this.usuario.almope
            this.form.agendamento = null
            this.form.tipoOcorrencia = null

            let urlData = `${config.baseUrl}api/shared/backoffice/tratativa/salvar_tratativa`
            this.$api.post(urlData, this.form)

            this.toast('Tratativa salva com sucesso!', 'top-right', false, 2500, 'success')
            this.clearForm()
            this._dadosCarregados = []
            this.dadosTratativa = []
            this.abrirModal && this.loadMinhasTratativas()
            this.$emit('update:analise-salva')
            this.time = null
          } catch (e) {
            this.toast(
              'Não foi possivel salvar a tratativa. Tente novamente!',
              'top-right',
              false,
              2500,
              'warning'
            )
          }
        }
      },
      async novoTratamento() {
        // this.$emit("update:info-carregamento-status", true);
        let numCaso = ''
        let dataAgendamento = ''
        let tipoOcorrencia = ''

        let urlBase = `${config.baseUrl}api/shared/backoffice/tratativa/exec_acao`
        var res = await this.$api.get(urlBase, {
          params: {
            filaProcedure: this.configFila?.FILA_PROCEDURE,
            paramVerificacao: this.configFila?.PARAMETRO_NOVO_CASO,
            numCaso: numCaso,
            almope: this.usuario.almope,
            dataAgendamento: dataAgendamento,
            tipoOcorrencia: tipoOcorrencia,
            filaNome: this.configFila?.FILA_NOME
          }
        })
        this.dadosTratativa = res?.data[0]
        this.form.observacao = res?.data && res?.data[0].OBSERVACAO
        setTimeout(() => {
          this.$emit('update:info-carregamento-status', false)
        }, 1500)
      },
      async salvarAgendamento(e) {
        try {
          this.form.filaProcedure = this.configFila?.FILA_PROCEDURE
          this.form.parametro = this.configFila?.PARAMETRO_AGENDAMENTO
          this.form.numOcorrencia = this.selecionarFonteDados?.NUM_CASO
          this.form.usuario = this.usuario.almope
          this.form.agendamento = e
          this.form.tipoOcorrencia = null

          let urlData = `${config.baseUrl}api/shared/backoffice/tratativa/salvar_tratativa`
          await this.$api.post(urlData, this.form)

          this.toast('Tratativa salva com sucesso!', 'top-right', false, 2500, 'success')
          this.clearForm()
          this.dadosTratativa = []
          this._dadosCarregados = []
          this.abrirModal && this.loadMinhasTratativas()
          this.$emit('update:analise-salva')
        } catch (e) {
          this.toast(
            'Não foi possivel salvar a tratativa. Tente novamente!',
            'top-right',
            false,
            2500,
            'warning'
          )
        }
      },
      show() {
        if (this.time >= 300) {
          this.timeStop = true
        }
        if (this.time >= 300 && this.timeStop == true) {
          if (this.time > 300) return
          this.swalConfirmation(
            () => {
              this.time = 0
              this.timeStop = false
            },
            'Alerta de inatividade',
            'Você está inativo há 5 minutos. Gostaria de continuar a tratativa?',
            'Sim',
            'Informaremos ao gestor sobre a inatividade.',
            '',
            true,
            false
          )
        }
        this.time++
      },
      handleEvent(event) {
        if (this.time > 300) return
        if (event) {
          this.time = 0
        }
        // e.preventDefault();
      },
      clearForm() {
        let newForm = Object.assign({}, this.form)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.form = newForm
        this.$refs.observer.reset()
      },
      opcoes(value) {
        if (!value) return
        let opcoes = this.listaOpcoes
        let result = opcoes.filter(item => {
          return item.TABULATION_FIELD == value
        })
        return result
      },
      async submit() {
        try {
          this.form.filaProcedure = this.configFila?.FILA_PROCEDURE
          this.form.parametro = this.configFila?.PARAMETRO_RESOLVER
          this.form.numOcorrencia = this.selecionarFonteDados?.NUM_CASO
          this.form.usuario = this.usuario.almope
          this.form.agendamento = null
          this.form.tipoOcorrencia = null

          let urlData = `${config.baseUrl}api/shared/backoffice/tratativa/salvar_tratativa`
          this.$api.post(urlData, this.form)

          this.toast('Tratativa salva com sucesso!', 'top-right', false, 2500, 'success')
          this.clearForm()
          this.dadosTratativa = []
          this._dadosCarregados = []
          this.abrirModal && this.loadMinhasTratativas()
          this.$emit('update:analise-salva')
        } catch (e) {
          this.toast(
            'Não foi possivel salvar a tratativa. Tente novamente!',
            'top-right',
            false,
            2500,
            'warning'
          )
        }
      },
      afterRoute() {
        this.$router.push('/pyxis/backoffice/operador')
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
      async loadOpcoes() {
        let urlData = `${config.baseUrl}api/shared/backoffice/acoes/opcoes/CLARO TRADE`
        var res = await this.$api.get(urlData)
        this.listaOpcoes = res?.data
      }
    },
    created() {
      this.loadOpcoes()
    },
    watch: {}
  }
</script>

<style scoped>
  fieldset {
    padding: 15px;
    border: 1px solid #3333;
    margin-bottom: 15px;
  }
  legend {
    padding: 0 10px;
    font-size: 18.5px;
  }

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

  .button-href {
    font-family: inherit;
    font-size: 18px;
    background: linear-gradient(to bottom, #0c1213 0%, #030913 100%);
    color: white;
    padding: 10px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 10px;
    box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.2);
    transition: all 0.3s;
  }

  a {
    text-decoration: none;
  }
</style>
