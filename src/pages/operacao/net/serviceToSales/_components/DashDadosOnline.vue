<template>
  <v-card class="cor-padrao rounded-lg mt-7" :loading="isLoadDataOnline">
    <v-col>
      <div style="display: flex; align-items: center; justify-content: space-between">
        <p class="white--text text-class-h2">Dados Online</p>
        <div>
          <v-chip small color="white" class="blue--text mr-3" v-if="arrayDados == ''">
            <i class="fa-solid fa-triangle-exclamation mr-2" style="color: #ff0000"></i>
            Não há dados disponiveis!
          </v-chip>
          <!-- <v-tooltip bottom v-if="usuario.filtro == 'OPERADOR'">
            <template v-slot:activator="{ attrs, on }">
              <v-btn v-on="on" v-bind="attrs" icon @click="$emit('open-bot-message')">
                <v-icon>fa-solid fa-comment-dollar blinking</v-icon>
              </v-btn>
            </template>
            <span>Clique para ver seu extrato detalhado!</span>
          </v-tooltip> -->
        </div>
      </div>
      <div
        style="
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
        "
      >
        <template>
          <v-col v-for="(item, i) in arrayDados" :key="i" class="pa-2">
            <CardDash
              :title="item.COLUNA"
              :valor="item.VALOR"
              :iconFa="item.FA_ICON"
              style="min-width: 350px"
              :iconHeader="indicadores[item.COLUNA]"
            />
          </v-col>
        </template>
      </div>
    </v-col>
  </v-card>
</template>

<script>
  import CardDash from '@/shared/components/cards/modern/cardDash.vue'
  export default {
    components: { CardDash },
    props: {
      arrayDados: {
        type: Array,
        default: () => []
      },
      isLoadDataOnline: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      indicadores: {
        ATENDIDAS: [{ icon: 'fas fa-headset', color: 'green' }],
        'VENDAS BRUTAS': [{ icon: 'fas fa-cash-register', color: 'blue' }],
        'VENDA GROSS': [{ icon: 'fas fa-dollar-sign', color: 'gray' }],
        '(%) CONVERSÃO': [{ icon: 'fas fa-percentage', color: 'orange' }],
        '(%) CONVERSÃO GROSS': [{ icon: 'fas fa-percentage', color: 'orange' }],
        '(%) GROSS': [{ icon: 'fas fa-percentage', color: 'gray' }],
        '(%) MIGRAÇÕES': [{ icon: 'fas fa-random', color: 'purple' }],
        'TRANFS. CHECKOUT': [{ icon: 'fas fa-random', color: 'teal' }],
        '(%) TRANFS. CKECKOUT': [{ icon: 'fas fa-chart-line', color: 'teal' }],
        'RESPOSTA CLIENTE URA': [{ icon: 'fas fa-phone-volume', color: 'blue' }],
        '(%) RESPOSTA CLIENTE URA': [{ icon: 'fas fa-percentage', color: 'blue' }],
        'ACEITE CLIENTE': [{ icon: 'fas fa-user-check', color: 'green' }],
        '(%) ACEITE CLIENTE': [{ icon: 'fas fa-percent', color: 'green' }],
        'NÃO ACEITE CLIENTE': [{ icon: 'fas fa-user-times', color: 'red' }],
        '(%) NÃO ACEITE CLIENTE': [{ icon: 'fas fa-exclamation-circle', color: 'red' }],
        'POSSIBILIDADE GANHO': [{ icon: 'fas fa-coins', color: 'gold' }]
      }
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      }
    }
  }
</script>

<style scoped>
  .img-card {
    position: absolute;
    height: 150px;
    bottom: 3px;
    right: 15px;
  }
  /* @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap"); */

  h2 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 35px;
    color: white;
  }

  img {
    position: absolute;
    height: 200px;
    bottom: 3px;
    right: 15px;
  }

  .text-class-h2 {
    border-left: 3px solid rgb(240, 240, 240);
    padding-left: 10px; /* opcional para espaçar o texto da linha */
    font-size: 20px;
  }

  .cor-padrao {
    background-image: linear-gradient(260deg, rgb(0, 236, 255), #ec6810);
  }

  @keyframes blink {
    0%,
    50% {
      font-size: 25px;
      color: #ec6810;
    }
    51%,
    100% {
      font-size: 35px;
      color: #ff0000;
    }
  }

  .blinking {
    animation: blink 1s infinite;
  }
</style>
