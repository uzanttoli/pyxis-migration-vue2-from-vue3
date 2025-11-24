<template>
  <configuracao-component to="/pyxis/service-to-sales/smart-sales">
    <div>
      <v-tabs v-model="tab">
        <template v-for="(tab, i) in tabs" :key="i">
          <v-tab>{{ tab.LABEL }}</v-tab>
        </template>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <template v-for="tab in tabs" :key="tab.LABEL">
          <v-tab-item>
            <component :is="tab.COMPONENT" class="mb-10"></component>
          </v-tab-item>
        </template>
      </v-tabs-items>
    </div>
  </configuracao-component>
</template>

<script>
  import alteracaoPontual from './alteracaoPontual.vue'
  import cadastroMassivo from './cadastroMassivo.vue'
  import cadastroDeCidades from './cadastroDeCidades.vue'

  import configuracaoComponent from '../../../shared/components/configuracao/Configuracao.component.vue'
  import config from '../../../core/config'
  export default {
    components: {
      configuracaoComponent,
      alteracaoPontual,
      cadastroMassivo,
      cadastroDeCidades
    },
    data: () => ({
      nameSubmenu: 'smart-sales',
      tabs: [],
      tab: null
    }),
    computed: {
      produto() {
        return this.$store.getters.usuario.produto
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

<style scoped></style>
