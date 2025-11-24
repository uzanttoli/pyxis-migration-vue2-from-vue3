<template>
  <v-footer dark padless fixed height="32">
    <v-card class="flex" flat tile>
      <v-card-text class="py-2 white--text text-center mb-0">
        <template v-if="new Date().getFullYear() != 2021">2021 -</template>
        {{ new Date().getFullYear() }} &copy; Centro de Controle Operacional
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
  export default {
    data: () => ({})
  }
</script>

<style></style>
