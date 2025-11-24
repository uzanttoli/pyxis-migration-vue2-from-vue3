<template>
  <v-card>
    <title-negative-margin :title="title" :icon="titleIcon"></title-negative-margin>
    <br />
    <v-data-table
      dense
      multi-sort
      class="text-no-wrap"
      item-key="ALMOPE"
      :loading="loading"
      loading-text="Carregando..."
      :headers="headers"
      :items="data"
      :items-per-page="30"
      :search="search"
    ></v-data-table>
  </v-card>
</template>
<script>
  import config from '../../../../core/config'

  export default {
    name: 'tabela-vendas-relatorios-dia-dia',
    props: {
      skill: {
        type: String,
        default: 'NET E2E'
      },
      title: {
        type: String,
        default: 'Mês'
      },
      titleIcon: {
        type: String,
        default: ''
      },
      dac: {
        type: Number,
        default: 2
      },
      actionUrl: {
        type: String,
        required: true
      },
      numSuperior: {
        type: [String, Number],
        default: 1
      }
    },
    data: () => ({
      search: '',
      loading: false,
      jsdonData: [],
      data: []
    }),
    computed: {
      headers() {
        return [
          { text: 'Skill', value: 'SKILL', align: 'center' },
          { text: 'Semana1', value: 'SEMANA1', align: 'center' },
          { text: '01', value: 'DIA_01', align: 'center' },
          { text: '02', value: 'DIA_02', align: 'center' },
          { text: '03', value: 'DIA_03', align: 'center' },
          { text: '04', value: 'DIA_04', align: 'center' },
          { text: '05', value: 'DIA_05', align: 'center' },
          { text: '06', value: 'DIA_06', align: 'center' },
          { text: '07', value: 'DIA_07', align: 'center' },
          { text: 'Semana2', value: 'SEMANA2', align: 'center' },
          { text: '08', value: 'DIA_08', align: 'center' },
          { text: '09', value: 'DIA_09', align: 'center' },
          { text: '10', value: 'DIA_10', align: 'center' },
          { text: '11', value: 'DIA_11', align: 'center' },
          { text: '12', value: 'DIA_12', align: 'center' },
          { text: '13', value: 'DIA_13', align: 'center' },
          { text: '14', value: 'DIA_14', align: 'center' },
          { text: 'Semana3', value: 'SEMANA3', align: 'center' },
          { text: '15', value: 'DIA_15', align: 'center' },
          { text: '16', value: 'DIA_16', align: 'center' },
          { text: '17', value: 'DIA_17', align: 'center' },
          { text: '18', value: 'DIA_18', align: 'center' },
          { text: '19', value: 'DIA_19', align: 'center' },
          { text: '20', value: 'DIA_20', align: 'center' },
          { text: '21', value: 'DIA_21', align: 'center' },
          { text: 'Semana4', value: 'SEMANA4', align: 'center' },
          { text: '22', value: 'DIA_22', align: 'center' },
          { text: '23', value: 'DIA_23', align: 'center' },
          { text: '24', value: 'DIA_24', align: 'center' },
          { text: '25', value: 'DIA_25', align: 'center' },
          { text: '26', value: 'DIA_26', align: 'center' },
          { text: '27', value: 'DIA_27', align: 'center' },
          { text: '28', value: 'DIA_28', align: 'center' },
          { text: 'Semana5', value: 'SEMANA5', align: 'center' },
          { text: '29', value: 'DIA_29', align: 'center' },
          { text: '30', value: 'DIA_30', align: 'center' },
          { text: '31', value: 'DIA_31', align: 'center' }
        ]
      }
    },
    methods: {
      generateKey(item, index) {
        const uniqueKey = `${item}-${index}`
        return uniqueKey
      },

      filterPairParams(arrParam, param1, param2) {
        let filteredData = arrParam.filter(
          element => element.SKILL == param1 || element.SKILL == param2
        )
        if (filteredData.length == 1) filteredData[1] = filteredData[0]
        return filteredData
      },
      arithmeticEachObject(obj1, obj2, symbol, ref) {
        let result = {}
        let bigger = {}
        let smaller = {}
        for (let item in obj1) {
          if (Number.isInteger(parseInt(obj1[item]))) {
            if (parseInt(obj1[ref]) > parseInt(obj2[ref])) {
              bigger = obj1
              smaller = obj2
            } else {
              bigger = obj2
              smaller = obj1
            }
            if (parseInt(bigger[item]) > 0)
              result[item] = eval(`${parseInt(smaller[item])} ${symbol} ${parseInt(bigger[item])}`)
            else result[item] = 0
          } else result[item] = obj1[item]
        }
        return result
      },
      decimalToPercent(obj) {
        let result = {}
        for (let element in obj) {
          if (typeof obj[element] != 'string') result[element] = (obj[element] * 100).toFixed(2)
          else result[element] = obj[element]
        }
        return result
      },
      async loadBase() {
        this.loading = true
        let urlData = `${config.baseUrl}${this.actionUrl}`
        await this.$api.get(urlData).then(res => {
          this.jsonData = res.data

          // let consolidado = [];
          let pairPercentTabulacao = this.filterPairParams(
            this.jsonData,
            'TABULADAS',
            'LIG_ATENDIDAS'
          )
          let pairPercentElegiveis = this.filterPairParams(this.jsonData, 'TABULADAS', 'ELEGIVEIS')
          let pairPercentClientesAbordados = this.filterPairParams(
            this.jsonData,
            'ELEGIVEIS',
            'ELEGIVEIS'
          )

          let pairConversaoBrutaLigAtendi = this.filterPairParams(
            this.jsonData,
            'LIG_ATENDIDAS',
            'VENDA BRUTA'
          )
          let pairConversaoBrutaLigEleg = this.filterPairParams(
            this.jsonData,
            'ELEGIVEIS',
            'VENDA BRUTA'
          )
          let pairConversaoBrutaLigAbordados = this.filterPairParams(
            this.jsonData,
            'ELEGIVEIS',
            'VENDA BRUTA'
          )

          let pairConversaoAtivadaLigAtendidas = this.filterPairParams(
            this.jsonData,
            'LIG_ATENDIDAS',
            'ATIVACAO'
          )
          let pairConversaoAtivadaLigElegiveis = this.filterPairParams(
            this.jsonData,
            'ELEGIVEIS',
            'ATIVACAO'
          )
          let pairConversaoAtivadaLigAbordados = this.filterPairParams(
            this.jsonData,
            'ELEGIVEIS',
            'ATIVACAO'
          )

          let percentTabulacao = this.decimalToPercent(
            this.arithmeticEachObject(
              pairPercentTabulacao[0],
              pairPercentTabulacao[1],
              '/',
              'SEMANA1'
            )
          )
          percentTabulacao['SKILL'] = '(%)Tabulação'
          let percentElegiveis = this.decimalToPercent(
            this.arithmeticEachObject(
              pairPercentElegiveis[0],
              pairPercentElegiveis[1],
              '/',
              'SEMANA1'
            )
          )
          percentElegiveis['SKILL'] = '(%)Clientes Elegíveis'
          let percentClientesAbordados = this.decimalToPercent(
            this.arithmeticEachObject(
              pairPercentClientesAbordados[0],
              pairPercentClientesAbordados[1],
              '/',
              'SEMANA1'
            )
          )
          percentClientesAbordados['SKILL'] = '(%)Clientes Abordados'

          let conversaoBrutaLigAtendi = this.decimalToPercent(
            this.arithmeticEachObject(
              pairConversaoBrutaLigAtendi[0],
              pairConversaoBrutaLigAtendi[1],
              '/',
              'SEMANA1'
            )
          )
          conversaoBrutaLigAtendi['SKILL'] = 'Conversão bruta lig atendi'
          let conversaoBrutaLigEleg = this.decimalToPercent(
            this.arithmeticEachObject(
              pairConversaoBrutaLigEleg[0],
              pairConversaoBrutaLigEleg[1],
              '/',
              'SEMANA1'
            )
          )
          conversaoBrutaLigEleg['SKILL'] = 'Conversão bruta lig elegíveis'
          let conversaoBrutaLigAbordados = this.decimalToPercent(
            this.arithmeticEachObject(
              pairConversaoBrutaLigAbordados[0],
              pairConversaoBrutaLigAbordados[1],
              '/',
              'SEMANA1'
            )
          )
          conversaoBrutaLigAbordados['SKILL'] = 'Conversão bruta lig abordados'

          let conversaoAtivadaLigAtendidas = this.decimalToPercent(
            this.arithmeticEachObject(
              pairConversaoAtivadaLigAtendidas[0],
              pairConversaoAtivadaLigAtendidas[1],
              '/',
              'SEMANA1'
            )
          )
          conversaoAtivadaLigAtendidas['SKILL'] = 'Conversão ativada lig atendidas'
          let conversaoAtivadaLigElegiveis = this.decimalToPercent(
            this.arithmeticEachObject(
              pairConversaoAtivadaLigElegiveis[0],
              pairConversaoAtivadaLigElegiveis[1],
              '/',
              'SEMANA1'
            )
          )
          conversaoAtivadaLigElegiveis['SKILL'] = 'Conversão ativada lig elegíveis'
          let conversaoAtivadaLigAbordados = this.decimalToPercent(
            this.arithmeticEachObject(
              pairConversaoAtivadaLigAbordados[0],
              pairConversaoAtivadaLigAbordados[1],
              '/',
              'SEMANA1'
            )
          )
          conversaoAtivadaLigAbordados['SKILL'] = 'Conversão ativada lig abordados'

          this.jsonData.push(percentTabulacao)
          this.jsonData.push(percentElegiveis)
          this.jsonData.push(percentClientesAbordados)

          this.jsonData.push(conversaoBrutaLigAtendi)
          this.jsonData.push(conversaoBrutaLigEleg)
          this.jsonData.push(conversaoBrutaLigAbordados)

          this.jsonData.push(conversaoAtivadaLigAtendidas)
          this.jsonData.push(conversaoAtivadaLigElegiveis)
          this.jsonData.push(conversaoAtivadaLigAbordados)

          this.data = this.jsonData
          this.loading = false
        })
      }
    },
    created: function () {
      this.loadBase()
    }
  }
</script>
