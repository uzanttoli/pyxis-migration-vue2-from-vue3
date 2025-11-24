<template>
  <v-row>
    <v-card class="elevation-4 ml-4" color="purple" dark style="max-width: 450px">
      <v-row justify="space-between">
        <template v-if="getAvatarUrl">
          <v-img
            class="shrink ma-2 ml-n1"
            contain
            height="125px"
            :src="getAvatarUrl"
            style="flex-basis: 127px"
          ></v-img>
        </template>
        <v-col cols="8">
          <div class="d-inline-block text-truncate" style="max-width: 250px">
            <span class="text-subtitle-2">{{ usuario.regional }}</span>
            <br />
            <span class="text-subtitle-1">{{ usuario.nome }}</span>
            <p class="mb-0 pb-0 text-subtitle-2">Id: {{ usuario.almope }}</p>
            <p class="mb-0 pb-0 text-subtitle-2">Superior: {{ usuario.superior1 }}</p>
            <p class="mb-0 pb-0 text-subtitle-2">{{ usuario.cargo }}</p>
          </div>
        </v-col>
      </v-row>

      <v-card-text class="pa-2">
        <v-card-text class="d-flex align-center text-center ma-0 pa-0">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="red" class="mx-2" v-bind="attrs" v-on="on">mdi-heart</v-icon>
              <v-progress-linear
                :value="life"
                height="10"
                stream
                color="deep-orange"
              ></v-progress-linear>
            </template>
            <span>{{ life }}</span>
          </v-tooltip>
        </v-card-text>

        <v-card-text class="d-flex align-center text-center ma-0 pa-0">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon color="yellow accent-3" class="mx-2" v-bind="attrs" v-on="on">
                mdi-flare
              </v-icon>
              <v-progress-linear
                :value="power"
                height="10"
                stream
                color="yellow accent-3"
              ></v-progress-linear>
            </template>
            <span>{{ power }}</span>
          </v-tooltip>
        </v-card-text>

        <v-icon class="float-right">mdi-gamepad-variant</v-icon>
      </v-card-text>
    </v-card>
    <v-card class="elevation-4 mx-4 flex-grow-1 d-flex align-center">
      <v-row justify="space-around">
        <v-col v-for="(item, i) in badges" :key="i" class="text-center">
          <v-avatar :color="item.color" size="100">
            <v-icon dark size="80">mdi-fire</v-icon>
          </v-avatar>
          <v-divider class="mt-2"></v-divider>
          <p>{{ item.item }}</p>
          <small>{{ item.missao }}</small>
        </v-col>
      </v-row>
    </v-card>
  </v-row>
</template>

<script>
  export default {
    name: 'card-banner',
    components: {},
    props: {
      usuarioAlmope: {
        type: [String, Number],
        default: null
      }
    },
    data: () => ({
      loading: false,
      life: 90,
      power: 30,
      badges: [
        {
          item: 'TMT - Não classificado',
          icon: 'mdi-timer',
          color: 'red',
          missao: 'sem resultados'
        },
        {
          item: 'Rechamada - Não classificado',
          icon: 'mdi-phone-return',
          color: 'grey lighten-3',
          missao: 'sem resultados'
        },
        {
          item: 'ABS - Não classificado',
          icon: 'mdi-account-minus',
          color: 'grey lighten-3',
          missao: 'sem resultados'
        },
        {
          item: 'VT - Não classificado',
          icon: 'mdi-calendar',
          color: 'grey lighten-3',
          missao: 'sem resultados'
        },
        {
          item: 'Permanência - Não classificado',
          icon: 'mdi-account-check',
          color: 'grey lighten-3',
          missao: 'sem resultados'
        }
      ]
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      getAvatarUrl() {
        let myAvatar = this.$store.getters.myAvatar
        if (myAvatar) {
          var avatar = require.context('@/assets/img/Avatar/', false, /\.png$/)
          return avatar('./' + myAvatar + '.png')
        } else {
          return false
        }
      },
      saveAvatarData() {
        return this.$store.getters.saveAvatarData
      }
    },
    methods: {},
    created() {},
    watch: {
      saveAvatarData() {
        if (this.saveAvatarData == true) {
          this.loadMyAvatar()
        }
      }
    }
  }
</script>

<style></style>
