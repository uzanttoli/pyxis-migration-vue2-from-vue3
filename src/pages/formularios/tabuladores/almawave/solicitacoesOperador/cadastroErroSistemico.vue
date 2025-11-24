<template>
  <v-card>
    <title-negative-margin
      title="VDI - Erro sistêmico"
      icon="fa-solid fa-receipt"
      className="rounded-r-xl"
    >
      <span>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon v-bind="attrs" v-on="on" @click="acompanharPedido = true">
              <v-icon>fa-solid fa-square-poll-vertical</v-icon>
            </v-btn>
          </template>
          <span>Acompanhar pedido</span>
        </v-tooltip>
      </span>
    </title-negative-margin>
    <v-col>
      <validation-observer v-slot="{ invalid, validate }" ref="observer">
        <form @submit.prevent="validate().then(submit)">
          <v-row>
            <v-col cols="4">
              <validation-provider v-slot="{ errors }" name="tipo" rules="required">
                <v-autocomplete
                  :error-messages="errors"
                  placeholder="Tipo"
                  label="Tipo"
                  v-model="form.nivel1"
                  required
                  dense
                  outlined
                  :items="arrayNivel1"
                  item-text="NIVEL_1"
                  item-value="ID"
                  no-data-text="Items indisponiveis"
                  @change="loadItemsNivel2"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="4">
              <validation-provider v-slot="{ errors }" name="qual incidente" rules="required">
                <v-autocomplete
                  :error-messages="errors"
                  placeholder="Qual incidente?"
                  label="Qual incidente?"
                  v-model="form.nivel2"
                  required
                  dense
                  outlined
                  :items="arrayNivel2"
                  no-data-text="Items indisponiveis"
                  item-text="NIVEL_2"
                  item-value="ID"
                  @change="loadItemsNivel3"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="4">
              <validation-provider v-slot="{ errors }" name="motivo" rules="required">
                <v-autocomplete
                  :error-messages="errors"
                  placeholder="Motivo"
                  label="Motivo"
                  v-model="form.nivel3"
                  required
                  dense
                  :items="arrayNivel3"
                  item-text="NIVEL_3"
                  item-value="ID"
                  no-data-text="Items indisponiveis"
                  outlined
                  @change="loadItemsNivel4"
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="4" class="mt-n6" v-if="form.nivel2 == 2">
              <validation-provider v-slot="{ errors }" name="submotivo" rules="required">
                <v-autocomplete
                  :error-messages="errors"
                  placeholder="Submotivo"
                  label="Submotivo"
                  v-model="form.nivel4"
                  required
                  dense
                  :items="arrayNivel4"
                  item-text="NIVEL_4"
                  item-value="ID"
                  no-data-text="Items indisponiveis"
                  outlined
                ></v-autocomplete>
              </validation-provider>
            </v-col>
            <v-col cols="4" class="mt-n6">
              <validation-provider v-slot="{ errors }" name="computador" rules="required">
                <v-text-field
                  :error-messages="errors"
                  placeholder="Informe modelo do seu computador"
                  label="Informe modelo do seu computador"
                  v-model="form.modeloComputador"
                  required
                  outlined
                  dense
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="4" class="mt-n6">
              <validation-provider v-slot="{ errors }" name="provedor" rules="required">
                <v-text-field
                  :error-messages="errors"
                  placeholder="Provedor Internet"
                  label="Provedor Internet"
                  v-model="form.provedor"
                  required
                  outlined
                  dense
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="mt-n6" cols="4">
              <validation-provider v-slot="{ errors }" name="ID Team View" rules="required|numeric">
                <v-text-field
                  placeholder="Favor insira o ID do Team View"
                  label="Team View"
                  dense
                  outlined
                  :error-messages="errors"
                  v-model="form.teamView"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col class="mt-n6" cols="4">
              <validation-provider v-slot="{ errors }" name="Senha Team View" rules="required">
                <v-text-field
                  placeholder="Favor insira a senha do Team View"
                  label="Senha do Team View"
                  dense
                  outlined
                  :error-messages="errors"
                  v-model="form.senhaTeamView"
                ></v-text-field>
              </validation-provider>
            </v-col>
            <v-col cols="12" class="mt-n6">
              <validation-provider
                v-slot="{ errors }"
                name="descrição do problema"
                rules="required|max:100"
              >
                <v-textarea
                  dense
                  outlined
                  placeholder="Descreva o problema"
                  label="Descreva o problema"
                  :error-messages="errors"
                  v-model="form.descricaoProblema"
                  counter="100"
                  maxlength="100"
                ></v-textarea>
              </validation-provider>
            </v-col>
          </v-row>
          <div style="display: flex; justify-content: end">
            <v-btn color="error" class="mr-2" @click="limparForm">Limpar</v-btn>
            <v-btn :disabled="invalid" type="submit" color="success">Abrir chamado</v-btn>
          </div>
        </form>
      </validation-observer>
    </v-col>
    <dialog-acompanhar-pedido
      :openAcompPedido="acompanharPedido"
      @update:close="acompanharPedido = !acompanharPedido"
    ></dialog-acompanhar-pedido>
  </v-card>
</template>

<script>
  import { ValidationObserver, ValidationProvider } from 'vee-validate'
  import config from '../../../../../core/config'
  import alerts from '../../../../../mixins/alerts.mixins'
  import DialogAcompanharPedido from './dialogAcompanharPedido.vue'
  export default {
    components: {
      ValidationObserver,
      ValidationProvider,
      DialogAcompanharPedido
    },
    data: () => ({
      isSend: false,
      acompanharPedido: false,
      form: {
        solicitarPara: 1, // PRODUTO
        produto: 43, // VDI - OPERADOR
        nivel1: null,
        nivel2: null,
        nivel3: null,
        nivel4: null,
        // titulo: null,
        provedor: null,
        modeloComputador: null,
        teamView: null,
        senhaTeamView: null,
        descricaoProblema: null
      },
      arrayNivel1: [],
      arrayNivel2: [],
      arrayNivel3: [],
      arrayNivel4: []
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      }
    },
    mixins: [alerts],
    methods: {
      limparForm() {
        for (let i in this.form) {
          this.form[i] = null
        }
        this.$refs.observer.reset()
      },
      async submit() {
        try {
          this.isSend = true
          this.form.almope = this.usuario.almope
          // this.form.titulo = this.form.nivel1 + ' ' + this.form.nivel2;
          let urlData = `${config.baseUrl}api/shared/automacoes/tabulacao/cadastrar`
          await this.$api.post(urlData, this.form)
          this.toast(
            'Sua solicitação foi encaminhada e será aberta em breve!',
            'top-right',
            false,
            2500,
            'success'
          )
          this.isSend = false
          this.limparForm()
        } catch (e) {
          this.toast(
            'Não foi possivel realizar o cadastro, tente novamente!',
            'top-right',
            false,
            2500,
            'error'
          )
          this.isSend = false
        }
      },
      loadItemsNivel1() {
        let urlData = `${config.baseUrl}api/shared/automacoes/tabulacao/nivel_1`
        this.$api.get(urlData).then(res => {
          this.arrayNivel1 = res.data
        })
      },
      loadItemsNivel2() {
        let urlData = `${config.baseUrl}api/shared/automacoes/tabulacao/nivel_2`
        this.$api
          .get(urlData, {
            params: {
              nivel1: this.form.nivel1
            }
          })
          .then(res => (this.arrayNivel2 = res.data))
      },
      loadItemsNivel3() {
        let urlData = `${config.baseUrl}api/shared/automacoes/tabulacao/nivel_3`
        this.$api
          .get(urlData, {
            params: {
              nivel2: this.form.nivel2
            }
          })
          .then(res => (this.arrayNivel3 = res.data))
      },
      loadItemsNivel4() {
        let urlData = `${config.baseUrl}api/shared/automacoes/tabulacao/nivel_4`
        this.$api
          .get(urlData, {
            params: {
              nivel3: this.form.nivel3
            }
          })
          .then(res => (this.arrayNivel4 = res.data))
      }
    },
    created() {
      this.loadItemsNivel1()
    }
  }
</script>

<style></style>
