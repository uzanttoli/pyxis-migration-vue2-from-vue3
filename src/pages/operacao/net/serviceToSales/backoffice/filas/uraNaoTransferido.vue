<template>
  <v-row class="mx-2">
    <v-col class="pa-0 ma-1">
      <v-select
        placeholder="Foi verbalizado oferta de venda para o cliente?"
        label="Foi verbalizado oferta de venda para o cliente?"
        dense
        outlined
        :items="['SIM', 'NÃO']"
        v-model="respostaFila.verbalizadoOferta"
      ></v-select>
    </v-col>
    <v-col class="ma-1 pa-0" v-if="respostaFila.verbalizadoOferta == 'SIM'">
      <v-select
        :items="['SIM', 'NÃO']"
        placeholder="Existe divergencia de oferta registrada e verbalizada?"
        label="Existe divergencia de oferta registrada e verbalizada?"
        outlined
        dense
        v-model="respostaFila.existeDivergenciaOferta"
      ></v-select>
    </v-col>
    <v-col class="ma-1 pa-0" v-if="respostaFila.existeDivergenciaOferta == 'SIM'">
      <v-select
        :items="['PLANO', 'VALORES']"
        placeholder="Qual divergência?"
        label="Qual divergência?"
        outlined
        dense
        v-model="respostaFila.qualDivergencia"
      ></v-select>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    props: {
      isSend: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      respostaFila: {
        verbalizadoOferta: null,
        existeDivergenciaOferta: null,
        qualDivergencia: null
      }
    }),
    computed: {
      isValid() {
        return (
          this.respostaFila.verbalizadoOferta == 'NÃO' ||
          (this.respostaFila.verbalizadoOferta == 'SIM' &&
            this.respostaFila.existeDivergenciaOferta == 'NÃO') ||
          (this.respostaFila.verbalizadoOferta == 'SIM' &&
            this.respostaFila.existeDivergenciaOferta == 'SIM' &&
            this.respostaFila.qualDivergencia)
        )
      }
    },
    methods: {
      isValidDemais() {
        return this.isValid
      },
      clearForm() {
        let newForm = Object.assign({}, this.respostaFila)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })

        this.respostaFila = newForm
      }
    },
    watch: {
      isValid: {
        deep: true,
        handler() {
          this.$emit('demais-info', {
            valid: this.isValidDemais(),
            object: this.respostaFila
          })
        }
      },
      isSend() {
        if (this.isSend == true) {
          this.clearForm()
        }
      },
      'respostaFila.verbalizadoOferta': function (oldVal, newVal) {
        if (oldVal != newVal) {
          this.respostaFila.existeDivergenciaOferta = null
          this.respostaFila.qualDivergencia = null
        }
      },
      'respostaFila.existeDivergenciaOferta': function (oldVal, newVal) {
        if (oldVal != newVal) {
          this.respostaFila.qualDivergencia = null
        }
      }
    }
  }
</script>

<style></style>
