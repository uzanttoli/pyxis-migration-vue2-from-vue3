<template>
  <v-container fluid class="h-full">
    <CardAppBar
      isButtonReturn
      customClass="rounded-xl mb-8"
      :minHeight="135"
      style="margin-top: 10px"
      styleCustom="display: flex; height: 135px; padding: 25px; align-items:center; color: #fafafa;"
      @update:click="goBack"
    >
      <template v-slot:title>
        <h3>
          <v-icon color="white" x-large class="mr-3">fa-solid fa-rug</v-icon>
          Raspadinha
        </h3>
      </template>
    </CardAppBar>
    <v-col class="h-full">
      <img
        v-if="campaignImage"
        :src="campaignImage"
        :key="campaignImage"
        class="w-full h-80 mb-8"
        alt="Imagem Campanha"
      />
      <img
        v-else-if="drawFormImage"
        :src="drawFormImage"
        :key="drawFormImage"
        class="w-full h-80"
        alt="Imagem Cartela"
      />
      <div v-else class="bg-image mb-8" :style="{ backgroundImage: 'url(' + currentImage + ')' }" />

      <!-- ROUTER VIEW -->
      <router-view></router-view>
    </v-col>
  </v-container>
</template>

<script>
  import FileService from '@/data/services/file/fileService'
  import CardAppBar from '../../shared/components/cards/modern/cardAppBar.vue'

  export default {
    name: 'Raspadinha',
    components: { CardAppBar },
    data() {
      return {
        loading: false,
        campaignImage: null,
        drawFormImage: null,
        drawForms: [],
        images: [
          require('@/assets/img/campanhas/raspadinha/defaultBg1.png'),
          require('@/assets/img/campanhas/raspadinha/defaultBg2.png')
        ],
        currentImageIndex: 0
      }
    },
    computed: {
      campaignId() {
        return this.$route.params.campaignId
      },
      drawFormId() {
        return this.$route.params.id
      },
      currentImage() {
        return this.images[this.currentImageIndex]
      }
    },
    methods: {
      goBack() {
        this.$router.go(-1)
      },
      async loadCampaignData() {
        if (this.campaignId) {
          this.campaignImage = await FileService.getFileUrl('raspadinha', this.campaignId)
        } else {
          this.campaignImage = null
        }
      },
      async loadDrawFormData() {
        if (this.drawFormId) {
          this.drawFormImage = await FileService.getFileUrl('raspadinhaCartela', this.drawFormId)
        } else {
          this.drawFormImage = null
        }
      }
    },
    watch: {
      async campaignId() {
        await this.loadCampaignData()
      },
      async drawFormId() {
        await this.loadDrawFormData()
      }
    },
    async beforeRouteUpdate(to, from, next) {
      await this.loadCampaignData()
      await this.loadDrawFormData()
      next()
    },
    async mounted() {
      await this.loadCampaignData()
      await this.loadDrawFormData()
      setInterval(() => {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length
      }, 10000)
    }
  }
</script>
<style scoped>
  .bg-image {
    width: 100%;
    height: 300px;
    background-size: contain;
    background-position: center;
  }
</style>
