<template>
  <v-card class="mx-auto my-5 cor-padrao" elevation="2">
    <!-- Cabeçalho do card -->
    <v-card-title class="text-h5 font-weight-bold white--text">
      <div style="display: flex; align-items: center; justify-content: space-between; width: 100%">
        <div :class="classTitle">
          <i class="fa-solid fa-lines-leaning mr-3"></i>
          {{ title }}
        </div>
        <slot name="action"></slot>
      </div>
    </v-card-title>
    <v-card-text>
      <slot name="body"></slot>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      classTitle: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style></style>
