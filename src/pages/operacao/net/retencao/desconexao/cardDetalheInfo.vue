<template>
  <div>
    <v-tooltip bottom v-if="dados != 0">
      <template v-slot:activator="{ attrs, on }">
        <v-card
          outlined
          class="pa-4 rounded-xl d-flex flex-column align-center"
          v-bind="attrs"
          v-on="on"
        >
          <v-row align="center" justify="space-between" no-gutters>
            <v-col cols="auto">
              <v-icon large :color="color" class="mr-2" style="font-size: 20px">{{ icon }}</v-icon>
            </v-col>
            <v-col>
              <div
                style="
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  flex-wrap: nowrap;
                "
              >
                <p
                  class="headline font-weight-medium mb-0"
                  style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                >
                  {{ title }}
                </p>
                <p class="ml-4 mb-0" style="font-size: 28px">{{ number }}</p>
              </div>
            </v-col>
          </v-row>

          <v-card-text class="mt-2">
            <div style="height: 40px">
              <v-tooltip right>
                <template v-slot:activator="{ attrs, on }">
                  <p
                    v-bind="attrs"
                    v-on="on"
                    style="
                      display: -webkit-box;
                      -webkit-box-orient: vertical;
                      -webkit-line-clamp: 2;
                      overflow: hidden;
                      text-overflow: ellipsis;
                      line-height: 1.2em;
                      max-height: 2.4em;
                    "
                  >
                    <i class="fa-solid fa-circle-question"></i>
                    {{ descricao }}
                  </p>
                </template>
                <span>
                  <div style="width: 300px">
                    <i class="fa-solid fa-circle-question"></i>
                    {{ descricao }}
                  </div>
                </span>
              </v-tooltip>
            </div>
          </v-card-text>
        </v-card>
      </template>
      <span>{{ title }}</span>
    </v-tooltip>
    <v-skeleton-loader
      v-else
      class="mx-auto rounded-xl"
      max-width="500"
      type="card"
    ></v-skeleton-loader>
  </div>
</template>

<script>
  export default {
    props: {
      color: {
        type: String,
        default: ''
      },
      dados: {
        type: [Array, Object, Number],
        default: 0
      },
      icon: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      number: {
        type: [Number, String],
        default: 0
      },
      descricao: {
        type: String,
        default: 'Descrição detalhada ou informação adicional do indicador pode ser colocada aqui.'
      }
    }
  }
</script>

<style scoped></style>
