<template>
  <v-alert :type="type" prominent border="left" colored-border elevation="3">
    {{ text }}
    <v-divider></v-divider>
    <div class="progress">
      <p>Checando conexão com o servidor:</p>
      <v-progress-linear
        v-model="countInterval"
        rounded
        color="amber"
        height="6"
      ></v-progress-linear>
    </div>
  </v-alert>
</template>

<script>
  import config from '../../core/config'
  export default {
    name: 'ServidorPing',
    data: () => ({
      isPingSuccess: null,
      text: null,
      type: null,
      interval: null,
      countInterval: null
    }),
    methods: {
      loadServerPing() {
        let urlData = `${config.baseUrl}api/shared/backoffice/bases/test_ping`
        this.$api.get(urlData).then(res => {
          if (res.data == 'Bem sucedido!') {
            this.isPingSuccess = true
            this.type = 'success'
            this.text =
              'A conexão com o servidor de execução das rotinas está ativa e funcionando corretamente.'
          } else {
            this.isPingSuccess = false
            this.type = 'error'
            this.text =
              'Desculpe, o servidor de execução das rotinas está indisponível no momento. Por favor, entre em contato com o CCO para obter assistência.'
          }
        })
      }
    },
    created() {
      this.loadServerPing()
      this.interval = setInterval(() => {
        this.countInterval += 9.66
        if (this.countInterval >= 99.6) {
          this.loadServerPing()
          this.countInterval = 0
        }
      }, 6000)
    },
    beforeUnmount: function () {
      clearInterval(this.interval)
    }
  }
</script>

<style scoped>
  .progress {
    padding: 5px;
  }
  .progress p {
    font-weight: 600;
    font-size: 11px;
    padding: 0;
    margin: 0;
  }
</style>
