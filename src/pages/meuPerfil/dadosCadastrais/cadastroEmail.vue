<template>
  <!-- v-model="dialogCadastroEmail" -->
  <v-dialog
    :model-value="dialogCadastroEmail"
    @update:modelValue="val => $emit('update:dialogCadastroEmail', val)"
    width="600"
    persistent
  >
    <v-card>
      <v-card-title class="ml-n3">Atualização Cadastral Obrigatório</v-card-title>
      <v-divider class="mb-3"></v-divider>
      <v-alert
        dense
        border="left"
        close-text="Close Alert"
        color="amber accent-4"
        text
        class="mx-2"
      >
        <div>
          <div class="text-h6">Importante</div>
          Atualização de E-mail obrigatória!
          <v-divider class="mt-2"></v-divider>
          <ul class="mt-2">
            <h4 class="ml-n4">Para que servirá?</h4>
            <li>
              Envio de
              <strong>atualização de vinculo</strong>
              ;
            </li>
            <li>
              Envio de
              <strong>erro de pagamentos</strong>
              ;
            </li>
            <li>
              Envio de
              <strong>reset de senha</strong>
              da Pyxis do Operador;
            </li>
          </ul>
        </div>
      </v-alert>
      <div class="context">
        <v-text-field
          placeholder="Ex.: meulogin@almavivaexperience.com.br"
          label="Informe seu email"
          outlined
          v-model="email"
          prepend-inner-icon="fa-solid fa-envelope"
          :rules="[rules.emailIsValid]"
        ></v-text-field>
      </div>
      <div
        style="
          margin-top: -10px;
          margin-right: 10px;
          padding-bottom: 10px;
          display: flex;
          justify-content: end;
        "
      >
        <v-btn
          color="success"
          :disabled="!emailIsValid"
          @click="changeEmail"
          @keyup.enter="changeEmail()"
          :loading="isSend"
        >
          Atualizar
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  import config from '../../../core/config'
  import alerts from '../../../mixins/alerts.mixins'
  export default {
    name: 'CadastroEmail',
    props: {
      dialogCadastroEmail: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      email: null,
      rules: {
        emailIsValid: email => !!email || 'Informe um email válido!'
      },
      isSend: false
    }),
    mixins: [alerts],
    computed: {
      emailIsValid() {
        let email = this.email
        let domainAlm = 'almavivaexperience.com.br'
        let domainClaro = 'claro.com.br'
        const pattern = new RegExp(`^[\\w\\.-]+@${domainAlm}$`, 'i')
        const pattern2 = new RegExp(`^[\\w\\.-]+@${domainClaro}$`, 'i')
        return pattern.test(email) || pattern2.test(email)
      },
      usuario() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      async changeEmail() {
        try {
          this.isSend = true
          let data = {
            usuario: this.usuario,
            email: this.email
          }
          let urlData = `${config.baseUrl}api/shared/user/email/`
          await this.$api.post(urlData, data)
          this.toast('Email atualizado com sucesso!', 'top-right', false, 2000, 'success')
          this.isSend = false
          this.$emit('update:close')
        } catch (error) {
          this.isSend = false
          this.toast(
            'Oops! Não foi possivel atualizar seu email.',
            'top-right',
            false,
            2000,
            'error'
          )
        }
      }
    }
  }
</script>

<style scoped>
  .context {
    padding: 0 10px 0 10px;
  }

  li,
  h5,
  div {
    color: #333;
  }

  li {
    font-size: 15px;
  }
</style>
