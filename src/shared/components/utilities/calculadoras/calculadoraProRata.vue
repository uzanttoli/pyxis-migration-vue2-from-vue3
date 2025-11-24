<template>
  <!-- <v-row> -->
  <!-- <v-dialog v-model="dialogCalcProRata" max-width="600px" persistent> -->
  <!-- <v-col class="pa-2"> -->
  <v-card>
    <title-negative-margin title="Calculadora Pró Rata"></title-negative-margin>
    <v-divider></v-divider>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-form>
              <v-row>
                <v-col cols="6">
                  <v-textarea
                    label="Valor da Fatura"
                    prefix="R$"
                    no-resize
                    rows="1"
                    :value="calculadora.result"
                    disabled
                  ></v-textarea>
                </v-col>

                <v-col cols="6">
                  <v-textarea
                    label="Contestar valor de"
                    prefix="R$"
                    no-resize
                    rows="1"
                    :value="calculadora.resultContest"
                    disabled
                  ></v-textarea>
                </v-col>

                <v-col cols="6">
                  <v-dialog
                    ref="dialogInicio"
                    v-model="calculadora.menuInicio"
                    v-model:return-value="calculadora.dataInicio"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="calculadora.dataInicio"
                        label="Data Inicial"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="calculadora.dataInicio" scrollable locale="pt-br">
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="calculadora.menuInicio = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialogInicio.save(calculadora.dataInicio)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col>

                <v-col cols="6">
                  <v-dialog
                    ref="dialogFim"
                    v-model="calculadora.menuFim"
                    v-model:return-value="calculadora.dataFim"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :disabled="dataIniIsStarted"
                        v-model="calculadora.dataFim"
                        label="Data Fim"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>

                    <v-date-picker
                      v-model="calculadora.dataFim"
                      :min="calculadora.dataInicio"
                      scrollable
                      locale="pt-br"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="calculadora.menuFim = false">
                        Cancel
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialogFim.save(calculadora.dataFim)"
                      >
                        OK
                      </v-btn>
                    </v-date-picker>
                  </v-dialog>
                </v-col>
              </v-row>

              <v-col cols="12">
                <v-row>
                  <v-text-field
                    v-model="calculadora.valorProduto"
                    filled
                    label="Informe o valor do Produto"
                    clearable
                    type="number"
                    required
                  ></v-text-field>
                </v-row>
              </v-col>
              <v-row>
                <v-btn
                  depressed
                  elevation="3"
                  @click="calcularProRata()"
                  :disabled="!formIsValid"
                  color="primary"
                >
                  Calcular
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  :disabled="!this.formFilled"
                  elevation="3"
                  @click="limparCalc()"
                  color="red darken-3 white--text"
                >
                  Limpar
                </v-btn>
              </v-row>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
  <!-- </v-col> -->
  <!-- </v-dialog>
  </v-row> -->
</template>

<script>
  export default {
    props: {
      dialogCalcProRata: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      calculadora: {
        menuInicio: false,
        menuFim: false,
        dataInicio: null,
        dataFim: null,
        result: 0,
        resultContest: 0,
        valorProduto: null
      },
      calculadoraDefault: {
        menuInicio: false,
        menuFim: false,
        dataInicio: null,
        dataFim: null,
        result: 0,
        resultContest: 0,
        valorProduto: null
      }
    }),
    computed: {
      dataIniIsStarted() {
        return !this.calculadora.dataInicio ? true : false
      },
      formIsValid() {
        return (
          this.calculadora.dataInicio && this.calculadora.dataFim && this.calculadora.valorProduto
        )
      },
      formFilled() {
        return (
          this.calculadora.dataInicio || this.calculadora.dataFim || this.calculadora.valorProduto
        )
      }
    },
    methods: {
      calcularProRata() {
        let dataIni = new Date(this.calculadora.dataInicio)
        let dataEnd = new Date(this.calculadora.dataFim)

        let diffDateInTime = dataEnd.getTime() - dataIni.getTime()
        let diffDate = diffDateInTime / (1000 * 3600 * 24) + 1

        this.calculadora.result = (this.calculadora.valorProduto / 30) * diffDate

        this.calculadora.resultContest =
          this.calculadora.valorProduto - (this.calculadora.valorProduto / 30) * diffDate
      },
      limparCalc() {
        Object.assign(this.calculadora, this.calculadoraDefault)
      }
    },
    watch: {
      'calculadora.dataInicio'() {
        this.calculadora.dataFim = null
      }
    }
  }
</script>
