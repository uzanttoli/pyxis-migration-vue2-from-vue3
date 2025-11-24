<template>
  <v-card color="white" class="mx-auto rounded-xl mb-5 mt-7" width="100%">
    <v-tabs v-model="tab" grow>
      <template v-for="(tab, i) in tabs">
        <v-tab
          :key="i"
          class="rounded-t-xl"
          @click="updateRoute(tab.ROUTE)"
          v-if="
            restricaoTipoAcesso(tab.COMPONENT_TIPO_ACESSO, filtro) &&
            restricaoRegional(tab.COMPONENT_REGIONAL_EXCECAO, regional)
          "
        >
          {{ tab.LABEL }}
        </v-tab>
      </template>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <template v-for="tab in tabs">
        <v-tab-item
          :key="tab.LABEL"
          v-if="
            restricaoTipoAcesso(tab.COMPONENT_TIPO_ACESSO, filtro) &&
            restricaoRegional(tab.COMPONENT_REGIONAL_EXCECAO, regional)
          "
        >
          <component :is="tab.COMPONENT" class="mx-3 mmb-10"></component>
        </v-tab-item>
      </template>
    </v-tabs-items>
  </v-card>
</template>

<script>
  const tabAcompanhamentoGeral = () =>
    import('./acompanhamentoGeral/acompanhamentoGeral.component.vue')
  const tabShortCall = () => import('./shortCall60/shortCall60.component.vue')
  const tabLinhaMuda = () => import('./linhaMuda/linhaMuda.component.vue')
  import config from '../../../core/config'
  import validacaoAcesso from '../../../mixins/validacao'
  export default {
    components: {
      tabShortCall,
      tabLinhaMuda,
      tabAcompanhamentoGeral
    },
    mixins: [validacaoAcesso],
    data: () => ({
      nameSubmenu: 'workflow',
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
      },
      regional() {
        let tipo = this.$store.getters.usuario.regional
        return tipo.toLowerCase()
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
