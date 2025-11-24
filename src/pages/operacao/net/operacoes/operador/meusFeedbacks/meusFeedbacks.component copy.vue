<template>
  <v-sheet class="mt-5">
    <v-row>
      <v-col>
        <v-card
          @updated:refetch="atualizou = true"
          v-if="meusFeedbacksPendentes.length > 0"
          class="mb-7"
          elevation="0"
        >
          <div
            style="display: flex; flex-direction: row; justify-content: end; align-items: center"
          >
            <div class="pa-4 mb-3" style="width: 500px">
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Pesquisar"
                single-line
                hide-details
              ></v-text-field>
            </div>
          </div>
          <v-data-table
            :headers="headers"
            :items="meusFeedbacksPendentes"
            :search="search"
            dense
            :items-per-page="20"
            class="text-no-wrap"
          >
            <template v-slot:item.actions="{ item }">
              <v-tooltip right color="black">
                <template v-slot:activator="{ attrs, on }">
                  <v-btn
                    v-bind="attrs"
                    v-on="on"
                    icon
                    class="ml-2"
                    :to="{
                      name: 'FeedbackId',
                      params: { id: item.ID },
                      query: { feedback: item.ID }
                    }"
                  >
                    <v-icon small color="green">mdi-eye-plus</v-icon>
                  </v-btn>
                </template>
                <span>Abrir Feedback {{ item.ID }}</span>
              </v-tooltip>
            </template>
            <template v-slot:item.DATA_CADASTRO="{ item }">
              {{ item.DATA_CADASTRO.substring(0, 10).split('-').reverse().join('/') }}
            </template>
            <template v-slot:item.DATA_CIENCIA_OPERADOR="{ item }">
              {{
                item.DATA_CIENCIA_OPERADOR != null
                  ? item.DATA_CIENCIA_OPERADOR.substring(0, 10).split('-').reverse().join('/')
                  : (item.DATA_CIENCIA_OPERADOR = `PENDENTE`)
              }}
            </template>
          </v-data-table>
        </v-card>
        <div v-else>
          <NaoHaDados :textPrimary="'Não há feedbacks no momento!'" />
        </div>
      </v-col>
    </v-row>
  </v-sheet>
</template>
<script>
  import NaoHaDados from '@/shared/components/informativo/NaoHaDados.vue'
  export default {
    name: 'meus-feedbacks',
    components: { NaoHaDados },
    data: () => ({
      atualizou: false,
      gravacao: '',
      search: '',
      enviandoDados: false,
      headers: [
        {
          text: 'Visualizar',
          value: 'actions',
          sortable: false,
          align: 'center'
        },
        { text: 'ID', value: 'ID', align: 'center' },
        { text: 'Data Cadastro', value: 'DATA_CADASTRO', align: 'center' },
        { text: 'Data Ciência', value: 'DATA_CIENCIA_OPERADOR', align: 'center' },
        { text: 'Motivo Contato', value: 'MOTIVO_CONTATO', align: 'center' },
        {
          text: 'SubMotivo Contato',
          value: 'SUBMOTIVO_CONTATO',
          align: 'center'
        },
        { text: 'Gestor', value: 'NOME_CADASTRO', align: 'center' },
        { text: 'Tipo', value: 'SANCAO', align: 'center' }

        // { text: "Arquivo", value: "" },
      ],
      observacaoOperador: ''
    }),
    computed: {
      nomeUser() {
        let nome = this.$store.getters.usuario.nome
        let nomeF = nome.split(' ')
        return nomeF[0]
      },
      meusFeedbacks() {
        return this.$store.getters.meusFeedbacks
      },
      meusFeedbacksPendentes() {
        let pendentes = this.$store.getters.meusFeedbacks

        return pendentes ? pendentes : []
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      horaAtualizada() {
        let date = new Date()
        let day = date.getDate().toString()
        let dayF = day.length == 1 ? '0' + day : day
        let mes = (date.getMonth() + 1).toString()
        let mesF = mes.length == 1 ? '0' + mes : mes
        let ano = date.getFullYear()

        let hora = date.getHours().toString()
        let horaF = hora.length == 1 ? '0' + hora : hora

        let minutos = date.getMinutes().toString()
        let minutosF = minutos.length == 1 ? '0' + minutos : minutos

        return dayF + '/' + mesF + '/' + ano + ' ' + horaF + ':' + minutosF
      },
      loadMeusFeedbacks() {
        return this.$store.dispatch('loadMeusFeedbacks', this.usuarioAlmope)
      }
    },
    watch: {
      atualizou() {
        if (this.atualizou == true) {
          this.loadMeusFeedbacks()
          setTimeout(() => {
            this.atualizou = false
          }, 2000)
        }
      },
      updateDataFormFeedback() {
        this.loadMeusFeedbacks()
      }
    },
    created() {
      this.loadMeusFeedbacks()
    }
  }
</script>

<style scoped>
  /* From uiverse.io by @SchawnnahJ */
</style>
