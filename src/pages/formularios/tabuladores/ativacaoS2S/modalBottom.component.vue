<template>
  <!-- v-model="sheet" -->
  <div class="text-center">
    <v-bottom-sheet
      :model-value="sheet"
      @update:modelValue="val => $emit('update:sheet', val)"
      inset
      persistent
    >
      <v-sheet class="text-center">
        <div class="my-3 pa-4">
          Será agendado para
          <strong>[ {{ dateNow }} ]!</strong>
          <br />
          <strong>Obs¹</strong>
          : Esse agendamento na data informada acima retornará pra você.
        </div>

        <div>
          <v-btn text class="mt-n5" color="success" @click="agendarCasoActions">Agendar</v-btn>
          <v-btn text class="mt-n5" color="error" @click="$emit('closeSchedule')">Cancelar</v-btn>
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
  export default {
    props: {
      sheet: {
        type: Boolean,
        default: false
      },
      dadosAgenda: {
        type: [Object, Array],
        require: true
      }
    },
    data: () => ({
      tipoTratativa: null
    }),
    computed: {
      dateNow() {
        this.moment.locale('pt-br')
        return this.moment()
          .add(this.dadosAgenda.itemCausaMacro === 1 ? 5 : 5, 'days')
          .format('YYYY-MM-DD')
      },
      usuarioAlmope() {
        return this.$store.getters.usuario.almope
      }
    },
    methods: {
      async agendarCasoActions() {
        let data = {
          procedimento: 2,
          statusTratamento: 2,
          almope: this.dadosAgenda.almopeTratamentoFechamento,
          casoAtivo: this.dadosAgenda.itemCasoAtivo,
          motivoMacro: this.dadosAgenda.itemCausaMacro,
          motivoMicro: this.dadosAgenda.itemCausaMicro,
          dataAgendamento: this.dateNow,
          idMailing: this.dadosAgenda.idMailing
        }
        await this.$store.dispatch('atualizarCasoActions', data)
        this.loadNovoCasoAtivacao()
        this.$emit('updated:agendado')
        this.$emit('closeSchedule')
      },

      async loadNovoCasoAtivacao() {
        try {
          await this.$store.dispatch('loadNovoCasoAtivacao', this.usuarioAlmope)
        } catch (error) {
          return error
        }
      }
    }
  }
</script>

<style></style>
