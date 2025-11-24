<template>
  <!-- v-model="extratoDialog" -->
  <v-dialog
    width="75%"
    persistent
    :model-value="extratoDialog"
    @update:modelValue="val => $emit('update:extratoDialog', val)"
  >
    <v-card>
      <v-card-title>
        Extrato Vendas Silente
        <v-spacer></v-spacer>
        <v-btn icon @click="$emit('closeDialogExtrato')"><v-icon>mdi-close</v-icon></v-btn>
      </v-card-title>
      <v-divider></v-divider>
      <v-col class="ma-0">
        <v-text-field
          v-model="search"
          outlined
          dense
          placeholder="Pesquisar"
          label="Pesquisar"
        ></v-text-field>
      </v-col>
      <v-data-table
        dense
        :search="search"
        :loading="loading"
        :headers="getHeaders"
        no-data-text="Não há dados no momento!"
        :items="extratoVendasSilente"
        class="text-no-wrap"
        :footer-props="footerProps"
      ></v-data-table>
    </v-card>
  </v-dialog>
</template>

<script>
  import { ExtratoService } from '@/data/services/serviceToSales'
  export default {
    props: {
      extratoDialog: {
        type: Boolean,
        default: false
      },
      almope: {
        type: Number
      },
      numCargo: {
        type: Number,
        required: true
      }
    },
    data: () => ({
      extrato: [],
      extratoVendasSilente: [],
      loading: false,
      search: null,
      footerProps: {
        itemsPerPageText: 'Itens por página:',
        pageText: '{0}-{1} de {2}',
        perPageText: 'Itens por página:'
      }
    }),
    computed: {
      getHeaders() {
        let header = this.extratoVendasSilente[0]
        if (!header) return
        let arrHeaders = Object.keys(header)
          .map(item => {
            return {
              text: item,
              value: item,
              align: 'center',
              sortable: false,
              class: 'blue-grey lighten-2 white--text'
            }
          })
          .filter(itemFilter => {
            return header[itemFilter.text] != null
          })

        return arrHeaders
      },
      usuario() {
        return this.$store.getters.usuario
      }
    },
    methods: {
      async loadDadosExtratoVendasSilente() {
        const result = await ExtratoService.getExtratoVendasSilente(
          this.usuario.almope,
          this.numCargo,
          this.usuario.produto
        )
        this.extratoVendasSilente = result
      }
    },
    created() {},
    watch: {
      extratoDialog: function (newVal) {
        if (newVal) {
          this.loadDadosExtratoVendasSilente()
        }
      }
    }
  }
</script>

<style></style>
