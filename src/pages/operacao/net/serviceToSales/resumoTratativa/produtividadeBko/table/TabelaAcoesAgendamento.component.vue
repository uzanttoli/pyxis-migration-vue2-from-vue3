<template>
  <v-sheet>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-center">Data</th>
            <th class="text-center">Qtd</th>
            <th class="text-center">Ação</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in dados" :key="i" class="text-center">
            <td>{{ item.DATA_AGENDAMENTO | dateFormat }}</td>
            <td>{{ item.QTD_CASOS_AGENDADOS }}</td>
            <td>
              <v-btn
                depressed
                tile
                class="rounded-xl white--text"
                color="green"
                small
                @click="liberar(item.DATA_AGENDAMENTO)"
              >
                Liberar
              </v-btn>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <v-overlay :value="atualizando">
      <v-progress-circular indeterminate size="100">Liberando...</v-progress-circular>
    </v-overlay>
  </v-sheet>
</template>

<script>
  import config from '@/core/config'
  export default {
    props: {
      tipo: {
        type: String
      }
    },
    data: () => ({
      dados: [],
      atualizando: false
    }),
    filters: {
      dateFormat(date) {
        if (!date) return
        const dateIntl = new Date(date)
        dateIntl.setDate(dateIntl.getDate() + 1)
        const options = {
          timeZone: 'America/Sao_Paulo',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        }
        return new Intl.DateTimeFormat('pt-BR', options).format(dateIntl)
      }
    },
    methods: {
      loadBase() {
        this.$emit('update:loading-acoes', true)
        let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/datas_agendadas/${this.tipo}`
        this.$api.get(urlData).then(res => {
          this.dados = res.data
          this.$emit('update:loading-acoes', false)
        })
      },
      async liberar(value) {
        this.$emit('update:loading-acoes', true)
        this.atualizando = true
        if (value != '' && this.tipo) {
          let urlData = `${config.baseUrl}api/shared/formularios/tratativa_bko_ativacao/liberar_agendamento/${value}/${this.tipo}`
          await this.$api.get(urlData)
          this.loadBase()
          this.$emit('updated:dados-graficos')
          this.atualizando = false
          this.$emit('update:loading-acoes', false)
        }
      }
    },
    watch: {},
    created() {
      this.loadBase()
    }
  }
</script>

<style></style>
