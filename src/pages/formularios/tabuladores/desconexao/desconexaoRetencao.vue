<template>
  <v-card>
    <title-negative-margin
      title="Desconexão Retenção"
      className="rounded-r-xl"
    ></title-negative-margin>
    <v-col class="mt-3">
      <v-row>
        <v-col class="py-0" cols="4">
          <v-text-field
            label="Contrato"
            @input="updateFormField('contrato', $event)"
            propsMasks="contratoComCodCidade"
            :isMasks="true"
            @change="formDesconexao.contrato.length == 14 ? loadMotivos() : ''"
            :value="formDesconexao.contrato"
            :rules="[rules.requiredContrato]"
          ></v-text-field>
        </v-col>
        <v-col class="py-0" cols="4">
          <v-autocomplete
            label="Motivo do cancelamento"
            :items="motivos"
            text="MOTIVOS"
            @input="updateFormField('motivoSelecionado', $event)"
            @change="loadSubmotivos()"
            :value="formDesconexao.motivoSelecionado"
          ></v-autocomplete>
        </v-col>
        <v-col class="py-0" cols="4">
          <v-autocomplete
            label="Submotivo do cancelamento"
            :items="submotivos"
            text="SUBMOTIVOS"
            @input="updateFormField('submotivoSelecionado', $event)"
            :value="formDesconexao.submotivoSelecionado"
          ></v-autocomplete>
        </v-col>
        <v-col class="py-0" v-if="formDesconexao.submotivoSelecionado == 'CONCORRENCIA'">
          <v-text-field
            label="Qual a Concorrente?"
            @input="updateFormField('qualConcorrente', $event)"
            :value="formDesconexao.qualConcorrente"
          ></v-text-field>
        </v-col>
        <v-col class="py-0" v-if="formDesconexao.submotivoSelecionado == 'CONCORRENCIA'">
          <v-text-field
            label="Valor Total da Concorrente?"
            @input="updateFormField('valorConcorrente', $event)"
            propsMasks="moeda"
            :isMasks="true"
            :value="formDesconexao.valorConcorrente"
          ></v-text-field>
        </v-col>
        <v-col class="py-0" v-if="formDesconexao.submotivoSelecionado == 'CONCORRENCIA'">
          <v-autocomplete
            label="Concorrente Já Instalada?"
            @input="updateFormField('concorrenteInstalada', $event)"
            :items="simNao"
            text="text"
            :value="formDesconexao.concorrenteInstalada"
          ></v-autocomplete>
        </v-col>
      </v-row>
      <div style="display: flex; justify-content: end; gap: 10px">
        <v-btn
          class="rounded-r-xl rounded-bl-xl"
          color="success"
          :disabled="!formIsValid()"
          @click="saveData"
          :loading="isSend"
        >
          Salvar
        </v-btn>
        <v-btn class="rounded-r-xl rounded-bl-xl" color="error" @click="limparForm">Limpar</v-btn>
      </div>
    </v-col>
  </v-card>
</template>

<script>
  import VAutocomplete from '../../../../shared/components/vuetifyComponents/VAutocomplete.vue'
  import VTextField from '../../../../shared/components/vuetifyComponents/VTextField.vue'
  import masks from '../../../../shared/masks/masks'

  // import { required, digits, email, max, regex } from "vee-validate/dist/rules";
  // import { extend, setInteractionMode } from "vee-validate";

  // setInteractionMode("eager");

  // extend("digits", {
  //   ...digits,
  //   message: "{_field_} needs to be {length} digits. ({_value_})",
  // });

  // extend("required", {
  //   ...required,
  //   message: "{_field_} can not be empty",
  // });

  // extend("max", {
  //   ...max,
  //   message: "{_field_} may not be greater than {length} characters",
  // });

  // extend("regex", {
  //   ...regex,
  //   message: "{_field_} {_value_} does not match {regex}",
  // });

  // extend("email", {
  //   ...email,
  //   message: "Email must be valid",
  // });

  import config from '../../../../core/config'
  import alerts from '../../../../mixins/alerts.mixins'
  export default {
    components: { VAutocomplete, VTextField },
    data: () => ({
      formDesconexao: {
        contrato: null,
        motivoSelecionado: null,
        submotivoSelecionado: null,
        qualConcorrente: null,
        valorConcorrente: null,
        concorrenteInstalada: null
      },
      isSend: false,
      motivos: [],
      submotivos: [],
      simNao: [{ text: 'SIM' }, { text: 'NÃO' }],
      rules: {
        requiredContrato: contrato =>
          (!!contrato && contrato.length == 14 && contrato != '000/00000000-0') ||
          'Para prosseguir o contrato precisa ser válido!'
      }
    }),
    mixins: [alerts],
    computed: {
      masks() {
        return masks
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      async saveData() {
        try {
          this.isSend = true
          this.formDesconexao.almopeCadastro = this.usuarioAlmope
          let urlData = `${config.baseUrl}api/shared/formularios/desconexao_me/desconexao_ret`
          await this.$api.post(urlData, this.formDesconexao)
          this.toast('Dados salvos com sucesso!', 'top-right', false, 2500, 'success')
          this.limparForm()
          this.isSend = false
        } catch (error) {
          this.isSend = false
          this.toast('Oops, não conseguimos salvar seus dados!', 'top-right', false, 2500, 'error')
          console.error(error)
        }
      },
      limparForm() {
        let newForm = Object.assign({}, this.formDesconexao)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.formDesconexao = newForm
      },
      updateFormField(model, value) {
        this.formDesconexao[model] = value
      },
      loadMotivos() {
        let urlData = `${config.baseUrl}api/shared/formularios/desconexao_me/motivos_desc`
        this.$api.get(urlData).then(res => {
          this.motivos = res.data
        })
      },
      loadSubmotivos() {
        let urlData = `${config.baseUrl}api/shared/formularios/desconexao_me/submotivos_desc/${this.formDesconexao.motivoSelecionado}`
        this.$api.get(urlData).then(res => {
          this.submotivos = res.data
        })
      },
      formIsValid() {
        return (
          (this.formDesconexao.contrato &&
            this.formDesconexao.motivoSelecionado != 'CONCORRENCIA' &&
            this.formDesconexao.motivoSelecionado != null &&
            this.formDesconexao.submotivoSelecionado != 'CONCORRENCIA' &&
            this.formDesconexao.submotivoSelecionado != null) ||
          (this.formDesconexao.contrato &&
            this.formDesconexao.motivoSelecionado &&
            this.formDesconexao.submotivoSelecionado == 'CONCORRENCIA' &&
            this.formDesconexao.qualConcorrente &&
            this.formDesconexao.valorConcorrente &&
            this.formDesconexao.concorrenteInstalada)
        )
      }
    },
    created() {
      // this.loadMotivos();
    },
    watch: {
      'formDesconexao.contrato': function (newVal, oldVal) {
        if (newVal != oldVal) {
          ;(this.formDesconexao.motivoSelecionado = null),
            (this.formDesconexao.submotivoSelecionado = null),
            (this.formDesconexao.qualConcorrente = null),
            (this.formDesconexao.valorConcorrente = null),
            (this.formDesconexao.concorrenteInstalada = null)
        }
      },
      'formDesconexao.motivoSelecionado': function (newVal, oldVal) {
        if (newVal != oldVal) {
          ;(this.formDesconexao.qualConcorrente = null),
            (this.formDesconexao.valorConcorrente = null),
            (this.formDesconexao.concorrenteInstalada = null)
        }
      }
    }
  }
</script>

<style></style>
