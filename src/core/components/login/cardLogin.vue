<template>
  <v-dialog v-model="_abrirLogin" width="400" style="padding: 0; margin: 0">
    <v-card
      height="400"
      style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
      "
    >
      <div class="e-card playing">
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="wave"></div>
        <div class="container-img">
          <img src="../../../assets/img/logo/pyxis.png" alt="" />
        </div>
        <p class="_title">Seja Bem vindo!</p>
        <form>
          <div class="login">
            <i class="fa-solid fa-user user"></i>
            <input type="text" placeholder="Almope" v-model="loginData.username" />
          </div>
          <div class="pass">
            <i class="fa-solid fa-lock password"></i>
            <input :type="type" placeholder="Senha" v-model="loginData.password" />
            <i class="fa-solid fa-eye islock" @click="type = 'text'" v-if="type == 'password'"></i>
            <i
              class="fa-solid fa-eye-slash islock"
              @click="type = 'password'"
              v-if="type == 'text'"
            ></i>
          </div>
          <!-- <div class="reset">
            <a @click="resetSenha">Esqueceu sua senha?</a>
          </div> -->
          <button @click.prevent="logar()">
            <div class="container-circle" v-if="isLoginLoaded">
              <div class="circle"></div>
              <div class="circle"></div>
              <div class="circle"></div>
            </div>
            <div v-else>Entrar</div>
          </button>
        </form>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  import masks from '../../../shared/masks/masks'
  import alerts from '../../../mixins/alerts.mixins'
  export default {
    props: { abrirLogin: { type: Boolean, default: false } },
    data: () => ({
      loginData: {
        username: '',
        password: ''
      },
      type: 'password',
      isLoginLoaded: false
    }),
    mixins: [alerts],
    computed: {
      masks() {
        return masks
      },
      _abrirLogin: {
        get() {
          return this.abrirLogin
        },
        set(newValue) {
          return newValue
        }
      }
    },
    methods: {
      resetSenha() {
        this.$emit('update:resetPassword')
      },
      async logar() {
        try {
          this.isLoginLoaded = true
          await this.$store.dispatch('init', this.loginData)
          this.isLoginLoaded = false
        } catch (error) {
          let errorMessage = 'Ocorreu um erro inesperado. Tente novamente.'

          if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message
          }

          console.error('Falha no login:', error)
          this.toast(errorMessage, 'top-right', false, 3500, 'error')

          this.isLoginLoaded = false
        }
      }
    }
  }
</script>

<style scoped>
  .e-card {
    padding: 10px;
  }

  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    z-index: 1;
  }
  .login,
  .pass {
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
  }

  input {
    padding: 10px;
    padding-left: 35px;
    border: 1px solid #dfdfdf;
    border-radius: 7px;
  }

  input::placeholder {
    padding: 5px;
  }

  .user,
  .password {
    position: absolute;
    left: 1rem;
    top: 0.9rem;
    fill: none;
    width: 1rem;
    height: 1rem;
    color: #1c3242;
  }

  .islock {
    position: absolute;
    right: 1rem;
    top: 0.9rem;
    cursor: pointer;
    fill: none;
    width: 1rem;
    height: 1rem;
    color: #a1a1a1;
  }

  .playing {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .playing img {
    width: 70px;
    margin-top: -25px;
    z-index: 1;
  }

  ._title {
    z-index: 1;
    font-size: 25px;
    margin-top: 15px;
  }

  button {
    background-color: #1c3242;
    color: #fff;
    font-weight: 600;
    padding: 10px;
    margin: 0 0 5px 0;
    height: 40px;
    width: 100%;
  }

  .reset {
    width: 100%;
    display: flex;
    justify-content: end;
  }

  a {
    font-size: 10px;
  }

  .wave {
    position: absolute;
    width: 540px;
    height: 700px;
    opacity: 0.6;
    left: 0;
    top: 0;
    margin-left: -25%;
    margin-top: -10%;
    background: linear-gradient(744deg, #af40ff, #5b42f3, #00ddeb);
  }
  .wave:nth-child(1) {
    top: 350px;
  }

  .wave:nth-child(2),
  .wave:nth-child(3) {
    top: 325px;
  }

  .playing .wave {
    border-radius: 40%;
    animation: wave 3000ms infinite linear;
  }

  .wave {
    border-radius: 40%;
    animation: wave 55s infinite linear;
  }

  .playing .wave:nth-child(2) {
    animation-duration: 4000ms;
  }

  .wave:nth-child(2) {
    animation-duration: 50s;
  }

  .playing .wave:nth-child(3) {
    animation-duration: 5000ms;
  }

  .wave:nth-child(3) {
    animation-duration: 45s;
  }

  @keyframes wave {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .container-img {
    display: flex;
  }

  .close {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 20px;
  }

  .container-circle {
    gap: 10px;
    display: flex;
    justify-content: center;
  }

  .circle {
    padding: 5px;
    border-radius: 50%;
    width: 10px;
    background-color: #fff;
    transform-origin: 50%;
    animation: circle754 0.5s alternate infinite ease;
  }

  @keyframes circle754 {
    0% {
      top: 2px;
      transform: scaleY(1.7);
    }
  }

  .circle:nth-child(2) {
    left: 45%;
    animation-delay: 0.2s;
  }

  .circle:nth-child(3) {
    left: auto;
    right: 15%;
    animation-delay: 0.3s;
  }
</style>
