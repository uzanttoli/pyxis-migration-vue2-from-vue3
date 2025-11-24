<template>
  <v-container>
    <div id="body">
      <img class="wave" src="../../assets/img/core/designPyxis.png" />

      <div class="container">
        <div class="img">
          <img src="../../assets/img/core/undraw_shared_goals_re_jvqde.png" />
        </div>
        <div class="login-content">
          <form>
            <img id="logo-pyxis" src="../../assets/img/core/logonewlayout.png" />
            <h3 class="title">Bem vindo</h3>
            <div class="input-div one">
              <div class="i">
                <i class="fas fa-user"></i>
              </div>
              <div class="div">
                <input
                  type="number"
                  class="input"
                  placeholder="Almope"
                  v-model="loginData.username"
                  @keyup.enter="logar()"
                />
              </div>
            </div>
            <div class="input-div pass">
              <div class="i">
                <i class="fas fa-lock"></i>
              </div>
              <div>
                <input
                  :type="show1 ? 'text' : 'password'"
                  class="input"
                  id="pass"
                  placeholder="Senha"
                  v-model="loginData.password"
                  @keyup.enter="logar()"
                />
                <div class="eye">
                  <v-btn icon v-if="show1" @click="show1 = false">
                    <i class="fas fa-eye-slash"></i>
                  </v-btn>
                  <v-btn icon v-else @click="show1 = true">
                    <i class="fas fa-eye"></i>
                  </v-btn>
                </div>
              </div>
            </div>
            <v-btn
              rounded
              class="btn cor-padrao"
              @click.prevent="logar()"
              :loading="loginRealizado"
            >
              Login
            </v-btn>
          </form>
        </div>
      </div>
      <div class="text-center ma-2">
        <v-snackbar v-model="accessDenied" top right>
          <template v-slot:action="{ attrs }">
            <v-icon color="warning" text v-bind="attrs">mdi-help-circle</v-icon>
          </template>
          {{ textInformeAlmopeESenha }}
        </v-snackbar>
      </div>
      <div class="text-center ma-2">
        <v-snackbar v-model="loginError" top right>
          <template v-slot:action="{ attrs }">
            <v-icon color="red" text v-bind="attrs">mdi-alert</v-icon>
          </template>
          {{ textSenhaInvalida }}
        </v-snackbar>
      </div>
      <div id="footer">
        Copyright &copy; {{ date }} |
        <strong>{{ nameFooter }}</strong>
      </div>
    </div>
  </v-container>
</template>
<script>
  export default {
    components: {},
    data: () => ({
      overlay: false,
      dialogExibirResetSenha: false,
      show1: false,
      loginData: {
        username: '',
        password: ''
      },
      textSenhaInvalida: 'Usuário ou senha inválida!',
      textInformeAlmopeESenha: 'Informe usuario e senha!',
      nameFooter: 'Centro de Controle Operacional'
    }),
    computed: {
      date() {
        let data = new Date()
        let ano = data.getFullYear()
        return ano
      },
      loginRealizado() {
        return this.$store.getters.loginRealizado
      },
      loginError() {
        return this.$store.getters.loginError
      },
      accessDenied() {
        return this.$store.getters.accessDenied
      }
    },
    methods: {
      logar() {
        this.$store.dispatch('init', this.loginData)
      }
    },
    watch: {
      overlay(val) {
        val &&
          setTimeout(() => {
            this.overlay = false
          }, 3000)
      }
    }
  }
</script>

<style scoped>
  body {
    font-family: 'Poppins', sans-serif;
    overflow: hidden;
  }

  /* Cor de fundo do autocomplete */
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 30px white inset;
  }

  /* Cor do texto do autocomplete */
  input:-webkit-autofill {
    -webkit-text-fill-color: #333 !important;
  }

  #footer {
    position: absolute;
    bottom: 1px;
    left: 15px;
    color: rgb(255, 252, 252);
    font-family: 'Times New Roman', Times, serif;
    font-size: 15px;
  }
  .wave {
    position: fixed;
    bottom: 0;
    left: 0;
    height: 100%;
    /* z-index: -1; */
  }
  .title {
    font-size: 1.5rem;
  }
  .container {
    height: 100%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    /* grid-gap: 10rem; */
    padding: 0 2rem;
  }

  #logo-pyxis {
    width: 250px;
    height: auto;
    padding: 0 0 13px 0;
  }
  .img {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    top: -6%;
    /* left: 3%; */
    position: relative;
    /* z-index: -1; */
  }
  .login-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    text-align: center;
    top: 30%;
    right: 10%;
    position: absolute;
  }
  .img img {
    width: 700px;
  }
  form {
    width: 300px;
  }
  .login-content img {
    height: 100px;
  }
  .login-content h2 {
    margin: 15px 0;
    color: #333;
    text-transform: uppercase;
    font-size: 2.9rem;
  }
  .login-content .input-div {
    position: relative;
    display: grid;
    grid-template-columns: 7% 93%;
    margin: 25px 0;
    padding: 5px 0;
    border-bottom: 2px solid #d9d9d9;
  }
  .login-content .input-div.one {
    margin-top: 0;
  }
  .i {
    color: #d9d9d9;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .i i {
    transition: 0.3s;
  }
  .eye {
    transition: 0.3s;
    display: flex;
    justify-content: flex-end;
  }

  .input-div > div {
    position: relative;
    height: 45px;
  }
  .input-div > div > h5 {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    font-size: 18px;
    transition: 0.3s;
  }
  .input-div:before,
  .input-div:after {
    content: '';
    position: absolute;
    bottom: -2px;
    width: 0%;
    height: 2px;
    background-color: #591b3d;
    transition: 0.4s;
  }
  .input-div:before {
    right: 50%;
  }
  .input-div:after {
    left: 50%;
  }
  .input-div.focus:before,
  .input-div.focus:after {
    width: 50%;
  }
  .input-div.focus > div > h5 {
    top: -5px;
    font-size: 15px;
  }
  .input-div.focus > .i > i {
    color: #591b3d;
  }
  .input-div > div > input {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    background: none;
    padding: 0.5rem 0.7rem;
    font-size: 1.2rem;
    color: #555;
    font-family: 'poppins', sans-serif;
  }
  .input-div.pass {
    margin-bottom: 4px;
  }
  a {
    display: block;
    text-align: right;
    text-decoration: none;
    color: #999;
    font-size: 0.9rem;
    transition: 0.3s;
  }
  a:hover {
    color: #591b3d;
  }
  .btn {
    display: block;
    width: 100%;
    height: 45px;
    border-radius: 25px;
    outline: none;
    border: none;
    background-image: linear-gradient(to right, #591b3d, #8b1331, #c91e1e);
    background-size: 200%;
    font-size: 1.2rem;
    color: #fff;
    font-family: 'Poppins', sans-serif;
    text-transform: uppercase;
    margin: 1rem 0;
    cursor: pointer;
    transition: 0.5s;
  }
  .btn:hover {
    background-position: right;
  }

  @media screen and (max-width: 1920px) {
    .container {
      grid-template-columns: 0.5fr;
      padding: 0 1rem;
    }
    form {
      width: 300px;
    }
    .login-content h2 {
      font-size: 2.4rem;
      margin: 8px 0;
    }

    .login-content {
      top: 25%;
    }

    .img img {
      width: 600px;
      margin-left: 4vw;
    }
  }

  @media screen and (max-width: 1680px) {
    .container {
      grid-template-columns: 0.5fr;
      padding: 0 1rem;
    }
    form {
      width: 290px;
    }
    .login-content h2 {
      font-size: 2.4rem;
      margin: 8px 0;
    }

    .login-content {
      top: 18%;
    }
    .img img {
      width: 500px;
      margin-left: -4vw;
    }
  }
  @media screen and (max-width: 1536px) {
    .container {
      grid-template-columns: 0.5fr;
      padding: 0 1rem;
    }
    form {
      width: 260px;
    }
    .login-content h2 {
      font-size: 2.4rem;
      margin: 8px 0;
    }

    .login-content {
      top: 23%;
      right: 15vw;
    }
    .img img {
      width: 500px;
      margin-top: 20%;
      margin-left: -2vw;
    }
  }

  @media screen and (max-width: 1440px) {
    .container {
      grid-template-columns: 0.5fr;
      padding: 0 1rem;
    }
    form {
      width: 290px;
    }
    .login-content h2 {
      font-size: 2.4rem;
      /* margin: 8px 0; */
    }
    .img img {
      width: 500px;
      margin-top: 15%;
      margin-left: 2vw;
    }
  }

  @media screen and (max-width: 1366px) {
    .container {
      grid-gap: 5rem;
    }
    .login-content {
      top: 25%;
      /* margin: 8px 0; */
    }
    .img img {
      margin-top: 20%;
      width: 500px;
    }
  }

  @media screen and (max-width: 1024px) {
    form {
      width: 230px;
    }
    #logo-pyxis {
      width: 200px;
    }

    .container {
      grid-template-columns: 0.5fr;
    }

    .login-content {
      justify-content: center;
      top: 25%;
    }
    .img img {
      width: 400px;
      margin-left: 5vw;
      margin-top: 25%;
    }
  }

  @media screen and (max-width: 1020px) {
    .container {
      grid-template-columns: 1fr;
    }
    .img {
      display: none;
    }
    .wave {
      display: none;
    }
    .login-content {
      justify-content: center;
      right: 35%;
    }
    #footer {
      color: #020202;
    }
  }

  @media screen and (max-width: 800px) {
    .img {
      display: none;
    }
    .wave {
      display: none;
    }
    .login-content {
      justify-content: center;
    }
  }

  .cor-padrao {
    background-image: linear-gradient(220deg, #00ecff, #8f0e8f);
  }
</style>
