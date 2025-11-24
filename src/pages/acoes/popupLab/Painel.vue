<template>
  <v-container>
    <v-card class="rounded-xl">
      <v-card-title>
        <v-icon color="red" class="mr-1">fa-solid fa-flask</v-icon>
        <span class="font-weight-semibold text-h6 border-top">Popup</span>
        <span class="red--text font-weight-bold text-h5 border-bottom">Lab</span>
      </v-card-title>
      <v-card-subtitle>Gerencie popup dentro da Pyxis</v-card-subtitle>
      <v-divider></v-divider>
      <v-col>
        <v-col>
          <CriarPopupLab :regionais="regionais" :rotas="rotas"></CriarPopupLab>
        </v-col>
        <v-col>
          <ListPopupLab :regionais="regionais" :rotas="rotas"></ListPopupLab>
        </v-col>
      </v-col>
    </v-card>
  </v-container>
</template>

<script>
  import CriarPopupLab from './CriarPopupLab.vue'
  import ListPopupLab from './ListPopupLab.vue'

  import { PopupLabService } from '@/data/services/Acoes'
  import config from '@/core/config'
  export default {
    components: { CriarPopupLab, ListPopupLab },
    data: () => ({
      regionais: [],
      rotas: []
    }),
    methods: {
      async loadRegionais() {
        let urlData = `${config.baseUrl}api/shared/meus_dados/perfil/regionais/`
        var res = await this.$api.get(urlData)
        this.regionais = res.data
      },
      async loadRoute() {
        this.rotas = await PopupLabService.getListarRotasDisponiveis()
      }
    },
    created() {
      this.loadRegionais()
      this.loadRoute()
    }
  }
</script>

<style></style>
