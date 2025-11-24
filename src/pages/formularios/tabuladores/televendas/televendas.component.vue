<template>
  <v-sheet v-if="dadosAlmope.ATIVACAO">
    <template>
      <card-titulo-pagina-com-fundo>
        <template v-slot:title>
          <v-icon color="white" class="mr-2">mdi-sale</v-icon>
          Televendas
        </template>

        <template v-slot:subtitle>Dados atualizados pelo CCO</template>
      </card-titulo-pagina-com-fundo>

      <v-row class="mt-n15">
        <v-col cols="4">
          <card-three-subtitles title="Ativação">
            <template v-slot:card-value>
              Performance: {{ dadosAlmope.P_ATIVACAO | percentage }}
            </template>
            <template v-slot:subtitle1>Ativações: {{ dadosAlmope.ATIVACAO }}</template>
            <template v-slot:subtitle2>
              <small>Ligações atendidas: {{ dadosAlmope.ATENDIDAS }}</small>
            </template>
          </card-three-subtitles>
        </v-col>

        <v-col cols="4">
          <card-three-subtitles title="Migração">
            <template v-slot:card-value>
              Performance: {{ dadosAlmope.P_MIGRACAO | percentage }}
              <v-progress-circular :size="15" :value="countInterval"></v-progress-circular>
            </template>
            <template v-slot:subtitle1>Migrações: {{ dadosAlmope.MIGRACAO }}</template>
            <template v-slot:subtitle2>
              <small>Ligações atendidas: {{ dadosAlmope.ATENDIDAS }}</small>
            </template>
          </card-three-subtitles>
        </v-col>

        <v-col cols="4">
          <card-three-subtitles title="Possibilidade ganhos">
            <template v-slot:card-value>
              Total: {{ parseFloat(dadosAlmope.VALOR) | moneyBr }}
            </template>
            <template v-slot:subtitle1>
              <small>*Base cliente</small>
            </template>
            <template v-slot:subtitle2>
              <small>**Dados passíveis de revisão</small>
            </template>
          </card-three-subtitles>
        </v-col>
      </v-row>
      <v-divider class="ma-5"></v-divider>
    </template>
  </v-sheet>
</template>

<script>
  const CardTituloPaginaComFundo = () =>
    import('../../../../shared/components/cards/cardTituloPaginaComFundo.vue')
  const CardThreeSubtitles = () =>
    import('../../../../shared/components/cards/cardThreeSubtitles.vue')

  export default {
    name: 'televendas',
    components: {
      CardTituloPaginaComFundo,
      CardThreeSubtitles
    },
    data: () => ({
      countInterval: 0,

      dadosAlmopeDefault: {
        ALMOPE: 0,
        ATENDIDAS: 0,
        ATIVACAO: 0,
        MIGRACAO: 0,
        P_ATIVACAO: 0.0,
        VALOR: 0.0,
        P_MIGRACAO: 0.0
      }
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      dadosAlmope() {
        return this.$store.getters.dadosPorAlmope[0]
          ? this.$store.getters.dadosPorAlmope[0]
          : this.dadosAlmopeDefault
      }
    },
    methods: {
      loadDadosPorAlmope() {
        return this.$store.dispatch('loadDadosPorAlmope', this.usuarioAlmope)
      }
    },
    created() {
      this.loadDadosPorAlmope()
    }
  }
</script>

<style></style>
