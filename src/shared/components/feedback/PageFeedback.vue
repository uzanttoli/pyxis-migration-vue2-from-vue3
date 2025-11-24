<template>
  <v-col>
    <v-row>
      <v-col cols="12">
        <card-info-display title="Formulários Disponíveis" classTitle="mt-n5" class="mr-7 mb-n2">
          <template v-slot:body>
            <v-row>
              <v-col v-for="(item, i) in formularios" :key="i" xl="2" md="4">
                <v-card
                  elevation="1"
                  min-height="100"
                  class="rounded-xl"
                  :to="{
                    name: 'Feedback Operacional',
                    query: { id: item.ID, gravacao: item.GRAVACAO }
                  }"
                >
                  <v-card-title class="mb-n2">
                    <v-icon size="15" color="red" class="mr-2">fa-solid fa-align-left</v-icon>
                    {{ item.NOME }}
                  </v-card-title>
                  <v-card-text>
                    <div>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ attrs, on }">
                          <p class="pa-0 ma-0" v-bind="attrs" v-on="on">
                            {{ item.DESCRICAO }}
                          </p>
                        </template>
                        <span>{{ item.DESCRICAO }}</span>
                      </v-tooltip>
                    </div>
                  </v-card-text>
                  <v-divider></v-divider>
                  <v-card-actions :class="item.STATUS == 0 ? 'grey lighten-2' : 'grey lighten-5'">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          icon
                          small
                          v-bind="attrs"
                          v-on="on"
                          :to="{
                            name: 'Feedback Operacional',
                            query: { id: item.ID, gravacao: item.GRAVACAO }
                          }"
                        >
                          <v-icon size="16">fa-solid fa-square-up-right</v-icon>
                        </v-btn>
                      </template>
                      <span>Monitorar</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn icon small v-bind="attrs" disabled v-on="on" color="orange darken-1">
                          <v-icon size="16">fa-solid fa-pen-to-square</v-icon>
                        </v-btn>
                      </template>
                      <span>Editar pesquisa</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn icon small v-bind="attrs" v-on="on" disabled>
                          <v-icon size="16">fa-solid fa-chart-pie</v-icon>
                        </v-btn>
                      </template>
                      <span>Analitico da pesquisa</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn
                          :disabled="item.STATUS != 1"
                          icon
                          small
                          v-bind="attrs"
                          v-on="on"
                          color="error"
                        >
                          <v-icon size="16">fa-solid fa-trash</v-icon>
                        </v-btn>
                      </template>
                      <span>Inativar pesquisa</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn icon small v-bind="attrs" v-on="on" color="green" disabled>
                          <v-icon size="16">fa-solid fa-rotate</v-icon>
                        </v-btn>
                      </template>
                      <span>Habilitar pesquisa</span>
                    </v-tooltip>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </template>

          <template v-slot:action>
            <v-btn icon large fab @click="$router.go(-1)">
              <v-icon>fa-solid fa-angles-left</v-icon>
            </v-btn>
          </template>
        </card-info-display>
      </v-col>
      <v-divider></v-divider>
      <v-col cols="12">
        <MeusFeedbacks class="mr-6" :listarFeedback="formularios" />
      </v-col>
    </v-row>
  </v-col>
</template>

<script>
  import config from '@/core/config'
  import MeusFeedbacks from './MeusFeedbacks.vue'
  import CardInfoDisplay from '@/pages/operacao/net/retencao/desconexao/CardInfoDisplay.vue'
  export default {
    components: { MeusFeedbacks, CardInfoDisplay },
    data: () => ({
      formularios: []
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      loadFormDisponivel() {
        let urlData = `${config.baseUrl}api/shared/feedback/formulario/listar`
        this.$api
          .get(urlData, {
            params: {
              almope: this.usuario.almope,
              regional: this.usuario.regional
            }
          })
          .then(res => {
            this.formularios = res.data
          })
      }
    },
    created() {
      this.loadFormDisponivel()
    }
  }
</script>

<style scoped>
  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cor-padrao {
    background-image: linear-gradient(260deg, rgb(0, 236, 255), #8f0e8f);
  }

  .v-card {
    border-radius: 16px;
  }

  .v-icon {
    margin-right: 8px;
  }

  .headline {
    font-size: 20px;
  }
</style>
