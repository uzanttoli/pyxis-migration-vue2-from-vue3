<template>
  <v-card>
    <title-negative-margin title="Hotline" className="rounded-r-xl"></title-negative-margin>
    <v-divider></v-divider>
    <!-- <pre>{{ fields }}</pre> -->
    <v-col class="mt-3">
      <v-row>
        <v-col
          class="py-0"
          v-for="(item, i) in fieldsForms"
          :key="i"
          :cols="item.cols"
          v-show="isDependecis(item.dependecies)"
        >
          <component
            :is="item.component"
            :label="item.label"
            :value="formField[item.model]"
            @input="updateFormField(item.model, $event)"
            @change="handleFieldChange(item.model, $event)"
            :isMasks="item.isMasks"
            :propsMasks="item.masks"
            :items="itemsList[item.items]"
            text="TEXT"
            value2="VALUE"
          ></component>
        </v-col>
      </v-row>
      <v-row justify="end" class="ma-0 pa-0 mt-2">
        <v-btn
          color="success"
          class="rounded-bl-xl rounded-r-xl mr-2"
          :disabled="!this.formIsValid(formField)"
          @click="saveForm"
        >
          Salvar
        </v-btn>
        <v-btn color="error" class="rounded-bl-xl rounded-r-xl" @click="clearForm">Limpar</v-btn>
      </v-row>
    </v-col>
  </v-card>
</template>

<script>
  import VTextField from '../../../../shared/components/vuetifyComponents/VTextField.vue'
  import VTextArea from '../../../../shared/components/vuetifyComponents/VTextArea.vue'
  import VAutocomplete from '../../../../shared/components/vuetifyComponents/VAutocomplete.vue'
  import VInputField from '../../../../shared/components/vuetifyComponents/VInputField.vue'

  import config from '../../../../core/config'
  import alerts from '../../../../mixins/alerts.mixins'
  export default {
    components: { VTextField, VTextArea, VInputField, VAutocomplete },
    data: () => ({
      formField: {
        enderecoLoja: null,
        canal: null,
        nomeCompletoVendedor: null,
        matriculaVendedor: null,
        numContrato: null,
        protocoloAtendimento: null,
        assunto: null,
        vendedorPossuiAlcada: null,
        ramificarAssuntos: null,
        motivoPrincipalLigacao: null,
        produtoSolicitacao: null,
        solicitacaoResolvidaAtendimento: null,
        breveDescricao: null,
        telefoneVendedor: null,
        comta: null,
        cidadeLoja: null,
        perfilSolicitante: null
      },
      listarRamificacaoAssunto: [],
      listarRamificacaoMicroAssunto: [],
      listarCanais: [],
      listCidades: [],
      listEnderecos: [],
      listComta: [],
      validacoes: [],
      simNao: [
        { TEXT: 'SIM', VALUE: 'SIM' },
        { TEXT: 'NÃO', VALUE: 'NAO' }
      ],
      itemsPerfilSolicitante: [
        { TEXT: 'Lojista', VALUE: 'Lojista' },
        { TEXT: 'Ativação Premium - MOTIVA', VALUE: 'Ativação Premium - MOTIVA' }
      ]
    }),
    mixins: [alerts],
    computed: {
      fieldsForms() {
        let fieldsForms = [
          {
            id: 1,
            component: 'v-autocomplete',
            label: 'Perfil do solicitante',
            model: 'perfilSolicitante',
            isMasks: false,
            masks: null,
            change: null,
            items: 'itemsPerfilSolicitante',
            dependecies: null,
            cols: 4
          },
          {
            id: 2,
            component: 'v-autocomplete',
            label: 'Canal (perguntar ao vendedor)',
            model: 'canal',
            isMasks: false,
            masks: null,
            change: 'loadListarCidades',
            items: 'listarCanais',
            dependecies: null,
            cols: 4
          },
          {
            id: 3,
            component: 'v-autocomplete',
            label: 'Cidade',
            model: 'cidadeLoja',
            isMasks: false,
            masks: null,
            change: 'loadEnderecos',
            items: 'listCidades',
            dependecies: ['canal'],
            cols: 4
          },
          {
            id: 3,
            component: 'v-autocomplete',
            label: 'Endereço da Loja (perguntar ao vendedor)',
            model: 'enderecoLoja',
            isMasks: false,
            masks: null,
            change: 'loadListarComta',
            items: 'listEnderecos',
            dependecies: ['cidadeLoja'],
            cols: 4
          },
          {
            id: 4,
            component: 'v-autocomplete',
            label: 'COMTA',
            model: 'comta',
            isMasks: false,
            masks: null,
            change: null,
            items: 'listComta',
            dependecies: ['enderecoLoja'],
            cols: 4
          },
          {
            id: 1,
            component: 'v-text-field',
            label: 'Telefone Vendendor',
            model: 'telefoneVendedor',
            isMasks: true,
            masks: ['telefoneBrMovel', 'telefoneBrFixo'],
            change: null,
            items: null,
            dependecies: ['comta'],
            cols: 4
          },
          {
            id: 5,
            component: 'v-text-field',
            label: 'Nome Completo Vendedor',
            model: 'nomeCompletoVendedor',
            isMasks: false,
            masks: null,
            change: null,
            items: null,
            dependecies: ['telefoneVendedor'],
            cols: 4
          },
          {
            id: 6,
            component: 'v-text-field',
            label: 'Login CLAROBR (Perguntar Ao Vendedor)',
            model: 'matriculaVendedor',
            isMasks: false,
            masks: null,
            change: null,
            items: null,
            dependecies: ['nomeCompletoVendedor'],
            cols: 4
          },
          {
            id: 7,
            component: 'v-text-field',
            label: 'Nº Contrato (Operadora/Contrato)',
            model: 'numContrato',
            isMasks: true,
            masks: ['contratoComCodCidade'],
            change: null,
            items: null,
            dependecies: ['enderecoLoja', 'canal', 'nomeCompletoVendedor', 'matriculaVendedor'],
            cols: 4
          },
          {
            id: 8,
            component: 'v-text-field',
            label: 'Protocolo Do Atendimento',
            model: 'protocoloAtendimento',
            isMasks: true,
            masks: 'protocolo',
            change: null,
            items: null,
            dependecies: ['numContrato'],
            cols: 4
          },
          {
            id: 9,
            component: 'v-autocomplete',
            label: 'Assunto*',
            model: 'assunto',
            isMasks: false,
            masks: null,
            change: null,
            items: 'listAssunto',
            dependecies: ['protocoloAtendimento'],
            cols: 4
          },
          {
            id: 10,
            component: 'v-autocomplete',
            label: 'Vendedor Possui Alçada Para Realizar O Procedimento',
            model: 'vendedorPossuiAlcada',
            isMasks: false,
            masks: null,
            change: null,
            items: 'simNao',
            dependecies: ['assunto'],
            cols: 4
          },
          {
            id: 11,
            component: 'v-autocomplete',
            label: 'Ramificar Assuntos',
            model: 'ramificarAssuntos',
            isMasks: false,
            masks: null,
            change: null,
            items: 'listarRamificacaoAssunto',
            dependecies: ['vendedorPossuiAlcada'],
            cols: 4
          },
          {
            id: 12,
            component: 'v-autocomplete',
            label: 'Qual Motivo Principal Da Ligação Do Vendedor*',
            model: 'motivoPrincipalLigacao',
            isMasks: false,
            masks: null,
            change: null,
            items: 'listarRamificacaoMicroAssunto',
            dependecies: ['ramificarAssuntos'],
            cols: 4
          },
          {
            id: 13,
            component: 'v-autocomplete',
            label: 'Para Qual Produto A Solicitação',
            model: 'produtoSolicitacao',
            isMasks: false,
            masks: null,
            change: null,
            items: 'listProdutoSoli',
            dependecies: ['motivoPrincipalLigacao'],
            cols: 4
          },
          {
            id: 14,
            component: 'v-autocomplete',
            label: 'Solicitação Do Cliente Foi Resolvida No Atendimento?',
            model: 'solicitacaoResolvidaAtendimento',
            isMasks: false,
            masks: null,
            change: null,
            items: 'listSolicitacaoResol',
            dependecies: ['produtoSolicitacao'],
            cols: 4
          },
          {
            id: 15,
            component: 'v-text-area',
            label: 'Breve Descrição',
            model: 'breveDescricao',
            isMasks: false,
            masks: null,
            change: null,
            items: null,
            dependecies: ['solicitacaoResolvidaAtendimento'],
            cols: 12
          }
        ]
        return fieldsForms
      },
      itemsList() {
        return {
          listAssunto: this.listAssunto,
          listarRamificacaoAssunto: this.listarRamificacaoAssunto,
          listarRamificacaoMicroAssunto: this.listarRamificacaoMicroAssunto,
          simNao: this.simNao,
          listarCanais: this.listarCanais,
          listProdutoSoli: this.listProdutoSoli,
          listSolicitacaoResol: this.listSolicitacaoResol,
          listCidades: this.listCidades,
          listEnderecos: this.listEnderecos,
          listComta: this.listComta,
          itemsPerfilSolicitante: this.itemsPerfilSolicitante
        }
      },

      listAssunto() {
        let validacoes = this.validacoes
        return validacoes.filter(validacao => {
          return validacao.FILTRO == 'ASSUNTO*'
        })
      },
      listProdutoSoli() {
        let validacoes = this.validacoes
        return validacoes.filter(validacao => {
          return validacao.FILTRO == 'PARA QUAL PRODUTO A SOLICITAÇÃO'
        })
      },
      listSolicitacaoResol() {
        let validacoes = this.validacoes
        return validacoes.filter(validacao => {
          return validacao.FILTRO == 'SOLICITAÇÃO DO CLIENTE FOI RESOLVIDA NO ATENDIMENTO?'
        })
      }
    },
    methods: {
      saveForm() {
        this.formField.almope = this.$store.getters.usuario.almope
        let urlData = `${config.baseUrl}api/shared/formularios/hotline/hotline`
        this.$api.post(urlData, this.formField).then(() => {
          this.toast('Dados Cadastrados com sucesso!', 'top-right', false, 3500, 'success')
          this.clearForm()
        })
      },
      loadValidacoes() {
        let urlData = `${config.baseUrl}api/shared/formularios/hotline/validacoes`
        this.$api.get(urlData).then(res => {
          this.validacoes = res.data
        })
      },
      listarRamificacaoMacro() {
        let urlData = `${config.baseUrl}api/shared/formularios/hotline/ramificacao_assunto`
        this.$api.get(urlData).then(res => {
          this.listarRamificacaoAssunto = res.data
        })
      },
      listarRamificacaoMicro() {
        let urlData = `${config.baseUrl}api/shared/formularios/hotline/micro_ramificacao/${this.formField.ramificarAssuntos}`
        this.$api.get(urlData).then(res => {
          this.listarRamificacaoMicroAssunto = res.data
        })
      },
      clearForm() {
        let newForm = Object.assign({}, this.formField)
        Object.keys(newForm).forEach(key => {
          newForm[key] = null
        })
        this.formField = newForm
        this.formField.almope = this.$store.getters.usuario.almope
      },
      updateFormField(model, value) {
        this.formField[model] = value
      },
      loadListarCanais() {
        let urlData = `${config.baseUrl}api/shared/formularios/hotline/canais`
        this.$api.get(urlData).then(res => {
          this.listarCanais = res.data
        })
      },
      loadListarCidades() {
        let urlData = `${config.baseUrl}api/shared/formularios/hotline/cidades/${this.formField.canal}`
        this.$api.get(urlData).then(res => {
          this.listCidades = res.data
        })
      },
      loadEnderecos() {
        let urlData = `${config.baseUrl}api/shared/formularios/hotline/enderecos/${this.formField.cidadeLoja}`
        this.$api.get(urlData).then(res => {
          this.listEnderecos = res.data
        })
      },
      loadListarComta() {
        let urlData = `${config.baseUrl}api/shared/formularios/hotline/comtas/${this.formField.enderecoLoja}`
        this.$api.get(urlData).then(res => {
          this.listComta = res.data
        })
      },
      handleFieldChange(fieldName, newValue) {
        if (newValue == '' || newValue == null) {
          return ''
        } else {
          const field = this.fieldsForms.find(item => item.model === fieldName && item.change)

          if (field) {
            const changeFunctionName = field.change
            if (this[changeFunctionName] && typeof this[changeFunctionName] === 'function') {
              this[changeFunctionName](newValue)
            }
          }
        }
      },
      isDependecis(value) {
        if (!value) return true
        for (let i = 0; i < value.length; i++) {
          if (this.formField[value[i]] == null || this.formField[value[i]] == '') {
            return false
          }
        }
        return true
      },
      formIsValid(object) {
        for (let chave in object) {
          if (object[chave] == null || object[chave] == '') {
            return false
          }
        }
        return true
      }
    },
    watch: {
      'formField.ramificarAssuntos': function (newVal, oldVal) {
        if (newVal != oldVal) {
          if (this.formField.ramificarAssuntos != null) {
            this.listarRamificacaoMicro()
          }
        }
      }
    },
    created() {
      this.listarRamificacaoMacro()
      this.loadValidacoes()
      this.loadListarCanais()
    }
  }
</script>

<style></style>
