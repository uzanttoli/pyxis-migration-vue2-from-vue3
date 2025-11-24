<template>
  <v-card outlined shaped elevation="0" class="rounded-xl">
    <v-expansion-panels v-model="panel" :disabled="disabled">
      <v-expansion-panel>
        <v-expansion-panel-header class="ma-0 pa-0">
          <template v-slot:actions>
            <v-icon class="mx-4" color="teal accent-3">mdi-car-brake-alert</v-icon>
          </template>
          <title-negative-margin
            :title="title.toLowerCase().replace('_', ' ')"
            className="rounded-r-xl"
          >
            <v-card-text class="ma-5">
              <div style="display: flex; align-items: center; width: 90%">
                <v-icon class="mr-2">{{ icon }}</v-icon>
                <v-tooltip bottom>
                  <template v-slot:activator="{ attrs, on }">
                    <p
                      class="text-h5"
                      v-bind="attrs"
                      v-on="on"
                      style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                    >
                      {{ subTitle }}
                    </p>
                  </template>
                  <span>{{ subTitle }}</span>
                </v-tooltip>
              </div>
              <div style="display: flex; align-items: center; width: 90%">
                <v-tooltip bottom>
                  <template v-slot:activator="{ attrs, on }">
                    <p
                      class="text-h8 mt-2"
                      v-bind="attrs"
                      v-on="on"
                      style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                    >
                      {{ label }}
                    </p>
                  </template>
                  <span>{{ label }}</span>
                </v-tooltip>
              </div>
            </v-card-text>
          </title-negative-margin>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-divider class="my-3"></v-divider>
          <slot></slot>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script>
  export default {
    name: 'card-expansivel',
    data: () => ({
      panel: [0, 1]
    }),
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: 'Titulo'
      },
      subTitle: {
        type: String,
        default: 'SubTitulo'
      },
      icon: {
        type: String,
        default: 'fa-solid fa-chart-simple'
      },
      label: {
        type: String,
        default: 'Clique aqui para Expandir'
      }
    }
  }
</script>
<style scoped>
  .tx-lg {
    font-size: xx-large;
  }

  p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0;
    margin: 0;
    margin-left: 3px;
  }
</style>
