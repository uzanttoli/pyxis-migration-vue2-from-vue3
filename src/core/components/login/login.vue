<template>
  <v-card class="overflow-hidden" elevation="0">
    <app-bar-login @updated-login="login = !login"></app-bar-login>
    <apresentacao-inicio></apresentacao-inicio>
    <sobre></sobre>
    <como-podemos-ajudar></como-podemos-ajudar>
    <pyxis></pyxis>
    <quem-somos></quem-somos>
    <footer-login></footer-login>
    <!-- <btn-login class="btn2" @clickMe="login = !login"></btn-login> -->
    <!-- <card-login :abrirLogin="login" @update:resetPassword="useResetPassword"></card-login> -->
    <CardLogin v-model:abrirLogin="login" />
    <!-- <reset-password
      :dialogReset="dialogReset"
      @update:close-reset="dialogReset = !dialogReset"
    ></reset-password> -->
  </v-card>
</template>

<script>
  import appBarLogin from './appBarLogin.vue'
  import ApresentacaoInicio from './apresentacaoInicio.vue'
  // import BtnLogin from "./btnLogin.vue";
  import CardLogin from './cardLogin.vue'
  import ComoPodemosAjudar from './comoPodemosAjudar.vue'
  import FooterLogin from './footerLogin.vue'
  import Pyxis from './pyxis.vue'
  import QuemSomos from './quemSomos.vue'
  // import ResetPassword from './resetPassword.vue'
  import Sobre from './sobre.vue'

  export default {
    components: {
      appBarLogin,
      ApresentacaoInicio,
      Sobre,
      ComoPodemosAjudar,
      Pyxis,
      QuemSomos,
      // BtnLogin,
      CardLogin,
      FooterLogin
      // ResetPassword
    },
    data: () => ({
      login: false,
      dialogReset: false
    }),
    methods: {
      changeLogin() {
        this.login = true
      },
      useResetPassword() {
        this.dialogReset = !this.dialogReset
      }
    },
    watch: {}
  }
</script>

<style scoped>
  .btn2 {
    position: fixed;
    bottom: 3%;
    right: 14px;
    border-radius: 50px;
  }
  /* animation: btn 2s infinite; */

  /* @keyframes btn {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(10px);
  }
  100% {
    transform: translateY(0px);
  }
} */
</style>
