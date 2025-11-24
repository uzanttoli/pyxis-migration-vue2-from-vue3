<template>
  <div class="text-center">
    <v-snackbar :multi-line="multiLine" :timeout="timeout">
      {{ alert }}

      <template v-slot:action="{ attrs }">
        <v-btn :color="color" text v-bind="attrs">
          {{ Fechar }}
        </v-btn>
      </template>
      <slot></slot>
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    props: {
      multiLine: {
        type: [Boolean],
        default: true
      },
      alert: {
        type: [String],
        default: 'Necessario informar um texto!'
      },
      Fechar: {
        type: [String],
        default: 'Close'
      },
      color: {
        type: [String],
        default: 'primary'
      },
      timeout: {
        type: [Number],
        default: 2000
      }
    }
  }
</script>

<style></style>
