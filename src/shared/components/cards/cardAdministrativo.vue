<template>
  <v-card class="mx-auto rounded-xl" elevation="8" outlined min-height="160" min-width="350">
    <v-list-item>
      <v-list-item-content>
        <div class="mb-1">
          <strong>{{ tipoGrupo }}</strong>
          <br />
        </div>
        <v-divider></v-divider>
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-list-item-title class="mb-1 text-wrap" v-bind="attrs" v-on="on">
              {{ title }}
              <v-icon></v-icon>
            </v-list-item-title>
          </template>
          <span>{{ title }}</span>
        </v-tooltip>
        <v-list-item-subtitle class="text-wrap">{{ description }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-card-actions class="pt-0">
      <v-btn
        style="position: absolute; bottom: 5px"
        text
        color="teal accent-4"
        @click="reveal = false"
        :to="routerCard"
      >
        Acessar
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    props: {
      routerCard: {
        type: [String, Object, Array],
        default: ''
      },
      tipoGrupo: {
        type: String,
        default: 'Titulo'
      },
      title: {
        type: String,
        default: 'Titulo'
      },
      description: {
        type: String,
        default: 'SubTitulo'
      }
    }
  }
</script>

<style></style>
