<template>
  <v-card elevation="0" class="rounded-tl-xl mt-7">
    <title-rounded-tl-rb class="mb-4">
      <template v-slot:title>
        <v-icon color="white" class="mr-2">fa-solid fa-dice</v-icon>
        <h2 class="white--text">Lista de Players</h2>
      </template>
      <v-row justify="end" align="end" class="mr-2">
        <v-col class="pa-0 ma-0" cols="2">
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Pesquisar"
            single-line
            hide-details
            outlined
            rounded
            color="white"
            dense
          ></v-text-field>
        </v-col>
      </v-row>
    </title-rounded-tl-rb>
    <v-data-table
      :search="search"
      :headers="filtroDeHeaders()"
      no-data-text="Não foram encontrados dados"
      dense
      :items="pendentesBencao"
      :items-per-page="20"
      class="text-no-wrap"
      :footer-props="footerProps"
    >
      <template v-slot:item.ACAO="{ item }">
        <v-btn
          icon
          @click="abriDetalheOperador([{ almope: item.ALMOPE_OPE, nome: item.NOME_OPE }])"
        >
          <v-icon size="16" color="blue">fa-solid fa-eye</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <view-detalhes-operador
      :viewDetalhesOperador="viewDetalhesOperador"
      @update:viewDetalhesOperador="viewDetalhesOperador = !viewDetalhesOperador"
      :nome="nome"
      :almope="almope"
    ></view-detalhes-operador>
  </v-card>
</template>

<script>
  import config from '../../../core/config.js'
  import ViewDetalhesOperador from './solicitarBencao/ViewDetalhesOperador.vue'
  export default {
    components: { ViewDetalhesOperador },
    data: () => ({
      page: 1,
      pageCount: 0,
      valid: true,
      search: '',
      playerConsulta: '',
      pendentesBencao: [],
      dadosBencao: [],
      abrirModalFeedback: false,
      viewDetalhesOperador: false,
      nome: null,
      almope: null,
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      }
    }),
    computed: {
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      cargo() {
        return this.$store.getters.usuario.filtro
      },
      numCargo() {
        let cargo = this.$store.getters.usuario.filtro
        if (cargo == 'SUPERVISOR') {
          return 1
        } else if (cargo == 'COORDENADOR') {
          return 2
        } else if (cargo == 'GERENTE' || cargo == 'ADMINISTRADOR') {
          return 3
        }
        return ''
      }
    },
    methods: {
      abriDetalheOperador(value) {
        this.nome = value[0].nome
        this.almope = value[0].almope
        this.viewDetalhesOperador = true
      },
      filtroDeHeaders() {
        if (this.cargo == 'SUPERVISOR') {
          return this.getHeaders(1)
        } else if (this.cargo == 'COORDENADOR') {
          return this.getHeaders(2)
        } else if (this.cargo == 'GERENTE' || this.cargo == 'ADMINISTRADOR') {
          return this.getHeaders(3)
        }
      },
      getHeaders(numCargo) {
        let id = {
          text: 'ID',
          align: 'center',
          value: 'ID'
        }

        let almope = {
          text: 'Almope',
          align: 'center',
          value: 'ALMOPE_OPE'
        }

        let nome = {
          text: 'Nome',
          align: 'center',
          value: 'NOME_OPE'
        }

        let nomeSupervisor = {
          text: 'Supervisor',
          align: 'center',
          value: 'SUPERIOR1'
        }

        let nomeCoordenador = {
          text: 'Coordenador',
          align: 'center',
          value: 'SUPERIOR2'
        }

        let headers = [
          {
            text: 'Rank Geral',
            align: 'center',
            value: 'RANK_GERAL'
          },
          {
            text: 'Rank Team',
            align: 'center',
            value: 'RANK_TEAM'
          },

          {
            text: 'Regional',
            align: 'center',
            value: 'REGIONAL'
          },
          {
            text: 'Equipe',
            align: 'center',
            value: 'GRUPO'
          },
          {
            text: 'Patente',
            align: 'center',
            value: 'PATENTE'
          },
          {
            text: 'XP',
            align: 'center',
            value: 'XP'
          },
          {
            text: 'HP',
            align: 'center',
            value: 'HP'
          },
          {
            text: 'Campanha',
            align: 'center',
            value: 'ACAO'
          },
          {
            text: 'Status',
            align: 'center',
            value: 'STATUS_REVIVE'
          }
        ]

        if (numCargo === 1) {
          headers.unshift(nome)
          headers.unshift(almope)
          headers.unshift(id)
        } else if (numCargo == 2) {
          headers.unshift(nomeSupervisor)
          headers.unshift(nome)
          headers.unshift(almope)
          headers.unshift(id)
        } else if (numCargo == 3) {
          headers.unshift(nomeCoordenador)
          headers.unshift(nomeSupervisor)
          headers.unshift(nome)
          headers.unshift(almope)
          headers.unshift(id)
        }

        return headers
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
          let urlData = `${config.baseUrl}api/shared/gamification/gestao_player/listar_players`
          var res = await this.$api.get(urlData, {
            params: {
              almope: this.usuarioAlmope,
              numCargo: this.numCargo
            }
          })
          this.pendentesBencao = res.data
        } catch (error) {
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
