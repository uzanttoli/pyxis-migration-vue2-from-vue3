<template>
  <v-menu transition="slide-y-transition" bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" icon>
        <v-icon>fa-solid fa-sliders</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title>Selecionar Público</v-card-title>
      <v-divider></v-divider>
      <v-list v-for="(item, i) in items" :key="i" style="padding: 2px 0">
        <v-list-item
          @click="changePublic(item.valor)"
          dense
          :style="item.valor == selecionado ? 'background-color: #00BFA5; color:white;' : ''"
        >
          {{ item.title }}
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script>
  export default {
    props: {},
    data: () => ({
      items: [
        { title: 'Por Regional', valor: 'REGIONAL' },
        { title: 'Por Coordenador', valor: 'COORDENADOR' }
      ],
      selecionado: 'REGIONAL'
    }),
    computed: {},
    methods: {
      changePublic(value) {
        this.selecionado = value
        this.$emit('update:public-alvo', value)
      }
    }
  }
</script>

<style></style>
