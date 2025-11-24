<template>
  <!-- v-model="abrirConfiguracaoTemporada" -->
  <v-dialog
    width="60%"
    :model-value="abrirConfiguracaoTemporada"
    @update:modelValue="val => $emit('update:abrirConfiguracaoTemporada', val)"
  >
    <v-card>
      <v-card-title>
        Configurar Temporada
        <v-spacer></v-spacer>
        <v-switch v-model="visivel" label="red" color="red" value="red" hide-details></v-switch>
      </v-card-title>
      <v-data-table no-data-text="Não há dados disponiveis" :headers="getHeaders()"></v-data-table>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    props: {
      abrirConfiguracaoTemporada: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      visivel: false
    }),
    methods: {
      getHeaders() {
        let header = [
          {
            text: 'Temporada',
            align: 'center'
          },
          {
            text: 'Produto',
            align: 'center'
          },
          {
            text: 'Inicio',
            align: 'center'
          },
          {
            text: 'Fim',
            align: 'center'
          },
          {
            text: 'Status',
            align: 'center'
          },
          {
            text: 'Descrição',
            align: 'center'
          },
          {
            text: 'Criado por',
            align: 'center'
          }
        ]
        return header
      }
    }
  }
</script>

<style></style>
