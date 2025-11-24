<template>
  <v-card class="mx-auto rounded-xl mt-4 mb-5" width="100%">
    <v-tabs v-model="tab" grow>
      <v-tab v-for="(tab, i) in tabs" :key="i" class="rounded-t-xl" @click="updateRoute(tab.route)">
        {{ tab.label }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="tab in tabs" :key="tab.label">
        <component :is="tab.component" class="mx-3 mb-10"></component>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>

<script>
  import dadosOnline from './dadosOnline/dadosOnline.vue'
  export default {
    components: { dadosOnline },
    data: () => ({
      tab: null,
      tabs: [
        {
          component: 'dados-online',
          label: 'Dados Online',
          route: '/pyxis/enel/operacoes/coordenador/dados-online'
        }
      ]
    }),
    methods: {
      updateRoute(route) {
        this.$router.push({ path: route }).catch(() => {})
      }
    }
  }
</script>

<style></style>
