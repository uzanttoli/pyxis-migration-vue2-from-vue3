<template>
  <section>
    <!-- <v-dialog v-model="dialogAtivacao" width="1000" persistent> -->
    <CardAtivacao @btnclose="_dialogAtivacao" />
    <!-- </v-dialog> -->
  </section>
</template>

<script>
  import CardAtivacao from './cardAtivacao.component.vue'
  export default {
    components: {
      CardAtivacao
    },
    props: {
      dialogAtivacao: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({}),
    computed: {},
    methods: {
      _dialogAtivacao() {
        let value = this.dialogAtivacaoS2S
        this.$emit('closeDialogAtivacao', value)
      }
    }
  }
</script>

<style></style>
