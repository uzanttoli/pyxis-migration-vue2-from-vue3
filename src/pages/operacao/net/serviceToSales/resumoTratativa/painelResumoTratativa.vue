<template>
  <v-card class="mx-auto rounded-xl mb-5" width="100%" style="margin-top: 35px" elevation="0">
    <ProdutividadeBko />
  </v-card>
</template>

<script>
  import config from '@/core/config'
  import validacaoAcesso from '@/mixins/validacao'
  import ProdutividadeBko from './produtividadeBko/produtividadeBko.vue'
  export default {
    components: { ProdutividadeBko },
    mixins: [validacaoAcesso],
    data: () => ({
      nameSubmenu: 'resumo-tratativas',
      tab: null,
      tabs: [],
      loading: false
    }),
    computed: {
      filtro() {
        let filtro = this.$store.getters.usuario.filtro
        return filtro.toLowerCase()
      },
      produto() {
        return this.$store.getters.usuario.produto
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
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
