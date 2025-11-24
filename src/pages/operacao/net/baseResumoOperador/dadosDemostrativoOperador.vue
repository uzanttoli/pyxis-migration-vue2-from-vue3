<template>
  <!-- v-model="abrirDialogDadosOperador" -->
  <v-dialog
    fullscreen
    transition="dialog-bottom-transition"
    :model-value="abrirDialogDadosOperador"
    @update:modelValue="val => $emit('update:abrirDialogDadosOperador', val)"
  >
    <v-card color="#ECEFF1" tile class="overflow-hidden">
      <div style="display: flex; align-items: center; justify-content: space-between">
        <v-card-title>
          Você esta consultado dados de
          <strong class="ml-2">{{ usuarioConsulta }}</strong>
        </v-card-title>
        <v-btn icon @click="$emit('updated:close-dialog')">
          <v-icon>fas fa-close</v-icon>
        </v-btn>
      </div>
      <v-divider class="mb-5"></v-divider>
      <v-card-text>
        <operador-component
          colorProps="blue-grey lighten-5"
          classProps=""
          :usuarioConsulta="usuarioConsulta"
        ></operador-component>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import operadorComponent from '../operacoes/operador/operador.component.vue'
  export default {
    components: { operadorComponent },
    props: {
      abrirDialogDadosOperador: {
        type: Boolean,
        default: false
      },
      usuarioConsulta: {
        type: [String, Number],
        default: ''
      }
    }
  }
</script>

<style></style>
