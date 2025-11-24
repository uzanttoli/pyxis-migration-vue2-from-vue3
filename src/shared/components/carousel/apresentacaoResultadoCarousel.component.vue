<template>
  <v-card>
    <v-carousel hide-delimiters hide-delimiter-background show-arrows-on-hover height="100%">
      <v-carousel-item v-for="(item, i) in items" :key="i">
        <div class="profile">
          <img class="img-banner" :src="imagemBanner(item.NOME_ARQUIVO)" />
          <!-- 1757 x 300 -->
        </div>
      </v-carousel-item>
    </v-carousel>
  </v-card>
</template>

<script>
  export default {
    props: {
      dialog: {
        type: Boolean,
        default: false
      },
      items: {
        type: Array,
        require: true
      },
      nameSrc: {
        type: String,
        require: true
      }
    },
    methods: {
      imagemBanner(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagens_ganhadores/${img}`
      }
    }
  }
</script>

<style scoped>
  .profile {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .img-banner {
    /* background-size: 100%; */
    position: relative;
    height: 100vh;
    width: 100vw;
    /* adicionando imagem de fundo */
    background-size: cover;
  }
</style>
