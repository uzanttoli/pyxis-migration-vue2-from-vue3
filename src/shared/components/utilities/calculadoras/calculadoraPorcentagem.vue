<template>
  <!-- <v-dialog max-width="500px" v-model="dialogCalcPercent" persistent> -->
  <!-- <v-col class="pa-2"> -->
  <v-card>
    <title-negative-margin title="Calculadora Porcentagem"></title-negative-margin>
    <v-divider></v-divider>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-form>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      filled
                      auto-grow
                      label="Valor do Desconto"
                      prefix="R$"
                      rows="2"
                      disabled
                      row-height="15"
                      shaped
                      :value="calculadora.resultValue"
                    ></v-textarea>

                    <v-text-field
                      label="Valor da mensalidade"
                      placeholder="0,00"
                      :rules="rules"
                      prefix="R$"
                      outlined
                      dense
                      v-model="calculadora.valorMensalidade"
                      type="number"
                    ></v-text-field>

                    <v-overflow-btn
                      v-model="descontoSelecionado"
                      class="my-2"
                      :items="items"
                      label="Selecione a porcentagem aqui!"
                      item-value="value"
                      @change=";(calculadora.desconto = null), calcularPorcentagem()"
                      item-text="text"
                    ></v-overflow-btn>

                    <v-text-field
                      v-if="descontoSelecionado == 'OUTRO'"
                      label="% de desconto"
                      :rules="rules"
                      outlined
                      dense
                      type="number"
                      v-model="calculadora.desconto"
                    ></v-text-field>
                    <v-row>
                      <v-btn
                        color="primary"
                        depressed
                        elevation="3"
                        :disabled="!fomrIsValid"
                        @click="calcularPorcentagem()"
                      >
                        Calcular
                      </v-btn>
                      <v-spacer></v-spacer>
                      <v-btn
                        color="red darken-1 white--text"
                        depressed
                        elevation="3"
                        :disabled="!this.formFilled"
                        @click="limparCalc()"
                      >
                        Limpar
                      </v-btn>
                    </v-row>
                  </v-col>
                </v-row>
              </v-container>
            </v-form>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
  <!-- </v-col> -->
  <!-- </v-dialog> -->
</template>
<script>
  export default {
    props: {},
    data: () => ({
      descontoSelecionado: null,
      calculadora: {
        valorMensalidade: null,
        desconto: null,
        resultValue: null
      },
      calculadoraDefault: {
        valorMensalidade: null,
        desconto: null,
        resultValue: null
      },
      items: [
        { text: '100%', value: 100 },
        { text: '75%', value: 75 },
        { text: '50%', value: 50 },
        { text: '25%', value: 25 },
        { text: 'OUTRO', value: 'OUTRO' }
      ],
      rules: [value => !!value || 'Necessario informar um valor!']
    }),
    computed: {
      descontoFinal() {
        return this.descontoSelecionado == 'OUTRO'
          ? this.calculadora.desconto
          : this.descontoSelecionado
      },
      fomrIsValid() {
        return (
          this.calculadora.valorMensalidade &&
          (this.calculadora.desconto || this.descontoSelecionado)
        )
      },
      formFilled() {
        return this.calculadora.valorMensalidade || this.calculadora.desconto
      }
    },
    methods: {
      calcularPorcentagem() {
        this.calculadora.resultValue =
          (this.calculadora.valorMensalidade * this.descontoFinal) / 100
      },
      limparCalc() {
        Object.assign(this.calculadora, this.calculadoraDefault)
      }
    }
  }
</script>

<style></style>
