<template>
  <v-row class="mt-7">
    <v-col cols="12" sm="8" class="pr-0">
      <v-card height="250px" tile flat color="primary">
        <v-row>
          <v-col cols="12" sm="4" class="pl-8 pt-5">
            <v-btn color="black" dark class="withoutupercase" small tile>new</v-btn>
            <h6 class="white--text mt-8">Produto 1</h6>
            <h3 class="white--text mt-5">Descricao breve</h3>
            <v-btn rounded color="primary" dark class="withoutupercase px-8 mt-10">Mais Info</v-btn>
          </v-col>
          <v-col cols="12" sm="8">
            <v-img src="./bike.png" max-height="400" max-width="400" contain class="mt-n6"></v-img>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
    <v-col cols="12" sm="4" class="pl-0">
      <v-card height="250px" tile flat color="orange">
        <v-row>
          <v-col cols="12" sm="6" class="pl-8 pt-5">
            <v-btn color="black" dark class="withoutupercase" small tile>new</v-btn>
            <h6 class="white--text mt-8">Produto 1</h6>
            <h3 class="white--text mt-5">Descricao breve</h3>
            <v-btn rounded color="orange" dark class="withoutupercase px-8 mt-3">Mais info</v-btn>
          </v-col>
          <v-col cols="12" sm="6">
            <v-img
              src="./jacket2.png"
              max-height="300"
              max-width="300"
              contain
              class="mt-n4"
            ></v-img>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  export default {}
</script>

<style scoped>
  .container {
    padding: 0px !important;
  }
  .v-btn.withoutupercase {
    text-decoration: none;
  }
  .v-chip.v-size--default {
    border-radius: 50px !important;
    font-size: 14px !important;
    height: 40px !important;
    width: 40px !important;
  }
  .v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: 0.5;
    position: absolute;
    width: 100%;
  }
  .card1 {
    z-index: 10;
  }
  .card2 {
    z-index: 1;
  }
</style>
