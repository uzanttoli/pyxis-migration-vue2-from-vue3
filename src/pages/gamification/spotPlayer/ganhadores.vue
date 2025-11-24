<template>
  <apresentacao-carousel-component :items="arrayImg"></apresentacao-carousel-component>
</template>

<script>
  import apresentacaoCarouselComponent from '../../../shared/components/carousel/apresentacaoResultadoCarousel.component.vue'

  import config from '../../../core/config'
  export default {
    components: { apresentacaoCarouselComponent },
    data: () => ({
      arrayImg: []
    }),
    methods: {
      loadImgWinner() {
        let urlData = `${config.baseUrl}api/shared/gamification/ganhadores/img`
        this.$api.get(urlData).then(res => {
          this.arrayImg = res.data
        })
      }
    },
    created() {
      this.loadImgWinner()
    }
  }
</script>

<style></style>
