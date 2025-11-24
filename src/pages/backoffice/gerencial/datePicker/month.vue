<template>
  <v-col cols="2" xl="2" sm="6" md="6">
    <v-dialog ref="dialog" v-model="modal" v-model:return-value="date" persistent width="320">
      <template v-slot:activator="{ on, attrs }">
        <v-row align="center" justify="center">
          <v-text-field
            id="dateView"
            v-model="dateView"
            prepend-inner-icon="mdi-calendar"
            placeholder="Selecione o período:"
            label="Selecione o período:"
            readonly
            dense
            outlined
            v-bind="attrs"
            v-on="on"
            class="rounded-xl"
          ></v-text-field>
        </v-row>
      </template>
      <v-date-picker v-model="date" type="month" scrollable locale="pt-BR">
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="modal = false">Cancelar</v-btn>
        <v-btn text color="primary" @click="saveDate(date)">OK</v-btn>
      </v-date-picker>
    </v-dialog>
  </v-col>
</template>

<script>
  export default {
    data: () => ({
      date: new Date().toISOString().substring(0, 7),
      menu: false,
      modal: false
    }),
    computed: {
      dateView() {
        this.moment.locale('pt-br')
        return this.moment(this.date).format('MMM/YYYY').toUpperCase()
      }
    },
    methods: {
      saveDate(value) {
        this.$refs.dialog.save(value)
        this.$emit('update:date', value)
      }
    }
  }
</script>

<style scoped>
  label {
    font-size: 15px !important;
    margin-top: -25px;
    margin-right: 5px;
  }
</style>
