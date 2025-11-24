<template>
  <v-sheet elevation="0">
    <v-card>
      <v-tabs color="deep-purple accent-4" left>
        <v-tab>Inicio</v-tab>
        <v-tab>Conquista</v-tab>
        <v-tab>Sobre</v-tab>
        <v-tab-item>
          <v-container fluid>
            <v-sheet elevation="0" class="ma-0 pt-5">
              <card-banner></card-banner>
              <v-row>
                <v-col cols="12">
                  <v-sheet elevation="4" class="ma-1 pb-8 pt-4 rounded-br-xl" v-if="usuarioAlmope">
                    <card-tempos :usuarioAlmope="usuarioAlmope"></card-tempos>
                  </v-sheet>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <v-sheet elevation="4" class="ma-1 pb-8 pt-4 rounded-bl-xl">
                    <card-indicadores-chart
                      :usuarioAlmope="usuarioAlmope"
                      title="Score"
                    ></card-indicadores-chart>
                  </v-sheet>
                </v-col>
              </v-row>
            </v-sheet>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <h1>Conquistas</h1>
        </v-tab-item>
        <v-tab-item>
          <h1>Sobre</h1>
        </v-tab-item>
      </v-tabs>
    </v-card>
    <!--  -->
  </v-sheet>
</template>
<script>
  import cardTempos from './cards/cardTempos'
  import cardBanner from './cards/cardBanner'
  import cardIndicadoresChart from './cards/cardIndicadoresChart'

  export default {
    name: 'gamification',
    components: {
      cardTempos,
      cardBanner,
      cardIndicadoresChart
    },
    props: {
      usuarioConsulta: {
        type: [String, Number],
        default: null
      }
    },
    data: () => ({}),
    computed: {
      usuarioAlmope() {
        return this.usuarioConsulta ? this.usuarioConsulta : this.$store.getters.usuario.almope
      },
      usuarioNome() {
        return this.usuarioConsulta ? this.usuarioConsulta : this.$store.getters.usuario.nome
      },
      meusIndicadores() {
        return this.$store.getters.meusIndicadores
      }
    },
    methods: {},
    watch: {},
    created() {}
  }
</script>
