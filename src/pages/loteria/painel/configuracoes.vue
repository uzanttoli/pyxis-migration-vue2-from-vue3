<template>
  <v-card elevation="0" tile class="mx-auto" style="margin-top: 35px">
    <v-col>
      <div style="display: flex">
        <h1>Configurações</h1>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon v-bind="attrs" v-on="on" to="/pyxis/loteria/bilhetes">
              <v-icon color="primary">fa-solid fa-person-walking-arrow-loop-left</v-icon>
            </v-btn>
          </template>
          <span>Voltar</span>
        </v-tooltip>
      </div>
      <div>
        <v-tabs v-model="tab">
          <template v-for="(tab, i) in tabs">
            <v-tab :key="i" v-if="restricaoTipoAcesso(tab.COMPONENT_TIPO_ACESSO, filtro)">
              {{ tab.LABEL }}
            </v-tab>
          </template>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <template v-for="tab in tabs">
            <v-tab-item
              :key="tab.LABEL"
              v-if="restricaoTipoAcesso(tab.COMPONENT_TIPO_ACESSO, filtro)"
            >
              <component
                :is="tab.COMPONENT"
                class="mb-10"
                @update:tab-edit="eventTabEdit"
                :dadosEdit="bilheteEditar"
              ></component>
            </v-tab-item>
          </template>
        </v-tabs-items>
      </div>
    </v-col>
  </v-card>
</template>

<script>
  import config from '../../../core/config'
  import validacaoAcesso from '../../../mixins/validacao'
  import painelConfiguracao from './painel.vue'
  import criarBilhete from './criar.vue'
  import editarBilhete from './editar.vue'
  import resultadoBilhete from './finalizarResultado.vue'
  export default {
    components: {
      painelConfiguracao,
      editarBilhete,
      criarBilhete,
      resultadoBilhete
    },
    mixins: [validacaoAcesso],
    data: () => ({
      nameSubmenu: 'bilhetePremiado',
      tab: null,
      tabs: [],
      bilheteEditar: []
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
      eventTabEdit(e) {
        this.tab = 2
        this.bilheteEditar = e
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

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Spectral:wght@200&display=swap"); */
  h1 {
    font-family: 'Spectral', serif;
  }
</style>
