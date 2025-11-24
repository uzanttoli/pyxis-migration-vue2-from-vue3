<template>
  <v-card elevation="2" class="ticketContainer rounded-t-xl">
    <div class="ticket">
      <div class="ticketTitle">{{ ganhador }}</div>
      <hr />
      <div class="ticketDetail">
        <p :title="nome">NOME: {{ nome }}</p>
        <p :title="supervisor">SUPERVISOR: {{ supervisor }}</p>
        <p :title="coordenador">COORDENADOR: {{ coordenador }}</p>
        <p :title="site">SITE: {{ textToUpperCase(site) }}</p>
      </div>
      <div class="ticketRip">
        <div class="circleLeft"></div>
        <div class="ripLine"></div>
        <div class="circleRight"></div>
      </div>
      <div class="ticketSubDetail">
        <div class="code">Número sorteado</div>
        <div class="date">
          <span class="numero">{{ numeroSorteado }}</span>
        </div>
      </div>
    </div>
    <div class="ticketShadow"></div>
  </v-card>
</template>

<script>
  export default {
    props: {
      ganhador: {
        type: Number,
        default: 0
      },
      numeroSorteado: {
        type: Number,
        default: 0
      },
      supervisor: {
        type: String,
        default: 'Supervisor'
      },
      coordenador: {
        type: String,
        default: 'Coordenador'
      },
      site: {
        type: String,
        default: 'Site'
      },
      nome: {
        type: String,
        default: ''
      }
    },
    methods: {
      textToUpperCase(value) {
        if (!value) return
        return value.toUpperCase()
      }
    }
  }
</script>

<style scoped>
  body {
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: sans-serif;
    font-size: 12px;
    font-family: 'Poppins', sans-serif;
    background-color: #b7b5e4;
  }

  /* Main Ticket Style */
  .ticketContainer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
  }
  .ticket {
    /* animation: bouncingCard 0.6s ease-out infinite alternate; */
    background-color: white;
    color: darkslategray;
    border-radius: 12px;
    max-width: 300px;
  }

  /* Ticket Content */
  .ticketTitle {
    font-size: 1.5rem;
    font-weight: 700;
    padding: 12px 16px 4px;
    display: flex;
    justify-content: center;
  }
  hr {
    width: 90%;
    border: 1px solid #efefef;
  }
  .ticketDetail {
    /* font-size: 1.1rem; */
    font-weight: 500;
    padding: 4px 16px;
    width: 99%;
    line-height: 20pt;
  }

  .ticketDetail p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0;
    margin: 0;
    font-size: 13px;
  }
  .ticketSubDetail {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1rem;
    padding: 12px 16px;
  }
  .ticketSubDetail .code {
    margin-right: 24px;
  }

  /* Ticket Ripper */
  .ticketRip {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .circleLeft {
    width: 12px;
    height: 24px;
    background-color: #b7b5e4;
    border-radius: 0 12px 12px 0;
  }
  .ripLine {
    width: 100%;
    border-top: 3px solid #b7b5e4;
    border-top-style: dashed;
  }
  .circleRight {
    width: 12px;
    height: 24px;
    background-color: #b7b5e4;
    border-radius: 12px 0 0 12px;
  }

  /* Ticket Bouncing Animation */
  @keyframes bouncingCard {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(-18px);
    }
  }
  @keyframes bouncingShadow {
    from {
      transform: translateY(0px);
    }
    to {
      transform: translateY(4px);
    }
  }

  .numero {
    background-color: #b7b5e4;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }
</style>
