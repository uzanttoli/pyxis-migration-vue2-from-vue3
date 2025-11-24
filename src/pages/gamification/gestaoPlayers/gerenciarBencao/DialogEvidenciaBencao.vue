<template>
  <v-dialog v-model="_dialogEvidenciaBencao" max-width="1500">
    <v-card class="rounded-xl">
      <div class="container">
        <div class="capa-imagem">
          <img :src="imagemEvidenciaBencao(imgEvidencia)" />
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      imgEvidencia: {
        type: String,
        require: true
      },
      dialogEvidenciaBencao: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({}),
    computed: {
      _dialogEvidenciaBencao: {
        get() {
          return this.dialogEvidenciaBencao
        },
        set(newValue) {
          return newValue
        }
      }
    },
    methods: {
      imagemEvidenciaBencao(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagem_evidencia_bencao/${img}`
      }
    }
  }
</script>

<style scoped>
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  /* .capa-imagem {
  width: 300px;
  margin: 10px;
  background-position: center;
  background-size: cover;
} */
</style>
