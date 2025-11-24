<template>
  <div class="mt-7">
    <!-- <card-produtividade-component></card-produtividade-component> -->
    <v-row>
      <load-envio-dados
        v-if="isLoading"
        :envioDados="isLoading"
        :activeMsg="true"
        msg="Obtendo informações do segmento... Por favor aguarde!"
      ></load-envio-dados>
      <template v-else-if="!isComboWL && !isClaroBKO && !isEnel">
        <v-container>
          <v-row class="ma-0 pa-0">
            <v-col cols="12" sm="12" md="12" xl="6">
              <informacoes-ocorencia-component
                :configFila="dadosConfig"
                :dadosCarregados="executarAcao"
                @update:analise-caso="dadosParaAnalise"
                @update:info-carregamento-status="statusCarregamento"
                @update:retornarCasoAgendado="reloadRetornarCasoAgendado"
                :analiseIsSave="statusIsSave"
              ></informacoes-ocorencia-component>
            </v-col>
            <v-col cols="12" sm="12" md="12" xl="6">
              <analise-caso-component
                :configFila="dadosConfig"
                :dadosTratativaCaso="analiseCaso"
                @update:info-carregamento-status="statusCarregamento"
                @update:analise-salva="statusAnalise"
              ></analise-caso-component>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <template v-else-if="isClaroBKOTrade">
        <v-container>
          <form-analise-caso-claro-trade
            :configFila="dadosConfig"
            :dadosCarregados="executarAcao"
            @update:analise-salva="statusAnalise"
          ></form-analise-caso-claro-trade>
        </v-container>
      </template>
      <template v-else-if="isEnel">
        <v-container>
          <FormMailingResolveN2 :configFila="dadosConfig" />
        </v-container>
      </template>
      <template v-else>
        <v-row class="ma-0 pa-0">
          <v-col cols="12" sm="12" md="12" xl="6">
            <informacoes-ocorrencia-wl-component
              :configFila="dadosConfig"
              :dadosCarregadosWl="executarAcao"
              @update:info-carregamento-status="statusCarregamento"
              @update:analise-caso-wl="dadosParaAnaliseWl"
              @update:retornarCasoAgendado="reloadRetornarCasoAgendado"
              :analiseIsSave="statusIsSave"
            ></informacoes-ocorrencia-wl-component>
          </v-col>
          <v-col cols="12" sm="12" md="12" xl="6">
            <form-analise-caso-wl-component
              :numOcorrenciaNomeOrigem="dadosAnaliseCasoWl"
              :configFila="dadosConfig"
              @update:info-carregamento-status="statusCarregamento"
              @update:analise-salva="statusAnalise"
            ></form-analise-caso-wl-component>
          </v-col>
        </v-row>
      </template>
    </v-row>
  </div>
</template>

<script>
  import AnaliseCasoComponent from './formAnaliseCaso.component.vue'
  import InformacoesOcorenciaComponent from './InformacoesOcorencia.component.vue'
  import loadEnvioDados from '../../../shared/components/load/loadHastag.vue'
  import InformacoesOcorrenciaWlComponent from './informacoesOcorrenciaWL.component.vue'
  import FormAnaliseCasoWlComponent from './formAnaliseCasoWl.component.vue'
  import FormAnaliseCasoClaroTrade from './tipoFila/claroTrade/formAnaliseCasoClaroTrade.vue'
  import FormMailingResolveN2 from '@/pages/resolveN2/backoffice/Tabulador.vue'
  // import CardProdutividadeComponent from "./CardProdutividade.component.vue";

  export default {
    components: {
      AnaliseCasoComponent,
      InformacoesOcorenciaComponent,
      loadEnvioDados,
      InformacoesOcorrenciaWlComponent,
      FormAnaliseCasoWlComponent,
      FormAnaliseCasoClaroTrade,
      FormMailingResolveN2
      // CardProdutividadeComponent,
    },
    data: () => ({
      analiseCaso: [],
      dadosAnaliseCasoWl: [],
      baixandoInfor: false,
      statusIsSave: false,
      isLoading: true
    }),
    computed: {
      dadosConfig() {
        // let configuracaoArray = this.configBackoffice[0] || {}
        // let configuracaoObject = {
        //   ID: configuracaoArray.ID,
        //   ID_SKILL: configuracaoArray.ID_SKILL,
        //   FILA_GRUPO: configuracaoArray.FILA_GRUPO,
        //   FILA_NOME: configuracaoArray.FILA_NOME,
        //   FILA_PROCEDURE: configuracaoArray.FILA_PROCEDURE,
        //   RESULTADO_PROCEDURE: configuracaoArray.RESULTADO_PROCEDURE,
        //   PARAMETRO_RESULTADOS_OPE: configuracaoArray.PARAMETRO_RESULTADOS_OPE,
        //   PARAMETRO_NOVO_CASO: configuracaoArray.PARAMETRO_NOVO_CASO,
        //   PARAMETRO_VERIFICACAO: configuracaoArray.PARAMETRO_VERIFICACAO,
        //   PARAMETRO_BACKLOG: configuracaoArray.PARAMETRO_BACKLOG,
        //   PARAMETRO_AGENDAMENTO: configuracaoArray.PARAMETRO_AGENDAMENTO,
        //   PARAMETRO_RESOLVER: configuracaoArray.PARAMETRO_RESOLVER,
        //   PARAMETRO_LIBERAR_AGEND: configuracaoArray.PARAMETRO_LIBERAR_AGEND,
        //   PARAMETRO_SALVAR: configuracaoArray.PARAMETRO_SALVAR,
        //   DENTRO_PRAZO: configuracaoArray.DENTRO_PRAZO,
        //   FORA_PRAZO: configuracaoArray.FORA_PRAZO
        // }
        const config = this.configBackoffice[0] || {}
        const campos = [
          'ID',
          'ID_SKILL',
          'FILA_GRUPO',
          'FILA_NOME',
          'FILA_PROCEDURE',
          'RESULTADO_PROCEDURE',
          'PARAMETRO_RESULTADOS_OPE',
          'PARAMETRO_NOVO_CASO',
          'PARAMETRO_VERIFICACAO',
          'PARAMETRO_BACKLOG',
          'PARAMETRO_AGENDAMENTO',
          'PARAMETRO_RESOLVER',
          'PARAMETRO_LIBERAR_AGEND',
          'PARAMETRO_SALVAR',
          'DENTRO_PRAZO',
          'FORA_PRAZO',
          'FILA_FORM_ID'
        ]

        return campos.reduce((acc, campo) => {
          acc[campo] = config[campo]
          return acc
        }, {})

        // return configuracaoObject
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      },
      configBackoffice() {
        return this.$store.getters.configBackoffice
      },
      executarAcao() {
        return this.$store.getters.executarAcao
      },
      isComboWL() {
        return this.dadosConfig?.FILA_GRUPO === 'COMBO WL'
      },
      isEnel() {
        let grupo = this.$route.query.grupo
        return grupo == 'ENEL BKO'
      },
      isClaroBKO() {
        return this.dadosConfig?.FILA_GRUPO
          ? ['CLARO BKO', 'CLARO TRADE BKO'].includes(this.dadosConfig.FILA_GRUPO)
          : false
      },
      isClaroBKOTrade() {
        return this.dadosConfig?.FILA_GRUPO === 'CLARO TRADE BKO'
      }
    },
    methods: {
      statusAnalise() {
        this.statusIsSave = true
        this.loadConfigBackoffice()
        setTimeout(() => {
          this.statusIsSave = false
        }, 1500)
      },
      loadConfigBackoffice() {
        this.$store.dispatch('loadConfigBackoffice', this.$route.params.id).then(() => {
          this.tratativaPendente()
          this.isLoading = false
        })
      },
      statusCarregamento(status) {
        this.baixandoInfor = status
      },
      dadosParaAnalise(dadosEvent) {
        this.analiseCaso = dadosEvent
      },
      dadosParaAnaliseWl(dadosEvent) {
        this.dadosAnaliseCasoWl = dadosEvent
      },
      async reloadRetornarCasoAgendado() {
        await this.tratativaPendente()
      },
      async tratativaPendente() {
        try {
          this.baixandoInfor = true
          let numCaso = ''
          let dataAgendamento = ''
          let tipoOcorrencia = ''
          let filaNome = ''

          await this.$store.dispatch('loadExecutarAcao', {
            filaProcedure: this.dadosConfig.FILA_PROCEDURE,
            paramVerificacao: this.dadosConfig.PARAMETRO_VERIFICACAO,
            numCaso: numCaso,
            almope: this.usuarioAlmope,
            dataAgendamento: dataAgendamento,
            tipoOcorrencia: tipoOcorrencia,
            filaNome: filaNome
          })
          setTimeout(() => {
            this.baixandoInfor = false
          }, 1500)
        } catch (error) {
          console.error(error)
        }
      }
    },
    created() {
      this.loadConfigBackoffice()
    }
  }
</script>

<style></style>
