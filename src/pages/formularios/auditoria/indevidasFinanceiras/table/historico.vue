<template>
  <v-dialog
    v-model="dialogHistoricoTratativa"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    persistent
  >
    <v-card>
      <v-toolbar dark color="primary">
        <v-btn icon dark @click.stop="$emit('closeDialogHistoricoTratativa')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Histórico de tratativa</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <v-sheet>
        <v-card elevation="3" class="pa-0 ma-5">
          <v-card-title>
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Pesquisar"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :search="search"
            :items="treatmentHistory"
            dense
            class="text-no-wrap"
            no-data-text="Não há dados no momento!"
          ></v-data-table>
        </v-card>
      </v-sheet>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'historico-tratativa',
    props: {
      dialogHistoricoTratativa: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        notifications: false,
        sound: true,
        widgets: false,
        search: '',
        headers: [
          {
            text: 'Almope Auditor',
            align: 'center',
            sortable: true,
            value: 'ALMOPE_AUDITOR'
          },
          {
            text: 'Ocorrência',
            align: 'center',
            sortable: false,
            value: 'OCORRENCIA'
          },
          { text: 'Contrato', value: 'CONTRATO', align: 'center' },
          { text: 'Tipo Ocorrencia', value: 'TIPO_OCORRENCIA', align: 'center' },
          {
            text: 'Cenario Reclamado',
            value: 'CENARIO_RECLAMADO_CLIENTE',
            align: 'center'
          },
          { text: 'Classifiçação', value: 'CLASSIFICACAO', align: 'center' },
          {
            text: 'Causa Macro N1',
            value: 'CLASSIFICACAO_MACRO_N1',
            align: 'center'
          },
          {
            text: 'Causa Micro N1',
            value: 'CLASSIFICACAO_MICRO_N1',
            align: 'center'
          },
          {
            text: 'Classificação BKO',
            value: 'CLASSIFICACAO_BKO',
            align: 'center'
          },
          { text: 'Causa Macro BKO', value: 'CAUSA_MACRO_BKO', align: 'center' },
          { text: 'Observação N1', value: 'OBSERVACAO_N1', align: 'center' },
          { text: 'Observação BKO', value: 'OBSERVACAO_BKO', align: 'center' }
        ]
      }
    },
    computed: {
      treatmentHistory() {
        let treatmentHistory = this.$store.getters.treatmentHistory
        return treatmentHistory ? treatmentHistory : []
      }
    },
    methods: {
      loadTreatmentHistory() {
        this.$store.dispatch('loadTreatmentHistory')
      }
    },
    created() {
      this.loadTreatmentHistory()
    }
  }
</script>

<style></style>
