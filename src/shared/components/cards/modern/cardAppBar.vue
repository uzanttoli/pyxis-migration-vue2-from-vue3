<template>
  <v-card :class="customClass" :min-height="minHeight" class="cor-padrao">
    <div :style="styleCustom" style="position: relative">
      <div class="pa-3" style="position: absolute; right: 10px; top: 8px" v-if="isButtonReturn">
        <v-btn icon large fab @click="$emit('update:click')">
          <v-icon>fa-solid fa-angles-left</v-icon>
        </v-btn>
      </div>
      <h2>
        <slot name="title"></slot>
      </h2>
      <p>
        <slot name="subtitle"></slot>
      </p>
    </div>
    <slot name="imagem"></slot>
    <slot name="info"></slot>
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
        default: 'rounded-xl rounded-bl-circle rounded-br-0 d-flex'
      },
      styleCustom: {
        type: String,
        default: ''
      },
      isButtonReturn: {
        type: Boolean,
        default: false
      }
    },
    methods: {}
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Pacifico&display=swap"); */
  .cor-padrao {
    background-image: linear-gradient(220deg, rgb(0, 236, 255), #8f0e8f);
  }

  /* h2 {
  font-family: "Pacifico", cursive;
} */
</style>
