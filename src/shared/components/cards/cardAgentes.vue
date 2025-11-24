<template>
  <v-card class="mx-auto rounded-xl" elevation="0" outlined>
    <v-list-item>
      <v-list-item-content>
        <div class="mb-1">
          <v-col>
            <div
              style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                letter-spacing: 2px;
              "
            >
              <strong>{{ data.AGRUPAMENTO }}</strong>
              <v-spacer></v-spacer>
              <v-icon
                color="orange"
                v-if="
                  data.QTD_DISPONIVEIS > 0 &&
                  data.QTD_DISPONIVEIS <= 4 &&
                  data.QTD_EM_ATENDIMENTO > 4
                "
              >
                fa-solid fa-temperature-half
              </v-icon>
              <v-icon
                color="green"
                v-else-if="data.QTD_DISPONIVEIS > 4 && data.QTD_EM_ATENDIMENTO > 0"
              >
                fa-solid fa-temperature-quarter
              </v-icon>
              <v-icon color="red" v-else>fa-solid fa-temperature-full</v-icon>
            </div>
          </v-col>
          <v-divider></v-divider>
        </div>

        <v-list-item-subtitle
          v-for="(item, i) in getBuildAgentes"
          :key="i"
          style="text-transform: capitalize; margin: 4px 0"
        >
          <v-icon size="20">{{ item.icon }}</v-icon>
          {{ item.title }}: {{ item.value }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-card>
</template>

<script>
  export default {
    props: {
      data: {
        type: [Array, Object]
      }
    },
    data: () => ({
      dados: []
    }),
    computed: {
      buildAgentes() {
        return {
          QTD_DISPONIVEIS: 'mdi-account-settings',
          QTD_EM_ATENDIMENTO: 'mdi-phone-settings',
          QTD_POS_ATENDIMENTO: 'mdi-phone-dial',
          QTD_ATD_ALMAVIVA_N1: 'mdi-phone-return',
          QTD_ATD_ALMAVIVA_RET: 'mdi-phone-return',
          QTD_DTH_N1: 'mdi-phone-return',
          QTD_DTH_RET: 'mdi-phone-return',
          QTD_TRANSBORDO_EXTERNO: 'mdi-open-in-new',
          QTD_CM_ATD_MTF: 'mdi-open-in-new',
          QTD_RET_ATD_TRB_EXT_N1: 'mdi-open-in-new',
          QTD_RET_ATD_TRB_EXT_RET: 'mdi-open-in-new',
          QTD_LINHA_MUDA: 'mdi-phone-alert',
          QTD_ATD_SUPERVISOR: 'mdi-human-greeting-proximity',
          QTD_S2S: 'mdi-sale'
        }
      },
      getBuildAgentes() {
        let data = this.data
        let dataHeader = Object.keys(data)
        return dataHeader
          .map(item => {
            return {
              title: this.formatText(item),
              icon: this.buildAgentes[item] ? this.buildAgentes[item] : 'mdi-account',
              value: data[item]
            }
          })
          .filter(item2 => {
            return item2.title != 'agrupamento'
          })
      }
    },
    methods: {
      getObjFormat(data) {
        const novoDados = {}
        for (const chave in data) {
          const novaChave = chave.replace(/QTD_|_/g, ' ')
          novoDados[novaChave] = data[chave]
        }
        return novoDados
      },
      formatText(string) {
        if (!string) return
        return string.replace(/QTD_|_/g, ' ').toLowerCase()
      }
    },
    created() {}
  }
</script>

<style></style>
