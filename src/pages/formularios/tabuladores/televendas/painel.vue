<template>
  <v-sheet
    class="d-flex align-center justify-center flex-wrap text-center mx-auto"
    elevation="4"
    height="250"
    rounded
    max-width="900"
  >
    <div
      style="
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      "
    >
      <h1 class="grey--text">Selecione uma opção:</h1>
      <v-alert prominent border="left" width="100%" type="info" dense outlined>
        Para o
        <strong>Service To Sales</strong>
        , favor seguir com cadastro atraves do SMART SALES.
      </v-alert>
      <div style="display: flex; flex-direction: row" class="mb-2">
        <v-dialog
          v-for="item in items"
          max-width="900"
          transition="dialog-bottom-transition"
          :retain-focus="false"
          :key="item.ID"
          v-model="itemDialog[item.ID]"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-card
              class="rounded-lg ma-3"
              outlined
              width="220"
              v-bind="attrs"
              v-on="on"
              hover
              :disabled="item.DISABLED"
              @click="exibirImg(item.ID)"
            >
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    class="subtitle-1 mb-1 font-weight-medium text-center text-wrap"
                  >
                    {{ item.TITLE }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-card>
          </template>
          <v-card>
            <component :is="item.COMPONENT"></component>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </v-sheet>
</template>

<script>
  import formularioS2s from '../televendas/formularios/formularios.component.vue'
  import formularioBf from '../televendas/formularios/brownfield/formulario.component.vue'
  const formularioMdu = () => import('./formularios/formularioMdu.component.vue')
  export default {
    components: { formularioS2s, formularioBf, formularioMdu },
    data: () => ({
      itemDialog: {},
      openImg: false,
      width: 500,
      items: [
        {
          ID: 1,
          TITLE: 'COMBO S2S',
          COMPONENT: 'formulario-s2s',
          DISABLED: false
        },
        {
          ID: 2,
          TITLE: 'BROWNFIELD',
          COMPONENT: 'formulario-bf',
          DISABLED: false
        },
        {
          ID: 3,
          TITLE: 'MDU',
          COMPONENT: 'formulario-mdu',
          DISABLED: true
        }
      ]
    }),
    methods: {
      exibirImg(id) {
        if (id == 2) {
          this.openImg = !this.openImg
        }
      }
    },
    created() {}
  }
</script>

<style scoped>
  .cardColor {
    border-color: white !important;
  }

  v-card v-sheet {
    background-color: rgba(255, 255, 255, 0.5) !important;
  }
</style>
