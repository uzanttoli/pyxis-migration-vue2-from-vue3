<template>
  <v-row justify="start" class="pa-4">
    <v-btn icon @click="isSearch = true" class="mr-2" color="blue">
      <v-icon>fa-solid fa-magnifying-glass</v-icon>
    </v-btn>
    <v-expand-x-transition>
      <v-card color="transparent" height="40" v-show="isSearch" elevation="0">
        <v-text-field
          outlined
          dense
          placeholder="Pesquisar"
          v-model="search"
          label="Pesquisar"
        ></v-text-field>
      </v-card>
    </v-expand-x-transition>
    <div style="margin-top: 25px; display: flex; flex-wrap: nowrap" class="overflow-x-auto">
      <board :items="card" :itemFilter="search"></board>
    </div>
  </v-row>
</template>

<script>
  import Board from '../board.vue'
  import config from '../../../../core/config'
  export default {
    components: { Board },
    data: () => ({
      card: [],
      isSearch: false,
      search: null
    }),
    computed: {},
    methods: {
      loadDadosSolicitacoes() {
        this.$emit('update:loading', true)
        let urlData = `${config.baseUrl}api/shared/project_manager/gestao/solicitacoes/`
        this.$api.get(urlData).then(res => {
          this.card = res.data
          this.$emit('update:loading', false)
        })
      }
    },
    created() {
      this.loadDadosSolicitacoes()
    }
  }
</script>

<style></style>
