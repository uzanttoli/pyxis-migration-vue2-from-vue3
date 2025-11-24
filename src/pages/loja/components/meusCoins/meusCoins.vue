<template>
  <div class="d-flex">
    <v-img width="30" src="../../../../assets/img/icons/mdi-icons/icons8-ruble-64.png"></v-img>
    <span class="font-weight-bold black--text text-h6 ml-2 mr-2">
      {{ myCash.QTDE_PYXIS_COIN | formatMoeda }}
    </span>
  </div>
</template>

<script>
  export default {
    data: () => ({
      saldoCoins: ''
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      myCash() {
        let cash = this.$store.getters.myCash[0]
        return cash ? cash : 0.0
      }
    },
    filters: {
      formatMoeda: function (value) {
        if (value) {
          const currency = function (number) {
            return new Intl.NumberFormat('pt-BR', {
              minimumFractionDigits: 2
            }).format(number)
          }
          return currency(value)
        } else {
          return 0.0
        }
      }
    },
    methods: {
      loadMyCash() {
        this.$store.dispatch('loadMyCash', this.usuarioAlmope)
      }
    },
    created() {
      this.loadMyCash()
    }
  }
</script>

<style></style>
