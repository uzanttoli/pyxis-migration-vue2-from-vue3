<template>
  <v-row>
    <v-col cols="12">
      <v-card elevation="1" class="rounded-xl">
        <title-negative-margin
          :title="title"
          icon="fa-solid fa-chart-simple"
          className="rounded-r-xl"
        >
          <div style="max-width: max-content">
            <v-text-field
              v-model="search"
              placeholder="Pesquisar"
              label="Pesquisar"
              outlined
              dense
            ></v-text-field>
          </div>
        </title-negative-margin>
        <v-data-table
          :headers="getHeaders()"
          no-data-text="Não há dados no momento!"
          :items="base"
          dense
          :search="search"
          loading-text="Carregando...."
          :loading="loadComplete"
          class="text-no-wrap"
        >
          <template v-slot:item.DATA_REFERENCIA="{ item }">
            <span class="text-capitalize">{{ convertDateExt(item.DATA_REFERENCIA) }}</span>
          </template>
          <template v-slot:item.PERC_ABS="{ item }">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ attrs, on }">
                <span v-bind="attrs" v-on="on">{{ item.PERC_ABS }}</span>
              </template>
              <span>Meta: {{ item.META_ABS }}</span>
            </v-tooltip>
            <i :class="calcMeta(item.PERC_ABS, item.META_ABS, 'menor')"></i>
          </template>
          <template v-slot:item.TEMPO_LOGADO="{ item }">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ attrs, on }">
                <span v-bind="attrs" v-on="on">{{ item.TEMPO_LOGADO }}</span>
              </template>
              <span>Meta: {{ item.META_TEMPO_LOGADO }}</span>
            </v-tooltip>
            <i :class="calcMeta(item.TEMPO_LOGADO, item.META_TEMPO_LOGADO, 'maior')"></i>
          </template>
          <template v-slot:item.JACKIN_SHE="{ item }">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ attrs, on }">
                <span v-bind="attrs" v-on="on">{{ item.JACKIN_SHE }}</span>
              </template>
              <span>Meta: {{ item.META_JACKIN_SHE }}</span>
            </v-tooltip>
            <i :class="calcMeta(item.JACKIN_SHE, item.META_JACKIN_SHE, 'maior')"></i>
          </template>
          <template v-slot:item.PARTICULAR="{ item }">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ attrs, on }">
                <span v-bind="attrs" v-on="on">{{ item.PARTICULAR }}</span>
              </template>
              <span>Meta: {{ item.META_PARTICULAR }}</span>
            </v-tooltip>
            <i :class="calcMeta(item.PARTICULAR, item.META_PARTICULAR, 'menor')"></i>
          </template>
          <template v-slot:item.TMT="{ item }">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ attrs, on }">
                <span v-bind="attrs" v-on="on">{{ item.TMT }}</span>
              </template>
              <span>Meta: {{ item.META_TMT }}</span>
            </v-tooltip>
            <i :class="calcMeta(item.TMT, item.META_TMT, 'maior')"></i>
          </template>
          <template v-slot:item.PERC_RECHAMADA="{ item }">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ attrs, on }">
                <span v-bind="attrs" v-on="on">{{ item.PERC_RECHAMADA }}</span>
              </template>
              <span>Meta: {{ item.META_RECHAMADA }}</span>
            </v-tooltip>
            <i :class="calcMeta(item.PERC_RECHAMADA, item.META_RECHAMADA, 'menor')"></i>
          </template>
          <template v-slot:item.PERC_TRANSF_RET="{ item }">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ attrs, on }">
                <span v-bind="attrs" v-on="on">{{ item.PERC_TRANSF_RET }}</span>
              </template>
              <span>Meta: {{ item.META_TRANSF_RET }}</span>
            </v-tooltip>
            <i :class="calcMeta(item.PERC_TRANSF_RET, item.META_TRANSF_RET, 'menor')"></i>
          </template>
          <template v-slot:item.RECHAMADA_72HR="{ item }">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ attrs, on }">
                <span v-bind="attrs" v-on="on">{{ item.RECHAMADA_72HR }}</span>
              </template>
              <span>Meta: {{ item.META_RECHAMADA_72HR }}</span>
            </v-tooltip>
            <i :class="calcMeta(item.RECHAMADA_72HR, item.META_RECHAMADA_72HR, 'menor')"></i>
          </template>
          <template v-slot:item.PERFORMANCE_OS="{ item }">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ attrs, on }">
                <span v-bind="attrs" v-on="on">{{ item.PERFORMANCE_OS }}</span>
              </template>
              <span>Meta: {{ item.META_OS }}</span>
            </v-tooltip>
            <i :class="calcMeta(item.PERFORMANCE_OS, item.META_OS, 'menor')"></i>
          </template>

          <template v-slot:item.OCS_FINANCEIRAS="{ item }">
            <v-tooltip bottom color="primary">
              <template v-slot:activator="{ attrs, on }">
                <span v-bind="attrs" v-on="on">{{ item.OCS_FINANCEIRAS }}</span>
              </template>
              <span>Meta: {{ item.META_OCS_FINANCEIRAS }}</span>
            </v-tooltip>
            <i :class="calcMeta(item.OCS_FINANCEIRAS, item.META_OCS_FINANCEIRAS, 'menor')"></i>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
  function IIf(realizado, condition, meta) {
    let iconSemMeta = ['-', 'N/A']
    //condition: faz a validacao se o realizado precisa ser menor ou igual a meta para que a meta seja entregue
    if (condition == 'maior') {
      if (iconSemMeta.includes(realizado)) {
        return 'fa-solid fa-circle-exclamation orange--text ml-1'
      } else {
        if (realizado >= meta) {
          return 'fa-solid fa-circle-check green--text ml-1'
        } else {
          return 'fa-solid fa-circle-xmark red--text ml-1'
        }
      }
    } else if (condition == 'menor') {
      if (iconSemMeta.includes(realizado)) {
        return 'fa-solid fa-circle-exclamation orange--text ml-1'
      } else {
        if (realizado <= meta) {
          return 'fa-solid fa-circle-check green--text ml-1'
        } else {
          return 'fa-solid fa-circle-xmark red--text ml-1'
        }
      }
    }
  }
  export default {
    props: {
      title: {
        type: String,
        default: 'Scoreboard'
      },
      actionUrl: {
        type: String,
        require: true
      },
      typeTable: {
        type: String
      },
      headers: {
        type: [Array, Object]
      }
    },
    data: () => ({
      base: [],
      search: null,
      loadComplete: false,
      iconDentroMeta: 'fa-solid fa-circle-check green--text ml-1',
      iconForaMeta: 'fa-solid fa-circle-xmark red--text ml-1',
      iconSemMeta: 'fa-solid fa-circle-exclamation orange--text ml-1'
    }),
    computed: {},
    methods: {
      calcMeta(realizado, meta, condition) {
        let iconSemMeta = ['-', 'N/A']
        if (iconSemMeta.includes(realizado)) {
          return this.iconSemMeta
        } else {
          return IIf(realizado, condition, meta)
        }
      },
      convertDateExt(item) {
        if (!item) return
        return this.moment(item).locale('pt-br').format('MMM/YYYY')
        // let mesAtual = this.moment().format("MM") - 1;
        // if(mesAtual == item?.split('-')[1]){
        //   return  item.split("-").reverse().join("/");
        // }else{
        //   return this.moment(item).locale('pt-br').format("MMM/YYYY")
        // }
      },
      getHeaders() {
        let arrHeadersOperador = [
          {
            text: 'Data Referência',
            align: 'center',
            value: 'DATA_REFERENCIA',
            class: 'grey lighten-2',
            sortable: true
          },
          {
            text: 'Nome',
            align: 'center',
            value: 'NOME',
            sortable: true
          },
          {
            text: 'Supervisor',
            value: 'SUPERIOR1',
            align: 'center',
            sortable: false
          },
          {
            text: 'Range',
            align: 'center',
            value: 'RANGE',
            sortable: true
          },
          {
            text: '% Abs',
            value: 'PERC_ABS',
            align: 'center',
            sortable: true
          },
          {
            text: 'Tempo Logado',
            value: 'TEMPO_LOGADO',
            align: 'center',
            sortable: true
          },
          {
            text: 'Jackin',
            value: 'JACKIN_SHE',
            align: 'center',
            sortable: true
          },
          {
            text: 'Particular',
            value: 'PARTICULAR',
            align: 'center',
            sortable: true
          },
          {
            text: 'TMT',
            value: 'TMT',
            align: 'center',
            sortable: true
          },
          {
            text: '% Rechamada',
            value: 'PERC_RECHAMADA',
            align: 'center',
            sortable: true
          },
          {
            text: '% Transf Retenção',
            value: 'PERC_TRANSF_RET',
            align: 'center',
            sortable: true
          },
          {
            text: 'Rechamada 72h',
            value: 'RECHAMADA_72HR',
            align: 'center',
            sortable: true
          },
          {
            text: 'Performance OS',
            value: 'PERFORMANCE_OS',
            align: 'center',
            sortable: true
          }
        ]

        let arrHeadersSupervisor = [
          {
            text: 'Data Referência',
            align: 'center',
            class: 'grey lighten-2',
            value: 'DATA_REFERENCIA',
            sortable: true
          },
          {
            text: 'Nome',
            align: 'center',
            value: 'NOME',
            sortable: true
          },
          {
            text: 'Range',
            align: 'center',
            value: 'RANGE',
            sortable: true
          },
          {
            text: '% Abs',
            value: 'PERC_ABS',
            align: 'center',
            sortable: true
          },
          {
            text: 'Tempo Logado',
            value: 'TEMPO_LOGADO',
            align: 'center',
            sortable: true
          },
          {
            text: 'Jackin',
            value: 'JACKIN_SHE',
            align: 'center',
            sortable: true
          },
          {
            text: 'Particular',
            value: 'PARTICULAR',
            align: 'center',
            sortable: true
          },
          {
            text: 'TMT',
            value: 'TMT',
            align: 'center',
            sortable: true
          },
          {
            text: '% Rechamada',
            value: 'PERC_RECHAMADA',
            align: 'center',
            sortable: true
          },
          {
            text: '% Transf Retenção',
            value: 'PERC_TRANSF_RET',
            align: 'center',
            sortable: true
          },
          {
            text: 'Rechamada 72h',
            value: 'RECHAMADA_72HR',
            align: 'center',
            sortable: true
          },
          {
            text: 'Performance OS',
            value: 'PERFORMANCE_OS',
            align: 'center',
            sortable: true
          }
        ]

        let arrHeadersMyScoreboard = [
          {
            text: 'Data de Atualização',
            value: 'DATA_REFERENCIA',
            align: 'center',
            sortable: false,
            class: 'grey lighten-2'
          },
          {
            text: 'Range',
            value: 'RANGE',
            align: 'center',
            sortable: false
          },
          {
            text: '% ABS',
            value: 'PERC_ABS',
            align: 'center',
            sortable: false
          },
          {
            text: 'Tempo Logado',
            value: 'TEMPO_LOGADO',
            align: 'center',
            sortable: false
          },

          {
            text: 'Jackin',
            value: 'JACKIN_SHE',
            align: 'center',
            sortable: false
          },

          {
            text: 'Particular',
            value: 'PARTICULAR',
            align: 'center',
            sortable: false
          },

          {
            text: 'TMT',
            value: 'TMT',
            align: 'center',
            sortable: false
          },
          {
            text: '% Rechamada',
            value: 'PERC_RECHAMADA',
            align: 'center',
            sortable: false
          },

          {
            text: '% Transf. Retenção',
            value: 'PERC_TRANSF_RET',
            align: 'center',
            sortable: false
          },

          {
            text: 'Rechamada 72h',
            value: 'RECHAMADA_72HR',
            align: 'center',
            sortable: false
          },

          {
            text: 'Performance OS',
            value: 'PERFORMANCE_OS',
            align: 'center',
            sortable: false
          }
        ]

        let arrHeadersHistorico = [
          {
            text: 'Mês Referência',
            value: 'DATA_REFERENCIA',
            align: 'center',
            class: 'grey lighten-2'
          },
          {
            text: 'Range',
            value: 'RANGE',
            align: 'center'
          },
          {
            text: '% Abs',
            value: 'PERC_ABS',
            align: 'center'
          },
          {
            text: 'Tempo Logado',
            value: 'TEMPO_LOGADO',
            align: 'center'
          },
          {
            text: 'Jackin',
            value: 'JACKIN_SHE',
            align: 'center'
          },
          {
            text: 'Particular',
            value: 'PARTICULAR',
            align: 'center'
          },
          {
            text: 'TMT',
            value: 'TMT',
            align: 'center'
          },
          {
            text: '% Rechamada',
            value: 'PERC_RECHAMADA',
            align: 'center'
          },
          {
            text: '% Transf Retenção',
            value: 'PERC_TRANSF_RET',
            align: 'center'
          },
          {
            text: 'Rechamada 72h',
            value: 'RECHAMADA_72HR',
            align: 'center'
          },
          {
            text: 'Performance OS',
            value: 'PERFORMANCE_OS',
            align: 'center'
          }
        ]

        if (this.typeTable == 'operador') {
          return arrHeadersOperador
        } else if (this.typeTable == 'supervisor') {
          return arrHeadersSupervisor
        } else if (this.typeTable == 'historico-scoreboard') {
          return arrHeadersHistorico
        } else {
          return arrHeadersMyScoreboard
        }
      },
      loadBase() {
        this.loadComplete = true
        let urlData = `${this.actionUrl}`
        this.$api.get(urlData).then(res => {
          this.base = res.data
          this.loadComplete = false
        })
      }
    },
    created() {
      this.loadBase()
    }
  }
</script>

<style></style>
