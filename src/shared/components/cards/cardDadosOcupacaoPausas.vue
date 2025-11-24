<template>
  <v-card class="rounded-xl mx-auto" elevation="0" outlined>
    <v-list-item>
      <v-list-item-content>
        <div class="pa-2">
          <strong>{{ data.Agrupamento }}</strong>
        </div>
        <v-divider class="ma-1"></v-divider>
        <v-list-item-title class="headline mb-1">
          <!-- class="font-weight-bold" -->
          <div style="display: flex; flex-direction: column; font-size: 16px; font-weight: 500">
            Percentual: {{ calcularPercentualAbs(data.Pausas, data.Logado) }}
            <div style="display: flex; align-items: center">
              Total: {{ data.Pausas }}
              <v-icon :color="classColor" small class="ml-2">fa-solid fa-circle-exclamation</v-icon>
            </div>
          </div>
        </v-list-item-title>

        <v-list-item-subtitle v-for="(item, i) in buildResumoPausasComputed" :key="i">
          <v-icon size="21">{{ item.icon || 'fa-solid fa-user-clock' }}</v-icon>
          {{ item.title }}: {{ item.value }} | ({{ item.pp }})
          <template v-if="item.title === 'Sistema Indevida'">
            <v-list-item-subtitle
              v-for="(item, i) in builPausasSistemas"
              :key="'A' + i"
              class="ml-6"
            >
              <v-icon style="width: 20px" :color="item.value > 0 ? item.color : 'red lighten-2'">
                {{ item.icon }}
              </v-icon>
              {{ item.title }}:{{ item.value }}
            </v-list-item-subtitle>
          </template>
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
  import IconsCards from '@/pages/relatoriosOnline/ocupacao/json/IconsCards'
  export default {
    props: {
      data: {
        type: [Array, Object]
      },
      produtoParams: {
        type: String
      },
      interval: {
        type: Number,
        default: 0
      }
    },
    computed: {
      classColor() {
        if (this.total > 20) {
          return 'red'
        } else if (this.total > 10 && this.total <= 20) {
          return 'orange'
        } else {
          return 'green'
        }
      },
      buildResumoPausasComputed() {
        let data = this.data
        let dataHeaders = Object.keys(data)
        let dataFormated = dataHeaders
          .map(item => {
            if (!this.palavraNaString(item, 'Sis. ')) {
              return {
                title: item,
                value: data[item],
                pp: this.percentPausas(data[item], data['Logado']),
                icon: IconsCards['pausasOcupacao'][item], //this.icons[item],
                aberturaSistema: []
              }
            }
          })
          .filter(itemFilter => {
            return (
              itemFilter != null &&
              itemFilter.title != 'Agrupamento' &&
              itemFilter.title != 'Logado' &&
              itemFilter.title != 'Atendimento' &&
              itemFilter.title != 'Agrupamento' &&
              itemFilter.title != 'Pausas'
            )
          })
        return dataFormated
      },
      builPausasSistemas() {
        let sistemas = this.data
        let dataHeaders = Object.keys(sistemas)
        let newData = dataHeaders
          .map(item => {
            if (this.palavraNaString(item, 'Sis. ')) {
              return {
                title: this.formatText(item),
                value: sistemas[item],
                pp: this.percentPausas(sistemas[item], sistemas['Logado']),
                icon: IconsCards['pausasOcupacao'][item], //this.icons[item],
                color: 'orange'
              }
            }
          })
          .filter(itemFilter => {
            return itemFilter != null
          })
        return newData
      }
    },
    methods: {
      palavraNaString(string, palavra) {
        var regex = new RegExp('\\b' + palavra + '\\b', 'i')
        return regex.test(string)
      },
      calcularPercentualAbs(value1, value2) {
        return ((value1 / value2) * 100).toFixed(2).concat('%')
      },
      convertToDecimalBr(valor) {
        return (valor / 100).toLocaleString(undefined, {
          style: 'percent',
          minimumFractionDigits: 2
        })
      },
      percentPausas(value1, value2) {
        return ((value1 / value2) * 100).toFixed(2).concat(' p.p.')
      },
      formatText(string) {
        if (!string) return
        return string.replace(/Sis. |_/g, ' ')
      }
    },
    created() {}
  }
</script>

<style></style>
