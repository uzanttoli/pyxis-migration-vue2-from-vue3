<template>
  <v-card>
    <title-negative-margin title="Formulário MDU" className="rounded-r-xl"></title-negative-margin>
    <v-col>
      <div
        style="
          border-bottom: 1px solid #3333;
          padding: 10px 0;
          margin-bottom: 10px;
          margin-top: -25px;
        "
      >
        <v-icon color="red">fa-solid fa-heart-pulse</v-icon>
        {{ `Olá ${usuario.nome}, tenha um excelente dia de vendas!` }}
      </div>
      <validation-observer ref="observer" v-slot="{ invalid }">
        <form @submit.prevent="submit">
          <v-row>
            <v-col cols="4">
              <validation-provider v-slot="{ errors }" name="venda" rules="required">
                <v-autocomplete
                  id="venda"
                  label="Venda"
                  placeholder="Venda"
                  hide-no-data
                  required
                  outlined
                  :error-messages="errors"
                  v-model="formMDU.tipoVenda"
                  :items="itemsVenda"
                  dense
                  class="mt-1"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="4">
              <validation-provider v-slot="{ errors }" name="cod. cidade" rules="required|min:3">
                <v-text-field
                  label="Cód. Cidade"
                  placeholder="Cód. Cidade"
                  v-mask="masks.codContrato"
                  no-data-text="Nada por aqui!"
                  :error-messages="errors"
                  required
                  outlined
                  v-model="formMDU.codContrato"
                  dense
                  class="mt-1"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4">
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
                  v-model="formMDU.contrato"
                  class="mt-1"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4" class="mt-n7">
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
                  v-model="formMDU.segmento"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="4" class="mt-n7">
              <validation-provider v-slot="{ errors }" name="tel. contato" rules="required|min:14">
                <v-text-field
                  dense
                  required
                  outlined
                  :error-messages="errors"
                  v-mask="[masks.telefoneBrMovel, masks.telefoneBrFixo]"
                  v-model="formMDU.telefone"
                  class="mt-1"
                  placeholder="Número para contato"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="mt-n7" cols="4">
              <validation-provider v-slot="{ errors }" name="cliente marcado" rules="required">
                <v-autocomplete
                  label="Cliente Marcado?"
                  placeholder="Cliente Marcado?"
                  hide-no-data
                  :error-messages="errors"
                  required
                  outlined
                  :items="simNao"
                  item-text="text"
                  v-model="formMDU.clienteMarcado"
                  item-value="value"
                  dense
                  class="mt-1"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col class="mt-n7" cols="4" v-if="formMDU.tipoVenda">
              <validation-provider
                v-slot="{ errors }"
                name="cliente aceitou oferta"
                rules="required"
              >
                <v-autocomplete
                  label="Cliente aceitou oferta?"
                  placeholder="Cliente aceitou oferta?"
                  hide-no-data
                  :error-messages="errors"
                  required
                  outlined
                  :items="simNao"
                  v-model="formMDU.aceitouOferta"
                  @change="
                    formMDU.aceitouOferta == 2 && formMDU.tipoVenda
                      ? loadItemsMotivosNaoAceite()
                      : false
                  "
                  item-text="text"
                  item-value="value"
                  dense
                  class="mt-1"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col class="mt-n7" v-if="formMDU.aceitouOferta == 1">
              <validation-provider v-slot="{ errors }" name="abertura do caso" rules="required">
                <v-autocomplete
                  label="Houve abertura do caso?"
                  placeholder="Houve abertura do caso?"
                  hide-no-data
                  :error-messages="errors"
                  required
                  outlined
                  :items="simNao"
                  item-text="text"
                  v-model="formMDU.houveAberturaCaso"
                  item-value="value"
                  dense
                  class="mt-1"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col class="mt-n7" v-if="formMDU.aceitouOferta == 2 && formMDU.tipoVenda">
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
                  v-model="formMDU.motivoNaoAceite"
                  class="mt-1"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
          </v-row>
          <v-row class="pa-2" align="end" justify="end">
            <v-btn
              class="rounded-r-xl rounded-bl-xl mr-2"
              color="success"
              type="submit"
              :disabled="invalid"
              :loading="loading"
            >
              Salvar
            </v-btn>
            <v-btn class="rounded-r-xl rounded-bl-xl" color="error" @click="limparFormulario">
              Limpar
            </v-btn>
          </v-row>
        </form>
      </validation-observer>
    </v-col>
  </v-card>
</template>

<script>
  import config from '../../../../../core/config'
  import { ValidationProvider, ValidationObserver } from 'vee-validate'

  import masks from '../../../../../shared/masks/masks'
  import alerts from '@/mixins/alerts.mixins'
  export default {
    components: { ValidationProvider, ValidationObserver },
    data: () => ({
      itemsVenda: [{ text: 'MOVEL' }, { text: 'RESIDENCIAL' }],
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
      itemsMotivoNaoAceite: [],
      formMDU: {
        tipoVenda: null,
        codContrato: null,
        contrato: null,
        clienteElegivel: null,
        motivoNaoElegivel: null,
        clienteAceitou: null,
        motivoNaoAceite: null,
        tipoMovimentacao: null,
        aceitouOferta: null,
        clienteMarcado: null,
        descProduto: null,
        valorCasoAceitasse: null,
        valorPlanoAtual: null,
        segmento: null,
        telefone: null,
        houveAberturaCaso: null
      },
      loading: false
    }),
    mixins: [alerts],
    computed: {
      masks() {
        return masks
      },
      usuario() {
        return this.$store.getters.usuario
      }
    },
    mounted() {},
    methods: {
      closeDialog() {
        if (this.dialogImg) {
          setTimeout(() => {
            this.dialogImg = false
          }, 1500)
        }
      },
      dataInstalacao(e) {
        this.dataInstalacaoCliente = e
      },
      limparFormulario() {
        const novoFormulario = Object.assign({}, this.formMDU)
        Object.keys(novoFormulario).forEach(key => (novoFormulario[key] = null))
        this.formMDU = novoFormulario
        this.$refs.observer.reset()
      },
      loadItemsMotivosNaoAceite() {
        let urlData = `${config.baseUrl}api/shared/formularios/brownfield/motivo_nao_aceite/${this.formMDU.aceitouOferta}/${this.formMDU.tipoVenda}`
        this.$api.get(urlData).then(res => {
          this.itemsMotivoNaoAceite = res.data
        })
      },
      async submit() {
        try {
          this.loading = true
          let isValid = await this.$refs.observer.validate()
          if (isValid) {
            this.formMDU.almopeUsuario = this.usuario.almope
            let urlData = `${config.baseUrl}api/shared/formularios/vendas_mdu/tabulacao`
            await this.$api.post(urlData, this.formMDU)
            this.limparFormulario()
            this.toast('Dados salvos com sucesso!', 'bottom-end', false, 2500, 'success')
            this.loading = false
          }
        } catch (error) {
          if (error.response) {
            this.toast(error.response.data, 'bottom-end', false, 3000, 'error')
            this.loading = false
          }
        }
      },

      changeTwoLoad() {
        this.loadItemsMotivosNaoAceite()
      }
    },
    created() {
      this.dialogImg = true
    },
    watch: {}
  }
</script>

<style scoped>
  .foo {
    margin-bottom: -25px;
  }

  /* Yoinked from CodePen, but improved the animation so that it is smooth among other more minor things */

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
