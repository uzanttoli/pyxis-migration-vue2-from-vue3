<template>
  <v-container fluid :class="almopeConsulta == '' ? 'mt-5' : ''">
    <slot name="header"></slot>
    <card-app-bar
      v-if="usuarioAlmope == usuario.almope"
      customClass="rounded-xl"
      :minHeight="120"
      style="margin-top: -20px"
      styleCustom="display:flex; flex-direction: column; height: 120px; padding:25px; color: #fafafa;"
    >
      <template v-slot:title>
        <div style="display: flex; flex-direction: column">
          <h2>Olá, {{ nomeUsuario }}!</h2>
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
    <div class="mt-7">
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
      <!--  -->
      <card-info-display title="Dados Histórico">
        <template v-slot:body>
          <v-row>
            <v-col xl="4" md="6" sm="12" lg="4" v-for="(item, j) in cardHistorico" :key="j">
              <cardDetalheInfo
                :dados="cardHistorico || 0"
                :title="item.COLUNA"
                :number="item.VALOR"
                :color="item.COLOR"
                :icon="item.FA_ICON"
                :descricao="item.DESCRIPTION_IND"
              />
            </v-col>
          </v-row>
          <table-component
            class="mt-5"
            :loading="dadosHistoricoTable == ''"
            :dados="dadosHistoricoTable"
          ></table-component>
        </template>
      </card-info-display>

      <!--  -->
      <card-info-display title="Dados Nominal" v-if="perfilUsuario != 1">
        <template v-slot:body>
          <table-component
            :dados="dadosNominal"
            :loading="dadosNominal == ''"
            :action="true"
            @update:dados-click="dadosRetorno"
          ></table-component>
        </template>
      </card-info-display>
    </div>
  </v-container>
</template>

<script>
  import cardAppBar from '@/shared/components/cards/modern/cardAppBar.vue'
  import TableComponent from './tableComponent.vue'
  import cardDetalheInfo from './cardDetalheInfo.vue'
  import CardInfoDisplay from './CardInfoDisplay.vue'
  import config from '../../../../../core/config'
  export default {
    name: 'painel',
    components: {
      cardAppBar,
      TableComponent,
      cardDetalheInfo,
      CardInfoDisplay
    },
    props: {
      almopeConsulta: {
        type: Number,
        default: null
      },
      usuarioAlmope: {
        type: Number,
        required: true
      },
      nomeUsuario: {
        type: String,
        required: true
      },
      perfilUsuario: {
        type: Number,
        required: true
      }
    },
    data: () => ({
      openDialog: false,
      perfil: [{ OPERADOR: 1 }, { SUPERVISOR: 2 }, { COORDENADOR: 3 }, { ADMINISTRADOR: 4 }],
      Icones: {
        ['Chamadas Atendidas']: 'fa-solid fa-headset',
        ['Desconexão']: 'fa-solid fa-circle-exclamation',
        ['(%) Desconexão Por Chamada']: 'fa-solid fa-percent'
      },
      corIcone: {
        ['Chamadas Atendidas']: 'blue',
        ['Desconexão']: 'red',
        ['(%) Desconexão Por Chamada']: 'grey'
      },
      cardOnline: [],
      cardHistorico: [],
      dadosHistoricoTable: [],
      dadosNominal: []
    }),
    computed: {
      usuario() {
        return this.$store.getters.usuario
      }
      // usuarioNome() {
      //   let usuario = this.$store.getters.usuario.usuario;
      //   let oneUsuario = usuario.split(" ");
      //   let nameExhibition = oneUsuario[0];
      //   let name =
      //     nameExhibition[0].toUpperCase() + nameExhibition.toLowerCase().slice(1);
      //   return name;
      // },
      // perfilUsuario() {
      //   return this.perfil
      //     .map((item) => item[this.usuario.filtro])
      //     .filter((item2) => item2 != null)[0];
      // },
    },
    methods: {
      dadosRetorno(item) {
        this.$emit('update:retorno', item)
        this.openDialog = true
      },
      loadDadosCard(periodo, ref) {
        let urlData = `${config.baseUrl}api/shared/retencao/desc_x_chamadas/dados_card`
        this.$api
          .get(urlData, {
            params: {
              almope: this.usuarioAlmope,
              periodo: periodo,
              perfil: this.perfilUsuario
            }
          })
          .then(res => {
            this[ref] = res.data // referência para o 'data:()=>({})'
          })
      },
      loadDadosTable(periodo) {
        let urlData = `${config.baseUrl}api/shared/retencao/desc_x_chamadas/dados_table`
        this.$api
          .get(urlData, {
            params: {
              almope: this.usuarioAlmope,
              periodo: periodo,
              perfil: this.perfilUsuario
            }
          })
          .then(res => {
            this.dadosHistoricoTable = res.data
          })
      },
      loadDadosNominal() {
        if (this.perfilUsuario == 1) return
        let urlData = `${config.baseUrl}api/shared/retencao/desc_x_chamadas/dados_nominal`
        this.$api
          .get(urlData, {
            params: {
              almope: this.usuarioAlmope,
              perfil: this.perfilUsuario
            }
          })
          .then(res => {
            this.dadosNominal = res.data
          })
      }
    },
    created() {
      this.loadDadosCard('ONLINE', 'cardOnline')
      this.loadDadosCard('HISTORICO', 'cardHistorico')
      this.loadDadosTable('HISTORICO')
      this.loadDadosNominal()
    },
    watch: {
      usuarioAlmope: function (newVal, oldVal) {
        if (newVal != oldVal) {
          this.loadDadosCard('ONLINE', 'cardOnline')
          this.loadDadosCard('HISTORICO', 'cardHistorico')
          this.loadDadosTable('HISTORICO')
          this.loadDadosNominal()
        }
      }
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
