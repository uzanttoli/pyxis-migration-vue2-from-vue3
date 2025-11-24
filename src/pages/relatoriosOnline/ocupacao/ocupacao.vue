<template>
  <v-card color="white" class="mx-auto rounded-xl mb-5 mt-7" width="100%">
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
          <component :is="tab.COMPONENT" class="mx-3 mb-10" :produtos="produtos"></component>
        </v-tab-item>
      </template>
    </v-tabs-items>
  </v-card>
</template>

<script>
  const painelOcupacao = () => import('./gerencial/painel.component.vue')
  const gerencialPausas = () => import('./gerencial/pausas/gerencialPausas.component.vue')
  const gerencialAbs = () => import('./gerencial/abs/gerencialAbs.component.vue')
  const visaoOperador = () => import('./gerencial/operadores/visaoOperador.component.vue')

  import config from '../../../core/config'
  import validacaoAcesso from '../../../mixins/validacao'
  import Utils from '@/data/services/common/Utils'
  export default {
    components: {
      gerencialPausas,
      gerencialAbs,
      visaoOperador,
      painelOcupacao
    },
    mixins: [validacaoAcesso],
    data: () => ({
      nameSubmenu: 'ocupacao',
      tab: null,
      tabs: [],
      produtos: []
    }),
    computed: {
      filtro() {
        let filtro = this.$store.getters.usuario.filtro
        return filtro.toLowerCase()
      },
      produto() {
        return this.$store.getters.usuario.produto
      },
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      async loadDataService() {
        const produtos = await Utils.getProductAvailable(
          'OCUPACAO',
          this.usuario.filtro,
          this.usuario.almope
        )
        this.produtos = produtos.map(item => {
          return {
            text: item.text,
            value: item.text
          }
        })
      },
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
    async created() {
      this.loadPainelConfig()
      await this.loadDataService()
    }
  }
</script>

<style></style>
