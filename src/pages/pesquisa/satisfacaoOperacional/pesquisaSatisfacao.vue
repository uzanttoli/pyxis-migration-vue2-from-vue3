<template>
  <section>
    <modal-satisfacao :isModalRefazerPesquisa="reanalise" :refazer="refazer"></modal-satisfacao>
    <modal-reanalise-satisfacao
      @update:reanalise-satisfacao="reanaliseModal"
    ></modal-reanalise-satisfacao>
  </section>
</template>

<script>
  import ModalReanaliseSatisfacao from './modalReanaliseSatisfacao.vue'
  import modalSatisfacao from './modalSatisfacao.vue'
  export default {
    components: { modalSatisfacao, ModalReanaliseSatisfacao },
    data: () => ({
      reanalise: false,
      refazer: 0
    }),
    methods: {
      reanaliseModal(event) {
        this.reanalise = event.modal
        this.refazer = event.refazer
      }
    }
  }
</script>

<style></style>
