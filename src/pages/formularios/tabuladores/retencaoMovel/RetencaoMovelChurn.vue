s
<template>
  <v-card>
    <title-negative-margin
      title="Tabulador | Churn"
      icon="mdi-account-alert"
      className="rounded-r-xl"
    ></title-negative-margin>
    <v-col>
      <ValidationObserver v-slot="{ invalid, validate }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-row>
            <v-col cols="3" class="py-0">
              <ValidationProvider name="MSISDN" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="form.msisdn"
                  label="MSISDN"
                  placeholder="MSISDN"
                  :error-messages="errors"
                  v-mask="masks.phone"
                  dense
                  outlined
                ></v-text-field>
              </ValidationProvider>
            </v-col>
            <v-col cols="3" class="py-0">
              <ValidationProvider name="Protocolo" rules="required" v-slot="{ errors }">
                <v-text-field
                  v-model="form.protocolo"
                  label="Protocolo"
                  placeholder="Protocolo"
                  :error-messages="errors"
                  v-mask="['###############']"
                  dense
                  outlined
                ></v-text-field>
              </ValidationProvider>
            </v-col>
            <v-col cols="3" class="py-0">
              <ValidationProvider name="Motivo Contato" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  v-model="form.motivo_contato"
                  label="Motivo contato"
                  placeholder="Motivo contato"
                  :error-messages="errors"
                  dense
                  outlined
                  :items="Items.motivoContato"
                ></v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col cols="3" class="py-0">
              <ValidationProvider name="Segmento" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  v-model="form.segmento"
                  label="Segmento do cliente"
                  placeholder="Segmento do cliente"
                  :error-messages="errors"
                  dense
                  outlined
                  :items="Items.segmentoCliente"
                ></v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col cols="4" class="py-0">
              <ValidationProvider name="Contato claro" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  v-model="form.contato_claro"
                  label="Cliente recebeu contato da claro?"
                  placeholder="Cliente recebeu contato da claro?"
                  :error-messages="errors"
                  dense
                  outlined
                  :items="Items.contatoClaro"
                ></v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col cols="4" class="py-0">
              <ValidationProvider name="reajuste" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  v-model="form.reajuste_alteracao_plano"
                  label="Cliente teve reajuste ou alteração de plano?"
                  placeholder="Cliente teve reajuste ou alteração de plano?"
                  :error-messages="errors"
                  dense
                  outlined
                  :items="Items.reajusteAlteracaoPlano"
                ></v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col cols="4" class="py-0">
              <ValidationProvider name="dependente" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  v-model="form.dependente_titular"
                  label="Cliente é dependente ou titular?"
                  placeholder="Cliente é dependente ou titular?"
                  :error-messages="errors"
                  dense
                  outlined
                  :items="Items.tipoCliente"
                ></v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col cols="4" class="py-0">
              <ValidationProvider name="termino desconto" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  v-model="form.termino_desconto"
                  label="Houve término de desconto?"
                  placeholder="Houve término de desconto?"
                  :error-messages="errors"
                  dense
                  outlined
                  :items="Items.terminoDesconto"
                ></v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col cols="4" class="py-0">
              <ValidationProvider name="migracao" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  v-model="form.migracao_compulsoria"
                  label="Foi migração compulsória?"
                  placeholder="Foi migração compulsória?"
                  :error-messages="errors"
                  dense
                  outlined
                  :items="Items.migracaoCompulsoria"
                ></v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col cols="4" class="py-0">
              <ValidationProvider name="resolucao atendimento" rules="required" v-slot="{ errors }">
                <v-autocomplete
                  v-model="form.resolucao_atendimento"
                  label="Resolução do atendimento"
                  placeholder="Resolução do atendimento"
                  :error-messages="errors"
                  dense
                  outlined
                  :items="Items.resolucaoAtendimento"
                ></v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col cols="12" class="py-0">
              <ValidationProvider name="observacao" rules="" v-slot="{ errors }">
                <v-textarea
                  v-model="form.observacao"
                  label="Resolução do atendimento"
                  placeholder="Resolução do atendimento"
                  :error-messages="errors"
                  dense
                  outlined
                  :items="Items.observacao"
                ></v-textarea>
              </ValidationProvider>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <div style="display: flex; justify-content: end; margin-top: 1rem">
            <v-btn
              type="submit"
              :disabled="invalid"
              color="success"
              class="mr-1"
              :loading="loading"
            >
              Salvar
            </v-btn>
            <v-btn color="error" @click="clearForm">Limpar</v-btn>
          </div>
        </form>
      </ValidationObserver>
    </v-col>
  </v-card>
</template>

<script>
  import items from './items.json'
  import masks from '@/shared/masks/masks'
  import { UtilitariosService } from '@/data/services/tabuladores'
  import { EventBus } from '@/eventBus'
  export default {
    data() {
      return {
        form: {
          msisdn: null,
          protocolo: null,
          motivo_contato: null,
          segmento: null,
          contato_claro: null,
          reajuste_alteracao_plano: null,
          dependente_titular: null,
          termino_desconto: null,
          migracao_compulsoria: null,
          resolucao_atendimento: null,
          observacao: null
        },
        loading: false
      }
    },
    computed: {
      Items() {
        return items
      },
      masks() {
        return masks
      },
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      clearForm() {
        let newForm = Object.assign({}, this.form)
        Object.keys(newForm).forEach(key => {
          newForm[key] = null
        })
        this.form = newForm
        this.$refs.observer.reset()
      },
      async submit() {
        this.loading = true
        let formTabulacao = {
          idForm: '1F950067-CCC8-4E6C-A73B-88DB8AF3481E',
          analiseCaso: [{ ...this.form }],
          usuario: this.usuario.almope
        }
        await UtilitariosService.processarTabulacao(formTabulacao)
        EventBus.$emit('snackbar', { text: 'Cadastro realizado com sucesso', color: 'success' })
        this.clearForm()
        this.loading = false
      }
    }
  }
</script>

<style></style>
