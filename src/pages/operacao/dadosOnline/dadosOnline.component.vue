<template>
  <v-container fluid>
    <v-card elevation="1" class="rounded-xl">
      <v-card-title
        style="display: flex; justify-content: space-between"
        class="caption text-h5 grey--text"
      >
        Dados Online | Operador
        <div class="actions">
          <v-btn icon @click="openDialogEscala = true">
            <v-icon color="blue">fa-solid fa-address-card</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon color="green">fa-solid fa-calendar-days</v-icon>
          </v-btn>
          <v-divider vertical></v-divider>
          <v-btn icon>
            <v-icon color="orange">fa-solid fa-rotate-left</v-icon>
          </v-btn>
        </div>
      </v-card-title>
      <v-divider></v-divider>
      <v-col>v-card</v-col>
    </v-card>
    <minha-escala :openDialogEscala="openDialogEscala" />
  </v-container>
</template>

<script>
  import minhaEscala from './modal/minhaEscala.vue'
  export default {
    components: { minhaEscala },
    data: () => ({
      openDialogEscala: false
    })
  }
</script>

<style scoped>
  .actions {
    display: flex;
    align-items: center;
    gap: 10px;
    height: 40px;
  }
</style>
