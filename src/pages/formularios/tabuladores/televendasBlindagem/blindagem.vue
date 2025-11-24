<template>
  <v-card>
    <title-negative-margin
      title="Vendas Blindagem"
      className="rounded-r-xl"
    ></title-negative-margin>
    <v-col>
      <validation-observer v-slot="{ invalid, validate }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-row>
            <v-col cols="3" class="my-0 py-0">
              <validation-provider v-slot="{ errors }" name="tipo venda" rules="required">
                <v-select
                  outlined
                  dense
                  placeholder="Tipo venda"
                  label="Tipo venda"
                  :items="itemsVenda"
                  @change="formBlindagem.clienteElegivel ? loadItemsNaoElegibilidade() : false"
                  :error-messages="errors"
                  required
                  v-model="formBlindagem.tipoVenda"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <validation-provider v-slot="{ errors }" name="cód. contrato" rules="required|min:3">
                <v-text-field
                  outlined
                  dense
                  placeholder="Cód. Contrato"
                  label="Cód. Contrato"
                  :error-messages="errors"
                  required
                  v-model="formBlindagem.codContrato"
                  v-mask="['###']"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <validation-provider v-slot="{ errors }" name="núm. contrato" rules="required|min:10">
                <v-text-field
                  outlined
                  dense
                  placeholder="Núm. Contrato"
                  label="Núm. Contrato"
                  :error-messages="errors"
                  required
                  v-model="formBlindagem.numContrato"
                  v-mask="[masks.contrato]"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <validation-provider v-slot="{ errors }" name="segmento" rules="required">
                <v-autocomplete
                  outlined
                  dense
                  placeholder="Segmento"
                  label="Segmento"
                  :items="segmentos"
                  :error-messages="errors"
                  required
                  v-model="formBlindagem.segmento"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <validation-provider v-slot="{ errors }" name="" rules="required|min:14">
                <v-text-field
                  outlined
                  dense
                  placeholder="Telefone contato"
                  label="Telefone contato"
                  :error-messages="errors"
                  required
                  v-model="formBlindagem.telefoneContato"
                  v-mask="[masks.telefoneBrFixo, masks.telefoneBrMovel]"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-0 py-0">
              <validation-provider v-slot="{ errors }" name="cliente elegivel" rules="required">
                <v-select
                  outlined
                  dense
                  placeholder="Cliente Elegivel?"
                  label="Cliente Elegivel?"
                  :items="simNao"
                  item-text="text"
                  @change="formBlindagem.tipoVenda ? loadItemsNaoElegibilidade() : false"
                  item-value="value"
                  :error-messages="errors"
                  required
                  v-model="formBlindagem.clienteElegivel"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-0 py-0" v-if="formBlindagem.clienteElegivel == 2">
              <validation-provider
                v-slot="{ errors }"
                name="motivo não elegibilidade"
                rules="required"
              >
                <v-autocomplete
                  outlined
                  dense
                  placeholder="Motivo não elegibilidade"
                  label="Motivo não elegibilidade"
                  :error-messages="errors"
                  :items="itemsNaoElegibilidade"
                  item-text="VALOR"
                  item-value="ID_MICRO"
                  no-data-text="Nada por aqui!"
                  @change="
                    formBlindagem.motivoNaoElegibilidade == 9
                      ? loadItemsSubmotivoNaoElegibilidade()
                      : false
                  "
                  required
                  v-model="formBlindagem.motivoNaoElegibilidade"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-0 py-0" v-if="formBlindagem.motivoNaoElegibilidade == 9">
              <validation-provider
                v-slot="{ errors }"
                name="submotivo não elegibilidade"
                rules="required"
              >
                <v-autocomplete
                  outlined
                  dense
                  placeholder="SubMotivo não elegibilidade"
                  label="SubMotivo não elegibilidade"
                  :error-messages="errors"
                  no-data-text="Nada por aqui!"
                  required
                  :items="itemsSubmotivoNaoElegibilidade"
                  item-text="VALOR"
                  item-value="ID_SUBMOTIVO"
                  v-model="formBlindagem.subMotivoNaoElegibilidade"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-0 py-0" v-if="formBlindagem.clienteElegivel == 1">
              <validation-provider v-slot="{ errors }" name="cliente aceitou" rules="required">
                <v-select
                  outlined
                  dense
                  placeholder="Cliente aceitou?"
                  label="Cliente aceitou?"
                  :error-messages="errors"
                  :items="simNao"
                  required
                  @change="
                    formBlindagem.clienteAceitou == 1
                      ? loadItemsTiposMovimentacao()
                      : loadItemsMotivosNaoAceite()
                  "
                  v-model="formBlindagem.clienteAceitou"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-0 py-0" v-if="formBlindagem.clienteAceitou == 2">
              <validation-provider v-slot="{ errors }" name="motivo não aceite" rules="required">
                <v-select
                  outlined
                  dense
                  placeholder="Motivo não aceite?"
                  label="Motivo não aceite?"
                  item-text="VALOR"
                  item-value="ID_MICRO"
                  no-data-text="Nada por aqui!"
                  :error-messages="errors"
                  :items="itemsMotivoNaoAceite"
                  required
                  v-model="formBlindagem.motivoNaoAceite"
                ></v-select>
              </validation-provider>
            </v-col>
            <v-col cols="3" class="my-0 py-0" v-if="formBlindagem.clienteAceitou == 1">
              <validation-provider v-slot="{ errors }" name="movimentação" rules="required">
                <v-autocomplete
                  outlined
                  dense
                  placeholder="Tipo movimentação"
                  label="Tipo movimentação"
                  :error-messages="errors"
                  :items="itemsTipoMovimentacao"
                  item-text="VALOR"
                  item-value="ID_TIPOS"
                  required
                  v-model="formBlindagem.tipoMovimentacao"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col style="margin-top: -12px" v-if="formBlindagem.tipoMovimentacao">
              <component-agendamento
                label="Data da instalação"
                @update:date="dataInstalacao"
              ></component-agendamento>
            </v-col>
          </v-row>
          <div style="display: flex; gap: 5px">
            <v-btn type="submit" :disabled="invalid" color="success">Salvar</v-btn>
            <v-btn @click="limparForm" color="error">Limpar</v-btn>
          </div>
        </form>
      </validation-observer>
    </v-col>
  </v-card>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import config from '../../../../core/config'
  import VScheduling from '../../../../shared/components/vuetifyComponents/VScheduling.vue'
  import alerts from '../../../../mixins/alerts.mixins'
  import masks from '../../../../shared/masks/masks'
  export default {
    components: {
      ValidationObserver,
      ValidationProvider,
      componentAgendamento: VScheduling
    },
    data: () => ({
      formBlindagem: {
        tipoVenda: null,
        codContrato: null,
        numContrato: null,
        clienteElegivel: null,
        motivoNaoElegibilidade: null,
        subMotivoNaoElegibilidade: null,
        clienteAceitou: null,
        segmento: null,
        telefoneContato: null,
        tipoMovimentacao: null,
        motivoNaoAceite: null
      },
      itemsVenda: [{ text: 'MOVEL' }, { text: 'RESIDENCIAL' }],
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
      itemsNaoElegibilidade: [],
      itemsSubmotivoNaoElegibilidade: [],
      itemsTipoMovimentacao: [],
      itemsMotivoNaoAceite: [],
      dataInstalacaoCliente: null
    }),
    mixins: [alerts],
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      masks() {
        return masks
      }
    },
    methods: {
      async submit() {
        try {
          this.formBlindagem.dataInstalacao = this.dataInstalacaoCliente
          this.formBlindagem.almope = this.usuario.almope
          let urlData = `${config.baseUrl}api/shared/formularios/vendas_blindagem/cadastrar`
          await this.$api.post(urlData, this.formBlindagem)
          this.toast('Cadastro realizado com sucesso!', 'top-right', false, 2500, 'success')
          this.limparForm()
        } catch (error) {
          if (error.response) {
            this.toast(error.response.data, 'bottom-end', false, 3000, 'error')
          }
        }
      },
      dataInstalacao(e) {
        this.dataInstalacaoCliente = e
      },
      limparForm() {
        for (let key in this.formBlindagem) {
          this.formBlindagem[key] = null
        }
        this.dataInstalacaoCliente = null
        this.$refs.observer.reset()
      },
      loadItemsNaoElegibilidade() {
        let urlData = `${config.baseUrl}api/shared/formularios/brownfield/cliente_elegivel/${this.formBlindagem.clienteElegivel}/${this.formBlindagem.tipoVenda}`
        this.$api.get(urlData).then(res => {
          this.itemsNaoElegibilidade = res.data
        })
      },
      loadItemsSubmotivoNaoElegibilidade() {
        let urlData = `${config.baseUrl}api/shared/formularios/brownfield/submotivo_nao_elegivel/${this.formBlindagem.tipoVenda}`
        this.$api.get(urlData).then(res => {
          this.itemsSubmotivoNaoElegibilidade = res.data
        })
      },
      loadItemsTiposMovimentacao() {
        let urlData = `${config.baseUrl}api/shared/formularios/brownfield/tipo_movimentacao/${this.formBlindagem.clienteAceitou}/${this.formBlindagem.tipoVenda}`
        this.$api.get(urlData).then(res => {
          this.itemsTipoMovimentacao = res.data
        })
      },
      loadItemsMotivosNaoAceite() {
        let urlData = `${config.baseUrl}api/shared/formularios/brownfield/motivo_nao_aceite/${this.formBlindagem.clienteAceitou}/${this.formBlindagem.tipoVenda}`
        this.$api.get(urlData).then(res => {
          this.itemsMotivoNaoAceite = res.data
        })
      }
    },
    created() {},
    watch: {
      'formBlindagem.clienteElegivel': function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.motivoNaoElegibilidade = null
          this.subMotivoNaoElegibilidade = null
          this.clienteAceitou = null
          this.tipoMovimentacao = null
          this.motivoNaoAceite = null
        }
      },
      'formBlindagem.clienteAceitou': function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.tipoMovimentacao = null
          this.motivoNaoAceite = null
        }
      }
    }
  }
</script>

<style></style>
