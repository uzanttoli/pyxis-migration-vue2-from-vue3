<template>
  <v-dialog v-model="dialogAnalisePerfil" width="800" persistent>
    <FormularioMapeamentoPerfil @update:questionarioRespondido="_dialogQuest" />
  </v-dialog>
</template>

<script>
  import FormularioMapeamentoPerfil from './FormularioMapeamentoPerfil.vue'
  export default {
    components: { FormularioMapeamentoPerfil },
    props: {
      dialogAnalisePerfil: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({}),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      _dialogQuest() {
        this.$emit('closeDialog')
        this.$store.dispatch('loadMinhaAnalise', this.usuarioAlmope)
      }
    },
    created() {}
  }
</script>

<style></style>
