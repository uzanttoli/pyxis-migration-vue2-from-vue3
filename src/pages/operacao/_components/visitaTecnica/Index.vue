<template>
  <v-card class="rounded-xl pa-2" elevation="1">
    <CustomCardRoot :buttons="botoes" @click="handleComponent($event)">
      <component :is="componentAtual" />
    </CustomCardRoot>
  </v-card>
</template>

<script>
  import { CustomCard } from '../../../../shared/components/CardsCustom'
  import TableGenericsVisitaImprodutivaVue from './TableGenericsVisitaImprodutiva.vue'
  import TableGenericsVTOperadoresVue from './TableGenericsVTOperadores.vue'
  export default {
    components: {
      CustomCardRoot: CustomCard.Root,
      TableAnalitico: TableGenericsVisitaImprodutivaVue,
      TableAnaliticoOperador: TableGenericsVTOperadoresVue
    },
    data: () => ({
      componentAtual: 'table-analitico',
      botoes: [
        {
          placeholder: 'Analítico',
          value: 1,
          icon: 'fa-solid fa-user',
          component: 'table-analitico',
          perfil: ['OPERADOR', 'SUPERVISOR', 'COORDENADOR']
        },
        {
          placeholder: 'Resultado por Operador',
          value: 2,
          icon: 'fa-solid fa-users',
          component: 'table-analitico-operador',
          perfil: ['SUPERVISOR', 'COORDENADOR']
        }
      ]
    }),
    computed: {},
    methods: {
      handleComponent(event) {
        this.componentAtual = event
      }
    }
  }
</script>

<style></style>
