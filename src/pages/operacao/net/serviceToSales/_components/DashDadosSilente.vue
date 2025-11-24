<template>
  <v-card class="cor-padrao rounded-lg">
    <v-col>
      <div style="display: flex; align-items: center; justify-content: space-between">
        <p class="white--text text-class-h2">Dados Vendas Silente</p>
        <div>
          <v-chip small color="white" class="blue--text mr-3" v-if="arrayDados == ''">
            <i class="fa-solid fa-triangle-exclamation mr-2" style="color: #ff0000"></i>
            Não há dados disponiveis!
          </v-chip>
          <v-tooltip bottom v-if="visibleExtrato">
            <template v-slot:activator="{ attrs, on }">
              <v-btn
                v-on="on"
                v-bind="attrs"
                icon
                @click="$emit('open-extrato')"
                color="orange"
                class="mt-n6"
              >
                <v-icon>fa-solid fa-cart-shopping blinking</v-icon>
              </v-btn>
            </template>
            <span>Clique para ver seu extrato detalhado!</span>
          </v-tooltip>
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
          <v-col v-for="(item, i) in arrayDados" :key="i" class="pa-2" xl="4" md="4">
            <CardDash
              :title="item.COLUNA"
              :valor="item.VALOR"
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
      visibleExtrato: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      indicadores: {
        'VENDA ATIVADA MAR': [{ icon: 'fas fa-calendar-plus', color: 'purple' }],
        'VENDA SILENTE MAR': [{ icon: 'fas fa-user-secret', color: 'orange' }],
        '(%) SILENTE MAR': [{ icon: 'fas fa-percentage', color: 'orange' }],
        'VENDA ATIVADA ABR': [{ icon: 'fas fa-calendar-plus', color: 'purple' }],
        'VENDA SILENTE ABR': [{ icon: 'fas fa-user-secret', color: 'orange' }],
        '(%) SILENTE ABR': [{ icon: 'fas fa-percentage', color: 'orange' }]
      }
    })
  }
</script>

<style scoped>
  h2 {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 35px;
    color: white;
  }

  .img-card {
    position: absolute;
    height: 150px;
    bottom: 3px;
    right: 15px;
  }

  .text-class-h2 {
    border-left: 3px solid rgb(240, 240, 240);
    padding: 8px; /* opcional para espaçar o texto da linha */
    font-size: 20px;
  }
  .cor-padrao {
    background-image: linear-gradient(260deg, rgb(0, 236, 255), #8f0e8f);
  }
</style>
