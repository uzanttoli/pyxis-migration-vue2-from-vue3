<template>
  <v-col cols="12" class="mt-7">
    <v-row justify="center">
      <v-carousel cycle height="300" hide-delimiter-background show-arrows-on-hover>
        <v-carousel-item v-for="(slide, i) in slides" :key="i">
          <v-sheet width="100%" height="100%">
            <v-row align="center">
              <div class="profile">
                <img class="img-banner" :src="imagemBanner(slide.NOME_ARQUIVO_IMAGEM)" />
                <!-- 1757 x 300 -->
              </div>
            </v-row>
          </v-sheet>
        </v-carousel-item>
      </v-carousel>
    </v-row>
  </v-col>
</template>

<script>
  export default {
    props: {
      slides: {
        type: Array
      }
    },
    data: () => ({}),
    methods: {
      imagemBanner(img) {
        return `http://172.16.252.214:4200/index.php/api/shared/arquivos/imagem_banner/${img}`
      },
      preparaImg(value) {
        let img = require.context('./', false, /\png$/)
        return img('./' + value + '.png')
      }
    }
  }
</script>

<style scoped>
  .profile {
    width: 100%;
    height: 100%;
  }

  .img-banner {
    width: 100%;
  }
</style>
