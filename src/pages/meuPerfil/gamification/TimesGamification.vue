<template>
  <v-row justify="center">
    <v-dialog v-model="exibirTimes" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-toolbar dark color="primary">
        <v-btn icon dark @click="exibirTimes = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Times</v-toolbar-title>
      </v-toolbar>
      <v-card class="mx-auto">
        <div class="image">
          <div v-for="image in imagens" :key="image.nome">
            <img width="200" :src="imgTeam(image.nome)" />
          </div>
        </div>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
  export default {
    data: () => ({
      exibirTimes: false,
      imagens: [{ nome: 'GATO' }, { nome: 'TUBARÃO' }, { nome: 'AGUIA' }, { nome: 'LOBO' }]
    }),
    methods: {
      imgTeam(value) {
        let img = require.context('../../../assets/img/team/', false, /\.png$/)
        return img('./' + value + '.png')
      }
    }
  }
</script>
<style scoped>
  .image {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding: 10px;
  }
</style>
