<template>
  <v-card class="mx-auto rounded-xl mb-5 mt-8" width="100%">
    <v-tabs v-model="tab" grow>
      <v-tab class="rounded-t-xl" v-for="(tab, i) in tabs" :key="i" @click="updateRoute(tab.route)">
        {{ tab.label }}
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item v-for="tab in tabs" :key="tab.label">
        <component class="mx-3 mb-10" :is="tab.component"></component>
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
          label: 'Dados Online',
          component: 'dados-online',
          route: '/pyxis/enel/operacoes/operador/dados-online'
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
