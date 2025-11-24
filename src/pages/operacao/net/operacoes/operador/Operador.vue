<template>
  <v-card class="mx-auto rounded-xl mb-5 mt-7" width="100%">
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
          <component :is="tab.COMPONENT" class="mb-10"></component>
        </v-tab-item>
      </template>
    </v-tabs-items>
    <comunicado-importante
      v-if="regionaisComunicado"
      :srcImg="require('@/assets/img/divulgacoes/portabilidade_cem_porcento.jpg')"
      title="Comunicado Importante"
    ></comunicado-importante>
  </v-card>
</template>

<script>
  import dadosOnline from './operador.component.vue'

  import meusFeedbacks from './meusFeedbacks/meusFeedbacks.component.vue'
  import comunicadoImportante from '@/shared/components/comunication/comunicado.vue'

  import config from '@/core/config'
  import validacaoAcesso from '@/mixins/validacao'
  export default {
    components: { dadosOnline, meusFeedbacks, comunicadoImportante },
    mixins: [validacaoAcesso],
    data: () => ({
      nameSubmenu: 'operador',
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
      regionaisComunicado() {
        let regionais = [
          'NET MTF S2S BB',
          'NET MTF N1 NSS',
          'NET MTF S2S NSS',
          'NET MTF RET TNPS SL',
          'NET MTF RET SL',
          'NET MTF PROPENSOS BB',
          'NET MTF N1 BB',
          'NET MTF S2S MA BB'
        ]
        let minhaRegional = this.$store.getters.usuario.regional
        let validacao = regionais.includes(minhaRegional)
        return validacao
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
