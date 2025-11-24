<template>
  <v-card class="rounded-xl pa-8" :loading="loading">
    <div class="d-flex flex-row justify-between align-center">
      <Title icon="fa-solid fa-receipt" title="Campanhas" />
      <v-btn
        v-if="hasPermission"
        height="40"
        color="success"
        @click="$router.push('/pyxis/raspadinha/campanha/nova')"
      >
        Nova
        <v-icon class="ml-2" dark>fa-solid fa-plus</v-icon>
      </v-btn>
    </div>
    <div v-if="campaigns.length > 0" class="d-flex flex-row flex-wrap gap-3 py-16">
      <div
        v-for="(item, index) in campaigns"
        :key="index"
        class="campaign-bg d-flex flex-column align-center justify-center clickable"
      >
        <div
          class="bg-opacity-white-90 radius-3 pa-4 ma-4 truncate h-75 w-75 d-flex justify-center align-center"
          @click="$router.push(`/pyxis/raspadinha/campanha/${item.ID}/Cartelas`)"
        >
          <h3>{{ item.TITLE }}</h3>
        </div>
        <div v-if="hasPermissionPublish">
          <v-btn
            small
            rounded
            :disabled="!isActive(item)"
            @click="publishForm(item.ID)"
            class="pa-2 ma-2"
          >
            {{ item.PUBLISHED ? 'Remover do ar' : 'Publicar' }}
            <v-icon size="16" :color="item.PUBLISHED ? 'red' : 'green'" class="pl-2">
              fa-solid fa-power-off
            </v-icon>
          </v-btn>
        </div>
      </div>
    </div>
    <v-col v-else>
      <div style="display: flex; justify-content: center; padding: 10px">
        <p class="pa-0 ma-0 text-h6 grey--text">
          <i class="fa-solid fa-quote-left"></i>
          Não há campanhas disponíveis para você
          <i class="fa-solid fa-quote-right"></i>
        </p>
      </div>
    </v-col>
  </v-card>
</template>

<script>
  import Title from '@/shared/components/Title/Title.vue'
  import CampaignService from '@/data/services/scratchCard/CampaignService'
  import alerts from '@/mixins/alerts.mixins'
  export default {
    name: 'RaspadinhaContent',
    components: { Title },
    mixins: [alerts],
    data() {
      return {
        loading: false,
        campaigns: []
      }
    },
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      hasPermission() {
        return this.usuario.filtro != 'OPERADOR'
      },
      hasPermissionPublish() {
        return this.usuario.filtro != 'OPERADOR' && this.usuario.filtro != 'SUPERVISOR'
      }
    },
    methods: {
      isActive(item) {
        return item.DELETED_AT ? false : true
      },
      async publishForm(id) {
        try {
          const currentCampaign = this.campaigns.find(campaign => campaign.ID === id)
          const data = {
            id: currentCampaign.ID,
            title: currentCampaign.TITLE,
            published: currentCampaign.PUBLISHED ? 0 : 1
          }

          const updated = await CampaignService.update(id, data)
          if (updated) {
            this.toast(
              'Status de campanha alterado com sucesso',
              'top-right',
              false,
              3000,
              'success'
            )
            this.fetchData()
          }
        } catch (error) {
          this.toast(error, 'top-right', false, 3500, 'error')
        }
      },
      async fetchData() {
        this.loading = true
        this.campaigns = await CampaignService.getAll()
        this.loading = false
      }
    },
    async mounted() {
      if (this.hasPermission) {
        this.fetchData()
      } else {
        this.campaigns = await CampaignService.getAllByRole(
          this.usuario.almope,
          this.usuario.regional,
          false
        )
      }
    }
  }
</script>

<style scoped>
  .campaign-bg {
    width: 400px;
    height: 200px;
    border-radius: 10px;
    background-color: #e5e5f7;
    opacity: 0.8;
    background: repeating-linear-gradient(45deg, #444cf7, #444cf7 5px, #e5e5f7 5px, #e5e5f7 25px);
  }
</style>
