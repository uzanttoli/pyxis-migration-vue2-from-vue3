<template>
  <v-card elevation="0">
    <template>
      <v-subheader>
        <h3>Pausas</h3>
        <v-img class="shrink ml-2" contain height="25px" style="flex-basis: 25px"></v-img>
        <!-- src="../../../../../assets/img/score/pause-button.svg" -->
      </v-subheader>

      <!-- <div class="space-around text-center">
        <v-tooltip
          bottom
          v-for="(item, i) in meusTempos"
          :key="i"
          class="ma-0 pa-0"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-chip
              v-bind="attrs"
              v-on="on"
              class="mx-3"
              :color="pausasIcons[i].successColor"
              text-color="white"
              label
            >
              <v-icon left>
                {{ pausasIcons[i].icon }}
              </v-icon>
              {{ item }}
            </v-chip>
          </template>
          <span>{{ i }}</span>
        </v-tooltip>
      </div> -->
    </template>

    <span>
      <v-icon class="ma-4 pa-4" color="purple">mdi-information</v-icon>
      Sem dados de pausas
    </span>
  </v-card>
</template>

<script>
  export default {
    name: 'card-tempos',
    components: {},
    props: {
      usuarioAlmope: {
        type: [String, Number],
        default: null
      }
    },
    data: () => ({
      loading: false,
      imgs: {
        pausas: '../../../img/score/pause-button.svg'
      },
      pausasIcons: {
        STATUS: {
          icon: 'mdi-account-check',
          default: '',
          target: '',
          successColor: 'pink',
          warningColor: 'warning',
          fail: 'danger'
        },
        DESCANSO: {
          icon: 'mdi-food-fork-drink',
          default: '00:00:00',
          target: '00:00:00',
          successColor: 'primary',
          warningColor: 'warning',
          fail: 'danger'
        },
        ALIMENTACAO: {
          icon: 'mdi-pasta',
          default: '00:00:00',
          target: '00:00:00',
          successColor: 'primary',
          warningColor: 'warning',
          fail: 'danger'
        },
        'TEMPO LOGADO': {
          icon: 'mdi-account-clock',
          default: '00:00:00',
          target: '00:00:00',
          successColor: 'pink',
          warningColor: 'default',
          fail: 'danger'
        },
        JACKIN: {
          icon: 'mdi-timeline-clock',
          default: '00:00:00',
          target: '00:00:00',
          successColor: 'pink',
          warningColor: 'danger',
          fail: 'danger'
        },
        TOTAL: {
          icon: 'mdi-clock-check',
          default: '00:00:00',
          target: '00:00:00',
          successColor: 'primary',
          warningColor: 'warning',
          fail: 'danger'
        },
        PARTICULAR: {
          icon: 'mdi-paper-roll',
          default: '00:00:00',
          target: '00:00:00',
          successColor: 'primary',
          warningColor: 'warning',
          fail: 'danger'
        },
        SISTEMA: {
          icon: 'mdi-laptop',
          default: '00:00:00',
          target: '00:00:00',
          successColor: 'cyan',
          warningColor: 'warning',
          fail: 'danger'
        },
        LABORAL: {
          icon: 'mdi-weight-lifter',
          default: '00:00:00',
          target: '00:00:00',
          successColor: 'cyan',
          warningColor: 'warning',
          fail: 'danger'
        },
        PADRAO: {
          icon: 'mdi-phone-cancel',
          default: '00:00:00',
          target: '00:00:00',
          successColor: 'cyan',
          warningColor: 'warning',
          fail: 'danger'
        },
        SUPORTE: {
          icon: 'mdi-face-agent',
          default: '00:00:00',
          target: '00:00:00',
          successColor: 'cyan',
          warningColor: 'warning',
          fail: 'danger'
        },
        INTERVALO: {
          icon: 'mdi-timer-sand',
          default: '00:00:00',
          target: '00:00:00',
          successColor: 'cyan',
          warningColor: 'warning',
          fail: 'danger'
        }
      }
    }),
    computed: {
      meusTempos() {
        return this.$store.getters.meusTempos
      }
    },
    methods: {
      // loadMeusTempos() {
      //   return this.$store.dispatch("loadMeusTempos", this.usuarioAlmope);
      // },
    },
    created() {
      // this.loadMeusTempos();
    }
  }
</script>

<style></style>
