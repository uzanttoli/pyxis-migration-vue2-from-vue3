<template>
  <v-card :class="customClass" :min-height="minHeight" class="cor-padrao">
    <v-card-title class="pa-10 white--text">
      <slot name="title"></slot>
    </v-card-title>
    <v-card-subtitle class="white--text pl-10">
      <slot name="subtitle"></slot>
    </v-card-subtitle>
    <slot name="imagem"></slot>
  </v-card>
</template>

<script>
  export default {
    name: 'card-titulo-pagina-com-fundo',
    props: {
      minHeight: {
        type: [Number, String],
        default: 250
      },
      customClass: {
        type: String,
        default: 'rounded-xl rounded-bl-circle rounded-br-0'
      }
    }
  }
</script>

<style scoped>
  .cor-padrao {
    background-image: linear-gradient(220deg, rgb(0, 236, 255), #8f0e8f);
  }
</style>
