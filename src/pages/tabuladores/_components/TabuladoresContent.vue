<template>
  <card-multi-actions :title="item.titulo" :objetivo="item.objetivo" :status="item.status">
    <template v-slot:button>
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <v-btn
            icon
            small
            v-bind="attrs"
            v-on="on"
            :to="{
              name: 'View Tabuladores',
              query: {
                id_tabulador: item.id,
                is_mailing: item.mailing
              }
            }"
          >
            <v-icon size="16">fa-solid fa-square-up-right</v-icon>
          </v-btn>
        </template>
        <span>Abrir</span>
      </v-tooltip>
      <!-- @click="visualizarPesquisa(item.ID)" -->
      <!--  -->
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <v-btn
            icon
            small
            disabled
            v-bind="attrs"
            v-on="on"
            color="blue lighten-2"
            :to="{
              name: 'Elaborar Pesquisas',
              query: { id: 'item.ID', action: 'duplicar-pesquisa' }
            }"
          >
            <v-icon size="16">fa-solid fa-copy</v-icon>
          </v-btn>
        </template>
        <span>Duplicar pesquisa</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <v-btn icon small disabled v-bind="attrs" v-on="on" color="orange darken-1">
            <v-icon size="16">fa-solid fa-pen-to-square</v-icon>
          </v-btn>
        </template>
        <span>Editar pesquisa</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <v-btn icon small v-bind="attrs" v-on="on" disabled>
            <v-icon size="16">fa-solid fa-chart-pie</v-icon>
          </v-btn>
        </template>
        <span>Analitico da pesquisa</span>
      </v-tooltip>
      <v-menu absolute offset-y>
        <template v-slot:activator="{ attrs, on }">
          <v-btn icon small v-bind="attrs" v-on="on" disabled>
            <v-icon size="16">fa-solid fa-download</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item>
            <v-list-item-title>
              <download-excel>
                <v-btn disabled>
                  <v-progress-circular value="20" indeterminate size="20"></v-progress-circular>
                  Baixar Dados
                </v-btn>
              </download-excel>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <v-btn icon small v-bind="attrs" v-on="on" color="error" disabled>
            <v-icon size="16">fa-solid fa-trash</v-icon>
          </v-btn>
        </template>
        <span>Inativar pesquisa</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ attrs, on }">
          <v-btn icon small v-bind="attrs" v-on="on" color="green" disabled>
            <v-icon size="16">fa-solid fa-rotate</v-icon>
          </v-btn>
        </template>
        <span>Habilitar pesquisa</span>
      </v-tooltip>
    </template>
  </card-multi-actions>
</template>
<script>
  import cardMultiActions from '../../../shared/components/cards/cardMultiActions.vue'
  export default {
    components: { cardMultiActions },
    props: {
      item: {
        type: Object,
        required: true
      }
    }
  }
</script>
