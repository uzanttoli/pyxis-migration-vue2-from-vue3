<template>
  <v-card :loading="isLoading">
    <title-negative-margin
      title="Reclamação Contigência"
      className="rounded-r-xl"
    ></title-negative-margin>
    <v-col>
      <v-alert
        outlined
        type="warning"
        prominent
        border="left"
        dense
        v-if="formContigencia.loginIsAlmaviva == 0"
      >
        <h4>Favor seguir com abertura de PU:</h4>
        <v-divider class="my-3"></v-divider>
        <p style="margin: 0; font-size: 15px; font-weight: 600; color: #880707">
          Não reconhece a linha móvel ou todos os produtos |
          <button @click="copyText('textoPadrao1')">
            {{
              isCopy == true && idTextCopy == 'textoPadrao1' ? 'Copiado!' : 'Copiar texto padrão'
            }}
          </button>
          <!-- <input type="text" :value="textoPadrao1" id="textoPadrao1" /> -->
        </p>
        <div id="textoPadrao1" style="display: none">
          <p>
            CPF do titular do contrato (Pessoa Física) ou CNPJ (Pessoa Jurídica):
            <br />
            MSISDN Reclamado e contrato:
            <br />
            Número da Conta Mobile:
            <br />
            Descrição do motivo da reanalise:
          </p>
        </div>
        <p style="margin: 0; font-size: 13px; color: #333">
          Registre o protocolo conforme o produto/segmento abaixo e finalize o atendimento.
        </p>
        <ul>
          <li>
            <strong>Para clientes Controle</strong>
            : Registre o protocolo Reclamação >> Claro controle >> Fraude >> Não reconhece
            linha-Combo multi.
          </li>
          <li>
            <strong>Para clientes Pós</strong>
            : Registre o protocolo Reclamação >> Claro conta >> Fraude >> Não Reconhece Combo multi.
          </li>
        </ul>
        <p style="margin: 0; font-size: 15px; font-weight: 600; color: #880707" class="mt-5">
          Não reconhece a migração da linha |
          <button @click="copyText('textoPadrao2')">
            {{
              isCopy == true && idTextCopy == 'textoPadrao2' ? 'Copiado!' : 'Copiar texto padrão'
            }}
          </button>
        </p>
        <p style="margin: 0; font-size: 13px; color: #333">
          Ex: Cliente reconhece a linha móvel, mas não solicitou que a linha fosse vinculada no
          Combo multi.
          <br />
          Registre a ocorrência CASO ou OCORRÊNCIA: CA3R - DV1 - COMBO MULTI - DIVERGENCIA VALORES E
          PRODUTOS.
        </p>
        <div id="textoPadrao2" style="display: none">
          <p>
            • Informar se cliente deseja cancelamento ou migração Pré/Pós/Controle Individual
            <br />
            • [ ] Cancelar Linha
            <br />
            • [ ] Migrar para Pré
            <br />
            • [ ] Migrar para Controle dentro do Combo multi
            <br />
            • [ ] Migrar para Controle fora do Combo multi
          </p>
        </div>
      </v-alert>

      <v-row>
        <v-col
          class="py-0"
          v-for="(item, i) in listField"
          :key="i.id"
          :cols="item.cols"
          v-show="isDependecis('esperarValor', item.dependecies, item.valueExpected)"
        >
          <component
            :is="item.component"
            :label="item.label"
            :value="formContigencia[item.model]"
            @input="updateFormField(item.model, $event)"
            :isMasks="item.isMasks"
            :propsMasks="item.masks"
            @keyEnterChange="onChange(item.change)"
            :isLoading="isLoading"
            :errorMessages="item.msgAlerta"
          ></component>
        </v-col>
        <!-- <v-btn class="mt-6 ml-n2" fab depressed small @click="loadValidationLoginIsAlmaviva">
          <v-icon small>fa-solid fa-magnifying-glass</v-icon>
        </v-btn> -->
      </v-row>
      <v-row justify="end" class="ma-0 pa-0 mt-2">
        <v-btn
          color="success"
          class="rounded-bl-xl rounded-r-xl mr-2"
          :disabled="!formIsValid(formContigencia, listField)"
          @click="salvarDados"
          :loading="isSend"
        >
          Salvar
        </v-btn>
        <v-btn color="error" class="rounded-bl-xl rounded-r-xl" @click="clearForm">Limpar</v-btn>
      </v-row>
    </v-col>
  </v-card>
</template>

<script>
  import VAutocomplete from '../../../../shared/components/vuetifyComponents/VAutocomplete.vue'
  import VSelect from '../../../../shared/components/vuetifyComponents/VSelect.vue'
  import VTextArea from '../../../../shared/components/vuetifyComponents/VTextArea.vue'
  import VTextField from '../../../../shared/components/vuetifyComponents/VTextField.vue'

  import config from '../../../../core/config'
  import alerts from '../../../../mixins/alerts.mixins'
  export default {
    components: { VAutocomplete, VSelect, VTextArea, VTextField },
    data: () => ({
      formContigencia: {
        numeroLinha: null,
        dataAtivacaoMig: null,
        codigoDealer: null,
        telefoneContato: null,
        nomeclaturaPlano: null,
        cpf: null,
        loginOfensor: null,
        loginIsAlmaviva: null
      },
      isSend: false,
      isLoading: false,
      searchCheckLogin: true,
      isCopy: false,
      idTextCopy: null
    }),
    mixins: [alerts],
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      listField() {
        let fieldsList = [
          {
            id: 1,
            component: 'v-text-field',
            label: 'Login ofensor',
            msgAlerta: 'Pressione `Enter` para pesquisar',
            model: 'loginOfensor',
            items: null,
            controleFcr: null,
            dependecies: null,
            change: 'loadValidationLoginIsAlmaviva',
            valueExpected: null,
            isMasks: false,
            masks: null,
            cols: 4
          },
          {
            id: 1,
            component: 'v-text-field',
            label: 'Número da linha',
            msgAlerta: null,
            model: 'numeroLinha',
            items: null,
            controleFcr: null,
            dependecies: ['loginIsAlmaviva'],
            change: null,
            valueExpected: 1,
            isMasks: true,
            masks: 'telefoneBrFixo',
            cols: 4
          },
          {
            id: 2,
            component: 'v-text-field',
            label: 'Data Ativação ou migração',
            msgAlerta: null,
            model: 'dataAtivacaoMig',
            items: null,
            controleFcr: null,
            dependecies: ['loginIsAlmaviva'],
            change: null,
            valueExpected: 1,
            isMasks: true,
            masks: 'data',
            cols: 4
          },
          {
            id: 3,
            component: 'v-text-field',
            label: 'Código Dealer Ativação/Migração(cod.vendedor):',
            msgAlerta: null,
            model: 'codigoDealer',
            items: null,
            controleFcr: null,
            dependecies: ['loginIsAlmaviva'],
            change: null,
            valueExpected: 1,
            isMasks: false,
            masks: null,
            cols: 4
          },
          {
            id: 4,
            component: 'v-text-field',
            label: 'Telefone para contato:',
            msgAlerta: null,
            model: 'telefoneContato',
            items: null,
            controleFcr: null,
            dependecies: ['loginIsAlmaviva'],
            change: null,
            valueExpected: 1,
            isMasks: true,
            masks: 'telefoneBrFixo',
            cols: 4
          },
          {
            id: 5,
            component: 'v-text-field',
            label: 'CPF:',
            msgAlerta: null,
            model: 'cpf',
            items: null,
            controleFcr: null,
            dependecies: ['loginIsAlmaviva'],
            change: null,
            valueExpected: 1,
            isMasks: true,
            masks: 'cpf',
            cols: 4
          },
          {
            id: 6,
            component: 'v-text-field',
            label: 'Nomenclatura do Plano Cliente:',
            msgAlerta: null,
            model: 'nomeclaturaPlano',
            items: null,
            controleFcr: null,
            dependecies: ['loginIsAlmaviva'],
            change: null,
            valueExpected: 1,
            isMasks: false,
            masks: null,
            cols: 4
          }
        ]
        return fieldsList
      }
    },
    methods: {
      copyText(id) {
        this.isCopy = true
        let copyText = document.getElementById(id)
        this.idTextCopy = id
        var originalDisplay = copyText.style.display

        copyText.style.display = 'block'

        var range = document.createRange()
        range.selectNode(copyText)
        window.getSelection().removeAllRanges()
        window.getSelection().addRange(range)
        // copyText.select();
        document.execCommand('copy')

        copyText.style.display = originalDisplay
        setTimeout(() => {
          this.isCopy = false
        }, 1500)
      },
      onChange(item) {
        if (!item) return
        this[item]()
      },
      loadValidationLoginIsAlmaviva() {
        this.isLoading = true
        let urlData = `${config.baseUrl}api/shared/formularios/reclamacao_contigencia/login_is_almaviva/${this.formContigencia.loginOfensor}`
        this.$api.get(urlData).then(res => {
          this.formContigencia.loginIsAlmaviva = res.data.RETORNO
          this.isLoading = false
        })
      },
      async salvarDados() {
        try {
          this.isSend = true
          this.formContigencia.usuarioAlmope = this.usuarioAlmope
          let urlData = `${config.baseUrl}api/shared/formularios/reclamacao_contigencia/create`
          await this.$api.post(urlData, this.formContigencia)
          this.toast('Reclamação registrada com sucesso', 'top-right', false, 3500, 'success')
          this.isSend = false
          this.clearForm()
        } catch (e) {
          this.isSend = false
          this.toast(
            'Ops! Não conseguimos salvar seus dados. Tente novamente!',
            'top-right',
            false,
            3500,
            'error'
          )
        }
      },
      isDependecis(tipoDependenci, dependecis, valueExpected) {
        if (tipoDependenci == 'esperarValor') {
          if (!dependecis || !valueExpected) return true
          if (this.formContigencia[dependecis] == valueExpected) {
            return true
          }
          return false
        }
      },
      updateFormField(model, value) {
        this.formContigencia[model] = value
      },
      clearForm() {
        let newForm = Object.assign({}, this.formContigencia)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })

        this.formContigencia = newForm
        this.formContigencia.usuarioAlmope = this.usuarioAlmope
      },
      formIsValid(objeto, dependencies) {
        if (
          this.formContigencia.loginIsAlmaviva == 2 ||
          this.formContigencia.loginIsAlmaviva == 0
        ) {
          return false
        } else {
          let newObj = { ...objeto }
          for (let i = 0; i < dependencies.length; i++) {
            const dependency = dependencies[i]
            if (dependency.dependecies != null) {
              const dependencyValue = newObj[dependency.dependecies]
              if (dependencyValue === dependency.valueExpected) {
                newObj[dependency.model] = null || this.formContigencia[dependency.model]
              } else {
                delete newObj[dependency.model]
              }
            }
          }
          for (var chave in newObj) {
            if (newObj[chave] == null || newObj[chave] == '') {
              return false
            }
          }
          return true
        }
      }
    },
    watch: {
      'formContigencia.loginOfensor': function (oldVal, newVal) {
        if (oldVal != newVal) {
          this.formContigencia.loginIsAlmaviva = 2
        }
      }
    }
  }
</script>

<style scoped>
  li {
    font-size: 13px;
    color: black;
  }

  .importante {
    color: red;
    animation: piscar 1s infinite;
  }

  /* @keyframes piscar {
    0%, 20% {
        opacity: 1;
    }
    25%, 75% {
        opacity: 0;
    }
    80%, 100% {
        opacity: 1;
    }
} */

  button {
    background-color: #0e0e61;
    color: #fff;
    padding: 2px 7px 2px 7px;
    border-radius: 10px;
    font-size: 11px;
  }

  #textoPadrao1,
  #textoPadrao2 {
    display: none;
  }
</style>
