<template>
  <v-card elevation="0" class="rounded-tl-xl mt-7">
    <title-rounded-tl-rb class="mb-4">
      <template v-slot:title>
        <v-icon color="white" class="mr-2">fa-solid fa-dice</v-icon>
        <h2 class="white--text">Lista de Players</h2>
      </template>
      <v-row style="display: flex; align-items: center; justify-content: end">
        <div style="min-width: 300px">
          <v-text-field
            class="mb-n5"
            label="Selecione"
            prepend-inner-icon="fa-solid fa-magnifying-glass"
            rounded
            solo
            color="white"
            v-model="search"
            dense
          ></v-text-field>
        </div>
        <v-btn class="ml-3" icon color="white" to="/pyxis/gamification/gestao-player/lista-players">
          <v-icon color="white">fa-solid fa-chevron-left</v-icon>
        </v-btn>
      </v-row>
    </title-rounded-tl-rb>
    <v-data-table
      :headers="headers"
      no-data-text="Não há players pendentes"
      dense
      :loading="loadingPendentes"
      loading-text="Carregando..."
      no-results-text="Não foram encontrados resultados para a pesquisa selecionada"
      :search="search"
      :items="pendentesBencao"
      :footer-props="footerProps"
    >
      <template v-slot:item.VALIDACAO="{ item }">
        <v-btn
          @click="concederBencao(item)"
          icon
          :disabled="item.PERMITIR_LIBERACAO == 'AGUARDANDO VALIDAÇÃO'"
        >
          <v-icon size="17" :color="btnBencao(item.PERMITIR_LIBERACAO)">
            fa-solid fa-hand-holding-heart
          </v-icon>
        </v-btn>
      </template>
      <template v-slot:item.PERMITIR_LIBERACAO="{ item }">
        {{ item.PERMITIR_LIBERACAO }}
      </template>
      <template v-slot:item.ALMOPE_PLAYER="{ item }">
        {{ item.ALMOPE_PLAYER }}
      </template>
      <template v-slot:item.ACAO="{ item }">
        <v-btn
          rounded
          small
          icon
          @click="abriDetalheOperador([{ almope: item.ALMOPE_PLAYER, nome: item.NOME }])"
        >
          <v-icon size="16">fa-solid fa-eye</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <modal-feedback-player
      :abrirModalFeedback="abrirModalFeedback"
      :dados="dadosBencao"
      @update:close="abrirModalFeedback = !abrirModalFeedback"
      @update:solicitacao-enviada="atualizarPendentes"
    ></modal-feedback-player>
    <view-detalhes-operador
      :viewDetalhesOperador="viewDetalhesOperador"
      @update:viewDetalhesOperador="viewDetalhesOperador = !viewDetalhesOperador"
      :nome="nome"
      :almope="almope"
    ></view-detalhes-operador>
  </v-card>
</template>

<script>
  import ModalFeedbackPlayer from './ModalFeedbackPlayer.vue'
  import ViewDetalhesOperador from './ViewDetalhesOperador.vue'

  import config from '../../../../core/config.js'
  export default {
    components: { ModalFeedbackPlayer, ViewDetalhesOperador },
    data: () => ({
      page: 1,
      pageCount: 0,
      valid: true,
      playerConsulta: '',
      pendentesBencao: [],
      dadosBencao: [],
      search: '',
      abrirModalFeedback: false,
      viewDetalhesOperador: false,
      nome: null,
      almope: null,
      loadingPendentes: false,
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      },
      headers: [
        {
          text: 'ID',
          align: 'center',
          value: 'ID'
        },
        {
          text: 'Campanha',
          align: 'center',
          value: 'ACAO'
        },
        {
          text: 'Almope',
          align: 'center',
          value: 'ALMOPE_PLAYER'
        },
        {
          text: 'Nome',
          align: 'center',
          value: 'NOME'
        },
        {
          text: 'Regional',
          align: 'center',
          value: 'REGIONAL'
        },
        {
          text: 'Equipe',
          align: 'center',
          value: 'EQUIPE'
        },
        {
          text: 'Inicio Ban',
          align: 'center',
          value: 'DATA_INICIO_BAN'
        },
        {
          text: 'Abençoar',
          align: 'center',
          value: 'VALIDACAO'
        },
        {
          text: 'Status Benção',
          align: 'center',
          value: 'PERMITIR_LIBERACAO'
        }
      ]
    }),
    computed: {
      usuarioNome() {
        return this.$store.getters.usuario.nome
      },
      produto() {
        return this.$store.getters.usuario.produto
      }
    },
    methods: {
      btnBencao(value) {
        if (value == 'AGUARDANDO VALIDAÇÃO') {
          return 'grey'
        } else if (value == 'REPROVADO') {
          return 'red'
        } else {
          return 'green'
        }
      },
      abriDetalheOperador(value) {
        this.nome = value[0].nome
        this.almope = value[0].almope
        this.viewDetalhesOperador = true
      },
      atualizarPendentes(e) {
        if (e == true) {
          this.loadPendentesBencao()
        }
      },
      concederBencao(i) {
        this.dadosBencao = []
        this.abrirModalFeedback = true
        this.dadosBencao = i
      },
      async loadPendentesBencao() {
        try {
          this.loadingPendentes = true
          let urlData = `${config.baseUrl}api/shared/gamification/gestao_player/pendentes_bencao`
          var res = await this.$api.get(urlData, {
            params: {
              supervisor: this.usuarioNome,
              produto: this.produto
            }
          })
          this.pendentesBencao = res.data
          this.loadingPendentes = false
        } catch (error) {
          this.loadingPendentes = false
          return error
        }
      }
    },
    created() {
      this.loadPendentesBencao()
    }
  }
</script>

<style scoped>
  .table {
    position: relative;
  }

  .btn-exibir {
    background-image: linear-gradient(220deg, rgb(0, 236, 255), rgb(143, 14, 143));
  }
</style>
