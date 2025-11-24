<template>
  <div class="text-center">
    <v-bottom-sheet v-model="central">
      <template v-slot:activator="{ attrs, on }">
        <v-btn icon class="mt-2" color="blue" v-bind="attrs" v-on="on">
          <v-icon>fa-solid fa-bars</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-subheader>Mais opções</v-subheader>
        <v-list-item v-for="tile in tiles" :key="tile.title" @click="sheet = false" :to="tile.href">
          <v-list-item-avatar>
            <v-avatar size="32px" tile>
              <v-icon>fa-regular fa-file-zipper</v-icon>
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-title>{{ tile.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-bottom-sheet>
  </div>
</template>

<script>
  export default {
    props: {
      tiles: {
        type: Array,
        required: true
      }
    },
    data: () => ({
      central: false
      // tiles: [{ img: "keep.png", title: "Download das evidências" }],
    })
  }
</script>

<style scoped></style>
