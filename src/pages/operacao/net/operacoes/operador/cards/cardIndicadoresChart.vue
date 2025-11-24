<template>
  <v-card elevation="0">
    <template v-if="atingimentoScoreboard">
      <title-negative-margin :title="title" :icon="titleIcon"></title-negative-margin>

      <v-spacer></v-spacer>

      <div class="space-around text-center">
        <chart-bullet :data="atingimentoScoreboard"></chart-bullet>
      </div>
    </template>

    <span v-else>
      <v-icon class="ma-4 pa-4" color="purple">mdi-information</v-icon>
      Sem dados de indicadores
    </span>
  </v-card>
</template>

<script>
  // import titleNegativeMargin from "../../../../shared/components/titles/titleNegativeMargin.component";
  import chartBullet from './bulletChart'
  export default {
    name: 'card-indicadores-chart',
    components: {
      chartBullet
      // titleNegativeMargin,
    },
    props: {
      title: {
        type: String,
        default: 'Título'
      },
      usuarioAlmope: {
        type: String,
        default: null
      },
      titleIcon: {
        type: String,
        default: 'mdi-monitor-dashboard'
      }
    },
    data: () => ({}),
    computed: {
      // iconsData() {
      //   return {
      //     TMT: this.iconPath("timer.svg"),
      //     RECHAMADA: this.iconPath("phone-return.svg"),
      //     ABS: this.iconPath("account-minus.svg"),
      //     OS: this.iconPath("calendar-cursor.svg"),
      //     TEMPO_LOGADO: this.iconPath("account-clock.svg"),
      //     JACKIN_SHE: this.iconPath("phone-off.svg"),
      //     PARTICULAR: this.iconPath("phone-alert.svg"),
      //     TRANSFERENCIA_RET: this.iconPath("phone-lock.svg"),
      //     OCS_FINANCEIRAS: this.iconPath("phone-lock.svg"),
      //     TNPS: this.iconPath("phone-lock.svg"),
      //   };
      // },
      atingimentoScoreboard() {
        let dadosAtingimento = this.$store.getters.atingimentoScoreboard
        let tempd = []
        let tempd2 = []
        if (dadosAtingimento[0]) {
          tempd = Object.entries(dadosAtingimento[0])
          tempd2 = tempd.map(el => {
            let value = el[1].replace('%', '').replace(',', '.').replace('-', 0).replace('N/A', 0)
            return {
              name: el[0],
              steps: parseInt(value),
              href: this.iconsData[el[0]]
            }
          })
          return tempd2
        }
        return null
      }
    },
    methods: {
      // iconPath(icon) {
      //   let url = `${require(`@/assets/img/score/${icon}`)}`;
      //   return url;
      // },
      loadScoreboard() {
        return this.$store.dispatch('loadAtingimentoScoreboard', this.usuarioAlmope)
      }
    },
    created() {
      this.loadScoreboard()
    }
  }
</script>

<style></style>
