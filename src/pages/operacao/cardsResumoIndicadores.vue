<template>
  <v-row justify="center" v-if="resumoIndicadores != ''">
    <card-title-info-bottom
      title="Abs"
      :consolidado="resumoAbs[0] ? resumoAbs[0].CONSOLIDADO : 0"
      :infoList="resumoAbs[0] ? resumoAbs[0].ITEMS : {}"
      :percentTitle="true"
      @update:justificar-abs="justificarAbs"
    ></card-title-info-bottom>
    <card-title-info-bottom
      title="Inaderência"
      :consolidado="resumoInaderencia[0] ? resumoInaderencia[0].CONSOLIDADO : 0"
      :infoList="resumoInaderencia[0] ? resumoInaderencia[0].ITEMS : {}"
      :percentTitle="true"
    ></card-title-info-bottom>
    <card-title-info-bottom
      title="Tempo Logado"
      :consolidado="resumoTempoLogado[0] ? resumoTempoLogado[0].CONSOLIDADO : 0"
      :infoList="resumoTempoLogado[0] ? resumoTempoLogado[0].ITEMS : {}"
    ></card-title-info-bottom>
    <card-title-info-bottom
      title="Pausas"
      :consolidado="resumoPausas[0] ? resumoPausas[0].CONSOLIDADO : 0"
      :infoList="resumoPausas[0] ? resumoPausas[0].ITEMS : {}"
    ></card-title-info-bottom>
  </v-row>
</template>

<script>
  import CardTitleInfoBottom from '@/shared/components/cards/cardTitleInfoBottom.vue'
  import config from '@/core/config'
  export default {
    components: { CardTitleInfoBottom },
    props: {
      usuarioNome: {
        type: String,
        required: true
      },
      apiUrl: {
        type: String,
        required: true
      }
    },
    data: () => ({
      resumoIndicadores: [],
      items: [
        {
          title: 'Inaderência',
          consolidado: 'resumoInaderencia',
          infoList: 'resumoInaderencia',
          percentTitle: true
        }
      ]
    }),
    computed: {
      resumoAbs() {
        let data = this.resumoIndicadores

        return data.map(item => {
          return {
            TITLE: 'ABS',
            CONSOLIDADO: item.PERCENT_ABS,
            ITEMS: [
              {
                SUBTITLE: 'Escalados',
                VALOR: item.ESCALADOS
              },
              {
                SUBTITLE: 'Faltas',
                VALOR: item.ABS
              }
            ]
          }
        })
      },
      resumoInaderencia() {
        let data = this.resumoIndicadores

        return data.map(item => {
          return {
            TITLE: 'INADERÊNCIA',
            CONSOLIDADO: item.P_INADERENCIA,
            ITEMS: [
              {
                SUBTITLE: 'Inaderentes',
                VALOR: item.INADERENCIA
              },
              {
                SUBTITLE: 'Aderentes',
                VALOR: item.ESCALADOS - item.INADERENCIA
              },
              {
                SUBTITLE: 'Antes Hórario',
                VALOR: item.ANTES
              },
              {
                SUBTITLE: 'Depois Hórario',
                VALOR: item.DEPOIS
              }
            ]
          }
        })
      },
      resumoTempoLogado() {
        let data = this.resumoIndicadores

        return data.map(item => {
          return {
            TITLE: 'TEMPO LOGADO',
            CONSOLIDADO: item.LOGADO,
            ITEMS: [
              {
                SUBTITLE: 'Logados',
                VALOR: item.AGENTES_LOGADOS
              }
            ]
          }
        })
      },
      resumoPausas() {
        let data = this.resumoIndicadores

        return data.map(item => {
          return {
            TITLE: 'PAUSAS',
            CONSOLIDADO: item.TOTAL_TIME,
            ITEMS: [
              {
                SUBTITLE: 'Alimentação',
                VALOR: item.ALIMENTACAO_TIME
              },
              {
                SUBTITLE: 'Descanso',
                VALOR: item.DESCANSO_TIME
              },
              {
                SUBTITLE: 'Particular',
                VALOR: item.PARTICULAR_TIME
              },
              {
                SUBTITLE: 'Feedback',
                VALOR: item.FEEDBACK_TIME
              },
              {
                SUBTITLE: 'Sistema',
                VALOR: item.SISTEMA_TIME
              },
              {
                SUBTITLE: 'Padrão',
                VALOR: item.PADRAO_TIME
              },
              {
                SUBTITLE: 'Laboral',
                VALOR: item.LABORAL_TIME
              }
            ]
          }
        })
      }
    },
    methods: {
      justificarAbs() {
        this.$emit('update:justificar-abs')
      },
      loadResumoIndicadores() {
        // let urlData = `${config.baseUrl}api/shared/supervisor/resumo_indicadores_online/${this.usuarioNome}`;
        let urlData = `${config.baseUrl}${this.apiUrl}`
        this.$api
          .get(urlData, {
            params: {
              nome: this.usuarioNome
            }
          })
          .then(res => {
            this.resumoIndicadores = res.data
          })
      }
    },
    created() {
      this.loadResumoIndicadores()
    }
  }
</script>

<style></style>
