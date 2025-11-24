<template>
  <v-row class="">
    <v-col v-for="(item, i) in escalaTrabalho" :key="i" class="d-flex justify-center" cols="4">
      <v-card width="500" class="rounded-xl pa-2" outlined>
        <p>
          <v-icon size="15" class="mr-1" color="info">fa-solid fa-calendar-days</v-icon>
          Data Escala:
          {{ item.DATA_CRIACAO }}
        </p>
        <p>
          <v-icon size="15" class="mr-1" color="success">fa-solid fa-play</v-icon>
          Inicio Turno: {{ item.INICIO_TURNO }}
        </p>
        <p>
          <v-icon size="15" class="mr-1" color="error">fa-solid fa-stop</v-icon>
          Fim Turno: {{ item.FIM_TURNO }}
        </p>
        <v-divider></v-divider>
        <p>
          <v-icon size="15" class="mr-1" color="warning">fa-solid fa-clock</v-icon>
          Pausas:
          <span v-for="(pause, i) in item.PAUSAS.split('|')" :key="i">
            <p class="ml-8 font-weight-bold">{{ i + 1 }}ª pausa: {{ pause }}</p>
          </span>
        </p>
      </v-card>
    </v-col>
  </v-row>
  <!-- <v-data-table
    dense
    hide-default-footer
    :headers="headers"
    :items="escalaTrabalho"
    item-key="name"
    class="elevation-1 text-no-wrap"
  ></v-data-table> -->
</template>

<script>
  export default {
    name: 'table-escala-trabalho',
    props: {
      usuarioAlmope: {
        type: [String, Number],
        default: null
      }
    },
    data: () => ({
      headers: [
        {
          text: 'Data',
          align: 'center',
          sortable: false,
          value: 'DATA_CRIACAO'
        },
        {
          text: 'Inicio Turno',
          align: 'center',
          sortable: false,
          value: 'INICIO_TURNO'
        },
        {
          text: 'Fim Turno',
          align: 'center',
          sortable: false,
          value: 'FIM_TURNO'
        },
        {
          text: 'Pausas',
          align: 'center',
          value: 'PAUSAS'
        }
      ]
    }),
    computed: {
      escalaTrabalho() {
        return this.$store.getters.escalaTrabalho
      }
    },
    methods: {
      loadEscalaTrabalho() {
        return this.$store.dispatch('loadEscalaTrabalho', this.usuarioAlmope)
      }
    },
    created() {
      this.loadEscalaTrabalho()
    }
  }
</script>

<style scoped>
  p {
    padding: 0;
    margin: 0;
  }
</style>
