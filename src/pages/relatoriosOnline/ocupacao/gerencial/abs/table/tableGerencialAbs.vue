<template>
  <v-card elevation="1" class="rounded-xl">
    <!-- <pre>{{ data }}</pre> -->
    <title-negative-margin
      :title="title"
      :icon="titleIcon"
      :progressVisible="false"
      :countIntervalProgress="countInterval"
      corProgress="white"
      className="rounded-r-xl"
    ></title-negative-margin>
    <v-data-table
      dense
      multi-sort
      :fixed-header="true"
      item-key="SUPERIOR2 + SUPERIOR1"
      :headers="getHeaders(numSuperior)"
      :items-per-page="15"
      :items="base"
      no-data-text="Não há dados no momento!"
      :loading="loading"
      class="text-no-wrap"
      loading-text="Carregando... Por favor aguardar!"
      :item-class="getClass"
    >
      <template v-slot:top>
        <v-container fluid>
          <v-row>
            <v-col v-if="numSuperior >= 1" :cols="numSuperior == 1 ? 3 : 3">
              <v-row class="pa-6">
                <v-select
                  :items="listaCoordenadores"
                  v-model="coordenadorFilter"
                  label="Coordenador"
                  outlined
                  dense
                ></v-select>
              </v-row>
            </v-col>

            <v-col v-if="numSuperior >= 2" :cols="numSuperior == 2 ? 3 : 3">
              <v-row class="pa-6">
                <v-select
                  :items="listaSupervisores"
                  v-model="supervisorFilter"
                  label="Supervisor"
                  outlined
                  dense
                ></v-select>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
      </template>
      <template v-slot:item.PERC_ABS_CTI="{ item }">
        {{ item.OP_ESCALADOS ? calcularPercentual(item.OP_ABS_CTI, item.OP_ESCALADOS) : '0,00%' }}
      </template>
      <template v-slot:item.PERC_ABS_PONTO="{ item }">
        {{ item.OP_ESCALADOS ? calcularPercentual(item.OP_ABS_PONTO, item.OP_ESCALADOS) : '0,00%' }}
      </template>
      <template v-slot:item.PERC_OP_INADERENTE="{ item }">
        {{
          item.OP_ESCALADOS ? calcularPercentual(item.OP_INADERENTE, item.OP_ESCALADOS) : '0,00%'
        }}
      </template>
      <template v-slot:item.PERC_OP_LOGOU_ANTES="{ item }">
        {{ item.OP_INADERENTE ? calcularPercentual(item.OP_LOGOU_ANTES, item.OP_INADERENTE) : '-' }}
      </template>
      <template v-slot:item.PERC_OP_LOGOU_DEPOIS="{ item }">
        {{
          item.OP_INADERENTE ? calcularPercentual(item.OP_LOGOU_DEPOIS, item.OP_INADERENTE) : '-'
        }}
      </template>
      <!-- <template v-slot:body.append v-if="numSuperior == 1">
        <tr
          v-for="(item, i) in totalEscaladosAbs"
          :key="i"
          class="grey lighten-3 text-center"
        >
          <td>TOTAL</td>
          <td>{{ item.OP_ESCALADOS }}</td>
          <td>{{ item.OP_ABS }}</td>
          <td>
            {{
              item.OP_ESCALADOS
                ? calcularPercentual(item.OP_ABS, item.OP_ESCALADOS)
                : "0,00%"
            }}
          </td>
          <td>{{ item.OP_INADERENTE }}</td>
          <td>
            {{ calcularPercentual(item.OP_INADERENTE, item.OP_ESCALADOS) }}
          </td>
          <td>{{ item.OP_LOGOU_ANTES }}</td>
          <td>
            {{ calcularPercentual(item.OP_LOGOU_ANTES, item.OP_INADERENTE) }}
          </td>
          <td>{{ item.OP_LOGOU_DEPOIS }}</td>
          <td>
            {{ calcularPercentual(item.OP_LOGOU_DEPOIS, item.OP_INADERENTE) }}
          </td>
        </tr>
      </template> -->
    </v-data-table>
  </v-card>
</template>

<script>
  import config from '../../../../../../core/config'
  export default {
    name: 'tabela-gerencial-abs',
    props: {
      data: {
        type: Object
      },
      title: {
        type: String,
        default: 'Abs'
      },
      titleIcon: {
        type: String,
        default: ''
      },
      actionUrl: {
        type: String,
        require: true
      },
      numSuperior: {
        type: Number,
        default: 1
      },
      indicador: {
        type: String,
        default: 'ABS'
      },
      produtoAtual: {
        type: String
      }
    },
    data: () => ({
      calories: '',
      search: '',
      colunaChave: 'COORDENADOR',
      countInterval: 0,
      interval: null,
      loading: false,
      supervisorFilter: '',
      coordenadorFilter: '',
      base: []
      // totalEscaladosAbs: [],
    }),
    computed: {
      listaSupervisores() {
        let result = this.base
          .filter(item => {
            if (item.SUPERIOR2 == this.coordenadorFilter) {
              return item.SUPERIOR1
            } else if (item.SUPERIOR2 == '') {
              return item.SUPERIOR1
            }
          })
          .map(item => item.SUPERIOR1)
          .filter(this.onlyUnique)
        result.push('')
        return result
      },
      listaCoordenadores() {
        let result = this.base
          .map(item => {
            return item.SUPERIOR2
          })
          .filter(this.onlyUnique)
        result.push('')
        return result
      },
      absConfigOcupacao() {
        return this.$store.getters.absConfigOcupacao
      }
    },
    methods: {
      getClass(item) {
        if (item.SUPERIOR2 === 'TOTAL') return 'teal lighten-5 font-weight-bold'
      },
      calcularTotal(array) {
        if (!array) return
        const total = array.reduce(
          (acc, obj) => {
            acc.OP_ABS_CTI += obj.OP_ABS_CTI
            acc.OP_ABS_PONTO += obj.OP_ABS_PONTO
            acc.OP_ADERENTE += obj.OP_ADERENTE
            acc.OP_ESCALADOS += obj.OP_ESCALADOS
            acc.OP_INADERENTE += obj.OP_INADERENTE
            acc.OP_LOGOU_ANTES += obj.OP_LOGOU_ANTES
            acc.OP_LOGOU_DEPOIS += obj.OP_LOGOU_DEPOIS
            return acc
          },
          {
            OP_ABS_CTI: 0,
            OP_ABS_PONTO: 0,
            OP_ADERENTE: 0,
            OP_ESCALADOS: 0,
            OP_INADERENTE: 0,
            OP_LOGOU_ANTES: 0,
            OP_LOGOU_DEPOIS: 0
          }
        )
        return total
      },
      onlyUnique(value, index, self) {
        return self.indexOf(value) === index
      },
      getHeaders(pNumSuperior = 1) {
        let headerCoordenador = {
          text: 'Coordenador',
          class: 'cyan darken-3 white--text',
          colorName: 'white--text',
          align: 'center',
          value: 'SUPERIOR2',
          filter: value => {
            if (!this.coordenadorFilter) {
              return true
            }
            return value == this.coordenadorFilter
          }
        }

        let headerSupervisor = {
          text: 'Supervisor',
          class: 'cyan darken-3 white--text',
          colorName: 'white--text',
          align: 'center',
          value: 'SUPERIOR1',
          filter: value => {
            if (!this.supervisorFilter) {
              return true
            }
            return value == this.supervisorFilter
          }
        }

        let arrheaders = [
          {
            text: 'Escalados',
            class: 'cyan darken-3 white--text',
            colorName: 'white--text',
            align: 'center',
            value: 'OP_ESCALADOS'
          },
          {
            text: 'Abs CTI',
            class: 'cyan darken-3 white--text',
            colorName: 'white--text',
            align: 'center',
            value: 'OP_ABS_CTI'
          },
          {
            text: '(%) Abs CTI',
            class: 'cyan darken-3 white--text',
            colorName: 'white--text',
            align: 'center',
            value: 'PERC_ABS_CTI'
          },
          {
            text: 'Abs Ponto',
            class: 'cyan darken-3 white--text',
            colorName: 'white--text',
            align: 'center',
            value: 'OP_ABS_PONTO'
          },
          {
            text: '(%) Abs Ponto',
            class: 'cyan darken-3 white--text',
            colorName: 'white--text',
            align: 'center',
            value: 'PERC_ABS_PONTO'
          },
          {
            text: 'Inaderentes',
            class: 'orange darken-2 white--text',
            colorName: 'white--text',
            align: 'center',
            value: 'OP_INADERENTE'
          },
          {
            text: '(%) Inaderência',
            class: 'orange darken-2 white--text',
            colorName: 'white--text',
            align: 'center',
            value: 'PERC_OP_INADERENTE'
          },
          {
            text: 'Logou Antes',
            class: 'orange lighten-2 white--text',
            colorName: 'white--text',
            align: 'center',
            value: 'OP_LOGOU_ANTES'
          },
          {
            text: '(%) Logou Antes',
            class: 'orange lighten-2 white--text',
            colorName: 'white--text',
            align: 'center',
            value: 'PERC_OP_LOGOU_ANTES'
          },
          {
            text: 'Logou Depois',
            class: 'orange lighten-2 white--text',
            colorName: 'white--text',
            align: 'center',
            value: 'OP_LOGOU_DEPOIS'
          },
          {
            text: '(%) Logou Depois',
            class: 'orange lighten-2 white--text',
            colorName: 'white--text',
            align: 'center',
            value: 'PERC_OP_LOGOU_DEPOIS'
          }
        ]
        if (pNumSuperior == 1) {
          this.colunaChave = 'COORDENADOR'
          arrheaders.unshift(headerCoordenador)
        } else {
          this.colunaChave = 'SUPERVISOR'
          arrheaders.unshift(headerCoordenador)
          arrheaders.unshift(headerSupervisor)
        }
        return arrheaders
      },
      replaceNulls(obj) {
        if (!obj) return
        for (let key in obj) {
          if (obj[key] === null || obj[key] === '') {
            obj[key] = '-'
          }
        }
      },
      loadBase() {
        this.loading = true
        let urlData = `${config.baseUrl}${this.actionUrl}${this.produtoAtual}`
        urlData = this.replaceUrlMultiParamSeparator(urlData)
        this.$api
          .get(urlData, {
            params: {
              agrupamento: this.data.AGRUPAMENTO,
              produto: this.data.PRODUTO
            }
          })
          .then(res => {
            let dados = res?.data
            dados.forEach(this.replaceNulls)
            this.base = dados
            this.base.push({
              SUPERIOR2: 'TOTAL',
              ...this.calcularTotal(res.data)
            })
            this.loading = false
          })
      },
      // loadTotalEscaladosAbs() {
      //   let urlData = `${config.baseUrl}api/shared/ocupacao/total_abs/${this.produtoAtual}`;
      //   this.$api.get(urlData).then((res) => {
      //     this.totalEscaladosAbs = res.data;
      //   });
      // },
      calcularPercentual(value1, value2) {
        let result = ((value1 / value2) * 100).toFixed(2).concat('%')
        return result
      }
    },
    watch: {
      produtoAtual() {
        this.loadBase()
        // this.loadTotalEscaladosAbs();
      }
    },
    created: function () {
      this.loadBase()
      // this.loadTotalEscaladosAbs();
      this.interval = setInterval(() => {
        this.countInterval += 9.66
        if (this.countInterval >= 99.6) {
          this.loadBase()
          // this.loadTotalEscaladosAbs();
          this.countInterval = 0
        }
      }, 15 * 6000)
    },
    beforeUnmount: function () {
      clearInterval(this.interval)
    }
  }
</script>

<style></style>
