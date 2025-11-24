<template>
  <!-- v-model="dialogHistoria" -->
  <v-dialog
    :model-value="dialogHistoria"
    @update:modelValue="val => $emit('update:dialogHistoria', val)"
    width="700"
    persistent
  >
    <v-card class="rounded-xl">
      <v-col>
        <v-window show-arrows class="elevation-0">
          <template v-slot:prev="{ on, attrs }">
            <v-btn color="primary" v-bind="attrs" v-on="on" rounded>
              <v-icon>mdi-arrow-left-thick</v-icon>
            </v-btn>
          </template>

          <template v-slot:next="{ on, attrs }">
            <v-btn color="primary" v-bind="attrs" v-on="on" rounded>
              <v-icon>mdi-arrow-right-thick</v-icon>
            </v-btn>
          </template>
          <v-window-item v-for="(item, i) in getInteracao()" :key="i" class="elevation-0">
            <v-row class="fill-height" align="center" justify="center">
              <v-card elevation="0">
                <div class="flex-box container-box">
                  <div class="content-box">
                    <img :src="getImg(item.img)" width="100%" />
                  </div>
                </div>
              </v-card>
            </v-row>
            <template v-if="item.btn">
              <div class="pt-4 mb-1">
                <v-row justify="center">
                  <v-col cols="4">
                    <v-btn
                      :color="errorColor"
                      class="white--text btn-error"
                      block
                      id="error"
                      v-on:mouseenter="mouseenter"
                      v-on:mouseleave="mouseleave"
                      rounded
                      @click="visualizarHistoria"
                    >
                      {{ textError }}
                    </v-btn>
                  </v-col>
                  <v-col cols="4">
                    <v-btn
                      :color="successColor"
                      class="white--text"
                      block
                      rounded
                      @click="visualizarHistoria"
                    >
                      {{ textSuccess }}
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </template>
            <template v-if="item.btnClose">
              <div class="pt-4 mb-1">
                <v-row justify="center">
                  <v-col cols="9">
                    <v-btn
                      class="white--text"
                      block
                      rounded
                      color="error"
                      @click="$emit('closeHistoria')"
                    >
                      Fechar
                    </v-btn>
                  </v-col>
                </v-row>
              </div>
            </template>
          </v-window-item>
        </v-window>
      </v-col>
    </v-card>
  </v-dialog>
</template>

<script>
  import config from '../../../core/config'
  export default {
    props: {
      dialogHistoria: {
        type: Boolean,
        default: false
      },
      visualizado: {
        type: [Array, Object],
        required: true
      }
    },
    data: () => ({
      errorColor: 'error',
      successColor: 'success',
      textError: 'Outro Time',
      textSuccess: ''
      // visualizado: [],
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    mounted() {
      this.textSuccess = `O Time ${this.$store.getters.usuario.grupo}`
    },
    methods: {
      _closedialogHistoria() {
        this._dialogHistoria = false
      },
      getInteracao() {
        let historia = [
          {
            img: 'pagina-1',
            btn: false,
            btnClose: false
          },
          {
            img: 'pagina-2',
            btn: false,
            btnClose: false
          },
          {
            img: 'pagina-3',
            btn: false,
            btnClose: false
          },
          {
            img: 'pagina-4',
            btn: false,
            btnClose: false
          },
          {
            img: 'pagina-5',
            btn: false,
            btnClose: false
          },
          {
            img: 'pagina-6',
            btn: false,
            btnClose: false
          },
          {
            img: 'pagina-7',
            btn: false,
            btnClose: false
          },
          {
            img: 'pagina-8',
            btn: false,
            btnClose: false
          },
          {
            img: 'pagina-9',
            btn: false,
            btnClose: false
          },
          {
            img: 'pagina-10',
            btn: this.visualizado?.LOGIN_VISUALIZACAO?.length > 0 ? false : true,
            btnClose: this.visualizado?.LOGIN_VISUALIZACAO?.length > 0 ? true : false
          }
        ]

        return historia
      },
      // existiVisualizacao() {
      //   let urlData = `${config.baseUrl}api/shared/gamification/historia/visualizar/${this.usuarioAlmope}`;
      //   this.$api.get(urlData).then((res) => {
      //     this.visualizado = res.data[0];
      //   });
      // },
      async visualizarHistoria() {
        try {
          let data = {
            id_historia: 1,
            loginVisualizacao: this.usuarioAlmope
          }
          let urlData = `${config.baseUrl}api/shared/gamification/historia/visualizar`
          let getFormData = object =>
            Object.keys(object).reduce((FormData, key) => {
              FormData.append(key, object[key])
              return FormData
            }, new FormData())
          var res = await this.$api.post(urlData, getFormData(data))
          const Toast = this.$swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: toast => {
              toast.addEventListener('mouseenter', this.$swal.stopTimer)
              toast.addEventListener('mouseleave', this.$swal.resumeTimer)
            }
          })
          Toast.fire({
            icon: 'success',
            title: res.data
          })
          this.$emit('closeHistoria')
          // this.existiVisualizacao();
        } catch (error) {
          const Toast = this.$swal.mixin({
            toast: true,
            position: 'bottom-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: toast => {
              toast.addEventListener('mouseenter', this.$swal.stopTimer)
              toast.addEventListener('mouseleave', this.$swal.resumeTimer)
            }
          })
          Toast.fire({
            icon: 'error',
            title: 'Erro inesperado, favor tentar novamente. COD:' + error.response.status
          })
        }
      },
      mouseleave() {
        // let btn = document.getElementById("error");
        // btn.addEventListener("mouseenter", (e) => {
        // });
        this.errorColor = 'error'
        this.successColor = 'success'
        this.textError = 'Outro Time'
        this.textSuccess = `O Time ${this.$store.getters.usuario.grupo}`
      },
      mouseenter() {
        // let btn = document.getElementById("error");
        // btn.addEventListener("mouseenter", (e) => {
        // });
        this.errorColor = 'success'
        this.successColor = 'error'
        this.textError = `O Time ${this.$store.getters.usuario.grupo}`
        this.textSuccess = 'Outro Time'
      },
      getImg(value) {
        let img = require.context('../../../assets/img/historias/comics/', false, /\.png$/)
        return img('./' + value + '.png')
      }
    },
    watch: {
      // dialogHistoria() {
      //   if (this.dialogHistoria == true) {
      //     this.existiVisualizacao();
      //   }
      // },
    },
    created() {
      // this.existiVisualizacao();
    }
  }
</script>

<style scoped>
  .flex-box {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
  }

  .container-box {
    height: 30rem;
  }

  .content-box {
    color: rgb(43, 34, 34);
    text-align: center;
    width: 30rem;
  }

  .container-btn {
    display: flex;
    flex-direction: row;
    justify-content: end;
    padding: 10px 25px 0px;
  }

  .btn-heart {
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .qtd-heart {
    font-size: 12px;
    margin: 0;
    color: #808080;
  }
</style>
