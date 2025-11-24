<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card color="white" class="rounded-xl mb-5 mt-7">
          <v-tabs v-model="tab" grow color="primary">
            <v-tab v-for="(tab, i) in tabs" :key="i">
              <v-tooltip bottom>
                <template #[`activator`]="{ attrs, on }">
                  <v-icon v-bind="attrs" v-on="on">{{ tab.ICONE }}</v-icon>
                </template>
                <span>{{ tab.LABEL }}</span>
              </v-tooltip>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item v-for="tab in tabs" :key="tab.LABEL">
              <component :is="tab.COMPONENT"></component>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import controleAcesso from './controleAcesso/controleDeAcessoPainel.vue'
  import configuracaoMenu from './configuracaoMenu/configuracaoMenu.vue'
  import configuracaoCampanha from './configuracaoCampanha/configuracaoCampanha.vue'
  import rotinas from './rotinas/rotinas.vue'
  import gerenciamentoGamification from './gamification/GerenciamentoGamification.vue'
  import controleUsuario from './usuarios/Usuarios.vue'
  import config from '../../../core/config'
  export default {
    components: {
      controleAcesso,
      rotinas,
      gerenciamentoGamification,
      controleUsuario,
      configuracaoMenu,
      configuracaoCampanha
    },
    data: () => ({
      tab: null,
      tabs: [],
      nameSubmenu: 'painel'
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

<style></style>
