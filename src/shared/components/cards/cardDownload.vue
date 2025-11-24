<template>
  <v-card class="mx-auto pa-2 card" outlined :href="link" color="blue-grey lighten-4">
    <div style="display: flex; flex-direction: row; justify-content: center">
      <span class="mb-n3">
        <p class="text-h6 text-truncate">{{ nomePlanilha }}</p>
      </span>
    </div>
  </v-card>
</template>

<script>
  export default {
    props: {
      link: {
        type: String,
        require: true
      },
      nomePlanilha: {
        type: String,
        default: 'Nome planilha'
      },
      fonte: {
        type: String,
        default: 'SQL'
      }
    }
  }
</script>

<style scoped></style>
