<template>
  <v-card class="mx-auto rounded-xl" elevation-4 min-height="580">
    <v-card dark flat>
      <v-img
        src="../../../assets/img/claroTelevendas/ClaroTelevendasTimelineBanner.jpg"
        max-height="160"
      >
        <v-container class="fill-height">
          <v-row>
            <strong class="display-4 ml-10 font-weight-regular">{{ vendas.length }}</strong>
            <div class="headline font-weight-light mt-2">Últimas Vendas</div>
          </v-row>
          <template>
            <v-dialog v-model="dialog">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  fab
                  dark
                  small
                  elevation="0"
                  color="purple darken-2"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-icon color="white">mdi-history</v-icon>
                </v-btn>
              </template>
              <v-card>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green darken-1" text @click="dialog = false">X Fechar</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </template>
        </v-container>
      </v-img>
    </v-card>
    <v-card-text class="py-0">
      <v-timeline align-top dense>
        <v-timeline-item
          v-for="vItem in vendas"
          :key="vItem.numCaso"
          :color="vItem.tipo == 'ATIVAÇÃO' ? 'pink' : 'teal lighten-3'"
          small
        >
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title class="text-capitalize">{{ vItem.nome }}</v-list-item-title>
                <v-list-item-subtitle>
                  {{
                    vItem.tipo
                      ? vItem.tipo.charAt(0).toUpperCase() + vItem.tipo.toLowerCase().slice(1)
                      : 'Não identificado'
                  }}
                  {{ vItem.operacao }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="indigo">
                  {{ vItem.operacao == 'NET' ? 'mdi-file-document-edit' : 'mdi-phone' }}
                </v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>
                  {{ vItem.operacao == 'NET' ? 'Contrato' : 'Telefone' }}
                </v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{
                    vItem.operacao == 'NET'
                      ? vItem.codCidadeDDD + vItem.contrato
                      : vItem.codCidadeDDD + vItem.telefone
                  }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon color="indigo">mdi-calendar</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-subtitle>Data Venda</v-list-item-subtitle>
                <v-list-item-subtitle>{{ vItem.dataVenda }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider inset class="my-0"></v-divider>
          </v-list>
        </v-timeline-item>
      </v-timeline>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'timeLine-televendas',
    data: () => ({
      loading: false,
      dialog: false,
      vendas: [],
      vendasHistorico: []
    })
  }
</script>

<style></style>
