<template>
  <v-container fluid class="mt-5">
    <slot name="header"></slot>
    <card-app-bar
      customClass="rounded-xl"
      :minHeight="120"
      style="margin-top: -20px"
      styleCustom="display:flex; flex-direction: column; height: 120px; padding:25px; color: #fafafa;"
    >
      <template v-slot:title>
        <div style="display: flex; flex-direction: column">
          <h2 class="text-capitalize">Olá, {{ usuario.nome.toLowerCase() }}!</h2>
        </div>
      </template>
      <template v-slot:subtitle>
        <p style="font-size: 12px">Acompanhe seu resultado de desconexões por chamadas.</p>
      </template>
      <template v-slot:imagem>
        <img
          src="@/assets/img/geral/03-index-bf-sem-fundo.png"
          style="position: absolute; height: 155px; bottom: -30px; right: 20px"
        />
      </template>
    </card-app-bar>
    <!-- botoes -->
    <div class="my-3" style="display: flex; justify-content: center; gap: 5px; flex-wrap: wrap">
      <fieldset style="padding: 7px; border: 0.5px solid #3333; border-radius: 5px">
        <legend
          style="
            font-size: 13px;
            margin: 0 5px;
            color: #343;
            padding: 0;
            margin-bottom: -5px;
            padding: 0 4px;
          "
        >
          Operação
        </legend>
        <v-btn-toggle
          mandatory
          v-model="operacao"
          class="rounded-lg"
          dense
          active-class="blue darken-3"
          @change="handleExe()"
        >
          <v-btn
            width="90"
            class="text-capitalize"
            v-for="(item, i) in operacoes"
            :key="i"
            :value="item.valor"
            :class="item.valor == operacao ? 'white--text' : ''"
          >
            <i
              v-if="item.valor == operacao"
              class="fa-solid fa-circle-check"
              style="color: greenyellow; margin-right: 5px"
            ></i>
            {{ item.text }}
          </v-btn>
        </v-btn-toggle>
      </fieldset>
      <fieldset style="padding: 7px; border: 0.5px solid #3333; border-radius: 5px">
        <legend
          style="
            font-size: 13px;
            margin: 0 5px;
            color: #343;
            padding: 0;
            margin-bottom: -5px;
            padding: 0 4px;
          "
        >
          Periodo
        </legend>
        <v-btn-toggle
          mandatory
          v-model="periodoAtual"
          class="rounded-lg"
          dense
          active-class="blue darken-3"
          @change="handleExe()"
        >
          <v-btn
            class="text-capitalize"
            v-for="(item, i) in periodos"
            :key="i"
            :value="item.valor"
            :class="item.valor == periodoAtual ? 'white--text' : ''"
          >
            <i
              v-if="item.valor == periodoAtual"
              class="fa-solid fa-circle-check"
              style="color: greenyellow; margin-right: 5px"
            ></i>
            {{ item.text }}
          </v-btn>
        </v-btn-toggle>
      </fieldset>
    </div>
    <!--  -->
    <card-info-display title="Dados Online">
      <template v-slot:body>
        <v-row>
          <!-- <pre>{{ cardOnline == "" }}</pre> -->
          <v-col xl="4" md="6" sm="12" lg="4" v-for="(item, i) in cardOnline" :key="i">
            <cardDetalheInfo
              :dados="cardOnline || 0"
              :title="item.COLUNA"
              :number="item.VALOR"
              :color="item.COLOR"
              :icon="item.FA_ICON"
              :descricao="item.DESCRIPTION_IND"
            />
          </v-col>
        </v-row>
      </template>
    </card-info-display>
    <card-info-display v-for="(item, i) in configuracaoComponents" :key="i" :title="item.TITULO">
      <template v-slot:body>
        <v-row>
          <v-col cols="12">
            <TableComponentChamadas
              :api="item.ENDPOINT"
              :objectParams="{ periodo: periodoAtual, parametro: operacao }"
              :numSuperior="item.NUM_SUPERIOR"
            />
          </v-col>
        </v-row>
      </template>
    </card-info-display>
  </v-container>
</template>

<script>
  import cardDetalheInfo from './cardDetalheInfo.vue'
  import CardInfoDisplay from './CardInfoDisplay.vue'
  import cardAppBar from '@/shared/components/cards/modern/cardAppBar.vue'
  import TableComponentChamadas from '../../../../../shared/components/DataTable/Table.vue'
  import { DesconexaoChamadas } from '../../../../../data/services/desconexaoChamadas/DesconexaoChamadas.js'
  import { ComponentesConfig } from '../../../../../data/services/componentes/Config.js'
  export default {
    components: {
      cardAppBar,
      cardDetalheInfo,
      CardInfoDisplay,
      TableComponentChamadas
    },
    data: () => ({
      operacoes: [
        {
          text: 'COMBO',
          valor: 'NET COMBO'
        },
        {
          text: 'MTF',
          valor: 'NET E2E'
        }
      ],
      periodos: [
        {
          text: 'Online',
          valor: 'ONLINE'
        },
        {
          text: 'Historico',
          valor: 'HISTORICO'
        }
      ],
      operacao: 'NET COMBO',
      periodoAtual: 'ONLINE',
      cardOnline: [],
      configuracaoComponents: []
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      async handleExe() {
        // 4: dados consolidados
        this.cardOnline = await DesconexaoChamadas.loadCardData(this.periodoAtual, this.operacao, 4)
      },
      async loadConfig() {
        this.configuracaoComponents = await ComponentesConfig.listarComponents(
          'NET',
          'DESCONEXAO CHAMADAS'
        )
      }
      // loadConfiguracaoComponents() {
      //   let urlData = `${config.baseUrl}api/shared/config/config_components/NET/PERFORMANCE ONLINE`;
      //   this.$api.get(urlData).then((res) => {
      //     this.configuracaoComponents = res.data;
      //   });
      // },
    },
    async created() {
      await this.handleExe()
      await this.loadConfig()
    }
  }
</script>

<style scoped>
  .cor-padrao {
    background-image: linear-gradient(260deg, rgb(0, 236, 255), #8f0e8f);
  }
  .v-card {
    border-radius: 16px;
  }

  .v-icon {
    margin-right: 8px;
  }

  .headline {
    font-size: 20px;
  }
</style>
