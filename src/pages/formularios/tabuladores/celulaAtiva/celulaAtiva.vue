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
        Para iniciar a tratativa, clique no botão "Tratar" abaixo. Você será direcionado para a
        página de tratamento.
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
              :color="item.DISABLED ? 'grey' : item.COLOR"
              width="220"
              v-bind="attrs"
              v-on="on"
              hover
              :disabled="item.DISABLED"
              :to="item.LINK"
              v-if="item.PERFIL.includes(fnToLowerCase(usuario.filtro))"
            >
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title
                    class="subtitle-1 mb-1 font-weight-medium text-center text-wrap white--text"
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
  export default {
    data: () => ({
      itemDialog: {},
      width: 500,
      items: [
        {
          ID: 1,
          TITLE: 'Tratar',
          COMPONENT: null,
          COLOR: 'green',
          LINK: '/pyxis/utilitarios/celula-ativa/tratar',
          DISABLED: false,
          PERFIL: ['operador', 'administrador']
        },
        {
          ID: 2,
          TITLE: 'Configuração Tratativa',
          COMPONENT: null,
          COLOR: 'orange',
          LINK: '/pyxis/utilitarios/celula-ativa/upload-base',
          DISABLED: false,
          PERFIL: ['gerente', 'administrador']
        }
      ]
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      fnToLowerCase(name) {
        if (!name) return
        return name.toLowerCase()
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
