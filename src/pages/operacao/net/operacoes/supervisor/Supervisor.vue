<template>
  <v-card class="mx-auto rounded-xl mt-8 mb-5" width="100%">
    <v-tabs v-model="tab" grow>
      <template v-for="(tab, i) in tabs">
        <v-tab
          :key="i"
          class="rounded-t-xl"
          @click="updateRoute(tab.ROUTE)"
          v-if="restricaoTipoAcesso(tab.COMPONENT_TIPO_ACESSO, filtro)"
        >
          {{ tab.LABEL }}
        </v-tab>
      </template>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <template v-for="tab in tabs">
        <v-tab-item :key="tab.LABEL" v-if="restricaoTipoAcesso(tab.COMPONENT_TIPO_ACESSO, filtro)">
          <component :is="tab.COMPONENT" class="mx-3 mmb-10"></component>
        </v-tab-item>
      </template>
    </v-tabs-items>
  </v-card>
</template>

<script>
  import dadosOnline from './supervisor.component.vue'
  import feedback from '@/shared/components/feedback/PageFeedback.vue'
  import tratarDemandas from './tratarDemandas/tratarDemandas.component.vue'

  import config from '@/core/config'
  import validacaoAcesso from '@/mixins/validacao.js'
  export default {
    components: { dadosOnline, feedback, tratarDemandas },
    mixins: [validacaoAcesso],
    data: () => ({
      nameSubmenu: 'supervisor',
      tab: null,
      tabs: []
    }),
    computed: {
      filtro() {
        let filtro = this.$store.getters.usuario.filtro
        return filtro.toLowerCase()
      },
      produto() {
        return this.$store.getters.usuario.produto
      }
    },
    methods: {
      updateRoute(route) {
        this.$router.push({ path: route }).catch(() => {})
      },
      loadPainelConfig() {
        let urlData = `${config.baseUrl}api/shared/painel/config/${this.produto}/${this.nameSubmenu}`
        this.$api.get(urlData).then(res => {
          this.tabs = res.data
        })
      }
    },
    created() {
      this.loadPainelConfig()
    }
  }
</script>

<style></style>
