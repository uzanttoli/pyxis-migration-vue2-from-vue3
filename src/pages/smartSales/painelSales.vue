<template>
  <div class="card-painel">
    <div class="card-img">
      <img src="../../assets/img/core/imgCardPrice.png" alt="" />
      <div class="container-img">
        <img src="../../assets/img/core/smartsales.png" alt="smartsales" />
      </div>
      <v-btn
        absolute
        style="top: 10px; right: 10px"
        depressed
        text
        outlined
        color="orange"
        href="http://10.64.175.49:4300/receptivo/index.php/api/arquivos/modelo_smart_sales/OFERTAS-SMARTSALES-ATUALIZADAS/.pdf"
      >
        <!--href - preenchido com o nome do campo e o formato do arquivo-->
        <span class="text-capitalize font-weight-bold">Baixar Ofertas</span>
        <v-icon class="ml-2">fa-solid fa-file-arrow-down</v-icon>
      </v-btn>
    </div>
    <div class="card-content">
      <h1 style="text-transform: capitalize">Bem vindo, {{ usuario }}!</h1>
      <div class="form">
        <v-stepper v-model="activeStep" elevation="0" tile class="rounded-xl">
          <v-stepper-header elevation="0">
            <v-stepper-step
              v-for="(componentName, index) in componentNames"
              :key="index"
              :step="index"
              :complete="index < activeStep"
              v-show="index != 0"
              color="blue"
            >
              {{ componentName.name }}
            </v-stepper-step>
          </v-stepper-header>
          <v-stepper-content :step="activeStep">
            <component :is="currentComponent.component"></component>
          </v-stepper-content>
        </v-stepper>
      </div>
    </div>
  </div>
</template>

<script>
  import ComponentA from './informacoesCliente.vue'
  export default {
    components: { ComponentA },
    data: () => ({
      activeStep: 1,
      openTextoPadrao: false,
      componentNames: [
        { name: '', component: '' },
        { name: 'Informações do Cliente', component: 'ComponentA' }
      ]
    }),
    computed: {
      currentComponent() {
        return this.componentNames[this.activeStep]
      },
      usuario() {
        let usuario = this.$store.getters.usuario.usuario
        let oneUsuario = usuario.split(' ')
        let nameExhibition = oneUsuario[0]
        return nameExhibition.toLowerCase()
      }
    },
    methods: {}
  }
</script>

<style scoped>
  .card-painel {
    display: flex;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
    /* border-radius: 15px; */
  }

  .card-img {
    /* max-width: 500px; */
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }

  .container-img {
    position: absolute;
    overflow: hidden;
    width: 200px;
    height: 100px;
    top: 10px;
    left: 10px;
  }

  .container-img::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      transparent,
      white
    ); /* Gradiente de transparência para a cor desejada */
    z-index: 2;
    animation: reveal 10s forwards infinite 10s;
  }

  @keyframes reveal {
    100% {
      left: 100%;
    }
  }

  img {
    width: 100%;
    /* border-radius: 15px; */
  }

  img:nth-child(2) {
    width: 150px;
    top: 10px;
    position: absolute;
    margin-left: -150px;
  }

  .card-content {
    background-image: linear-gradient(45deg, rgb(143, 14, 143), rgb(0, 236, 255));
    /* border-radius: 15px; */
  }

  .card-content h1 {
    color: #fff;
    margin: 40px;
  }

  .form {
    padding: 10px;
  }

  .divulgacao {
    background-color: #585757;
    color: #ffff00;
    display: flex;
    justify-content: end;
    align-items: center;
    font-weight: 600;
    padding: 5px;
    overflow: hidden;
  }

  .slide-list {
    /* list-style: none; */
    display: inline-block;
    animation: slideLeft 15s linear infinite;
  }

  .slide-list li {
    display: inline-block;
    margin: 0px 10px;
  }

  @keyframes slideLeft {
    0% {
      transform: translateX(100%);
    }
    100% {
      transform: translateX(-100%);
    }
  }
</style>
