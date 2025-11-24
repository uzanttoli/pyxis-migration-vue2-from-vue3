<template>
  <v-card>
    <title-negative-margin
      title="Piloto Financeiro"
      className="rounded-r-xl"
    ></title-negative-margin>
    <v-col>
      <validation-observer v-slot="{ validate, invalid }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-row>
            <v-col cols="4">
              <validation-provider v-slot="{ errors }" rules="required|min:14" name="contrato">
                <v-text-field
                  outlined
                  dense
                  :error-messages="errors"
                  label="Contrato"
                  placeholder="Contrato"
                  v-model="form.contrato"
                  v-mask="['###/########-#']"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4">
              <validation-provider v-slot="{ errors }" rules="required" name="motivo ligação">
                <v-autocomplete
                  outlined
                  dense
                  :error-messages="errors"
                  label="Qual motivo da ligação?"
                  placeholder="Qual motivo da ligação?"
                  no-data-text="Não há itens"
                  :items="motivosLigacao"
                  v-model="form.motivoLigacao"
                  item-text="DESCRICAO"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="4" v-if="exibirDemaisCampos">
              <validation-provider v-slot="{ errors }" rules="required" name="transferir retenção">
                <v-autocomplete
                  outlined
                  dense
                  label="Foi necessário transferir para retenção?"
                  placeholder="Foi necessário transferir para retenção?"
                  :error-messages="errors"
                  no-data-text="Não há itens"
                  v-model="form.transferirRetencao"
                  :items="itemsSimNao"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="4" v-if="exibirDemaisCampos && form.transferirRetencao == 'NÃO'">
              <validation-provider v-slot="{ errors }" rules="required" name="oferta reclamada">
                <v-autocomplete
                  outlined
                  dense
                  label="A oferta reclamada pelo cliente foi localizada?"
                  placeholder="A oferta reclamada pelo cliente foi localizada?"
                  :error-messages="errors"
                  no-data-text="Não há itens"
                  v-model="form.ofertaReclamadaLocalizada"
                  :items="itemsSimNao"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col
              cols="4"
              class="mt-n7"
              v-if="
                exibirDemaisCampos &&
                form.transferirRetencao == 'NÃO' &&
                form.ofertaReclamadaLocalizada == 'NÃO'
              "
            >
              <validation-provider v-slot="{ errors }" rules="required" name="aceitou nova oferta">
                <v-autocomplete
                  outlined
                  dense
                  label="Cliente aceitou a nova oferta?"
                  placeholder="Cliente aceitou a nova oferta?"
                  :error-messages="errors"
                  no-data-text="Não há itens"
                  v-model="form.novaOferta"
                  :items="itemsSimNao"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col
              cols="4"
              class="mt-n7"
              v-if="exibirDemaisCampos && form.transferirRetencao == 'NÃO' && form.novaOferta"
            >
              <validation-provider v-slot="{ errors }" rules="required" name="oferta de R$20">
                <v-autocomplete
                  outlined
                  dense
                  label="Foi necessário utilizar a oferta de R$20?"
                  placeholder="Foi necessário utilizar a oferta de R$20?"
                  :error-messages="errors"
                  no-data-text="Não há itens"
                  v-model="form.oferta20"
                  :items="itemsSimNao"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col
              cols="4"
              class="mt-n7"
              v-if="
                exibirDemaisCampos && form.transferirRetencao == 'NÃO' && form.novaOferta == 'NÃO'
              "
            >
              <validation-provider
                v-slot="{ errors }"
                rules="required"
                name="necessário gerar caso p/ bko"
              >
                <v-autocomplete
                  outlined
                  dense
                  label="Foi necessário gerar um caso para BKO?"
                  placeholder="Foi necessário gerar um caso para BKO?"
                  :error-messages="errors"
                  no-data-text="Não há itens"
                  v-model="form.gerarCasoBko"
                  :items="itemsSimNao"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="12" class="mt-n7">
              <validation-provider v-slot="{ errors }" rules="required|max:250" name="observação">
                <v-textarea
                  outlined
                  dense
                  :error-messages="errors"
                  label="Observação"
                  placeholder="Observação"
                  v-model="form.observacao"
                  counter="250"
                  maxlength="250"
                ></v-textarea>
              </validation-provider>
            </v-col>
          </v-row>
          <v-btn :disabled="invalid" color="success" type="submit" class="mr-2" :loading="loading">
            Salvar
          </v-btn>
          <v-btn color="error" @click="limparForm">Limpar</v-btn>
        </form>
      </validation-observer>
    </v-col>
  </v-card>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import config from '../../../../core/config'
  import alerts from '../../../../mixins/alerts.mixins'
  export default {
    components: { ValidationObserver, ValidationProvider },
    data: () => ({
      motivosLigacao: [],
      itemsSimNao: ['SIM', 'NÃO'],
      loading: false,
      form: {
        motivoLigacao: null,
        transferirRetencao: null,
        ofertaReclamadaLocalizada: null,
        novaOferta: null,
        oferta20: null,
        gerarCasoBko: null,
        observacao: null,
        contrato: null
      }
    }),
    mixins: [alerts],
    computed: {
      exibirDemaisCampos() {
        let dadosMotivos = this.motivosLigacao
        let dados = dadosMotivos.filter(item => {
          return item.DESCRICAO == this.form.motivoLigacao
        })
        return dados[0] ? dados[0].ID_PARENT : false
      },
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      async submit() {
        try {
          this.loading = true
          this.form.almope = this.usuario.almope
          let urlData = `${config.baseUrl}api/shared/formularios/piloto_financeiro/tabulacao`
          await this.$api.post(urlData, this.form)
          this.toast('Tabulação salva com sucesso!', 'top-rigth', false, 2500, 'success')
          this.loading = false
          this.limparForm()
        } catch (e) {
          this.toast('Tabulação não foi salva! Tente novamente.', 'top-rigth', false, 2500, 'error')
        }
      },
      loadMotivosLigacao() {
        let urlData = `${config.baseUrl}api/shared/formularios/piloto_financeiro/motivos`
        this.$api.get(urlData).then(res => {
          this.motivosLigacao = res.data
        })
      },
      limparForm() {
        let newForm = Object.assign({}, this.form)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.form = newForm
        this.$refs.observer.reset()
      }
    },
    created() {
      this.loadMotivosLigacao()
    }
  }
</script>

<style></style>
