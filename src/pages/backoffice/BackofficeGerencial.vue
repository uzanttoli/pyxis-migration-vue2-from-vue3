<template>
  <v-container fluid class="mt-5">
    <v-card class="mx-auto" width="100%">
      <v-tabs v-model="tab" grow centered>
        <template v-for="(tab, i) in tabs">
          <v-tab
            :key="i"
            v-if="
              (restricaoTipoAcesso(tab.COMPONENT_TIPO_ACESSO, filtro) &&
                restricaoRegional(tab.COMPONENT_REGIONAL_EXCECAO, regional)) ||
              almopeLiberacao(tab.COMPONENT_ALMOPE_LIBERACAO, usuarioAlmope)
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
              (restricaoTipoAcesso(tab.COMPONENT_TIPO_ACESSO, filtro) &&
                restricaoRegional(tab.COMPONENT_REGIONAL_EXCECAO, regional)) ||
              almopeLiberacao(tab.COMPONENT_ALMOPE_LIBERACAO, usuarioAlmope)
            "
          >
            <keep-alive :max="5">
              <component :is="tab.COMPONENT" class="mx-3 mb-10"></component>
            </keep-alive>
          </v-tab-item>
        </template>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
  import config from '../../core/config.js'
  import validacaoAcesso from '../../mixins/validacao'

  import GerencialOnline from './gerencial/GerencialOnline.vue'
  import GerencialSla from './gerencial/GerencialSla.vue'
  import GerencialAgingAbertura from './gerencial/GerencialAgingAbertura.vue'
  import GerencialProdutividade from './gerencial/GerencialProdutividade.vue'
  export default {
    components: {
      GerencialOnline,
      GerencialSla,
      GerencialAgingAbertura,
      GerencialProdutividade
    },
    mixins: [validacaoAcesso],
    data: () => ({
      tab: null,
      tabs: [],
      nameSubmenu: 'gerencial-bko'
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
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
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
