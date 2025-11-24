<template>
  <v-card elevation="0" tile class="mx-auto" style="margin-top: 35px">
    <v-col>
      <div style="display: flex">
        <h1>{{ title }}</h1>
        <v-spacer></v-spacer>
        <v-tooltip bottom v-if="isBtn">
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon v-bind="attrs" v-on="on" :to="to">
              <v-icon>fa-solid fa-person-walking-arrow-loop-left</v-icon>
            </v-btn>
          </template>
          <span>Voltar</span>
        </v-tooltip>
      </div>
      <v-divider></v-divider>
      <div>
        <slot></slot>
      </div>
    </v-col>
  </v-card>
</template>

<script>
  export default {
    name: 'ConfiguracaoComponent',
    props: {
      to: {
        type: String,
        required: true
      },
      title: {
        type: String,
        default: 'Configurações'
      },
      isBtn: {
        type: Boolean,
        default: true
      }
    },
    data: () => ({
      tab: null
    })
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Spectral:wght@200&display=swap"); */
  h1 {
    font-family: 'Spectral', serif;
  }
</style>
