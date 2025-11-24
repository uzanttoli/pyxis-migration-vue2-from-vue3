<template>
  <v-sheet>
    <title-negative-margin
      title="Formulário Brownfield"
      className="rounded-r-xl"
    ></title-negative-margin>
    <div class="pa-5">
      <div>
        <v-icon color="red">fa-solid fa-heart-pulse</v-icon>
        {{ `Olá ${nome}, tenha um excelente dia de vendas!` }}
      </div>
      <v-divider class="ma-2"></v-divider>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="submit">
          <v-row class="mx-2 mt-2" style="gap: 10px">
            <v-col class="pa-0 ma-0">
              <validation-provider v-slot="{ errors }" name="venda" rules="required">
                <v-autocomplete
                  id="venda"
                  label="Venda"
                  placeholder="Venda"
                  hide-no-data
                  required
                  outlined
                  :error-messages="errors"
                  v-model="formBrownfield.tipoVenda"
                  :items="itemsVenda"
                  @change="loadItemsDescProduto"
                  dense
                  class="mt-1"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col class="ma-0 pa-0">
              <validation-provider v-slot="{ errors }" name="cod. cidade" rules="required|min:3">
                <v-text-field
                  label="Cód. Cidade"
                  placeholder="Cód. Cidade"
                  v-mask="masks.codContrato"
                  no-data-text="Nada por aqui!"
                  :error-messages="errors"
                  required
                  outlined
                  v-model="formBrownfield.codContrato"
                  dense
                  class="mt-1"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pa-0 ma-0">
              <validation-provider v-slot="{ errors }" name="contrato" rules="required|min:10">
                <v-text-field
                  label="Contrato"
                  placeholder="Contrato"
                  v-mask="masks.contrato"
                  no-data-text="Nada por aqui!"
                  dense
                  outlined
                  :error-messages="errors"
                  required
                  v-model="formBrownfield.contrato"
                  class="mt-1"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="pa-0 ma-0">
              <validation-provider v-slot="{ errors }" name="segmento" rules="required">
                <v-autocomplete
                  dense
                  class="mt-1"
                  label="Segmento"
                  hide-no-data
                  required
                  outlined
                  :error-messages="errors"
                  :items="segmentos"
                  v-model="formBrownfield.segmento"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row class="mx-2" style="gap: 10px">
            <v-col class="ma-0 pa-0">
              <validation-provider v-slot="{ errors }" name="tel. contato" rules="required|min:14">
                <v-text-field
                  dense
                  required
                  outlined
                  :error-messages="errors"
                  v-mask="[masks.telefoneBrMovel, masks.telefoneBrFixo]"
                  v-model="formBrownfield.telefone"
                  class="mt-1"
                  placeholder="Telefone para contato"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="ma-0 pa-0">
              <validation-provider v-slot="{ errors }" name="cliente elegivel" rules="required">
                <v-select
                  :label="
                    formBrownfield.tipoVenda == 'MOVEL'
                      ? 'Cliente elegivel ao Movel'
                      : 'Cliente elegivel ao GPON'
                  "
                  :placeholder="
                    formBrownfield.tipoVenda == 'MOVEL'
                      ? 'Cliente elegivel ao Movel'
                      : 'Cliente elegivel ao GPON'
                  "
                  no-data-text="Nada por aqui!"
                  :error-messages="errors"
                  required
                  outlined
                  dense
                  :items="simNao"
                  class="mt-1"
                  @change="loadItemsClienteElegivel"
                  v-model="formBrownfield.clienteElegivel"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col v-if="formBrownfield.clienteElegivel == 2" class="ma-0 pa-0">
              <validation-provider v-slot="{ errors }" name="motivo" rules="required">
                <v-autocomplete
                  :error-messages="errors"
                  required
                  outlined
                  label="Motivo"
                  placeholder="Motivo"
                  dense
                  hide-no-data
                  class="mt-1"
                  :items="itemsClienteElegivel"
                  v-model="formBrownfield.motivoNaoElegivel"
                  item-text="VALOR"
                  item-value="ID_MICRO"
                  @change="formBrownfield.motivoNaoElegivel == 9 ? loadListSubmotivos() : ''"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col v-if="formBrownfield.motivoNaoElegivel == 9" class="ma-0 pa-0">
              <validation-provider v-slot="{ errors }" name="submotivo" rules="required">
                <v-autocomplete
                  label="Submotivo"
                  placeholder="Submotivo"
                  :error-messages="errors"
                  required
                  outlined
                  dense
                  hide-no-data
                  class="mt-1"
                  :items="itemsSubmotivo"
                  item-text="VALOR"
                  item-value="ID_SUBMOTIVO"
                  v-model="formBrownfield.submotivoNaoAceite"
                ></v-autocomplete>
              </validation-provider>
            </v-col>

            <v-col v-if="formBrownfield.clienteElegivel == 1" class="ma-0 pa-0">
              <validation-provider v-slot="{ errors }" name="aceitou oferta" rules="required">
                <v-autocomplete
                  label="Cliente aceitou oferta?"
                  placeholder="Cliente aceitou oferta?"
                  hide-no-data
                  :error-messages="errors"
                  required
                  outlined
                  :items="simNao"
                  v-model="formBrownfield.clienteAceitou"
                  dense
                  @change="changeTwoLoad"
                  class="mt-1"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col
              class="ma-0 pa-0"
              v-if="formBrownfield.clienteElegivel == 1 && formBrownfield.clienteAceitou == 2"
            >
              <validation-provider v-slot="{ errors }" name="motivo não aceitou" rules="required">
                <v-autocomplete
                  label="Motivo não aceite"
                  placeholder="Motivo não aceite"
                  hide-no-data
                  :error-messages="errors"
                  required
                  outlined
                  :items="itemsMotivoNaoAceite"
                  item-text="VALOR"
                  item-value="ID_MICRO"
                  dense
                  v-model="formBrownfield.motivoNaoAceite"
                  class="mt-1"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col class="ma-0 pa-0" v-if="formBrownfield.clienteAceitou == 1">
              <validation-provider v-slot="{ errors }" name="tipo" rules="required">
                <v-autocomplete
                  label="Tipo"
                  placeholder="Tipo"
                  :error-messages="errors"
                  required
                  hide-no-data
                  dense
                  outlined
                  item-text="VALOR"
                  item-value="ID_TIPOS"
                  :items="itemsTipoMovimentacao"
                  class="mt-1"
                  v-model="formBrownfield.tipoMovimentacao"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row class="mx-2" style="gap: 10px">
            <v-col
              class="ma-0 pa-0"
              v-if="formBrownfield.clienteAceitou == 1 && formBrownfield.tipoMovimentacao"
            >
              <validation-provider v-slot="{ errors }" name="produto" rules="required">
                <v-autocomplete
                  label="Produto"
                  placeholder="Produto"
                  hide-no-data
                  :error-messages="errors"
                  required
                  outlined
                  :items="itemsDescProduto"
                  item-text="DSC_PRODUTO_TABULACAO"
                  dense
                  class="mt-1"
                  v-model="formBrownfield.descProduto"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col
              class="ma-0 pa-0 mt-1"
              v-if="formBrownfield.submotivoNaoAceite == 1 || formBrownfield.descProduto"
            >
              <v-scheduling
                label="Horário da instalação"
                @update:date="dataInstalacao"
              ></v-scheduling>
            </v-col>
          </v-row>
          <v-row class="mx-2" style="gap: 10px" v-if="formBrownfield.motivoNaoAceite == 19">
            <v-col class="ma-0 pa-0">
              <validation-provider v-slot="{ errors }" name="valor plano atual" rules="required">
                <v-text-field
                  label="Valor Plano Atual"
                  placeholder="Valor Plano Atual"
                  :error-messages="errors"
                  required
                  dense
                  outlined
                  class="mt-1"
                  v-mask="['#,##', '##,##', '###,##']"
                  v-model="formBrownfield.valorPlanoAtual"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="ma-0 pa-0">
              <validation-provider v-slot="{ errors }" name="valor caso aceitasse" rules="required">
                <v-text-field
                  label="Valor caso aceitasse"
                  placeholder="Valor caso aceitasse"
                  :error-messages="errors"
                  required
                  dense
                  outlined
                  class="mt-1"
                  v-mask="['#,##', '##,##', '###,##']"
                  v-model="formBrownfield.valorCasoAceitasse"
                ></v-text-field>
              </validation-provider>
            </v-col>
          </v-row>

          <v-divider class="py-3 mt-2"></v-divider>
          <v-row class="pa-2" align="end" justify="end">
            <v-btn
              class="rounded-r-xl rounded-bl-xl mr-2"
              color="success"
              type="submit"
              :disabled="invalid"
            >
              Salvar
            </v-btn>
            <v-btn class="rounded-r-xl rounded-bl-xl" color="error" @click="limparFormulario">
              Limpar
            </v-btn>
          </v-row>
        </form>
      </validation-observer>
    </div>
    <!-- src="http://10.64.175.49:4300/receptivo/index.php/api/arquivos/modelo_smart_sales/comunicado-brown/aviso_brown.jpg" -->
  </v-sheet>
</template>

<script>
  import config from '../../../../../../core/config'
  import { ValidationProvider, ValidationObserver } from 'vee-validate'
  import VScheduling from '../../../../../../shared/components/vuetifyComponents/VScheduling.vue'

  import masks from '../../../../../../shared/masks/masks'
  import alerts from '@/mixins/alerts.mixins'
  export default {
    components: { ValidationProvider, ValidationObserver, VScheduling },
    data: () => ({
      itemsVenda: [{ text: 'MOVEL' }, { text: 'RESIDENCIAL' }, { text: 'TV' }],
      dialogImg: false,
      width: 300,
      simNao: [
        { text: 'Sim', value: 1 },
        { text: 'Não', value: 2 }
      ],
      segmentos: [
        { text: 'PURPLE' },
        { text: 'SEM SEGMENTO' },
        { text: 'WHITE' },
        { text: 'PURPLE INTERNET' },
        { text: 'BLACK' },
        { text: 'PME PURPLE' },
        { text: 'PME ' }
      ],
      itemsClienteElegivel: [],
      itemsMotivoNaoAceite: [],
      itemsTipoMovimentacao: [],
      itemsDescProduto: [],
      itemsSubmotivo: [],
      formBrownfield: {
        tipoVenda: null,
        codContrato: null,
        contrato: null,
        clienteElegivel: null,
        motivoNaoElegivel: null,
        clienteAceitou: null,
        motivoNaoAceite: null,
        tipoMovimentacao: null,
        descProduto: null,
        valorCasoAceitasse: null,
        valorPlanoAtual: null,
        segmento: null,
        telefone: null,
        submotivoNaoAceite: null
      },
      dataInstalacaoCliente: null
    }),
    mixins: [alerts],
    computed: {
      masks() {
        return masks
      },
      almope() {
        return this.$store.getters.usuario.almope
      },
      produto() {
        return this.$store.getters.usuario.produto
      },
      nome() {
        return this.$store.getters.usuario.nome
      }
    },
    mounted() {},
    methods: {
      closeDialog() {
        // Verifica se o clique foi fora da imagem e fecha o v-dialog
        if (this.dialogImg) {
          setTimeout(() => {
            this.dialogImg = false
          }, 1500)
        }
      },
      dataInstalacao(e) {
        this.dataInstalacaoCliente = e
      },
      loadListSubmotivos() {
        let urlData = `${config.baseUrl}api/shared/formularios/brownfield/submotivo_nao_elegivel/${this.formBrownfield.tipoVenda}`
        this.$api.get(urlData).then(res => {
          this.itemsSubmotivo = res.data
        })
      },
      limparFormulario() {
        const novoFormulario = Object.assign({}, this.formBrownfield)
        Object.keys(novoFormulario).forEach(key => (novoFormulario[key] = null))
        this.formBrownfield = novoFormulario
        this.$refs.observer.reset()
      },
      async submit() {
        try {
          let isValid = await this.$refs.observer.validate()
          if (isValid) {
            let urlData = `${config.baseUrl}api/shared/formularios/brownfield/inserir_venda/`
            this.formBrownfield.almope = this.almope
            this.formBrownfield.produto = this.produto
            this.formBrownfield.dataInstalacaoCliente = this.dataInstalacaoCliente
            let getFormData = object =>
              Object.keys(object).reduce((formData, key) => {
                formData.append(key, object[key])
                return formData
              }, new FormData())

            await this.$api.post(urlData, getFormData(this.formBrownfield)).then(res => {
              this.toast(res.data, 'bottom-end', false, 3000, 'success')
              this.limparFormulario()
            })
          }
        } catch (error) {
          if (error.response) {
            this.toast(error.response.data, 'bottom-end', false, 3000, 'error')
          }
        }
      },
      loadItemsClienteElegivel() {
        let urlData = `${config.baseUrl}api/shared/formularios/brownfield/cliente_elegivel/${this.formBrownfield.clienteElegivel}/${this.formBrownfield.tipoVenda}`
        this.$api.get(urlData).then(res => {
          this.itemsClienteElegivel = res.data
        })
      },
      loadItemsMotivosNaoAceite() {
        let urlData = `${config.baseUrl}api/shared/formularios/brownfield/motivo_nao_aceite/${this.formBrownfield.clienteAceitou}/${this.formBrownfield.tipoVenda}`
        this.$api.get(urlData).then(res => {
          this.itemsMotivoNaoAceite = res.data
        })
      },
      loadItemsTiposMovimentacao() {
        let urlData = `${config.baseUrl}api/shared/formularios/brownfield/tipo_movimentacao/${this.formBrownfield.clienteAceitou}/${this.formBrownfield.tipoVenda}`
        this.$api.get(urlData).then(res => {
          this.itemsTipoMovimentacao = res.data
        })
      },
      loadItemsDescProduto() {
        let urlData = `${config.baseUrl}api/shared/formularios/brownfield/desc_produto/${this.formBrownfield.tipoVenda}`
        this.$api.get(urlData).then(res => {
          this.itemsDescProduto = res.data
        })
      },
      changeTwoLoad() {
        this.loadItemsMotivosNaoAceite(), this.loadItemsTiposMovimentacao()
      }
    },
    created() {
      this.dialogImg = true
    },
    watch: {
      'formBrownfield.clienteElegivel': function (newVal, oldVal) {
        if (oldVal !== newVal) {
          ;(this.formBrownfield.motivoNaoElegivel = null),
            (this.formBrownfield.clienteAceitou = null),
            (this.formBrownfield.motivoNaoAceite = null),
            (this.formBrownfield.tipoMovimentacao = null),
            (this.formBrownfield.descProduto = null)
        }
      },

      'formBrownfield.clienteAceitou': function (newVal, oldVal) {
        if (oldVal !== newVal) {
          ;(this.formBrownfield.motivoNaoAceite = null),
            (this.formBrownfield.tipoMovimentacao = null),
            (this.formBrownfield.descProduto = null)
        }
      },
      'formBrownfield.tipoVenda': function (newVal, oldVal) {
        if (oldVal !== newVal) {
          ;(this.formBrownfield.motivoNaoAceite = null),
            (this.formBrownfield.tipoMovimentacao = null),
            (this.formBrownfield.descProduto = null)
          this.formBrownfield.clienteAceitou = null
          this.formBrownfield.clienteElegivel = null
        }
      }
    }
  }
</script>

<style scoped>
  .foo {
    margin-bottom: -25px;
  }

  /* Yoinked from CodePen, but improved the animation
so that it is smooth among other more minor things */

  .codepen-button {
    display: block;
    cursor: pointer;
    color: white;
    margin: 0 auto;
    margin-right: 10px;
    position: relative;
    text-decoration: none;
    font-weight: 600;
    border-radius: 6px;
    overflow: hidden;
    padding: 3px;
    isolation: isolate;
  }

  .codepen-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 400%;
    height: 100%;
    background: linear-gradient(115deg, #fad648, #fdfdfd, #ffcd06, #ffcd06);
    background-size: 25% 100%;
    animation-play-state: running;
    animation: an-at-keyframe-css-at-rule-that-translates-via-the-transform-property-the-background-by-negative-25-percent-of-its-width-so-that-it-gives-a-nice-border-animation_-We-use-the-translate-property-to-have-a-nice-transition-so-it_s-not-a-jerk-of-a-start-or-stop
      0.75s linear infinite;
    translate: -5% 0%;
    transition: translate 0.25s inde;
  }

  .codepen-button:hover::before {
    animation-play-state: running;
    transition-duration: 0.75s;
    translate: 0% 0%;
  }

  @keyframes an-at-keyframe-css-at-rule-that-translates-via-the-transform-property-the-background-by-negative-25-percent-of-its-width-so-that-it-gives-a-nice-border-animation_-We-use-the-translate-property-to-have-a-nice-transition-so-it_s-not-a-jerk-of-a-start-or-stop {
    to {
      transform: translateX(-25%);
    }
  }

  .codepen-button span {
    position: relative;
    display: block;
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
    background: #000;
    border-radius: 3px;
    height: 100%;
  }
</style>
