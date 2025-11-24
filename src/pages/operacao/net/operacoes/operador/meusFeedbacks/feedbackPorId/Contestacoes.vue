<template>
  <v-card elevation="0" max-height="70vh" class="overflow-auto">
    <div
      v-if="contestacao.length == 0"
      style="
        display: flex;
        justify-content: center;
        font-size: 16px;
        font-weight: 600;
        color: #3333;
      "
    >
      Não há contestações ainda.
    </div>
    <div v-for="(msg, i) in contestacao" :key="i" v-else>
      <div
        :style="`display: flex; ${
          msg.send == usuario.almope ? 'justify-content: end' : 'justify-content: start'
        }`"
      >
        <div
          :style="
            msg.send == usuario.almope
              ? 'background: #7986CB; color: white; border-radius: 10px 10px 0 10px'
              : 'background: #3333; border-radius: 10px 10px 10px 0'
          "
          style="max-width: 500px; padding: 10px; margin: 5px 0"
        >
          <p>
            <strong>Nome:</strong>
            {{ msg.nome }}
          </p>
          <p>
            <strong>Status:</strong>
            {{ msg.acao ? msg.acao : 'Enviado' }}
          </p>
          <p>
            <strong class="text-capitalize">Descrição:</strong>
            {{ msg.msgContestacao }}
          </p>
        </div>
      </div>
    </div>
  </v-card>
</template>

<script>
  export default {
    props: {
      contestacao: {
        type: [Object, Array],
        required: true
      }
    },
    data: () => ({}),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      }
    }
  }
</script>

<style scoped>
  p {
    padding: 0;
    margin: 0;
    font-size: 12px;
  }
</style>
