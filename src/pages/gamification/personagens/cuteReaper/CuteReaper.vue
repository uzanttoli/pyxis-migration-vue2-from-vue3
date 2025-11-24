<template>
  <!-- v-model="cuteReaperDialog" -->
  <v-dialog
    :model-value="cuteReaperDialog"
    @update:modelValue="val => $emit('update:cuteReaperDialog', val)"
    fullscreen
    persistent
  >
    <v-card class="card" color="grey lighten-2">
      <img src="../../../../assets/img/icons/mdi-icons/Imagem2.png" alt="" class="img-teste" />
      <div>
        <h1 v-html="msg"></h1>
        <div class="img-cute">
          <img src="../../../../assets/img/core/modelo-ceifador-fire.png" class="plane" />
        </div>

        <v-col>
          <v-row justify="center" align="center">
            <div class="btn">
              <v-btn color="primary" class="white--text btn-acoes" rounded :to="'/home'">
                Home
              </v-btn>
              <!-- @click="$emit('update:close')" -->
            </div>
          </v-row>
        </v-col>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      cuteReaperDialog: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      msg: `VOCÊ NÃO POSSUI MAIS <span class="red--text">HP</span>, SOLICITE A
          BENÇÃO DO SEU MENTOR PARA CONTINUAR PONTUANDO!`,
      solicitado: false
    })
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Creepster&display=swap"); */

  .img-teste {
    width: 100%;
    height: 100%;
    position: absolute;
    /* z-index: 0; */
    /* height: 550px; */
    /* border-bottom-right-radius: 26px; */
    /* border-bottom-left-radius: 26px; */
  }

  .card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
  }
  .btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
  }

  .btn-acoes {
    padding: 10px;
  }

  h1 {
    text-align: center;
    position: relative;
    font-family: 'Creepster', cursive;
    font-size: 40px;
    color: rgb(136, 35, 167);
    background-color: aliceblue;
    padding: 10px;
    /* transform: rotate(2deg); */
  }
  .img-cute {
    display: flex;
    justify-content: center;
    align-content: center;
  }

  .plane {
    width: 400px;
    padding-bottom: 50px;
    animation-duration: 1s;
    animation-name: anim-plane;
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: linear;
    animation-fill-mode: forwards;
    transform: translateY(40px);
  }

  @keyframes anim-plane {
    to {
      transform: translateY(20px);
    }
  }
</style>
