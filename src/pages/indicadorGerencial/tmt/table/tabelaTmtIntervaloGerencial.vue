<template>
  <v-card elevation="1" class="rounded-xl">
    <title-negative-margin :title="title" className="rounded-r-xl">
      <v-spacer></v-spacer>
      <download-excel
        :data="baseDownload"
        name="PYXIS_TMT_GERENCIAL_INTERVALO"
        worksheet="PYXIS_TMT_GERENCIAL_INTERVALO"
      >
        <v-tooltip bottom>
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon>fa-solid fa-file-arrow-down</v-icon>
            </v-btn>
          </template>
          <span>Baixar</span>
        </v-tooltip>
      </download-excel>
    </title-negative-margin>
    <v-data-table
      dense
      multi-sort
      class="text-no-wrap"
      loading-text="Carregando..."
      no-data-text="Nenhum dados carregados..."
      :items="base"
      :headers="getHeaders(numSuperior, withSkill)"
      :loading="loading"
      :items-per-page="15"
      :search="search"
      :item-key="colunaChave"
    >
      <template v-slot:top v-if="withFilter">
        <v-container fluid>
          <v-row>
            <v-col v-if="numSuperior > 2" :cols="withSkill == 1 ? 3 : 4">
              <v-row class="pa-6">
                <v-text-field
                  v-model="search"
                  type="text"
                  label="Nome"
                  class="rounded-xl"
                  outlined
                  dense
                ></v-text-field>
              </v-row>
            </v-col>

            <v-col v-if="numSuperior >= 1" :cols="withSkill == 1 ? 3 : 4">
              <v-row class="pa-6">
                <v-select
                  :items="listaCoordenadores"
                  v-model="coordenadorFilter"
                  label="Coordenador"
                  class="rounded-xl"
                  outlined
                  dense
                ></v-select>
              </v-row>
            </v-col>

            <v-col v-if="numSuperior >= 2" :cols="withSkill == 1 ? 3 : 4">
              <v-row class="pa-6">
                <v-select
                  :items="listaSupervisores"
                  v-model="supervisorFilter"
                  label="Supervisor"
                  class="rounded-xl"
                  outlined
                  dense
                ></v-select>
              </v-row>
            </v-col>
            <v-col v-if="withSkill == 1" :cols="withSkill == 1 ? 3 : 4">
              <v-row class="pa-6">
                <v-select
                  :items="listaSkills"
                  v-model="skillFilter"
                  label="Skill"
                  outlined
                  class="rounded-xl"
                  dense
                ></v-select>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </template>

      <template v-slot:header>
        <thead class="text-center">
          <tr>
            <th class="text-center" :colspan="[title == 'Operador' ? 4 : 3]">Consolidado</th>
            <th class="text-center grey lighten-3" colspan="2">Anterior Consolidado</th>
            <th
              class="text-center"
              :class="[i % 2 ? 'grey lighten-3' : '']"
              v-for="(inter, i) in intervalos"
              colspan="2"
              :key="i"
            >
              {{ inter.INTERVALO ? inter.INTERVALO : '-' }}
            </th>
            <th
              v-if="numSuperior > 1"
              class="text-center grey lighten-3"
              :colspan="[numSuperior - 1]"
            >
              Gestores
            </th>
          </tr>
        </thead>
      </template>
      <template v-slot:item.TMT_CONSOLIDADO="{ item }">
        <v-icon v-if="item.TMT_CONSOLIDADO == 0" color="grey">{{ iconZero }}</v-icon>
        <v-icon v-else-if="calcularMeta(item.TMT_CONSOLIDADO, meta, true, item)" color="green">
          {{ iconDown }}
        </v-icon>
        <v-icon v-else color="red">{{ iconUp }}</v-icon>
        {{ roundTmt(item.TMT_CONSOLIDADO) }}
      </template>
      <template v-slot:item.FALADO_ANT="{ item }">
        <span :class="itemRowBackground()">
          <v-icon v-if="calcularTmt(item.CHAMADAS_ANT, item.FALADO_ANT) == 0" color="grey">
            {{ iconZero }}
          </v-icon>
          <v-icon
            v-else-if="
              calcularMeta(calcularTmt(item.CHAMADAS_ANT, item.FALADO_ANT), meta, true, item)
            "
            color="green"
          >
            {{ iconDown }}
          </v-icon>
          <v-icon v-else color="red">{{ iconUp }}</v-icon>
          {{ calcularTmt(item.CHAMADAS_ANT, item.FALADO_ANT) }}
        </span>
      </template>
      <template v-slot:item.FALADO2="{ item }">
        <v-icon v-if="calcularTmt(item.CHAMADAS2, item.FALADO2) == 0" color="grey">
          {{ iconZero }}
        </v-icon>
        <v-icon
          v-else-if="calcularMeta(calcularTmt(item.CHAMADAS2, item.FALADO2), meta, true, item)"
          color="green"
        >
          {{ iconDown }}
        </v-icon>
        <v-icon v-else color="red">{{ iconUp }}</v-icon>
        {{ calcularTmt(item.CHAMADAS2, item.FALADO2) }}
      </template>
      <template v-slot:item.FALADO3="{ item }">
        <v-icon v-if="calcularTmt(item.CHAMADAS3, item.FALADO3) == 0" color="grey">
          {{ iconZero }}
        </v-icon>
        <v-icon
          v-else-if="calcularMeta(calcularTmt(item.CHAMADAS3, item.FALADO3), meta, true, item)"
          color="green"
        >
          {{ iconDown }}
        </v-icon>
        <v-icon v-else color="red">{{ iconUp }}</v-icon>
        {{ calcularTmt(item.CHAMADAS3, item.FALADO3) }}
      </template>
      <template v-slot:item.FALADO4="{ item }">
        <v-icon v-if="calcularTmt(item.CHAMADAS4, item.FALADO4) == 0" color="grey">
          {{ iconZero }}
        </v-icon>
        <v-icon
          v-else-if="calcularMeta(calcularTmt(item.CHAMADAS4, item.FALADO4), meta, true, item)"
          color="green"
        >
          {{ iconDown }}
        </v-icon>
        <v-icon v-else color="red">{{ iconUp }}</v-icon>
        {{ calcularTmt(item.CHAMADAS4, item.FALADO4) }}
      </template>
      <template v-slot:item.FALADO5="{ item }">
        <v-icon v-if="calcularTmt(item.CHAMADAS5, item.FALADO5) == 0" color="grey">
          {{ iconZero }}
        </v-icon>
        <v-icon
          v-else-if="calcularMeta(calcularTmt(item.CHAMADAS5, item.FALADO5), meta, true, item)"
          color="green"
        >
          {{ iconDown }}
        </v-icon>
        <v-icon v-else color="red">{{ iconUp }}</v-icon>
        {{ calcularTmt(item.CHAMADAS5, item.FALADO5) }}
      </template>
      <template v-slot:item.FALADO6="{ item }">
        <v-icon v-if="calcularTmt(item.CHAMADAS6, item.FALADO6) == 0" color="grey">
          {{ iconZero }}
        </v-icon>
        <v-icon
          v-else-if="calcularMeta(calcularTmt(item.CHAMADAS6, item.FALADO6), meta, true, item)"
          color="green"
        >
          {{ iconDown }}
        </v-icon>
        <v-icon v-else color="red">{{ iconUp }}</v-icon>
        {{ calcularTmt(item.CHAMADAS6, item.FALADO6) }}
      </template>
      <template v-slot:item.FALADO7="{ item }">
        <v-icon v-if="calcularTmt(item.CHAMADAS7, item.FALADO7) == 0" color="grey">
          {{ iconZero }}
        </v-icon>
        <v-icon
          v-else-if="calcularMeta(calcularTmt(item.CHAMADAS7, item.FALADO7), meta, true, item)"
          color="green"
        >
          {{ iconDown }}
        </v-icon>
        <v-icon v-else color="red">{{ iconUp }}</v-icon>
        {{ calcularTmt(item.CHAMADAS7, item.FALADO7) }}
      </template>
      <template v-slot:item.FALADO8="{ item }">
        <v-icon v-if="calcularTmt(item.CHAMADAS8, item.FALADO8) == 0" color="grey">
          {{ iconZero }}
        </v-icon>
        <v-icon
          v-else-if="calcularMeta(calcularTmt(item.CHAMADAS8, item.FALADO8), meta, true, item)"
          color="green"
        >
          {{ iconDown }}
        </v-icon>
        <v-icon v-else color="red">{{ iconUp }}</v-icon>
        {{ calcularTmt(item.CHAMADAS8, item.FALADO8) }}
      </template>
      <template v-slot:item.FALADO9="{ item }">
        <v-icon v-if="calcularTmt(item.CHAMADAS9, item.FALADO9) == 0" color="grey">
          {{ iconZero }}
        </v-icon>
        <v-icon
          v-else-if="calcularMeta(calcularTmt(item.CHAMADAS9, item.FALADO9), meta, true, item)"
          color="green"
        >
          {{ iconDown }}
        </v-icon>
        <v-icon v-else color="red">{{ iconUp }}</v-icon>
        {{ calcularTmt(item.CHAMADAS9, item.FALADO9) }}
      </template>
      <template v-slot:item.FALADO10="{ item }">
        <v-icon v-if="calcularTmt(item.CHAMADAS10, item.FALADO10) == 0" color="grey">
          {{ iconZero }}
        </v-icon>
        <v-icon
          v-else-if="calcularMeta(calcularTmt(item.CHAMADAS10, item.FALADO10), meta, true, item)"
          color="green"
        >
          {{ iconDown }}
        </v-icon>
        <v-icon v-else color="red">{{ iconUp }}</v-icon>
        {{ calcularTmt(item.CHAMADAS10, item.FALADO10) }}
      </template>
      <template v-slot:item.SENIORIDADE="{ item }">
        {{ item.SENIORIDADE ? item.SENIORIDADE : '-' }}
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
  export default {
    name: 'tabela-tmt-intervalo-gerencial',
    props: {
      title: {
        type: String,
        default: 'Gerencial - TMT'
      },
      titleIcon: {
        type: String
      },
      meta: {
        type: [Array, Number]
      },
      newApi: {
        type: Boolean,
        default: false
      },
      actionUrl: {
        type: String,
        required: true
      },
      skill: {
        type: String,
        default: 'NET MTF'
      },
      dac: {
        type: String,
        default: '2'
      },
      skillType: {
        type: String,
        default: 'NORMAL'
      },
      grouping: {
        type: String,
        default: 'N1'
      },
      numSuperior: {
        type: Number,
        default: 1
      },
      withSkill: {
        type: Number,
        default: 0
      },
      withFilter: {
        type: Boolean,
        default: true
      },
      usuarioAlmope: {
        type: [String, Number],
        default: null
      },
      agrupamentoSelecionado: {
        type: String
      }
    },
    data: function () {
      return {
        itemClass: 'grey lighten-3',
        search: '',
        interval: null,
        colunaChave: 'COORDENADOR+SUPERVISOR',
        iconUp: 'fa-solid fa-caret-up',
        iconDown: 'fa-solid fa-caret-down',
        iconZero: 'fa-solid fa-minus',
        loading: false,
        base: [],
        skillFilter: '',
        supervisorFilter: '',
        coordenadorFilter: ''
      }
    },
    computed: {
      intervalos() {
        return this.$store.getters.intervalos
      },
      listaCoordenadores() {
        let result = this.base
          .map(item => {
            return item.COORDENADOR
          })
          .filter(this.onlyUnique)
        result.push('')
        return result
      },
      listaSkills() {
        let result = this.base
          .map(item => {
            return item.SKILL
          })
          .filter(this.onlyUnique)
        result.push('')
        return result
      },
      listaSupervisores() {
        // this.supervisorFilter = ''

        let result = this.base
          .filter(item => {
            if (item.COORDENADOR == this.coordenadorFilter) {
              return item.SUPERVISOR
            } else if (item.COORDENADOR == '') {
              return item.SUPERVISOR
            }
          })
          .map(item => item.SUPERVISOR)
          .filter(this.onlyUnique)
        result.push('')
        return result
      },
      tmtConfig() {
        return this.$store.getters.tmtConfig
      },
      baseDownload() {
        let base = this.base
        let intervalo = this.intervalos
        let newBase = base
          .filter(item => {
            if (this.coordenadorFilter != '' || this.supervisorFilter != '') {
              return (
                item.COORDENADOR == this.coordenadorFilter ||
                item.SUPERVISOR == this.supervisorFilter
              )
            } else {
              return base
            }
          })
          .map(item2 => {
            return {
              SENIORIDADE: item2.SENIORIDADE == '-' ? 'NÃO SE APLICA' : item2.SENIORIDADE,
              ALMOPE: item2.ALMOPE ?? 'NÃO SE APLICA',
              NOME: item2.NOME ?? 'NÃO SE APLICA',
              SUPERVISOR: item2.SUPERVISOR ?? 'NÃO SE APLICA',
              COORDENADOR: item2.COORDENADOR,
              ATENDIDAS: item2.ATENDIDAS,
              TMT_CONSOLIDADO: item2.TMT_CONSOLIDADO?.toFixed(0) * 1,
              CHAMADAS_ANT: item2.CHAMADAS_ANT,
              TMT_ANTERIOR: this.calcularTmt(item2.CHAMADAS_ANT, item2.FALADO_ANT),

              ['ATENDIDAS ' + intervalo[0]?.INTERVALO]: item2.CHAMADAS2,
              ['TMT ' + intervalo[0]?.INTERVALO]: this.calcularTmt(item2.CHAMADAS2, item2.FALADO2),

              ['ATENDIDAS ' + intervalo[1]?.INTERVALO]: item2.CHAMADAS3,
              ['TMT ' + intervalo[1]?.INTERVALO]: this.calcularTmt(item2.CHAMADAS3, item2.FALADO3),

              ['ATENDIDAS ' + intervalo[2]?.INTERVALO]: item2.CHAMADAS4,
              ['TMT ' + intervalo[2]?.INTERVALO]: this.calcularTmt(item2.CHAMADAS4, item2.FALADO4),

              ['ATENDIDAS ' + intervalo[3]?.INTERVALO]: item2.CHAMADAS5,
              ['TMT ' + intervalo[3]?.INTERVALO]: this.calcularTmt(item2.CHAMADAS5, item2.FALADO5),

              ['ATENDIDAS ' + intervalo[4]?.INTERVALO]: item2.CHAMADAS6,
              ['TMT ' + intervalo[4]?.INTERVALO]: this.calcularTmt(item2.CHAMADAS6, item2.FALADO6),

              ['ATENDIDAS ' + intervalo[5]?.INTERVALO]: item2.CHAMADAS7,
              ['TMT ' + intervalo[5]?.INTERVALO]: this.calcularTmt(item2.CHAMADAS7, item2.FALADO7),

              ['ATENDIDAS ' + intervalo[6]?.INTERVALO]: item2.CHAMADAS8,
              ['TMT ' + intervalo[6]?.INTERVALO]: this.calcularTmt(item2.CHAMADAS8, item2.FALADO8),

              ['ATENDIDAS ' + intervalo[7]?.INTERVALO]: item2.CHAMADAS9,
              ['TMT ' + intervalo[7]?.INTERVALO]: this.calcularTmt(item2.CHAMADAS9, item2.FALADO9),

              ['ATENDIDAS ' + intervalo[8]?.INTERVALO]: item2.CHAMADAS10,
              ['TMT ' + intervalo[8]?.INTERVALO]: this.calcularTmt(item2.CHAMADAS10, item2.FALADO10)
            }
          })
        return newBase
      }
    },
    methods: {
      roundTmt(value) {
        if (!value) return
        return Math.round(value)
      },
      generateKey(item, index) {
        const uniqueKey = `${item}-${index}`
        return uniqueKey
      },
      itemRowBackground: function () {
        return 'grey lighten-3'
      },
      onlyUnique(value, index, self) {
        return self.indexOf(value) === index
      },
      calcularTmt(chamadas, tmtReal) {
        let tmt = 0
        tmt = chamadas > 0 ? (tmtReal / chamadas) | 0 : 0
        return tmt
      },
      isNumber(n) {
        return Number(n) === n
      },
      calcularMeta(valorRealizado, metas, isLimit = true, item = null) {
        let dentroDaMeta
        if (metas.length <= 1) {
          metas.forEach(elem => {
            if (isLimit) {
              dentroDaMeta = valorRealizado * 1 <= elem.meta * 1
            } else {
              dentroDaMeta = valorRealizado * 1 >= elem.meta * 1
            }
          })
        } else {
          metas.forEach(elem => {
            if (item.COORDENADOR == elem.skill) {
              if (isLimit) {
                dentroDaMeta = valorRealizado <= elem.meta * 1
              } else {
                dentroDaMeta = valorRealizado >= elem.meta * 1
              }
            } else if (item.SKILL == elem.skill) {
              if (isLimit) {
                dentroDaMeta = valorRealizado <= elem.meta * 1
              } else {
                dentroDaMeta = valorRealizado >= elem.meta * 1
              }
            } else if (item.SKILL == elem.skillType) {
              if (isLimit) {
                dentroDaMeta = valorRealizado <= elem.meta * 1
              } else {
                dentroDaMeta = valorRealizado >= elem.meta * 1
              }
            }
          })
        }
        return dentroDaMeta
      },
      // tempoMenorQue(sTime, eTime) {
      // var beginningTime = moment(sTime, 'hh:mm:ss');
      // var endTime = moment(eTime, 'hh:mm:ss');
      // return (beginningTime.isBefore(endTime)) ? false : true
      // return true;
      // },
      async loadBase() {
        this.loading = true
        this.base = []
        let urlData = this.actionUrl
        if (!this.newApi) {
          switch (this.grouping) {
            case 'SENIORIDADE':
              urlData += this.skill + '/'
              break
            case 'CAMPANHA':
              urlData += this.skill + '/' + this.skillType
              break
            case 'SKILL':
              urlData += this.skill + '/' + this.dac + '/'
              break
            default:
              urlData += this.dac + '/'
              urlData += this.skillType + '/'
              break
          }
          urlData = this.replaceUrlMultiParamSeparator(urlData)
        }
        await this.$api.get(urlData).then(res => {
          this.base = res.data
          this.loading = false
        })
      },
      loadIntervalos() {
        this.$store.dispatch('loadIntervalos', {
          qtd: 9,
          skill: this.skill,
          skillType: this.skillType
        })
      },
      getHeaders(pNumSuperior = 1, pWithSkill = 0) {
        let hCoord = {
          text: 'Coordenador',
          align: 'center',
          sortable: true,
          value: 'COORDENADOR',
          class: '',
          filter: value => {
            if (!this.coordenadorFilter) {
              return true
            }
            return value == this.coordenadorFilter
          }
        }

        let hSup = {
          text: 'Supervisor',
          align: 'center',
          sortable: true,
          value: 'SUPERVISOR',
          class: '',
          filter: value => {
            if (!this.supervisorFilter) {
              return true
            }
            return value == this.supervisorFilter
          }
        }

        let hOper = {
          text: 'Nome',
          align: 'center',
          sortable: true,
          value: 'NOME',
          class: ''
        }

        let hSenioridade = {
          text: 'Senioridade',
          align: 'center',
          sortable: true,
          value: 'SENIORIDADE',
          class: ''
        }

        let hSkill = {
          text: 'Skill',
          align: 'center',
          sortable: true,
          value: 'SKILL',
          class: '',
          filter: value => {
            if (!this.skillFilter) {
              return true
            }
            return value == this.skillFilter
          }
        }

        let arrHeaders = [
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'ATENDIDAS',
            class: ''
          },
          {
            text: 'TMT',
            align: 'center',
            sortable: true,
            value: 'TMT_CONSOLIDADO',
            class: ''
          },
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS_ANT',
            class: 'grey lighten-3'
          },
          {
            text: 'TMT',
            align: 'center',
            sortable: true,
            value: 'FALADO_ANT',
            class: 'grey lighten-3'
          },

          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS2',
            class: ''
          },
          {
            text: 'TMT',
            align: 'center',
            sortable: true,
            value: 'FALADO2',
            class: ''
          },
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS3',
            class: 'grey lighten-3'
          },
          {
            text: 'TMT',
            align: 'center',
            sortable: true,
            value: 'FALADO3',
            class: 'grey lighten-3'
          },
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS4',
            class: ''
          },
          {
            text: 'TMT',
            align: 'center',
            sortable: true,
            value: 'FALADO4',
            class: ''
          },
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS5',
            class: 'grey lighten-3'
          },
          {
            text: 'TMT',
            align: 'center',
            sortable: true,
            value: 'FALADO5',
            class: 'grey lighten-3'
          },
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS6',
            class: ''
          },
          {
            text: 'TMT',
            align: 'center',
            sortable: true,
            value: 'FALADO6',
            class: ''
          },
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS7',
            class: 'grey lighten-3'
          },
          {
            text: 'TMT',
            align: 'center',
            sortable: true,
            value: 'FALADO7',
            class: 'grey lighten-3'
          },
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS8',
            class: ''
          },
          {
            text: 'TMT',
            align: 'center',
            sortable: true,
            value: 'FALADO8',
            class: ''
          },
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS9',
            class: 'grey lighten-3'
          },
          {
            text: 'TMT',
            align: 'center',
            sortable: true,
            value: 'FALADO9',
            class: 'grey lighten-3'
          },
          {
            text: 'Atendidas',
            align: 'center',
            sortable: true,
            value: 'CHAMADAS10',
            class: ''
          },
          {
            text: 'TMT',
            align: 'center',
            sortable: true,
            value: 'FALADO10',
            class: ''
          }
        ]

        // let dados = this.base[0]
        // for (let i = 2; i <= 10; i++) {
        //   let chamadas = `CHAMADAS${i}`
        //   let falado = `FALADO${i}`

        //   if (dados && dados[chamadas] > 0 && dados[falado] > 0) {
        //     arrHeaders.push(
        //       {
        //         text: 'Atendidas',
        //         align: 'center',
        //         sortable: true,
        //         value: chamadas,
        //         class: i % 2 ? 'grey lighten-3' : ''
        //       },
        //       {
        //         text: 'TMT',
        //         align: 'center',
        //         sortable: true,
        //         value: falado,
        //         class: i % 2 ? 'grey lighten-3' : ''
        //       }
        //     )
        //   }
        // }

        if (pNumSuperior == 1) {
          if (pWithSkill == '1') {
            arrHeaders.unshift(hSkill)
            this.colunaChave = this.generateKey('COORDENADOR', 'SKILL')
          } else {
            this.colunaChave = 'COORDENADOR'
          }
          arrHeaders.unshift(hCoord)
        } else if (pNumSuperior == 2) {
          if (pWithSkill == '1') {
            arrHeaders.unshift(hSkill)
            this.colunaChave = this.generateKey('SUPERVISOR', 'SKILL')
          } else {
            this.colunaChave = 'SUPERVISOR'
          }
          arrHeaders.unshift(hSup)
          arrHeaders.push(hCoord)
        } else if (pNumSuperior == 3) {
          if (pWithSkill == '1') {
            arrHeaders.unshift(hSkill)
            this.colunaChave = this.generateKey('NOME', 'SKILL')
          } else {
            this.colunaChave = 'NOME'
          }
          arrHeaders.unshift(hSenioridade)
          arrHeaders.unshift(hOper)
          arrHeaders.push(hSup)
          arrHeaders.push(hCoord)
        }

        return arrHeaders
      }
    },
    watch: {
      skill: function () {
        if (this.skill != '' || this.skill != null) {
          this.loadIntervalos()
        }
      },
      tmtConfig: function () {
        this.loadBase()
      },
      usuarioAlmope: function () {
        this.loadIntervalos()
        this.loadBase()
      }
    },
    created: function () {
      this.loadBase()
      if (this.skill != '') {
        this.loadIntervalos()
      }

      this.interval = setInterval(() => {
        this.loadIntervalos()
        this.loadBase()
      }, 5 * 60 * 1000)
    },
    beforeUnmount: function () {
      clearInterval(this.interval)
    }
  }
</script>
<style scoped>
  .cor-button {
    background-image: linear-gradient(290deg, #00ecff, #8f0e8f);
  }
</style>
