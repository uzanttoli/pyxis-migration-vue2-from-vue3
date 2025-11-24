<template>
  <v-card class="my-3 rounded-tl-xl">
    <title-rounded-tl-rb class="mb-4">
      <template v-slot:title>
        <v-icon color="white" class="mr-2">mdi-handshake-outline</v-icon>
        <h2 class="white--text">
          {{ 'Validar benção ID: ' + $route.params.id }}
        </h2>
      </template>
      <v-spacer></v-spacer>
      <v-btn fab dark small color="white" to="/pyxis/gamification/gestao-player/validar-bencao">
        <v-icon color="blue">mdi-chevron-left</v-icon>
      </v-btn>
    </title-rounded-tl-rb>
    <v-col>
      <v-row>
        <img class="img-perfil" :src="imagemPerfil(imagemPerfilBencao)" />
        <v-col class="pa-5">
          <v-row>
            <v-text-field
              label="Almope Player"
              :value="dados.ALMOPE_PLAYER"
              outlined
              disabled
              class="mr-3"
            ></v-text-field>
            <v-text-field
              label="Nome Player"
              :value="dados.NOME_PLAYER"
              outlined
              disabled
              class="mr-3"
            ></v-text-field>
          </v-row>
          <v-row>
            <v-text-field
              label="Regional Player"
              :value="dados.REGIONAL"
              outlined
              disabled
              class="mr-3"
            ></v-text-field>
            <v-text-field
              label="Nome Solicitante Benção"
              :value="dados.NOME_GESTOR"
              outlined
              disabled
              class="mr-3"
            ></v-text-field>
          </v-row>
          <v-row class="mb-n10">
            <v-text-field
              label="Nome Tratamento"
              :value="usuarioTratativa"
              outlined
              disabled
              class="mr-3"
            ></v-text-field>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-col class="pa-5">
      <v-row>
        <img
          class="img-evidencia"
          :src="imagemEvidenciaBencao(dados.EVIDENCIA_BENCAO)"
          alt=""
          @click="verificarEvidencia"
          style="cursor: pointer"
        />
        <v-col class="mt-n2">
          <v-textarea
            outlined
            no-resize
            rows="18"
            label="Descreva sobre a validação..."
            v-model="observacao"
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row class="mt-n7">
        <v-col>
          <v-btn block rounded color="success" @click="validarBencao(1)">Aprovar</v-btn>
        </v-col>
        <v-col>
          <v-btn block rounded color="error" @click="validarBencao(0)">Reprovar</v-btn>
        </v-col>
      </v-row>
    </v-col>
    <dialog-evidencia-bencao
      :imgEvidencia="imgEvidenciaSelecionada"
      :dialogEvidenciaBencao="dialogEvidenciaBencao"
    ></dialog-evidencia-bencao>
  </v-card>
</template>

<script>
  import config from '../../../../core/config'
  import DialogEvidenciaBencao from './DialogEvidenciaBencao.vue'
  export default {
    components: { DialogEvidenciaBencao },
    data: () => ({
      dadosParaValidacao: [],
      observacao: 'Necessário anexar nova evidência.',
      dialogEvidenciaBencao: false,
      imgEvidenciaSelecionada: ''
    }),
    computed: {
      dados() {
        let dadosValidacao = this.dadosParaValidacao[0]
        return dadosValidacao ? dadosValidacao : []
      },
      imagemPerfilBencao() {
        let img = this.dadosParaValidacao[0]
        if (img) {
          if (img.NOME_AVATAR != null) {
            return img.NOME_AVATAR
          } else {
            return 'padrao.png'
          }
        } else {
          return null
        }
      },
      usuarioTratativa() {
        return this.$store.getters.usuario.nome
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    mounted() {
      // let keysPressed = {};
      // window.addEventListener("keydown", (event) => {
      //   keysPressed[event.key] = true;
      //   if (keysPressed["Control"] && event.key == "y") {
      //     event.preventDefault();
      //     this.validarBencao(1);
      //   } else if (keysPressed["Control"] && event.key == "n") {
      //     event.preventDefault();
      //     this.validarBencao(2);
      //   }
      // });
      // window.addEventListener("keyup", (event) => {
      //   delete keysPressed[event.key];
      // });
    },
    methods: {
      imagemEvidenciaBencao(img) {
        this.imgEvidenciaSelecionada = img
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagem_evidencia_bencao/${img}`
      },
      verificarEvidencia() {
        this.dialogEvidenciaBencao = !this.dialogEvidenciaBencao
      },
      // clienteIP() {
      //   this.$store.dispatch("clienteIP");
      // },
      async validarBencao(num) {
        if (num === 1) {
          let data = {
            id: this.$route.params.id,
            permitirLiberacao: num,
            dataHoraFimBan: this.moment().format('YYYY-MM-DD'),
            almopeValidacao: this.usuarioAlmope
          }
          let urlData = `${config.baseUrl}api/shared/gamification/gestao_player/validar_reviver/`
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
          // this.$router.push({ path: "/pyxis/gamification/gestao-player/validar-bencao",});
          window.history.go(-1)
        } else {
          let data = {
            id: this.$route.params.id,
            observacao: this.observacao,
            permitirLiberacao: num,
            almopeValidacao: this.usuarioAlmope
          }
          let urlData = `${config.baseUrl}api/shared/gamification/gestao_player/validar_reviver/`
          let getFormData = object =>
            Object.keys(object).reduce((FormData, key) => {
              FormData.append(key, object[key])
              return FormData
            }, new FormData())
          await this.$api.post(urlData, getFormData(data))
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
            title: 'Validação encaminhada para supervisor.'
          })
          this.$router.push({
            path: '/pyxis/gamification/gestao-player/validar-bencao'
          })
        }
      },
      imagemPerfil(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/minha_imagem/${img}`
      },

      async loadDadosValidacao() {
        try {
          let urlData = `${config.baseUrl}api/shared/gamification/gestao_player/reviver_player/${this.$route.params.id}`
          var res = await this.$api.get(urlData)
          this.dadosParaValidacao = res.data
        } catch (error) {
          if (error.response.status) {
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
              icon: 'warning',
              title: error.response.data
            })
            this.$router.push({
              path: '/pyxis/gamification/gestao-player'
            })
          }
        }
      }
    },
    created() {
      // this.clienteIP();
      this.loadDadosValidacao()
    }
  }
</script>

<style scoped>
  .container-dados {
    display: flex;
    flex-direction: row;
    justify-content: start;
  }

  .title {
    display: flex;
    justify-content: center;
    padding-top: 10px;
    color: #808080;
  }

  .img-perfil {
    padding: 5px;
    height: auto;
    width: 15rem;
    /* max-width: 150px; */
  }

  .img-evidencia {
    max-width: 50%;
    /* max-width: 50rem; */
    height: 38em;
    background-size: contain;
    background-repeat: no-repeat;
  }

  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
</style>
