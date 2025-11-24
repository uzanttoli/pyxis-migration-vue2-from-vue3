<template>
  <v-dialog
    v-model="_caracteristicaDialog"
    style="background-color: red; display: flex"
    :width="expand ? '1400' : '900'"
    class="overflow-hidden"
  >
    <div
      style="display: flex; width: 100%; justify-content: center; padding: 5px"
      class="overflow-hidden"
    >
      <div class="card" v-if="minhaAnalise.length > 0">
        <div class="img">
          <img class="preview" :src="imgTeam(perfil ? perfil : minhaAnalise[0].GRUPO)" alt="" />
        </div>
        <div class="container-caracteristicas" v-if="caracteristicas.length > 0">
          <div class="titulo-caracteristicas">
            <h2>Características</h2>
          </div>
          <!-- <pre>{{ caracteristicas }}</pre> -->
          <section>
            <h3>COMPORTAMENTOS:</h3>
            <span>{{ caracteristicas[0].COMPORTAMENTOS }}</span>
            <h3>PONTOS FORTES:</h3>
            <span>{{ caracteristicas[0].PONTOS_FORTES }}</span>
            <h3>PONTOS DE MELHORIA:</h3>
            <span>{{ caracteristicas[0].PONTOS_DE_MELHORIA }}</span>
            <h3>MOTIVACOES:</h3>
            <span>{{ caracteristicas[0].MOTIVACOES }}</span>
            <h3>VALORES:</h3>
            <span>{{ caracteristicas[0].VALORES }}</span>
            <v-row justify="end">
              <v-btn
                x-small
                absolute
                style="bottom: 10px; right: 10px; opacity: 0.95"
                depressed
                @click="expand = !expand"
                class="grey--text font-weight-bold"
              >
                MAIS INFORMAÇÕES
              </v-btn>
            </v-row>
          </section>
          <p></p>
        </div>
      </div>
      <v-expand-x-transition>
        <v-card
          style="
            width: 500px;
            border-radius: 20px;
            margin-left: 10px;
            background-color: #eeeeee;
            display: flex;
            flex-direction: column;
            justify-content: center;
          "
          v-show="expand"
        >
          <!-- <div style="background-color: #EEEEEE;"> -->
          <chartCaracteristicaTeam></chartCaracteristicaTeam>
          <!-- </div> -->
        </v-card>
      </v-expand-x-transition>
    </div>
  </v-dialog>
</template>

<script>
  import config from '../../../core/config.js'
  import chartCaracteristicaTeam from './chartCaracteristicaTeam.vue'
  export default {
    components: { chartCaracteristicaTeam },
    props: {
      caracteristicaDialog: {
        type: Boolean,
        default: false
      },
      perfil: {
        type: String,
        require: true
      }
    },
    data() {
      return {
        closeOnClick: false,
        caracteristicas: [],
        expand: false
      }
    },
    computed: {
      _caracteristicaDialog: {
        get() {
          return this.caracteristicaDialog
        },
        set(newValue) {
          return newValue
        }
      },
      minhaAnalise() {
        let minhaAnalise = this.$store.getters.minhaAnalise
        return minhaAnalise ? minhaAnalise : []
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      loadCaracteristicas() {
        let urlData = `${config.baseUrl}api/shared/gamification/perfil/caracteristicas`
        this.$api
          .get(urlData, {
            params: {
              perfil: this.perfil
            }
          })
          .then(res => {
            this.caracteristicas = res.data
            // this.$swal("Hello Vue world!!!");
          })
      },
      convertPalavra(palavra) {
        if (palavra == 'TUBARÃO') {
          return 'Você faz parte da Team SHARK'
        } else if (palavra == 'GATO') {
          return 'Você faz parte da Team CAT'
        } else if (palavra == 'AGUIA') {
          return 'Você faz parte da Team EAGLE'
        } else {
          return 'Você faz parte da Team WOLF'
        }
      },
      loadMinhaAnalise() {
        this.$store.dispatch('loadMinhaAnalise', this.usuarioAlmope)
      },
      imgTeam(img) {
        if (img) {
          let image = require.context('../../../assets/img/team', false, /\.png$/)
          return image('./' + img + '.png')
        }
      }
    },
    watch: {
      perfil() {
        this.loadCaracteristicas()
      }
    },
    created() {
      this.loadMinhaAnalise()
      this.loadCaracteristicas()
    }
  }
</script>

<style scoped>
  /*@import url("https://fonts.googleapis.com/css2?family=Orbitron&family=Silkscreen&family=Tajawal:wght@200&family=VT323&display=swap");*/
  img {
    width: 350px;
    margin-left: -20px;
  }

  .container-caracteristicas {
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  img.preview {
    padding: 9px;
    margin-left: 20px;
    /* align-items: center; */
    /* justify-items: center; */
    z-index: 1;
  }

  .img {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    /* align-items: center; */
  }

  .card {
    background: #e2a624;
    position: relative;
    display: flex;
    /* place-content: center; */
    justify-content: space-between;
    place-items: center;
    overflow: hidden;
    border-radius: 20px;
    height: 400px;
  }

  .card h2 {
    z-index: 1;
    color: rgb(3, 10, 30);
    font-size: 2em;
  }

  .card::before {
    content: '';
    position: absolute;
    width: 900px;
    background-image: linear-gradient(180deg, rgb(0, 183, 255), rgb(255, 48, 255));
    height: 130%;
    animation: rotBGimg 3s linear infinite;
    transition: all 0.2s linear;
  }

  @keyframes rotBGimg {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  .card::after {
    content: '';
    background: #d2d5d8;
    inset: 5px;
    border-radius: 15px;
  }

  h2 {
    /* font-family: "VT323", monospace; */
    font-family: 'Silkscreen', cursive;
    color: black;
    /* border-bottom: 1px solid black; */
  }

  h3 {
    font-family: 'Silkscreen', cursive;
    font-size: 15px;
    color: rgb(75, 71, 71);
    /* color: rgb(231, 231, 231); */
    margin-top: 10px;
  }

  .titulo-caracteristicas {
    display: flex;
    /* flex-direction: row; */
    justify-content: center;
    padding: 10px;
  }

  span {
    color: rgb(231, 231, 231);
    /* color: rgb(107, 108, 109); */
    /* font-family: "Tajawal", sans-serif; */
    /* margin-left: 15px; */
    font-size: 15px;
    font-weight: 700;
    font-style: italic;
  }

  element.style {
    background-color: red !important;
  }
</style>
