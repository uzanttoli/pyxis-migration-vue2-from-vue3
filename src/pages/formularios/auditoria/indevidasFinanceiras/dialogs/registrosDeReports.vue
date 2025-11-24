<template>
  <v-row justify="space-around">
    <v-col cols="auto">
      <v-dialog
        transition="dialog-bottom-transition"
        v-model="dialogRegistrosDeReports"
        max-width="1350"
        persistent
      >
        <template>
          <v-card>
            <v-toolbar color="primary" dark>
              Registro de Reports
              <v-spacer></v-spacer>
              <v-btn icon @click="$emit('closeDialogRegistrosDeReport')">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <div class="text-h2 pa-12">
                <v-simple-table dense class="text-no-wrap">
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-center grey lighten-3">Data Cadastro</th>
                        <th class="text-center grey lighten-3">Almope do Responsavel</th>
                        <th class="text-center grey lighten-3">Nome do Responsavel</th>
                        <th class="text-center grey lighten-3">Report</th>
                        <th class="text-center grey lighten-3">Observação</th>
                        <!-- <th class="text-center" v-if="adm == 'ADMINISTRADOR'">
                          Validar
                        </th> -->
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, i) in recordReport" :key="i">
                        <td class="text-center">
                          {{ item.DATA.split('-').reverse().join('/') }}
                        </td>
                        <td class="text-center">{{ item.ALMOPE_AUDITOR }}</td>
                        <td class="text-center">{{ item.NOME_AUDITOR }}</td>
                        <td class="text-center">{{ item.DESCRICAO }}</td>
                        <td class="text-center">{{ item.OBSERVACAO }}</td>
                        <!-- <td class="text-center">
                          <v-btn icon color="green">
                            <v-icon>mdi-check</v-icon>
                          </v-btn>-->
                        <!-- </td> -->
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </div>
            </v-card-text>
          </v-card>
        </template>
      </v-dialog>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: 'RegistroDeReports',
    props: {
      dialogRegistrosDeReports: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      desserts: []
    }),
    computed: {
      adm() {
        return this.$store.getters.usuario.filtro
      },
      recordReport() {
        let recordReport = this.$store.getters.recordReport
        return recordReport ? recordReport : []
      }
    },
    methods: {
      loadRecordReport() {
        this.$store.dispatch('loadRecordReport')
      }
    },
    watch: {
      dialogRegistrosDeReports() {
        if (this.dialogRegistrosDeReports == true) {
          this.loadRecordReport()
        }
      }
    }
  }
</script>

<style></style>
