<template>
  <v-container>
    <card-app-bar
      customClass="rounded-xl"
      :minHeight="135"
      style="margin-top: 20px"
      styleCustom="display: flex; flex-direction: column; height: 135px; padding: 25px; color: #fafafa;"
    >
      <template v-slot:title>
        <div style="display: flex; flex-direction: column">
          <h2 class="text-capitalize">Olá, {{ usuario.nome.split(' ')[0].toLowerCase() }}!</h2>
        </div>
      </template>
      <template v-slot:subtitle>
        <p style="font-size: 12px">Acompanhe suas vendas online e histórica aqui.</p>
      </template>
      <template v-slot:imagem>
        <img class="img-card" src="@/assets/img/geral/index-bf.png" />
      </template>
    </card-app-bar>
    <div class="mt-7">
      <div style="display: grid; grid-template-columns: 1fr 350px; gap: 20px">
        <div>
          <CardDadosSilente
            :arrayDados="dadosVendasSilente"
            :visibleExtrato="true"
            @open-extrato="extratoDialog = !extratoDialog"
          />
          <!-- DADOS ONLINE -->
          <CardDadosOnline
            :arrayDados="vendasOnline"
            :isLoadDataOnline="isLoadDataOnline"
            @open-bot-message="isClickedBot = !isClickedBot"
          />

          <!-- DADOS HISTORICO -->
          <CardDadosHistorico
            :arrayDados="vendasHistorica"
            :isLoadDataHistory="isLoadDataHistory"
          />
        </div>
        <div>
          <card-chat-bot
            :items="items"
            :loadingData="isItems"
            :isArrayObject="true"
            messageImportante="Extrato detalhado de vendas"
            :isAlert="true"
            statusMessages="STATUS VENDA"
            equalStatusMessages="VENDA BRUTA"
          >
            <template v-slot:button>
              <v-btn
                rounded
                depressed
                width="150"
                class="mb-2"
                :class="tipoDado == 'ONLINE' ? 'primary' : 'orange lighten-5'"
                @click="tipoDado = 'ONLINE'"
              >
                Online
              </v-btn>
              <v-btn
                rounded
                depressed
                width="150"
                @click="tipoDado = 'HISTORICO'"
                :class="tipoDado == 'HISTORICO' ? 'primary' : 'orange lighten-5'"
              >
                Histórico
              </v-btn>
            </template>
          </card-chat-bot>
        </div>
      </div>
    </div>
    <ComunicadoSilente v-model="dialog" />
    <extratoDeVendasComponent
      :numCargo="3"
      :extratoDialog="extratoDialog"
      @closeDialogExtrato="extratoDialog = !extratoDialog"
    />
  </v-container>
</template>

<script>
  import CardAppBar from '@/shared/components/cards/modern/cardAppBar.vue'
  import CardChatBot from '@/shared/components/cards/modern/chat/cardChatBot.vue'
  import extratoDeVendasComponent from './dialog/table/extratoDeVendas.component.vue'
  import ComunicadoSilente from './dialog/ComunicadoSilente.vue'

  import CardDadosSilente from '@/pages/operacao/net/serviceToSales/_components/DashDadosSilente.vue'
  import CardDadosOnline from '@/pages/operacao/net/serviceToSales/_components/DashDadosOnline.vue'
  import CardDadosHistorico from '@/pages/operacao/net/serviceToSales/_components/DashDadosHistorico.vue'
  import { ExtratoService } from '@/data/services/serviceToSales'
  export default {
    components: {
      CardAppBar,
      CardChatBot,
      extratoDeVendasComponent,
      CardDadosSilente,
      CardDadosOnline,
      CardDadosHistorico,
      ComunicadoSilente
    },
    data() {
      return {
        tipoDado: 'ONLINE',
        dialog: true,
        dialogExtrato: false,
        loadingData: false,
        isLoadDataOnline: false,
        isLoadDataHistory: false,
        openDiscurso: true,
        isItems: false,
        isClickedBot: false,
        extratoDialog: false,
        items: [{ message: '' }],
        dadosVendasSilente: [],
        vendasHistorica: [],
        vendasSilente: [],
        vendasOnline: []
      }
    },
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      usuario() {
        return this.$store.getters.usuario
      }
    },
    mounted() {},
    methods: {
      async loadExtratoVendas() {
        this.isItems = true
        this.items = [{ message: '' }]
        const result = await ExtratoService.getDetalhamentoVendas(
          this.usuario.almope,
          this.tipoDado
        )
        this.items = result
        this.isItems = false
      },
      async loadVendasOnline() {
        const result = await ExtratoService.getVendasOnline(
          this.usuario.almope,
          3,
          this.usuario.produto
        )
        this.vendasOnline = result
      },
      async loadVendasHistorica() {
        const result = await ExtratoService.getVendasHistorica(
          this.usuario.almope,
          3,
          this.usuario.produto
        )
        this.vendasHistorica = result
      },
      async loadDadosVendasSilente() {
        const result = await ExtratoService.getVendasSilente(
          this.usuario.almope,
          3,
          this.usuario.produto
        )
        this.dadosVendasSilente = result
      }
    },
    created() {
      this.loadExtratoVendas()

      this.loadVendasOnline()
      this.loadVendasHistorica()
      this.loadDadosVendasSilente()
    },
    watch: {
      tipoDado() {
        this.loadExtratoVendas()
      }
    }
  }
</script>

<style scoped>
  /* @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap"); */

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

  @keyframes blink {
    0%,
    50% {
      font-size: 25px;
      color: #be1fee;
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
