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
          <h2>Olá, {{ usuarioNome }}</h2>
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
      <v-row>
        <v-col cols="12">
          <!-- DADOS SILENTE -->
          <CardDadosSilente
            :arrayDados="dadosVendasSilente"
            :visibleExtrato="true"
            @open-extrato="extratoDialog = !extratoDialog"
          />
          <!-- DADOS ONLINE -->
          <CardDadosOnline
            :arrayDados="vendasOnline"
            :isLoadDataOnline="loadingData"
            @open-bot-message="isClickedBot = !isClickedBot"
          />
          <!-- DADOS HISTORICO -->
          <CardDadosHistorico :arrayDados="vendasHistorica" :isLoadDataHistory="loadingData" />
        </v-col>
      </v-row>
    </div>
    <extratoDeVendasComponent
      :numCargo="2"
      :extratoDialog="extratoDialog"
      @closeDialogExtrato="extratoDialog = !extratoDialog"
    />
  </v-container>
</template>

<script>
  import CardAppBar from '@/shared/components/cards/modern/cardAppBar.vue'
  import extratoDeVendasComponent from '../operador/dialog/table/extratoDeVendas.component.vue'
  import CardDadosSilente from '@/pages/operacao/net/serviceToSales/_components/DashDadosSilente.vue'
  import CardDadosOnline from '@/pages/operacao/net/serviceToSales/_components/DashDadosOnline.vue'
  import CardDadosHistorico from '@/pages/operacao/net/serviceToSales/_components/DashDadosHistorico.vue'
  import { ExtratoService } from '@/data/services/serviceToSales'
  export default {
    components: {
      CardAppBar,
      extratoDeVendasComponent,
      CardDadosSilente,
      CardDadosOnline,
      CardDadosHistorico
    },
    data() {
      return {
        dadosCarregados: false,
        loadingData: false,
        extratoDialog: false,
        isClickedBot: false,
        dadosVendasSilente: [],
        vendasHistorica: [],
        vendasOnline: []
      }
    },
    computed: {
      usuario() {
        return this.$store.getters.usuario
      },
      usuarioNome() {
        let usuario = this.$store.getters.usuario.usuario
        let oneUsuario = usuario.split(' ')
        let nameExhibition = oneUsuario[0]
        let name = nameExhibition[0].toUpperCase() + nameExhibition.toLowerCase().slice(1)
        return name
      }
    },
    methods: {
      async loadVendasOnline() {
        const result = await ExtratoService.getVendasOnline(
          this.usuario.almope,
          2,
          this.usuario.produto
        )
        this.vendasOnline = result
      },
      async loadVendasHistorica() {
        const result = await ExtratoService.getVendasHistorica(
          this.usuario.almope,
          2,
          this.usuario.produto
        )
        this.vendasHistorica = result
      },
      async loadDadosVendasSilente() {
        const result = await ExtratoService.getVendasSilente(
          this.usuario.almope,
          2,
          this.usuario.produto
        )
        this.dadosVendasSilente = result
      }
    },
    created() {
      this.loadVendasOnline()
      this.loadVendasHistorica()
      this.loadDadosVendasSilente()
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
