<template>
  <section>
    <v-col cols="12" xs="12" v-for="i in 1" :key="i">
      <v-card elevation="2" class="mx-auto rounded-xl pa-2" max-width="300" color="" flat outlined>
        <div align="center" justify="center">
          <v-img max-height="300" max-width="300" contain src="../bike.png"></v-img>
        </div>

        <v-card-title class="">{{ 'Bike' }}</v-card-title>
        <v-card-title class="grey--text text-grey-darken-1 caption mt-n6">
          {{ 'Breve descrição' }}
        </v-card-title>
        <v-card-title class="mt-n4">{{ 'R$1.014' }}</v-card-title>

        <v-card-actions class="mx-2 mt-n4">
          <v-spacer></v-spacer>
          <v-btn class="mx-2 mt-n3" fab dark small color="primary">
            <v-icon>mdi-shopping</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </section>
</template>

<script>
  export default {}
</script>

<style></style>
