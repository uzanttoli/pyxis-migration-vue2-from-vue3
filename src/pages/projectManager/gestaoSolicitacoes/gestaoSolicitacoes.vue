<template>
  <v-container fluid class="mx-auto">
    <configuracao-component :isBtn="false" title="Gestão de Solicitações" to="/">
      <div
        style="
          background-color: #ebebeb;
          display: flex;
          align-items: center;
          border-radius: 8px;
          margin: 8px;
          padding: 6px;
        "
      >
        <v-tabs v-model="tab" align-with-title class="rounded-xl transparent-tabs">
          <v-tabs-slider color="purple darken-3"></v-tabs-slider>

          <template v-for="(tab, i) in tabs" :key="i">
            <v-tab class="black--text font-weight-bold">
              <v-icon class="mr-2" size="18">{{ tab.ICONE }}</v-icon>

              <span style="font-size: 12px">{{ tab.LABEL }}</span>
            </v-tab>
          </template>
        </v-tabs>
      </div>

      <v-tabs-items v-model="tab" class="rounded-xl">
        <template v-for="tab in tabs" :key="tab.LABEL">
          <v-tab-item>
            <v-card :loading="loadingBase" tile>
              <component
                :is="tab.COMPONENT"
                class="rounded-xl mx-3 mb-10"
                @update:loading="loadDataSolicitacoes"
              ></component>
            </v-card>
          </v-tab-item>
        </template>
      </v-tabs-items>
    </configuracao-component>
  </v-container>
</template>

<script>
  // import config from "../../../core/config";
  import painelSolicitacoes from './tabs/painel.vue'
  import minhasTratativas from '../areaTratativa/minhasTratativas/cardsMinhasTratativas.vue'
  import ConfiguracaoComponent from '../../../shared/components/configuracao/Configuracao.component.vue'
  import DemandasFinalizadas from './DemandasFinalizadas.vue'
  export default {
    components: {
      ConfiguracaoComponent,
      painelSolicitacoes,
      minhasTratativas,
      DemandasFinalizadas
    },
    data: () => ({
      items: [
        { title: 'Aberto', icon: 'mdi-view-dashboard' },
        { title: 'Cancelado', icon: 'mdi-account-box' },
        { title: 'Em execução', icon: 'mdi-gavel' }
      ],
      card: [],
      tabs: [
        {
          LABEL: 'Painel',
          COMPONENT: 'painelSolicitacoes',
          ICONE: 'fa-solid fa-user-gear'
        },
        {
          LABEL: 'Minhas Tratativas',
          COMPONENT: 'minhasTratativas',
          ICONE: 'fa-solid fa-user-clock'
        },
        {
          LABEL: 'Tratativas finalizadas/canceladas',
          COMPONENT: 'DemandasFinalizadas',
          ICONE: 'fa-solid fa-ban'
        }
      ],
      nameSubmenu: 'gestao-solicitacoes',
      tab: null,
      loadingBase: false
    }),
    computed: {
      produto() {
        return this.$store.getters.usuario.produto
      }
    },
    methods: {
      // async loadTabsConfig() {
      //   let urlData = `${config.baseUrl}api/shared/painel/config/${this.produto}/${this.nameSubmenu}`;
      //   await this.$api.get(urlData).then((res) => {
      //     this.tabs = res.data;
      //   });
      // },
      loadDataSolicitacoes(e) {
        this.loadingBase = e
      }
    },
    created() {
      // this.loadTabsConfig();
    }
  }
</script>

<style scoped>
  .transparent-tabs ::v-deep .v-tabs-bar {
    background-color: transparent !important;
  }
</style>
