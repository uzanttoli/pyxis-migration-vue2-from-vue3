<template>
  <v-card class="rounded-xl pa-8" :loading="loading">
    <div class="d-flex flex-row justify-between align-center">
      <Title icon="fa-solid fa-receipt" title="Cartelas:" />
      <v-btn
        v-if="hasPermission"
        height="40"
        color="success"
        @click="
          $router.push(`/pyxis/raspadinha/campanha/${$route.params.campaignId}/cartelas/nova`)
        "
      >
        Nova
        <v-icon class="ml-2" dark>fa-solid fa-plus</v-icon>
      </v-btn>
    </div>
    <div v-if="drawForms.length > 0" class="d-flex flex-row flex-wrap gap-3 py-16">
      <div
        v-for="(item, index) in drawForms"
        :key="index"
        :class="['scratch-card-item-bg', { 'custom-bg': bgImage }]"
        :style="bgImage ? { backgroundImage: `url(${bgImage + item.ID + '.png'})` } : {}"
        class="d-flex align-center justify-center clickable"
        @click="
          $router.push(`/pyxis/raspadinha/campanha/${$route.params.campaignId}/cartelas/${item.ID}`)
        "
      >
        <div
          v-if="!bgImage"
          class="bg-opacity-white-90 radius-3 pa-4 ma-4 truncate h-75 w-75 d-flex justify-center align-center"
        >
          <h3>{{ item.TITLE }}</h3>
        </div>
      </div>
    </div>
    <v-col v-else>
      <div style="display: flex; justify-content: center; padding: 10px">
        <p class="pa-0 ma-0 text-h6 grey--text">
          <i class="fa-solid fa-quote-left"></i>
          Não há cartelas disponíveis para você
          <i class="fa-solid fa-quote-right"></i>
        </p>
      </div>
    </v-col>
  </v-card>
</template>

<script>
  import Title from '../../../shared/components/Title/Title.vue'
  import DrawCardService from '@/data/services/scratchCard/DrawCardService'
  import FileService from '@/data/services/file/fileService'
  export default {
    name: 'RaspadinhaContent',
    components: { Title },
    data() {
      return {
        loading: false,
        drawForms: [],
        bgImage: null
      }
    },
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      hasPermission() {
        return this.usuario.filtro != 'OPERADOR'
      }
    },
    async mounted() {
      this.drawForms = await DrawCardService.getAll(this.$route.params.campaignId)
      this.bgImage = await FileService.getFolderUrl('raspadinhaCartela')
    }
  }
</script>

<style scoped>
  .scratch-card-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 10px;
  }
  .scratch-card-item-bg {
    width: 400px;
    height: 200px;
    border-radius: 10px;
    background-color: #e5e5f7;
    opacity: 0.8;
    background-image: linear-gradient(135deg, #444cf7 25%, transparent 25%),
      linear-gradient(225deg, #444cf7 25%, transparent 25%),
      linear-gradient(45deg, #444cf7 25%, transparent 25%),
      linear-gradient(315deg, #444cf7 25%, #e5e5f7 25%);
    background-position: 36px 0, 36px 0, 0 0, 0 0;
    background-size: 72px 72px;
    background-repeat: repeat;
  }
  .custom-bg {
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
</style>
