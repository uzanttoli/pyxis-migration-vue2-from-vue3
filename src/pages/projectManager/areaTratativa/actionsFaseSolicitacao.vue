<template>
  <v-col xl="1" lg="2" md="12" sm="12">
    <div class="status-fase">
      <div class="status-fase-title">
        <p class="ma-0 pa-0 mr-2" style="font-size: 14px; font-weight: 600; color: #787878">
          Mover para a fase
        </p>
      </div>
      <div class="actions">
        <v-btn
          v-for="(item, i) in status"
          :key="i"
          depressed
          min-width="250"
          style="
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            text-transform: capitalize;
            font-weight: 600;
          "
          outlined
          :color="item.COLOR"
        >
          {{ retirarS(item.STATUS_SOLICITACAO) }}
          <v-icon right dark>fa-solid fa-arrow-right</v-icon>
        </v-btn>
      </div>
    </div>
  </v-col>
</template>

<script>
  export default {
    props: {
      status: {
        type: [Array, Object]
      }
    },
    methods: {
      retirarS(string) {
        if (!string) return
        let s = string[string.length - 1]
        if (s.toLowerCase() == 's') return string.slice(0, string.length - 1)
        else return string
      }
    }
  }
</script>

<style scoped>
  .container-card {
    display: flex;
    flex-wrap: wrap;
    gap: 25px;
    margin-top: 25px;
  }

  .container-formulario {
    /* width: 600px; */
  }
  .title-card {
    margin-bottom: 15px;
  }
  .data-solicitacao {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 10px;
  }
  .data-solicitacao span {
    font-size: 13px;
    color: #3a3a3ac7;
  }

  .circle-ico {
    text-align: center;
    border-radius: 50%;
    background-color: #b9f6ca;
    width: 20px;
  }

  .dados-solicitacao span {
    font-size: 13px;
    color: #3a3a3ac7;
  }

  .dados-body {
    margin-top: 20px;
  }

  .dados-form {
    margin-bottom: 25px;
  }

  /* FASES */
  .container-fase {
    /* width: 600px; */
  }

  .fase-title {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }

  .fase-body {
    margin-top: 24px;
  }

  .field-body {
    margin-bottom: 40px;
  }

  .status-fase {
  }

  .status-fase-title {
    margin-bottom: 15px;
  }

  .actions {
    gap: 10px;
  }
</style>
