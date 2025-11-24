<template>
  <div class="mt-2 container-cliente">
    <v-col>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="submit">
          <v-row class="mx-2" style="gap: 10px">
            <v-col class="pa-0 ma-0">
              <validation-provider
                v-slot="{ errors }"
                name="cod. contrato"
                rules="required|max:3|min:3"
              >
                <v-text-field
                  class="mt-2"
                  title="Cód. Contrato"
                  placeholder="Cód. Contrato"
                  label="Cód. Contrato"
                  v-model="informacoesCliente.codCidade"
                  @change="filterCodCidade"
                  outlined
                  dense
                  :error-messages="errors"
                  required
                  :class="classTextField"
                  v-mask="masks.codContrato"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pa-0 ma-0">
              <validation-provider v-slot="{ errors }" rules="required" name="nome da cidade">
                <v-autocomplete
                  class="mt-2"
                  title="Nome da Cidade"
                  label="Nome da Cidade"
                  placeholder="Nome da Cidade"
                  outlined
                  required
                  :items="listCidades"
                  item-text="NOME_CIDADE"
                  v-model="informacoesCliente.nomeCidade"
                  @change="filterNomeCidade"
                  :error-messages="errors"
                  dense
                  :class="classTextField"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col class="pa-0 ma-0">
              <validation-provider
                v-slot="{ errors }"
                name="nª contrato"
                rules="required|max:10|min:10"
              >
                <v-text-field
                  class="mt-2"
                  title="Nª Contrato"
                  label="Nª Contrato"
                  placeholder="Nª Contrato"
                  outlined
                  required
                  :error-messages="errors"
                  dense
                  v-model="informacoesCliente.numeroContrato"
                  :class="classTextField"
                  v-mask="masks.contrato"
                ></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>

          <v-row
            class="mx-2"
            style="gap: 10px"
            v-if="
              informacoesCliente.codCidade &&
              informacoesCliente.nomeCidade &&
              informacoesCliente.numeroContrato
            "
          >
            <v-col class="ma-0 pa-0">
              <validation-provider v-slot="{ errors }" rules="required" name="cliente elegivel">
                <v-select
                  title="Cliente Elegivel?"
                  placeholder="Cliente Elegivel?"
                  label="Cliente Elegivel?"
                  outlined
                  required
                  :error-messages="errors"
                  :items="simNao"
                  item-text="TEXT"
                  v-model="informacoesCliente.clienteElegivel"
                  dense
                  :class="classTextField"
                  @change="
                    informacoesCliente.clienteElegivel == 'NAO' ? listarDadosNaoElegivel() : ''
                  "
                ></v-select>
              </validation-provider>
            </v-col>
          </v-row>

          <template
            v-if="
              informacoesCliente.codCidade &&
              informacoesCliente.nomeCidade &&
              informacoesCliente.numeroContrato &&
              informacoesCliente.clienteElegivel == 'SIM'
            "
          >
            <v-row class="mx-2" style="gap: 10px">
              <v-col class="ma-0 pa-0">
                <validation-provider v-slot="{ errors }" rules="required" name="cliente possui tv">
                  <v-select
                    title="Cliente possui TV?"
                    placeholder="Cliente possui TV?"
                    label="Cliente possui TV?"
                    outlined
                    :items="simNao"
                    :error-messages="errors"
                    required
                    item-text="TEXT"
                    v-model="informacoesCliente.possuiTv"
                    dense
                    :class="classTextField"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col class="ma-0 pa-0" v-if="informacoesCliente.possuiTv == 'SIM'">
                <validation-provider v-slot="{ errors }" rules="required" name="valor assinatura">
                  <v-text-field
                    title="Valor da Assinatura"
                    prepend-inner-icon="fa-solid fa-dollar-sign fa-2xs"
                    v-model="informacoesCliente.valorAssinaturaTv"
                    placeholder="Valor da Assinatura"
                    label="Valor da Assinatura"
                    outlined
                    dense
                    :error-messages="errors"
                    required
                    v-mask="['#.##', '##.##', '###.##']"
                    @input="formatInput"
                    :class="classTextField"
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row
              class="mx-2"
              style="gap: 10px"
              v-if="
                informacoesCliente.possuiTv == 'NAO' ||
                (informacoesCliente.possuiTv == 'SIM' && informacoesCliente.valorAssinaturaTv)
              "
            >
              <v-col class="ma-0 pa-0">
                <validation-provider v-slot="{ errors }" rules="required" name="possui virtua">
                  <v-select
                    title="Cliente Possui VIRTUA?"
                    label="Cliente Possui VIRTUA?"
                    placeholder="Cliente Possui VIRTUA?"
                    outlined
                    dense
                    required
                    :error-messages="errors"
                    v-model="informacoesCliente.possuiVirtua"
                    :class="classTextField"
                    :items="simNao"
                    item-text="TEXT"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col class="ma-0 pa-0" v-if="informacoesCliente.possuiVirtua == 'SIM'">
                <validation-provider v-slot="{ errors }" rules="required" name="velocidade">
                  <v-select
                    title="Qual velocidade?"
                    label="Qual velocidade?"
                    placeholder="Qual velocidade?"
                    outlined
                    dense
                    required
                    :error-messages="errors"
                    :items="listPlanosVirtua"
                    item-text="DSC_PRODUTO_TABULACAO"
                    v-model="informacoesCliente.velocidadeVirtua"
                    :class="classTextField"
                    no-data-text="Planos não foram carregados!"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col
                class="ma-0 pa-0"
                v-if="
                  informacoesCliente.possuiVirtua == 'SIM' && informacoesCliente.velocidadeVirtua
                "
              >
                <validation-provider v-slot="{ errors }" name="valor assinatura" rules="required">
                  <v-text-field
                    title="Valor da Assinatura"
                    label="Valor da Assinatura"
                    placeholder="Valor da Assinatura"
                    v-mask="['#.##', '##.##', '###.##']"
                    prepend-inner-icon="fa-solid fa-dollar-sign fa-2xs"
                    v-model="informacoesCliente.valorAssinaturaVirtua"
                    outlined
                    dense
                    required
                    :error-messages="errors"
                    :class="classTextField"
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
            <v-row
              class="mx-2"
              style="gap: 10px"
              v-if="
                informacoesCliente.possuiVirtua == 'NAO' ||
                (informacoesCliente.possuiVirtua == 'SIM' &&
                  informacoesCliente.valorAssinaturaVirtua)
              "
            >
              <v-col class="pa-0 ma-0">
                <validation-provider v-slot="{ errors }" rules="required" name="possui fone">
                  <v-select
                    title="Cliente Possui FONE?"
                    label="Cliente Possui FONE?"
                    placeholder="Cliente Possui FONE?"
                    v-model="informacoesCliente.possuiFone"
                    outlined
                    dense
                    required
                    :error-messages="errors"
                    :items="simNao"
                    item-text="TEXT"
                    :class="classTextField"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col class="ma-0 pa-0" v-if="informacoesCliente.possuiFone == 'SIM'">
                <validation-provider v-slot="{ errors }" rules="required" name="valor assinatura">
                  <v-text-field
                    title="Valor da Assinatura"
                    prepend-inner-icon="fa-solid fa-dollar-sign fa-2xs"
                    label="Valor da Assinatura"
                    placeholder="Valor da Assinatura"
                    v-mask="['#.##', '##.##', '###.##']"
                    v-model="informacoesCliente.valorAssinaturaFone"
                    outlined
                    dense
                    required
                    :error-messages="errors"
                    :class="classTextField"
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>

            <v-row
              class="mx-2"
              style="gap: 10px"
              v-if="
                informacoesCliente.possuiFone == 'NAO' ||
                (informacoesCliente.possuiFone == 'SIM' && informacoesCliente.valorAssinaturaFone)
              "
            >
              <v-col class="ma-0 pa-0">
                <validation-provider v-slot="{ errors }" name="possui linha movel" rules="required">
                  <v-select
                    title="Cliente Possui LINHA MÓVEL?"
                    label="Cliente Possui LINHA MÓVEL?"
                    placeholder="Cliente Possui LINHA MÓVEL?"
                    outlined
                    dense
                    required
                    :error-messages="errors"
                    :items="simNao"
                    item-text="TEXT"
                    :class="classTextField"
                    v-model="informacoesCliente.possuiMovel"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col class="ma-0 pa-0" v-if="informacoesCliente.possuiMovel == 'SIM'">
                <validation-provider v-slot="{ errors }" name="operadora" rules="required">
                  <v-select
                    title="Operadora"
                    label="Operadora"
                    placeholder="Operadora"
                    outlined
                    dense
                    required
                    :error-messages="errors"
                    :class="classTextField"
                    :items="operadoras"
                    item-text="NOME"
                    v-model="informacoesCliente.operadora"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col
                class="ma-0 pa-0"
                v-if="informacoesCliente.possuiMovel == 'SIM' && informacoesCliente.operadora"
              >
                <validation-provider v-slot="{ errors }" name="plano" rules="required">
                  <v-select
                    title="Plano"
                    label="Plano"
                    placeholder="Plano"
                    outlined
                    dense
                    required
                    :error-messages="errors"
                    :items="tipoPlano"
                    item-text="NOME"
                    v-model="informacoesCliente.tipoPlano"
                    :class="classTextField"
                  ></v-select>
                </validation-provider>
              </v-col>
            </v-row>

            <v-row
              class="mx-2"
              style="gap: 10px"
              v-if="
                informacoesCliente.possuiMovel == 'SIM' &&
                informacoesCliente.operadora &&
                informacoesCliente.tipoPlano
              "
            >
              <v-col class="ma-0 pa-0">
                <validation-provider v-slot="{ errors }" rules="required" name="valor pago">
                  <v-text-field
                    title="Valor pago?"
                    label="Valor pago?"
                    prepend-inner-icon="fa-solid fa-dollar-sign fa-2xs"
                    placeholder="Valor pago?"
                    outlined
                    dense
                    required
                    :error-messages="errors"
                    v-mask="['#.##', '##.##', '###.##']"
                    v-model="informacoesCliente.valorPlanoPago"
                    :class="classTextField"
                  ></v-text-field>
                </validation-provider>
              </v-col>
              <v-col
                class="ma-0 pa-0"
                v-if="
                  informacoesCliente.tipoPlano != 'PRÉ PAGO' && informacoesCliente.valorPlanoPago
                "
              >
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="conteudos exclusivos"
                >
                  <v-select
                    title="O plano permite acesso a conteúdo exclusivos, como a NETFLIX, HBO, DISNEY+?"
                    :label="
                      informacoesCliente.beneficiosPlano
                        ? 'O plano permite acesso a streaming?'
                        : ''
                    "
                    placeholder="O plano permite acesso a conteúdo exclusivos, como a NETFLIX, HBO, DISNEY+?"
                    outlined
                    dense
                    :error-messages="errors"
                    v-model="informacoesCliente.beneficiosPlano"
                    :class="classTextField"
                    :items="simNao"
                    item-text="TEXT"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col
                class="ma-0 pa-0"
                v-if="
                  informacoesCliente.possuiMovel == 'SIM' &&
                  informacoesCliente.tipoPlano != 'PRÉ PAGO' &&
                  informacoesCliente.beneficiosPlano
                "
              >
                <validation-provider v-slot="{ errors }" rules="required" name="utiliza plano para">
                  <v-select
                    title="O cliente utiliza mais o plano para:"
                    label="O cliente utiliza mais o plano para:"
                    placeholder="O cliente utiliza mais o plano para:"
                    outlined
                    dense
                    :error-messages="errors"
                    v-model="informacoesCliente.principalUsoPlano"
                    :class="classTextField"
                    :items="itemsPrincipalUsoPlano"
                    item-text="NOME"
                  ></v-select>
                </validation-provider>
              </v-col>
              <v-col
                class="pa-0 ma-0"
                v-if="
                  informacoesCliente.possuiMovel == 'SIM' &&
                  informacoesCliente.tipoPlano != 'PRÉ PAGO' &&
                  informacoesCliente.principalUsoPlano
                "
              >
                <validation-provider
                  v-slot="{ errors }"
                  rules="required"
                  name="quantidade que utilizam a linha movel"
                >
                  <v-text-field
                    v-model="informacoesCliente.qtdDependentes"
                    title="Quantas pessoas utilizam linha móvel na residência do cliente?"
                    label="Quantas pessoas utilizam linha móvel na residência do cliente?"
                    placeholder="Quantas pessoas utilizam linha móvel na residência do cliente?"
                    outlined
                    dense
                    :error-messages="errors"
                    :class="classTextField"
                  ></v-text-field>
                </validation-provider>
              </v-col>
            </v-row>
          </template>
          <template
            v-else-if="
              informacoesCliente.codCidade &&
              informacoesCliente.nomeCidade &&
              informacoesCliente.numeroContrato &&
              informacoesCliente.clienteElegivel == 'NAO'
            "
          >
            <v-row class="mx-2">
              <v-col class="ma-0 pa-0" v-if="informacoesCliente.clienteElegivel == 'NAO'">
                <validation-provider
                  rules="required"
                  v-slot="{ errors }"
                  name="motivo não elegibilidade"
                >
                  <v-autocomplete
                    title="Motivo não Elegibilidade?"
                    placeholder="Motivo não Elegibilidade?"
                    label="Motivo não Elegibilidade?"
                    :items="motivosNaoElegivel"
                    item-text="DESCRICAO"
                    outlined
                    dense
                    :error-messages="errors"
                    v-model="informacoesCliente.motivoNaoElegibilidade"
                    :class="classTextField"
                  ></v-autocomplete>
                </validation-provider>
              </v-col>
            </v-row>
          </template>
          <div style="display: flex; justify-content: end">
            <v-btn
              class="ma-2 rounded-bl-xl rounded-r-xl white--text success"
              type="submit"
              :disabled="invalid"
            >
              {{ informacoesCliente.clienteElegivel == 'SIM' ? 'Validar Formulário' : 'Finalizar' }}
            </v-btn>
            <v-btn class="ma-2 rounded-bl-xl rounded-r-xl white--text error" @click="limparForm">
              Limpar
            </v-btn>
          </div>
        </form>
      </validation-observer>
    </v-col>
    <dialog-validacao
      :openValidacaoSales="openValidacaoSales"
      @update:closeDialog="openValidacaoSales = !openValidacaoSales"
      :arrayDados="informacoesCliente"
      @update:abrirModalTelevendas="abrirModalTelevendas"
      @update:limparFormNaoAceitou="limparFormNaoAceitou"
    ></dialog-validacao>
    <grafico-de-speech
      :abrirGraficoSpeech="abrirGrafico"
      @update:abrir-sugestoes="abrirSugestoes"
    ></grafico-de-speech>
    <smart-sales-televendas-component
      :dialogModalTelevendas="abrirModalTelevendasSmart"
      @update:close-tlvsmart="abrirModalTelevendasSmart = !abrirModalTelevendasSmart"
      :dadosPrePreenchidos="informacoesCliente"
      @update:dadosEnviados="limparDados"
    ></smart-sales-televendas-component>
    <!-- <v-dialog v-model="abrirChecagemBko" width="500">
      <v-card>
        teste
      </v-card>
    </v-dialog> -->
    <texto-padrao
      :openTextoPadrao="openTextoPadrao"
      @update:close="openTextoPadrao = !openTextoPadrao"
    ></texto-padrao>
  </div>
</template>

<script>
  import config from '../../core/config'
  import alerts from '../../mixins/alerts.mixins'
  import masks from '../../shared/masks/masks'
  import GraficoDeSpeech from './graficoDeSpeech.vue'
  import dialogValidacao from './dialogValidacao.vue'
  import smartSalesTelevendasComponent from '../formularios/tabuladores/televendas/formularios/smartSalesTelevendas.component.vue'
  import textoPadrao from '../formularios/tabuladores/televendas/formularios/textoPadrao.vue'

  import { ValidationProvider, ValidationObserver } from 'vee-validate'
  export default {
    components: {
      dialogValidacao,
      GraficoDeSpeech,
      smartSalesTelevendasComponent,
      ValidationProvider,
      ValidationObserver,
      textoPadrao
    },
    props: {
      acao: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      classTextField: 'rounded-xl mx-1',
      openTextoPadrao: false,
      simNao: [{ TEXT: 'SIM' }, { TEXT: 'NAO' }],
      operadoras: [{ NOME: 'CLARO' }, { NOME: 'VIVO' }, { NOME: 'TIM' }],
      tipoPlano: [{ NOME: 'PRÉ PAGO' }, { NOME: 'CONTROLE' }, { NOME: 'PÓS PAGO' }],
      itemsPrincipalUsoPlano: [{ NOME: 'LIGAÇÕES' }, { NOME: 'INTERNET' }, { NOME: 'SMS' }],
      listCidades: [],
      listPlanosVirtua: [
        {
          DSC_PRODUTO_TABULACAO: '125 MB'
        },
        {
          DSC_PRODUTO_TABULACAO: '250 MB'
        },
        {
          DSC_PRODUTO_TABULACAO: '350 MB'
        },
        {
          DSC_PRODUTO_TABULACAO: '500 MB'
        },
        {
          DSC_PRODUTO_TABULACAO: '700 MB'
        },
        {
          DSC_PRODUTO_TABULACAO: '1 GB'
        }
      ], // 125M, 250M,350M,500M,700M,1GB
      dadosPrePreenchidos: [],
      motivosNaoElegivel: [],
      openValidacaoSales: false,
      abrirChecagemBko: true,
      abrirModalTelevendasSmart: false,
      abrirGrafico: false,
      informacoesCliente: {
        nomeCidade: null,
        codCidade: null,
        numeroContrato: null,
        possuiTv: null,
        valorAssinaturaTv: null,
        possuiVirtua: null,
        velocidadeVirtua: null,
        valorAssinaturaVirtua: null,
        possuiFone: null,
        valorAssinaturaFone: null,
        possuiMovel: null,
        operadora: null,
        tipoPlano: null,
        valorPlanoPago: null,
        beneficiosPlano: null,
        principalUsoPlano: null,
        qtdDependentes: null,
        clienteElegivel: null,
        motivoNaoElegibilidade: null,
        fonte: 'SMART_SALES'
      }
    }),
    mixins: [alerts],
    computed: {
      masks() {
        return masks
      },
      almopeCadastro() {
        return this.$store.getters.usuario.almope
      },
      requiredRule() {
        return [v => !!v || 'This field is required']
      },
      finalSemana() {
        let diasSemana = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sabado']
        let dia = new Date().getDay()
        return diasSemana[dia] === 'sabado' || diasSemana[dia] === 'domingo' ? true : false
      }
    },
    mounted() {
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
          this.openValidacaoSales = false
        }
      })
    },
    methods: {
      async submit() {
        const isValid = await this.$refs.observer.validate()
        if (isValid) {
          if (this.informacoesCliente.clienteElegivel == 'SIM') {
            this.validacaoDePlano()
          } else {
            this.finalizarCadastro()
          }
        }
      },
      finalizarCadastro() {
        this.informacoesCliente.almopeCadastro = this.$store.getters.usuario.almope
        this.informacoesCliente.clienteAceitou = null
        this.informacoesCliente.flag = null
        this.informacoesCliente.planoEscolha = null
        this.informacoesCliente.tipo = null
        let urlData = `${config.baseUrl}api/shared/smartsales/televendas/inserir/`
        this.$api.post(urlData, this.informacoesCliente).then(() => {
          this.limparForm()
        })
      },
      listarDadosNaoElegivel() {
        let urlData = `${config.baseUrl}api/shared/televendas/dados_campo/CLIENTE_ELEGIVEL`
        this.$api.get(urlData).then(res => {
          this.motivosNaoElegivel = res.data
        })
      },
      limparFormNaoAceitou() {
        this.limparForm()
      },
      formatInput(e) {
        return e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
      },
      async limparDados() {
        this.limparForm()
        this.abrirModalTelevendasSmart = !this.abrirModalTelevendasSmart
        // abri janela para texto padrão
        await this.swalConfirmation(
          () => {
            this.openTextoPadrao = true
          },
          'Deseja gerar o texto padrão?',
          'Gerar o texto padrão através do smartsales é prático e facilita o registro do seu atendimento.',
          'Gerar texto',
          '',
          '',
          true,
          true,
          'Cancelar',
          false
        )
      },
      // async abrirModalTelevendas(e) {
      //   let urlData = `${config.baseUrl}api/shared/service_to_sales/check/venda/usuario`
      //   var res = await this.$api.get(urlData, {
      //     params: {
      //       almope: this.almopeCadastro,
      //     },
      //   })
      //   if (res.data.length > 0 && !this.finalSemana) {
      //     do {
      //       //
      //       const { value: formValues } = await this.$swal.fire({
      //         title: 'Validação de venda',
      //         html: `<input id="swal-input1" class="swal2-input" placeholder="Insira seu almope">
      //                <input id="swal-input2" class="swal2-input" placeholder="Insira sua senha" type="password">`,
      //         focusConfirm: false,
      //         showCancelButton: true,
      //         cancelButtonText: 'Cancelar',
      //         preConfirm: () => {
      //           return [document.getElementById('swal-input1').value, document.getElementById('swal-input2').value]
      //         },
      //       })

      //       let dadosForm = formValues
      //       if (dadosForm[0] == '' || dadosForm[1] == '') return
      //       let urlValidacao = `${config.baseUrl}api/shared/service_to_sales/check/venda/validacao`
      //       var result = await this.$api.get(urlValidacao, {
      //         params: {
      //           username: dadosForm[0],
      //           senha: dadosForm[1],
      //           almopeOperador: this.almopeCadastro,
      //         },
      //       })
      //       e.almopeAuditor = dadosForm[0]

      //       if (!result.data) {
      //         await this.$swal.fire({
      //           title: 'Dados não conferem!',
      //           text: 'Por favor valide os dados e tente novamente.',
      //           icon: 'error',
      //         })
      //       }
      //     } while (!result.data)

      //     this.$swal.fire({
      //       title: 'Acesso concedido',
      //       text: `Validação realizada com sucesso!`,
      //       icon: 'success',
      //     })
      //     this.abrirModalTelevendasSmart = true
      //     this.dadosPrePreenchidos = e
      //   } else {
      //     this.abrirModalTelevendasSmart = true
      //     this.dadosPrePreenchidos = e
      //   }
      // },
      async abrirModalTelevendas(e) {
        let urlData = `${config.baseUrl}api/shared/service_to_sales/check/venda/usuario`
        var res = await this.$api.get(urlData, {
          params: {
            almope: this.almopeCadastro
          }
        })
        if (res.data.length > 0 && !this.finalSemana) {
          let result = null
          do {
            const swalResult = await this.$swal.fire({
              title: 'Validação de venda',
              html: `<input id="swal-input1" class="swal2-input" placeholder="Insira seu almope">
               <input id="swal-input2" class="swal2-input" placeholder="Insira sua senha" type="password">`,
              focusConfirm: false,
              showCancelButton: true,
              cancelButtonColor: '#d33',
              cancelButtonText: 'Não validar',
              preConfirm: () => {
                return [
                  document.getElementById('swal-input1').value,
                  document.getElementById('swal-input2').value
                ]
              }
            })

            // adicionado 02/07/2025
            if (swalResult.isDismissed) {
              this.abrirModalTelevendasSmart = true
              this.dadosPrePreenchidos = e
              return
            }

            let dadosForm = swalResult.value
            if (dadosForm[0] == '' || dadosForm[1] == '') return

            let urlValidacao = `${config.baseUrl}api/shared/service_to_sales/check/venda/validacao`
            result = await this.$api.get(urlValidacao, {
              params: {
                username: dadosForm[0],
                senha: dadosForm[1],
                almopeOperador: this.almopeCadastro
              }
            })
            e.almopeAuditor = dadosForm[0]

            if (!result.data) {
              await this.$swal.fire({
                title: 'Dados não conferem!',
                text: 'Por favor valide os dados e tente novamente.',
                icon: 'error'
              })
            }
          } while (!result.data)

          this.$swal.fire({
            title: 'Acesso concedido',
            text: `Validação realizada com sucesso!`,
            icon: 'success'
          })
          this.abrirModalTelevendasSmart = true
          this.dadosPrePreenchidos = e
        } else {
          this.abrirModalTelevendasSmart = true
          this.dadosPrePreenchidos = e
        }
      },

      abrirSugestoes() {
        this.abrirGrafico = false
        this.openValidacaoSales = true
      },
      loadListPlanosVirtua() {
        let urlData = `${config.baseUrl}api/shared/televendas/dsc_virtua`
        this.$api.get(urlData).then(res => {
          this.listPlanosVirtua = res.data
        })
      },
      limparForm() {
        let form = Object.assign({}, this.informacoesCliente)
        Object.keys(form).forEach(element => {
          return (form[element] = null)
        })
        this.informacoesCliente = form
        this.$refs.observer.reset()
        this.informacoesCliente.fonte = 'SMART_SALES'
      },
      validacaoDePlano() {
        this.abrirGrafico = true
      },
      filterCodCidade() {
        let cidades = this.listCidades
        return cidades.filter(cidade => {
          if (cidade.COD_CIDADE == this.informacoesCliente.codCidade) {
            this.informacoesCliente.nomeCidade = cidade.NOME_CIDADE
          }
        })
      },
      filterNomeCidade() {
        let cidades = this.listCidades
        return cidades.filter(cidade => {
          if (cidade.NOME_CIDADE == this.informacoesCliente.nomeCidade) {
            this.informacoesCliente.codCidade = cidade.COD_CIDADE
          }
        })
      },
      loadCidades() {
        let urlData = `${config.baseUrl}api/shared/utils/geral/cidades`
        this.$api.get(urlData).then(res => {
          this.listCidades = res.data
        })
      }
    },
    created() {
      this.loadCidades()
    }
  }
</script>
<style scoped>
  .container-cliente {
    /* max-height: 60vh; */
    max-height: 50vh;
    overflow: auto;
  }

  .btn {
    background-image: linear-gradient(45deg, rgb(143, 14, 143), rgb(0, 236, 255));
    /* border-radius: 15px; */
  }
</style>
