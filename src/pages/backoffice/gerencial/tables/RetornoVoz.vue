<template>
  <v-row>
    <v-col>
      <title-negative-margin title="Retorno Voz Mês"></title-negative-margin>
      <v-data-table
        dense
        :headers="headers"
        no-results-text="Nada encontrado!"
        loading-text="Carregando... Por favor aguarde!"
        no-data-text="Não há nada por aqui"
        :footer-props="footerProps"
      ></v-data-table>
    </v-col>
  </v-row>
</template>

<script>
  // import config from "@core/config.js";
  export default {
    data: () => ({
      base: [],
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      },
      headers: [
        {
          text: 'Almope',
          align: 'center',
          value: 'ALMOPE',
          class: 'grey lighten-2'
        },
        {
          text: 'Nome',
          align: 'center',
          value: 'NOME',
          class: 'grey lighten-2'
        },
        {
          text: 'Supervisor',
          align: 'center',
          value: 'SUPERVISOR',
          class: 'grey lighten-2'
        },
        {
          text: 'Casos Resolvidos',
          align: 'center',
          value: '',
          class: 'grey lighten-4'
        },
        {
          text: 'Ativo C/ Sucesso',
          align: 'center',
          value: '',
          class: 'grey lighten-4'
        },
        {
          text: '(%) Ativo C/ Sucesso',
          align: 'center',
          value: '',
          class: 'grey lighten-4'
        },
        {
          text: 'TMT',
          align: 'center',
          value: '',
          class: 'grey lighten-4'
        }
      ]
    })
  }
</script>

<style></style>
