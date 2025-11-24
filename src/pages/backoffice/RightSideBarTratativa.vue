<template>
  <v-navigation-drawer app color="" right width="320" permanent>
    <slot></slot>
    <v-card
      flat
      elevation="3"
      class="rounded-br-pill rounded-tr-pill pa-4 mr-1 mt-2"
      color="#5075BF"
    >
      <v-row align="center">
        <v-col cols="12" sm="8">
          <h3 class="white--text">{{ title }}</h3>
          <v-row>
            <v-col cols="12" sm="8">
              <span style="color: #f2f2f2">Online</span>
              <br />
              <v-divider></v-divider>
              <span style="color: #f2f2f2; font-size: 9px">*Atualizações a cada 60s</span>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" sm="4">
          <v-progress-circular
            :size="60"
            :width="4"
            :value="valueContador"
            color="#FAFAFA"
            class="mt-2"
          >
            {{ contador }}s
          </v-progress-circular>
        </v-col>
      </v-row>
    </v-card>
    <v-card elevation="0" height="80vh" class="overflow-auto">
      <div class="d-block text-center mt-2 mb-n2" v-if="base == ''">
        <h4 class="grey--text">{{ text }}</h4>
      </div>

      <transition-group name="card" tag="div">
        <v-card
          class="card"
          color="mx-2 mt-2 rounded-bl-xl rounded-tr-xl pa-2"
          height="90"
          v-for="(item, i) in base"
          :key="i"
          :style="{ transitionDelay: `${i * 0.4}s` }"
        >
          <v-tooltip bottom>
            <template v-slot:activator="{ attrs, on }">
              <v-row align="center" v-bind="attrs" v-on="on">
                <v-col cols="12" sm="6" class="text-center">
                  <v-icon color="#BBDEFB" large>fas fa-laptop</v-icon>
                  <br />
                  <p
                    style="
                      color: #283593;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      text-transform: capitalize;
                    "
                  >
                    {{ formatText(item.COLUNA) }}
                  </p>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-progress-circular
                    :size="70"
                    :width="3"
                    :value="100"
                    color="#1E88E5"
                    class="mt-2 ml-12"
                  >
                    <div style="width: 100%">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ attrs, on }">
                          <p
                            v-bind="attrs"
                            v-on="on"
                            class="pa-0 ma-0"
                            style="
                              font-size: 0.9rem;
                              color: #1e88e5;
                              white-space: nowrap;
                              overflow: hidden;
                              text-overflow: ellipsis;
                              text-transform: capitalize;
                            "
                          >
                            {{ item.VALOR }}
                          </p>
                        </template>
                        <span>{{ item.VALOR }}</span>
                      </v-tooltip>
                    </div>
                  </v-progress-circular>
                  <v-badge bordered bottom color="green" dot offset-x="1" offset-y="-20"></v-badge>
                </v-col>
              </v-row>
            </template>
            <span>{{ item.COLUNA }}</span>
          </v-tooltip>
        </v-card>
      </transition-group>
    </v-card>
  </v-navigation-drawer>
</template>

<script>
  export default {
    props: {
      base: {
        type: Array,
        require: true
      },
      title: {
        Type: String,
        default: 'Meus Indicadores'
      },
      value: Boolean
    },
    data: () => ({
      intervalText: null,
      contador: 0,
      valueContador: 0,
      drawer: false,
      mini: true,
      intervalTextBase: null,
      text: 'Carregando'
    }),
    computed: {
      dialog: {
        get() {
          return this.value
        },
        set(val) {
          this.$emit('input', val)
        }
      }
    },
    mounted() {
      this.intervalText = null
      this.contador = 0
      this.intervalText = setInterval(() => {
        this.contador++
        this.valueContador += 1.66
        if (this.contador == 60) {
          this.contador = 0
          this.valueContador = 0
          this.$emit('updated:reload-base')
        }
      }, 1000)
      this.intervalTextBase = setInterval(() => {
        if (this.text.length == 13) {
          this.text = 'Carregando'
        } else {
          this.text += '.'
        }
      }, 1000)
    },
    methods: {
      toggleDrawer() {
        this.drawer = !this.drawer
      },
      formatText(value) {
        if (!value) return
        let text = value.toLowerCase()

        return text
      }
    },
    watch: {}
  }
</script>

<style scoped>
  .cor-padrao {
    background-image: linear-gradient(220deg, rgb(143, 14, 143), #0084ff);
  }

  .card-enter-active,
  .card-leave-active {
    transition: all 0.5s;
  }

  .card-enter,
  .card-leave-to {
    opacity: 0;
    transform: translateY(20px);
  }
</style>
