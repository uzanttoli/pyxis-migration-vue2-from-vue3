<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="0" class="rounded-xl">
        <title-background>
          <template v-slot:title>
            <v-icon color="white" class="mr-2">mdi-weather-cloudy-clock</v-icon>
            Meu Resultado Online
          </template>
          <template v-slot:subtitle>Dados atualizados a cada 30 minutos.</template>
        </title-background>
        <v-col>
          <v-row v-if="dadosExtrato != ''">
            <card-css
              v-for="(item, i) in dadosExtrato"
              :key="i"
              :title="item.COLUNA"
              :dadosCampo1="item.PERC"
              :dadosCampo2="item.VALOR"
              :subTitle="item.COLUNA == 'CHAMADAS ATENDIDAS' ? 'Identificada' : 'Percentual'"
              :subTitle2="item.COLUNA == 'CHAMADAS ATENDIDAS' ? 'Atendidas' : 'Quantidade'"
            ></card-css>
          </v-row>
          <v-row v-else>
            <v-card
              width="100%"
              min-height="150"
              class="d-flex align-center justify-center rounded-xl mt-n5"
            >
              <img src="../../../../../../assets/img/geral/notFound.png" alt="" height="175" />
              <p class="text-h6 grey--text">Intervalo de resultado online ainda não disponível!</p>
            </v-card>
          </v-row>
        </v-col>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  import cardCss from '@/shared/components/cards/cardSubTitle.component.vue'
  import titleBackground from '@/shared/components/cards/cardTituloPaginaComFundo.vue'
  import config from '@/core/config'
  export default {
    name: 'card-resultado-online',
    components: {
      titleBackground,
      cardCss
    },
    props: {
      parametro: {
        type: [String, Number],
        default: null
      },
      apiUrl: {
        type: String,
        default: null
      }
    },
    data: () => ({
      dadosExtrato: []
    }),
    computed: {},
    methods: {
      loadDadosExtrato() {
        let urlData = `${config.baseUrl}${this.apiUrl}/${this.parametro}`
        this.$api.get(urlData).then(res => {
          this.dadosExtrato = res.data
        })
      }
    },
    watch: {
      parametro() {
        this.loadDadosExtrato()
      }
    },
    created() {
      this.loadDadosExtrato()
    }
  }
</script>

<style></style>
