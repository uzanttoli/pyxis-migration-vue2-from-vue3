<template>
  <v-row>
    <v-col cols="12">
      <v-col cols="8" offset="2">
        <v-card>
          <v-toolbar flat color="primary" dark v-if="justificativaAbs != ''">
            <v-toolbar-title>
              <v-icon>mdi-human-male-board</v-icon>
              Justifique seu Abs
            </v-toolbar-title>
          </v-toolbar>
          <v-tabs vertical v-if="justificativaAbs">
            <v-tab v-for="(item, i) in justificativaAbs" :key="i">
              <v-icon left>mdi-account</v-icon>
              {{ item.ALMOPE }}
            </v-tab>

            <v-tab-item v-for="(item, i) in justificativaAbs" :key="i">
              <v-card flat>
                <v-card-text class="mt-4 pa-0">
                  <v-col cols="12">
                    <v-row>
                      <v-col>
                        <div>
                          <p>
                            <b>Nome:</b>
                            {{ item.NOME }}
                          </p>
                        </div>
                      </v-col>
                      <div style="width: 400px" class="mt-1 mr-2">
                        <v-select
                          :items="absJustificadoSupervisor"
                          solo
                          item-value="ID"
                          item-text="DESCRICAO"
                          placeholder="Selecione à justificativa!"
                          v-model="justificativaAbsSupervisor.descricao"
                        ></v-select>
                      </div>
                    </v-row>
                    <v-divider></v-divider>
                    <v-col cols="12" class="mt-4">
                      <v-row>
                        <v-textarea
                          filled
                          auto-grow
                          label="Descreva aqui, se necessário"
                          rows="4"
                          row-height="25"
                          shaped
                          v-model="justificativaAbsSupervisor.observacao"
                        ></v-textarea>
                      </v-row>
                    </v-col>
                    <v-col offset="4" class="pt-0">
                      <v-row>
                        <v-btn
                          color="primary"
                          width="200"
                          :loading="loading"
                          @click="saveDataFormJustificativaAbs(item)"
                        >
                          Enviar
                        </v-btn>
                        <v-alert
                          class="ml-5"
                          height="38"
                          dense
                          outlined
                          type="error"
                          v-if="alertJustificativaAbs"
                        >
                          Necessário preencher a
                          <strong>Justificativa !</strong>
                        </v-alert>
                      </v-row>
                    </v-col>
                  </v-col>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-card>

        <v-toolbar flat color="primary" dark class="mt-5">
          <v-toolbar-title>
            <v-icon>mdi-history</v-icon>
            Historico de Justificativa
          </v-toolbar-title>
        </v-toolbar>
        <v-card>
          <v-data-table-extended
            dense
            :headers="headers"
            no-data-text="Não historico no momento!"
            :items="historicoJustificativaAbs"
            :search="search"
            csv-filename="Justificativa Abs"
          >
            <template v-slot:item.DATA_JUSTIFICATIVA="{ item }">
              {{ item.DATA_JUSTIFICATIVA.substr(0, 10).split('-').reverse().join('/') }}
            </template>
            >
          </v-data-table-extended>
        </v-card>
      </v-col>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    name: 'justificativa-abs',
    props: {
      usuarioConsulta: {
        type: [String, Number],
        default: null
      }
    },
    data: () => ({
      iconZero: 'mdi-upload-lock',
      alertJustificativaAbs: false,
      loading: false,
      search: null,
      justificativaAbsSupervisor: {
        chave: '',
        observacao: null,
        descricao: null
      },
      justificativaAbsSupervisorDefault: {
        observacao: null,
        descricao: null
      },
      headers: [
        {
          text: 'Data da Justificativa',
          align: 'center',
          value: 'DATA_JUSTIFICATIVA'
        },
        { text: 'Almope', value: 'ALMOPE', align: 'center' },
        { text: 'Nome', value: 'NOME', align: 'center' },
        { text: 'Descrição', value: 'DESCRICAO', align: 'center' },
        { text: 'Observação', value: 'OBSERVACAO', align: 'center' }
      ]
    }),
    computed: {
      usuarioAlmope() {
        return this.usuarioConsulta ? this.usuarioConsulta : this.$store.getters.usuario.almope
      },
      usuarioNome() {
        return this.usuarioConsulta ? this.usuarioConsulta : this.$store.getters.usuario.nome
      },
      justificativaAbs() {
        return this.$store.getters.justificativaAbs
      },
      absJustificadoSupervisor() {
        return this.$store.getters.absJustificadoSupervisor
      },
      historicoJustificativaAbs() {
        let historicoJustificativaAbs = this.$store.getters.historicoJustificativaAbs
        historicoJustificativaAbs.map(elem => {
          if (elem.OBSERVACAO == 'null') {
            elem.OBSERVACAO = 'SEM OBS'
          }
        })
        return historicoJustificativaAbs
      }
    },
    methods: {
      resetarFormularioJustificativaAbs() {
        this.loadJustificativaAbs()
        this.loadHistoricoJustificativaAbs()
        this.justificativaAbsSupervisor.observacao = null
        this.justificativaAbsSupervisor.descricao = null
      },
      loadJustificativaAbs() {
        return this.$store.dispatch('loadJustificativaAbs', this.usuarioNome)
      },
      loadAbsJustificadoSupervisor() {
        return this.$store.dispatch('loadAbsJustificadoSupervisor')
      },
      loadHistoricoJustificativaAbs() {
        return this.$store.dispatch('loadHistoricoJustificativaAbs', this.usuarioNome)
      },

      dateConvert() {
        let data = new Date()
        let dia = data.getDate().toString()
        let diaF = dia.length == 1 ? '0' + dia : dia
        let mes = (data.getMonth() + 1).toString() //+1 pois no getMonth Janeiro começa com zero.
        let mesF = mes.length == 1 ? '0' + mes : mes
        let anoF = data.getFullYear()

        return diaF + '/' + mesF + '/' + anoF
      },
      saveDataFormJustificativaAbs(item) {
        if (item && this.justificativaAbsSupervisor.descricao !== null) {
          this.loading = true
          setTimeout(() => {
            this.justificativaAbsSupervisor.almope = item.ALMOPE
            this.justificativaAbsSupervisor.nome = item.NOME
            this.justificativaAbsSupervisor.superior1 = item.SUPERIOR1
            this.justificativaAbsSupervisor.superior2 = item.SUPERIOR2
            this.justificativaAbsSupervisor.campanha = item.REGIONAL
            this.justificativaAbsSupervisor.chave = item.ALMOPE + this.dateConvert()
            this.$store
              .dispatch('saveDataFormJustificativaAbs', this.justificativaAbsSupervisor)
              .then(() => {
                this.loading = false
              })
            this.resetarFormularioJustificativaAbs()
          }, 2000)
        } else {
          setInterval(() => {
            this.alertJustificativaAbs = false
          }, 5000)
          return (this.alertJustificativaAbs = true)
        }
      }
    },
    created() {
      this.loadJustificativaAbs()
      this.loadAbsJustificadoSupervisor()
      this.loadHistoricoJustificativaAbs()
    }
  }
</script>

<style scoped></style>
