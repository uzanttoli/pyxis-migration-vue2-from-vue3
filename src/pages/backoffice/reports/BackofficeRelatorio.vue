<template>
  <v-container>
    <card-app-bar
      customClass="rounded-xl"
      :minHeight="100"
      style="margin: 10px 0 16.5px 0"
      styleCustom="display: flex; height: 100px; padding: 25px; align-items:center; color: #fafafa;"
    >
      <template v-slot:title>
        <h3>
          <v-icon color="white" class="mr-3" size="25">fa-solid fa-chart-line</v-icon>
          Reports Backoffice
        </h3>
      </template>
      <template v-slot:imagem>
        <img
          src="@/assets/img/geral/03-index-bf-sem-fundo.png"
          style="position: absolute; height: 155px; bottom: -30px; right: 20px"
        />
      </template>
    </card-app-bar>
    <v-col v-for="(component, i) in components" :key="i">
      <component :is="component.component" :data="array" :title="component.title"></component>
    </v-col>
  </v-container>
</template>

<script>
  import cardAppBar from '@/shared/components/cards/modern/cardAppBar.vue'
  import TableBackofficeRelatorio from './_components/TableBackofficeRelatorio.vue'
  export default {
    components: { TableBackofficeRelatorio, cardAppBar },
    data: () => ({
      array: [
        {
          text: 'Nome1',
          value: 1
        },
        {
          text: 'Nome2',
          value: 2
        },
        {
          text: 'Nome3',
          value: 3
        }
      ],
      components: [
        { component: 'table-backoffice-relatorio', title: 'Diário PAP SP1' },
        {
          component: 'table-backoffice-relatorio',
          title: 'Fechamento Diário PAP MG'
        }
      ]
    })
  }
</script>

<style></style>
