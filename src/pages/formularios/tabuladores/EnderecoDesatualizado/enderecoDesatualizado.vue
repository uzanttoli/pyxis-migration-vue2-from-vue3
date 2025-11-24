<template>
  <v-card>
    <title-negative-margin title="Endereço desatualizado"></title-negative-margin>
    <v-col>
      <ValidationObserver v-slot="{ invalid, validate }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-row>
            <v-col cols="4">
              <ValidationProvider v-slot="{ errors }" name="telefone ligou" rules="required|min:14">
                <v-text-field
                  placeholder="Telefone que ligou"
                  label="Telefone que ligou"
                  :error-messages="errors"
                  outlined
                  required
                  dense
                  v-model="form.telefoneLigou"
                  v-mask="masks.phone"
                ></v-text-field>
              </ValidationProvider>
            </v-col>
            <v-col cols="4">
              <ValidationProvider
                v-slot="{ errors }"
                name="telefone atendimento"
                rules="required|min:14"
              >
                <v-text-field
                  placeholder="Telefone que solicitou atendimento"
                  label="Telefone que solicitou atendimento"
                  :error-messages="errors"
                  outlined
                  required
                  dense
                  v-model="form.telefoneSolicitouAtendimento"
                  v-mask="masks.phone"
                ></v-text-field>
              </ValidationProvider>
            </v-col>
            <v-col cols="4">
              <ValidationProvider
                v-slot="{ errors }"
                name="skill ligação"
                rules="required"
                :error-messages="errors"
              >
                <v-autocomplete
                  placeholder="Qual skill entrou na ligação?"
                  label="Qual skill entrou na ligação?"
                  :error-messages="errors"
                  outlined
                  dense
                  required
                  v-model="form.qualSkillLigacao"
                  :items="skill"
                ></v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col cols="4">
              <ValidationProvider
                v-slot="{ errors }"
                name="confirmação de endereço"
                rules="required"
              >
                <v-autocomplete
                  placeholder="A confirmação se o endereço cadastrado está correto foi feita?"
                  label="A confirmação se o endereço cadastrado está correto foi feita?"
                  :error-messages="errors"
                  outlined
                  dense
                  required
                  :items="confirmacao"
                  v-model="form.confirmacaoEnderecoCadastradoCorretamente"
                ></v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col cols="4">
              <ValidationProvider v-slot="{ errors }" name="endereço correto" rules="required">
                <v-autocomplete
                  placeholder="O endereço está correto?"
                  label="O endereço está correto?"
                  :error-messages="errors"
                  outlined
                  dense
                  required
                  :items="confirmacao"
                  v-model="form.enderecoEstaCorreto"
                ></v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col cols="4" v-if="form.enderecoEstaCorreto == 'NÃO'">
              <ValidationProvider v-slot="{ errors }" name="correção realizada" rules="required">
                <v-autocomplete
                  placeholder="Procedimento de correção de endereço foi realizado?"
                  label="Procedimento de correção de endereço foi realizado?"
                  :error-messages="errors"
                  outlined
                  dense
                  required
                  :items="confirmacao"
                  v-model="form.correcaoRealizada"
                ></v-autocomplete>
              </ValidationProvider>
            </v-col>
            <v-col cols="12" v-if="form.correcaoRealizada == 'NÃO'">
              <ValidationProvider v-slot="{ errors }" name="motivo" rules="required">
                <v-textarea
                  placeholder="Se não foi realizado, qual o motivo?"
                  label="Se não foi realizado, qual o motivo?"
                  :error-messages="errors"
                  outlined
                  dense
                  required
                  v-model="form.porqueNaoFoiRealizadaCorrecao"
                ></v-textarea>
              </ValidationProvider>
            </v-col>
          </v-row>
          <div class="d-flex gap-2">
            <v-btn type="submit" color="success" :disabled="invalid">Salvar</v-btn>
            <v-btn color="error" @click="clearForm">Limpar</v-btn>
          </div>
        </form>
      </ValidationObserver>
    </v-col>
  </v-card>
</template>

<script>
  import { EnderecoDesatualizadoService } from '@/data/services/tabuladores'
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import alerts from '@/mixins/alerts.mixins'
  import masks from '@/shared/masks/masks'
  export default {
    name: 'EnderecoDesatualizado',
    components: {
      ValidationObserver,
      ValidationProvider
    },
    data: () => ({
      form: {
        telefoneLigou: null,
        telefoneSolicitouAtendimento: null,
        qualSkillLigacao: null,
        confirmacaoEnderecoCadastradoCorretamente: null,
        enderecoEstaCorreto: null,
        correcaoRealizada: null,
        porqueNaoFoiRealizadaCorrecao: null
      },
      skill: [
        { text: 'S2S 1', value: 'S2S 1' },
        { text: 'S2S 2', value: 'S2S 2' },
        { text: 'S2S 3', value: 'S2S 3' },
        { text: 'N1', value: 'N1' }
      ],
      confirmacao: [
        { text: 'SIM', value: 'SIM' },
        { text: 'NÃO', value: 'NÃO' }
      ]
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
      clearForm() {
        let newForm = Object.assign({}, this.form)
        Object.keys(newForm).forEach(key => {
          newForm[key] = null
        })

        this.form = newForm
        this.$refs.observer.reset()
      },
      async submit() {
        this.form.almopeCadastro = this.usuario.almope
        await EnderecoDesatualizadoService.salvarDadosTabulacao(this.form)
        this.toast('Cadastro realizado com sucesso!', 'top-right', false, 2000, 'success')
        this.clearForm()
      }
    }
  }
</script>

<style scoped>
  .col-4,
  .col-12 {
    padding: 0 10px !important;
  }
</style>
