<template>
  <v-dialog v-model="comunicadoEventoBonus" width="600">
    <v-card>
      <div class="pa-3">
        <h2>XP EM DOBROOO</h2>
      </div>
      <v-divider class="ml-5 mr-5"></v-divider>
      <div class="body-comunicado">
        <h3 class="grey--text">Que tal ganhar mais XP e sair na frente de todos!</h3>
        <img src="../../../assets/img/icons/gifs/icons8-fire.gif" />
        <article>
          Do dia 20/12/2022 ate 25/12/2022 teremos 200xp para os indicadores de ABS Do dia
          20/12/2022 ate 25/12/2022 teremos 200xp para os indicadores de ABS Do dia 20/12/2022 ate
          25/12/2022 teremos 200xp para os indicadores de ABS
        </article>
        <v-simple-table>
          <template v-slot:header></template>
        </v-simple-table>
        <div class="chips">
          <v-chip small color="red" class="white--text mr-2">Jackin + 100xp</v-chip>
          <v-chip small color="blue" class="white--text mr-2">ABS + 100xp</v-chip>
          <v-chip small color="blue" class="white--text mr-2">ABS + 100xp</v-chip>
          <v-chip small color="blue" class="white--text mr-2">ABS + 100xp</v-chip>
          <v-chip small color="orange" class="white--text">TMT + 100xp</v-chip>
        </div>
      </div>
      <v-divider class="ml-5 mr-5"></v-divider>
      <div class="footer-comunicado">
        <v-btn depressed class="color-primary white--text" rounded>Gostei</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    data: () => ({
      comunicadoEventoBonus: true
    })
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Orbitron&display=swap"); */

  h2 {
    font-family: 'Orbitron', sans-serif;
  }

  .color-primary {
    background-image: linear-gradient(100deg, rgb(143, 14, 143), rgb(0, 236, 255));
  }

  .footer-comunicado {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px;
  }

  .body-comunicado {
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  img {
    width: 100px;
  }

  article {
    width: 550px;
    text-align: justify;
    margin-bottom: 10px;
  }
  .chips {
    display: flex;
    flex-direction: row;
    width: 550px;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }

  .v-card {
    border-top-right-radius: 50px !important;
    border-bottom-left-radius: 50px !important;
  }
</style>
