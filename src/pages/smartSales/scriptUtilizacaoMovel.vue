<template>
  <!-- v-model="scriptOpen" -->

  <v-dialog
    max-width="500"
    persistent
    class="overflow-y-hidden"
    :model-value="scriptOpen"
    @update:modelValue="val => $emit('update:scriptOpen', val)"
  >
    <v-card max-height="800" class="overflow-y-hidden" elevation="4" max-width="500">
      <v-img
        style="position: relative"
        src="../../assets/img/salesAI/script-oferta.png"
        :aspect-ratio="14 / 24"
        width="500"
      >
        <v-btn
          absolute
          style="top: 10px; right: 10px; z-index: 1000"
          depressed
          text
          icon
          @click="$emit('updated:close-script')"
        >
          <v-icon>fas fa-close</v-icon>
        </v-btn>

        <div
          style="
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;
          "
          v-if="progress >= 0"
        >
          <v-card
            width="390"
            class="rounded-lg card-info"
            :style="'position: relative; background:' + setColor"
            elevation="7"
          >
            <v-card-title style="display: flex; justify-content: center">
              <strong>AVISO IMPORTANTE</strong>
            </v-card-title>

            <v-divider light></v-divider>

            <div style="padding: 10px; margin: 15px 0">
              Você sabia que o principal motivo de estorno de comissionamento é a
              <br />

              <br />

              <div style="display: flex; justify-content: center; width: 100%; text-align: center">
                <div style="background-color: white; padding: 10px">
                  <strong style="color: rgb(230, 0, 0)">
                    NÃO UTILIZAÇÃO DA LINHA APÓS A ATIVAÇÃO?
                  </strong>

                  <br />
                </div>
              </div>

              <br />

              <div style="display: flex; justify-content: center; width: 100%">
                <div style="background-color: white; padding: 10px">
                  <strong style="color: rgb(230, 0, 0)">O CLIENTE DEVE FAZER USO DA LINHA!</strong>

                  <br />
                </div>
              </div>

              <br />

              <div style="display: flex; justify-content: center; width: 100%">
                Utilize o script a seguir!
              </div>
            </div>

            <v-progress-linear
              style="position: absolute; bottom: 0px"
              :value="progress"
              color="white"
              height="10"
            ></v-progress-linear>
          </v-card>
        </div>

        <!-- <div
         class="codepen-button" 
          style="position: absolute; bottom: 70px;"
        >
          <v-btn
            @click="$emit('update:seguirCadastro')"
            :disabled="progress >= 0"
          >
            Seguir com cadastro
          </v-btn>
        </div> -->

        <div
          style="
            position: absolute;
            bottom: 70px;
            width: 100%;
            display: flex;
            justify-content: center;
          "
        >
          <div
            class="codepen-button"
            style="display: flex; justify-content: center; align-items: center; border-radius: 35px"
          >
            <!-- <div style="display: flex; justify-content: center; width: 100%;"> -->

            <v-btn
              rounded
              depressed
              style="z-index: 1; border: 2px solid #5667e4"
              @click="$emit('update:seguirCadastro')"
              :disabled="progress >= 0"
            >
              Seguir com cadastro
            </v-btn>

            <!-- </div> -->
          </div>
        </div>
      </v-img>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      scriptOpen: {
        type: Boolean,
        default: false
      },
      indexOferta: {
        type: Number
      }
    },
    data: () => ({
      progress: 100,
      interval: null
    }),
    computed: {
      setColor() {
        if (this.indexOferta == 0) {
          return 'linear-gradient(-45deg, #fe0847, #feae3f)'
        } else if (this.indexOferta == 1) {
          return 'linear-gradient(-45deg, #ffec61, #f321d7);'
        } else if (this.indexOferta == 2) {
          return 'linear-gradient(-45deg, #24ff72, #9a4eff)'
        } else {
          return 'linear-gradient(-45deg, #f403d1, #64b5f6)'
        }
      }
    },
    methods: {
      loadProgress() {
        this.progress = 0
        this.progress = 100
        if (this.progress == 100 && this.interval == null) {
          this.interval = setInterval(() => {
            if (this.progress < 0) {
              this.interval = null
              this.progress = 0
            }
            this.progress -= 1
          }, 30)
        }
      }
    },
    created() {
      // this.loadProgress();
    },
    beforeUnmount: function () {
      clearInterval(this.interval)
    },
    watch: {
      scriptOpen() {
        if (this.scriptOpen == true) {
          this.loadProgress()
        }
      }
    }
  }
</script>

<style scoped>
  .btn-cadastro {
    /* background: linear-gradient(-45deg, #feae3f,#fe0847); */
    position: relative;
    z-index: 2;
    color: #696969;
    width: 225px;
    height: 40px;
    line-height: 40px;
    border-radius: 40px;
    display: block;
    text-align: center;
    margin: 20px auto 0;
    -webkit-border-radius: 40px;
    -moz-border-radius: 40px;
    -ms-border-radius: 40px;
    -o-border-radius: 40px;
    font-size: 14px;
    text-transform: capitalize;
    cursor: pointer;
    text-decoration: none;
    font-weight: 600;
    transition: 2s;
  }

  .card-info {
    /* width: 350px; */
    /* max-width: 350px; */
    /* background: linear-gradient(-45deg, #feae3f,#fe0847); */
    /* padding: 40px 20px; */
    height: auto;
    border-radius: 15px;
    -webkit-border-radius: 15px;
    -moz-border-radius: 15px;
    -ms-border-radius: 15px;
    -o-border-radius: 15px;
    margin: 0 auto;
    color: #fff;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
    overflow: hidden;
  }

  .img-important {
    position: absolute;
    top: 285px;
    right: 25px;
    z-index: 1;
    width: 65px;
  }
</style>
