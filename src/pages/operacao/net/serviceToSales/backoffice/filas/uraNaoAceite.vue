<template>
  <v-row class="mx-2">
    <v-col class="pa-0 ma-1">
      <v-select
        :items="['SIM', 'NÃO']"
        dense
        outlined
        v-model="respostaFila.existeDivergencia"
        placeholder="Existe divergência URA X Operador?"
        label="Existe divergência URA X Operador?"
      ></v-select>
    </v-col>
    <v-col class="pa-0 ma-1" v-if="respostaFila.existeDivergencia == 'SIM'">
      <v-select
        :items="['PLANO', 'VALORES']"
        dense
        outlined
        placeholder="Qual divergência?"
        label="Qual divergência?"
        v-model="respostaFila.qualDivergencia"
      ></v-select>
    </v-col>
    <v-col class="pa-0 ma-1" v-if="respostaFila.qualDivergencia != null">
      <v-select
        :items="['SIM', 'NÃO']"
        dense
        outlined
        placeholder="Foi possivel fazer nova oferta?"
        label="Foi possivel fazer nova oferta?"
        v-model="respostaFila.possivelFazerNovaOferta"
      ></v-select>
    </v-col>
    <v-col class="pa-0 ma-1" v-if="respostaFila.possivelFazerNovaOferta == 'SIM'">
      <v-select
        :items="['SIM', 'NÃO']"
        dense
        outlined
        placeholder="Cliente aceitou nova oferta?"
        label="Cliente aceitou nova oferta?"
        v-model="respostaFila.clienteAceitouOferta"
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
        existeDivergencia: null,
        qualDivergencia: null,
        possivelFazerNovaOferta: null,
        clienteAceitouOferta: null
      }
    }),
    computed: {
      isValid() {
        return (
          this.respostaFila.existeDivergencia == 'NÃO' ||
          (this.respostaFila.existeDivergencia == 'SIM' &&
            this.respostaFila.qualDivergencia &&
            this.respostaFila.possivelFazerNovaOferta == 'NÃO') ||
          (this.respostaFila.existeDivergencia == 'SIM' &&
            this.respostaFila.qualDivergencia != null &&
            this.respostaFila.possivelFazerNovaOferta == 'SIM' &&
            this.respostaFila.clienteAceitouOferta != null)
        )
      }
    },
    methods: {
      clearForm() {
        let newForm = Object.assign({}, this.respostaFila)
        Object.keys(newForm).forEach(item => {
          newForm[item] = null
        })
        this.respostaFila = newForm
      },
      isValidDemais() {
        return this.isValid
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
      'respostaFila.existeDivergencia': function (oldVal, newVal) {
        if (oldVal != newVal) {
          this.respostaFila.qualDivergencia = null
          this.respostaFila.possivelFazerNovaOferta = null
          this.respostaFila.clienteAceitouOferta = null
        }
      }
    }
  }
</script>

<style></style>
