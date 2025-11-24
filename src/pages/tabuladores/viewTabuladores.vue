<template>
  <div v-if="isReady">
    <div v-if="isMailing === 1">
      <TabuladorMailing />
    </div>
    <div v-else-if="isMailing === 0">
      <TabuladorSemMailing />
    </div>
    <div v-else-if="isDynamic === 1">
      <PyxFormsBuilder />
    </div>
  </div>
</template>

<script>
  import PyxFormsBuilder from './pyxforms/PyxFormsBuilder.vue'

  import TabuladorMailing from './direcionamento/tabuladorMailing.vue'
  import TabuladorSemMailing from './direcionamento/tabuladorSemMailing.vue'

  export default {
    components: {
      TabuladorMailing,
      TabuladorSemMailing,
      PyxFormsBuilder
    },
    data() {
      return {
        isReady: false,
        isMailing: -1,
        isDynamic: 0
      }
    },
    computed: {
      usuario() {
        return this.$store.getters.usuario
      }
    },
    created() {
      this.isMailing = Number(this.$route.query.is_mailing)
      this.isDynamic = Number(this.$route.query.dynamic)
      this.isReady = true
    },
    watch: {
      '$route.query.is_mailing': {
        immediate: true,
        handler(newVal) {
          this.isMailing = Number(newVal || -1)
        }
      },
      '$route.query.dynamic': {
        immediate: true,
        handler(newVal) {
          this.isDynamic = Number(newVal || 0)
        }
      }
    }
  }
</script>

<style scoped></style>
